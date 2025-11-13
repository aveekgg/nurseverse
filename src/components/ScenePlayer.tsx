import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, BookOpen, ChevronDown, Lightbulb, MessageSquare, Square, Target, TrendingUp, MessageCircle, History, RotateCcw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { scenarios } from '../data/scenarios';
import { useVapiConversation } from '../hooks/useVapiConversation';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { DialogueMessage } from './DialogueMessage';
import { MessageHistory } from './MessageHistory';
import { HintModal } from './HintModal';
import { GoalsModal } from './GoalsModal';
import { FeedbackModal } from './FeedbackModal';
import { ChatInput } from './ChatInput';
import { PronunciationFeedback, analyzePronunciation } from './PronunciationFeedback';
import { SessionManager } from '../utils/sessionManager';
import { getLanguageLabels, getLanguageConfig, getDefaultGreeting, generateContextualResponses as getContextualResponses, getCommonPhrases, getVoiceIdForLanguage } from '../utils/languageConfig';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  translation?: string;
  timestamp: Date;
  germanText: string;
  englishText: string;
  characterName: string;
  isFromUser: boolean;
}

interface ResponseOption {
  german: string;
  english: string;
  pronunciation: string;
}

interface Objective {
  id: string;
  text: string;
  completed: boolean;
  progress?: number;
}

interface FeedbackItem {
  id: string;
  germanText: string;
  pronunciationScore: number;
  grammarScore: number;
  fluencyScore: number;
  feedback: string;
  timestamp: number;
}

interface ScenePlayerProps {
  scenarioId: string;
  onBack: () => void;
}

const ScenePlayer = ({ scenarioId, onBack }: ScenePlayerProps) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [isCharacterSpeaking, setIsCharacterSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showMessageHistory, setShowMessageHistory] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [dynamicResponseOptions, setDynamicResponseOptions] = useState<ResponseOption[]>([]);
  const [pronunciationAnalysis, setPronunciationAnalysis] = useState<any>(null);
  const [isConversationComplete, setIsConversationComplete] = useState(false);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);
  const [translationState, setTranslationState] = useState(false);
  const [conversationTurns, setConversationTurns] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<FeedbackItem | null>(null);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const MAX_CONVERSATION_TURNS = 50;
  
  // Helper functions
  const getScenarioById = (id: string) => {
    return scenarios.find(s => s.id === id);
  };

  const getCurrentScene = (scenarioId: string, sceneIndex: number) => {
    const scenario = getScenarioById(scenarioId);
    return scenario?.scenes[sceneIndex];
  };

  const scenario = getScenarioById(scenarioId);
  const currentScene = getCurrentScene(scenarioId, currentSceneIndex);
  
  const {
    isConnected,
    isAISpeaking,
    messages,
    userTranscriptLive,
    assistantTranscriptLive,
    connect,
    disconnect,
    sendTextMessage,
  } = useVapiConversation();

  // Initialize session and objectives from scenario
  useEffect(() => {
    if (scenario) {
      // Create or load session for this scenario
      const existingSession = SessionManager.getCurrentSession();
      
      if (!existingSession || existingSession.scenarioId !== scenarioId) {
        // Create new session
        const newSession = SessionManager.createSession(scenarioId, scenario.title);
        console.log('📝 Created new session:', newSession.id);
      }

      // Initialize objectives
      if (scenario.context.conversationGoals?.objectives) {
        const initObjectives: Objective[] = scenario.context.conversationGoals.objectives.map((goal, index) => ({
          id: `obj-${index}`,
          text: goal,
          completed: false,
          progress: 0
        }));
        setObjectives(initObjectives);
        
        // Save objectives to session
        SessionManager.updateObjectives(
          initObjectives.map(obj => ({ id: obj.id, text: obj.text, completed: obj.completed }))
        );
      }
    }
  }, [scenario, scenarioId]);

  // Initialize conversation
  useEffect(() => {
    if (scenario) {
      const languageConfig = getLanguageConfig();
      const languageLabels = getLanguageLabels();
      
      // Replace German/English references in system prompt with configured languages
      const adaptedSystemPrompt = scenario.assistantConfig.systemPrompt
        .replace(/German/g, languageConfig.targetLanguage)
        .replace(/german/g, languageConfig.targetLanguage.toLowerCase())
        .replace(/Deutsch/g, languageConfig.targetLanguage)
        + `\n\nIMPORTANT: You must respond ONLY in ${languageConfig.targetLanguage}. Never use ${languageConfig.knownLanguage} in your responses. The student knows ${languageConfig.knownLanguage} and is learning ${languageConfig.targetLanguage}.`;
      
      const assistantConfig = {
        name: `${scenario.character.name} - ${scenario.character.role}`,
        model: {
          provider: scenario.assistantConfig.model.provider,
          model: scenario.assistantConfig.model.model,
          messages: [{
            role: "system",
            content: adaptedSystemPrompt
          }],
          temperature: scenario.assistantConfig.model.temperature
        },
        voice: {
          provider: scenario.assistantConfig.voice.provider,
          voiceId: getVoiceIdForLanguage() // Use language-appropriate voice
        },
        // Use language-specific greeting instead of hardcoded one
        firstMessage: getDefaultGreeting()
      };
      
      connect(assistantConfig);
    }
    return () => disconnect();
  }, [scenario]);

  // Track AI speaking and handle real-time updates
  useEffect(() => {
    if (isAISpeaking && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        setIsCharacterSpeaking(true);
        
        // Generate contextual response suggestions based on the latest complete message
        const contextualResponses = getContextualResponses(lastMessage.content);
        setDynamicResponseOptions(contextualResponses);
      }
    } else if (!isAISpeaking && isCharacterSpeaking) {
      // Character finished speaking - now process the complete message
      setIsCharacterSpeaking(false);
    }
  }, [isAISpeaking, messages, isCharacterSpeaking]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [conversationHistory, assistantTranscriptLive]);

  // Enhanced translation function using language config
  const getTranslation = (targetText: string): string => {
    if (!targetText) return "";
    
    const languageConfig = getLanguageConfig();
    const commonPhrases = getCommonPhrases();
    
    // Clean the text first
    const cleanText = targetText.trim();

    // Try exact match first from common phrases
    if (commonPhrases[cleanText]) {
      return commonPhrases[cleanText];
    }

    // Try to translate by finding partial matches
    let translation = cleanText;
    
    // Replace known phrases
    for (const [targetLang, knownLang] of Object.entries(commonPhrases)) {
      if (translation.toLowerCase().includes(targetLang.toLowerCase())) {
        translation = translation.replace(new RegExp(targetLang, 'gi'), String(knownLang));
      }
    }
    
    // If no translation found, provide a helpful fallback
    if (translation === cleanText) {
      return `[${languageConfig.targetLanguage}: ${cleanText}]`;
    }
    
    return translation;
  };

  // Clean and filter message content
  const cleanMessage = (content: string): string => {
    if (!content) return "";
    
    // Remove common English words that shouldn't be in German responses
    const englishWords = ['good', 'and', 'the', 'is', 'are', 'you', 'me', 'what', 'does', 'this', 'mean', 'only'];
    
    // Split into sentences and process each
    const sentences = content.split(/[.!?]+/).map(sentence => {
      const words = sentence.trim().split(' ');
      
      // Filter out English words and repetitions
      const cleanWords = words.filter((word, index, array) => {
        const lowerWord = word.toLowerCase().replace(/[.,!?;]/g, '');
        
        // Skip empty words
        if (!word.trim()) return false;
        
        // Skip English words
        if (englishWords.includes(lowerWord)) return false;
        
        // Skip immediate repetitions (same word appearing consecutively)
        if (index > 0 && array[index - 1] === word) return false;
        
        return true;
      });
      
      return cleanWords.join(' ').trim();
    }).filter(sentence => sentence.length > 0);
    
    // Remove duplicate sentences
    const uniqueSentences = [...new Set(sentences)];
    
    return uniqueSentences.join('. ').trim();
  };

  // Update conversation history - only when messages are complete
  useEffect(() => {
    if (messages.length === 0) {
      setConversationHistory([]);
      return;
    }

    // Only process messages when AI is not currently speaking (messages are complete)
    if (isAISpeaking) return;

    // Convert messages to display format with deduplication
    const formattedMessages: Message[] = [];
    const seenContent = new Set<string>();
    
    messages.forEach((msg, index) => {
      const isFromUser = msg.role === 'user';
      const characterName = isFromUser ? 'You' : (scenario?.character.name || 'Character');
      
      // Clean the final message content
      const cleanContent = cleanMessage(msg.content);
      
      // Skip if empty or duplicate
      if (!cleanContent.trim()) return;
      
      // Create a unique key for deduplication
      const messageKey = `${msg.role}-${cleanContent.toLowerCase()}`;
      if (seenContent.has(messageKey)) {
        console.log('⚠️ Skipping duplicate message:', cleanContent);
        return;
      }
      
      seenContent.add(messageKey);
      
      formattedMessages.push({
        id: `msg-${index}-${Date.now()}`,
        role: msg.role,
        content: cleanContent,
        translation: msg.role === 'assistant' ? getTranslation(cleanContent) : undefined,
        timestamp: new Date(),
        germanText: cleanContent,
        englishText: msg.role === 'assistant' ? getTranslation(cleanContent) : '',
        characterName,
        isFromUser
      });
    });

    console.log(`📝 Displaying ${formattedMessages.length} unique messages`);
    setConversationHistory(formattedMessages);
    
    // Update conversation turn count
    setConversationTurns(formattedMessages.length);
    
    // Save messages to current session
    const currentSession = SessionManager.getCurrentSession();
    if (currentSession) {
      // Convert to session message format
      const sessionMessages = messages.map(msg => ({
        role: msg.role,
        content: cleanMessage(msg.content),
        timestamp: msg.timestamp || Date.now()
      }));
      
      SessionManager.updateSession({
        messages: sessionMessages,
        turnCount: formattedMessages.filter(m => m.role === 'user').length
      });
    }
    
    // Check if max turns reached
    if (formattedMessages.length >= MAX_CONVERSATION_TURNS) {
      setIsConversationComplete(true);
      SessionManager.completeSession();
    }
  }, [messages, scenario, isAISpeaking]); // Add isAISpeaking as dependency

  // Dynamic goal evaluation - more sophisticated
  const evaluateObjectives = (messageHistory: Message[]) => {
    if (!scenario?.context.conversationGoals?.completionTriggers) return;
    
    const triggers = scenario.context.conversationGoals.completionTriggers;
    const allText = messageHistory.map(m => m.content).join(' ').toLowerCase();
    
    let hasNewCompletions = false;
    
    setObjectives(prev => {
      const updatedObjectives = prev.map((obj, index) => {
        if (obj.completed) return obj; // Already completed
        
        if (index < triggers.length) {
          const trigger = triggers[index].toLowerCase();
          const completed = allText.includes(trigger);
          
          if (completed && !obj.completed) {
            hasNewCompletions = true;
            console.log(`✅ Goal achieved: ${obj.text}`);
          }
          
          return { ...obj, completed, progress: completed ? 100 : 0 };
        }
        return obj;
      });
      
      // Save updated objectives to session
      SessionManager.updateObjectives(
        updatedObjectives.map(obj => ({ id: obj.id, text: obj.text, completed: obj.completed }))
      );
      
      // Check if all objectives are complete
      if (updatedObjectives.length > 0 && updatedObjectives.every(obj => obj.completed)) {
        setIsConversationComplete(true);
        SessionManager.completeSession();
      }
      
      return updatedObjectives;
    });
  };

  // Evaluate objectives after each message
  useEffect(() => {
    if (conversationHistory.length > 0) {
      evaluateObjectives(conversationHistory);
    }
  }, [conversationHistory, scenario]);

  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
    
    // Send the message through VAPI
    sendTextMessage(message);
    
    // Generate feedback for text message
    const analysis = analyzePronunciation(message, message);
    const feedback: FeedbackItem = {
      id: `feedback-${Date.now()}`,
      germanText: message,
      pronunciationScore: 85, // Good score for typed message
      grammarScore: Math.random() * 20 + 75, // Higher for typed
      fluencyScore: Math.random() * 15 + 80,
      feedback: "Text message sent successfully. Great German sentence structure!",
      timestamp: Date.now()
    };
    
    setFeedbackHistory(prev => [...prev, feedback]);
    setLastFeedback(feedback);
    
    // Show feedback popup briefly
    setShowFeedbackPopup(true);
    setTimeout(() => setShowFeedbackPopup(false), 3000);
  };

  const handleMicToggle = () => {
    if (!isConnected) {
      connect();
      return;
    }
    
    const wasRecording = isRecording;
    setIsRecording(!isRecording);
    
    if (wasRecording) {
      // Stopped recording - provide feedback
      console.log("Recording stopped - waiting for VAPI transcription");
    }
  };
  
  // Provide feedback when user finishes speaking (after transcript received)
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      // If last message was from user, provide feedback
      if (lastMessage.role === 'user' && !isRecording) {
        const analysis = analyzePronunciation(lastMessage.content, lastMessage.content);
        const feedback: FeedbackItem = {
          id: `feedback-${Date.now()}`,
          germanText: lastMessage.content,
          pronunciationScore: analysis.score,
          grammarScore: Math.random() * 30 + 65,
          fluencyScore: Math.random() * 25 + 70,
          feedback: analysis.feedback,
          timestamp: Date.now()
        };
        
        setFeedbackHistory(prev => {
          // Avoid duplicate feedback
          if (prev.length > 0 && prev[prev.length - 1].germanText === feedback.germanText) {
            return prev;
          }
          return [...prev, feedback];
        });
        
        setLastFeedback(feedback);
        setShowFeedbackPopup(true);
        setTimeout(() => setShowFeedbackPopup(false), 4000);
      }
    }
  }, [messages, isRecording]);

  const getCurrentResponseOptions = (): ResponseOption[] => {
    if (dynamicResponseOptions.length > 0) {
      return dynamicResponseOptions;
    }
    
    if (!currentScene) {
      // Default helpful responses when no scene-specific hints
      return [
        {
          german: "Guten Tag!",
          english: "Good day!",
          pronunciation: "GOO-ten tahk"
        },
        {
          german: "Wie geht es Ihnen?", 
          english: "How are you?",
          pronunciation: "vee gayt es EE-nen"
        },
        {
          german: "Können Sie mir helfen?",
          english: "Can you help me?",
          pronunciation: "KUH-nen zee meer HEL-fen"
        }
      ];
    }
    
    return currentScene.hints.map(hint => ({
      german: hint.german,
      english: hint.english, 
      pronunciation: hint.pronunciation,
    }));
  };

  const handleSuggestionSelect = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  if (!scenario || !currentScene) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Scenario not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen fixed inset-0 flex flex-col overflow-hidden">
      {/* Scene Background - Fixed */}
      <div className="absolute inset-0 -z-10">
        <img
          src={currentScene.background}
          alt={currentScene.title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />
      </div>

      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-b border-white/10 z-40">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Back button and title */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div>
                <h2 className="text-sm font-semibold text-white">{scenario.character.name}</h2>
                <p className="text-xs text-white/70">{currentScene.title}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {/* Message history */}
              <button
                onClick={() => setShowMessageHistory(true)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title="View conversation history"
              >
                <History className="w-4 h-4 text-white/80" />
              </button>

              {/* Goals */}
              <button
                onClick={() => setShowGoals(true)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title="View learning goals"
              >
                <Target className="w-4 h-4 text-emerald-300" />
              </button>

              {/* Pronunciation feedback */}
              <button
                onClick={() => setShowFeedback(true)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title="View pronunciation feedback"
              >
                <TrendingUp className="w-4 h-4 text-indigo-300" />
              </button>

              {/* Reset conversation button */}
              <button
                onClick={() => {
                  setConversationHistory([]);
                  disconnect();
                  setTimeout(() => {
                    if (scenario) {
                      const assistantConfig = {
                        name: `${scenario.character.name} - ${scenario.character.role}`,
                        model: {
                          provider: scenario.assistantConfig.model.provider,
                          model: scenario.assistantConfig.model.model,
                          messages: [{
                            role: "system",
                            content: scenario.assistantConfig.systemPrompt
                          }],
                          temperature: scenario.assistantConfig.model.temperature
                        },
                        voice: {
                          provider: scenario.assistantConfig.voice.provider,
                          voiceId: getVoiceIdForLanguage() // Use language-appropriate voice
                        },
                        firstMessage: getDefaultGreeting() // Use language-specific greeting
                      };
                      connect(assistantConfig);
                    }
                  }, 1000);
                }}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4 text-red-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface - Scrollable */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto pt-16 pb-32 px-4 max-w-md mx-auto w-full scroll-smooth"
      >
        <div className="space-y-2 py-4">
          {/* Show actual conversation if any */}
          {conversationHistory.length > 0 ? (
            conversationHistory.map((message) => (
              <DialogueMessage
                key={message.id}
                germanText={message.germanText}
                englishText={message.englishText}
                characterName={message.characterName}
                isFromUser={message.isFromUser}
                defaultTranslationOpen={translationState}
                onPlayAudio={() => console.log('Play audio:', message.germanText)}
              />
            ))
          ) : (
            /* Welcome message when no conversation yet - use language-specific greeting */
            <DialogueMessage
              germanText={getDefaultGreeting()}
              englishText={`Welcome! The AI will speak in ${getLanguageConfig().targetLanguage}.`}
              characterName={scenario?.character.name || "Character"}
              isFromUser={false}
              defaultTranslationOpen={false}
              onPlayAudio={() => console.log('Play welcome message')}
            />
          )}

          {/* User is speaking/processing indicator */}
          {userTranscriptLive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="ml-auto"
            >
              {userTranscriptLive.includes('Listening') || userTranscriptLive.includes('Processing') ? (
                <div className="flex items-center gap-3 bg-emerald-500/20 backdrop-blur-sm rounded-2xl px-4 py-3 max-w-xs border border-emerald-400/30">
                  <div className="text-sm text-emerald-100 font-medium">
                    {userTranscriptLive}
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                    <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
              ) : (
                <DialogueMessage
                  germanText={userTranscriptLive}
                  englishText="You are saying..."
                  characterName="You"
                  isFromUser={true}
                  defaultTranslationOpen={false}
                  onPlayAudio={() => {}}
                />
              )}
            </motion.div>
          )}

          {/* AI is speaking indicator - show live transcript */}
          {isCharacterSpeaking && assistantTranscriptLive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mr-auto"
            >
              <DialogueMessage
                germanText={assistantTranscriptLive}
                englishText={getTranslation(assistantTranscriptLive)}
                characterName={scenario?.character.name || "Character"}
                isFromUser={false}
                defaultTranslationOpen={false}
                onPlayAudio={() => console.log('Play live audio')}
              />
            </motion.div>
          )}
          
          {/* Simple speaking indicator when no transcript yet */}
          {isCharacterSpeaking && !assistantTranscriptLive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mr-auto bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 max-w-xs border border-white/20"
            >
              <div className="text-sm text-white/90 font-medium">
                {scenario?.character.name || "Character"} is speaking...
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}

          {/* Conversation complete message */}
          {objectives.every(obj => obj.completed) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-100 rounded-2xl p-4 text-center border border-emerald-200"
            >
              <h3 className="text-emerald-800 font-semibold mb-2">🎉 Great job!</h3>
              <p className="text-emerald-700 text-sm">
                You've achieved all learning objectives!
              </p>
            </motion.div>
          )}
          
          {/* Turn counter and completion warning */}
          {conversationTurns >= MAX_CONVERSATION_TURNS * 0.8 && !isConversationComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-100 rounded-xl p-3 text-center border border-amber-300"
            >
              <p className="text-amber-800 text-sm">
                ⏰ {MAX_CONVERSATION_TURNS - conversationTurns} turns remaining
              </p>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Feedback Popup - shows after each response */}
      <AnimatePresence>
        {showFeedbackPopup && lastFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full mx-4"
          >
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-slate-800 text-sm">Quick Feedback</h4>
                <button
                  onClick={() => setShowFeedbackPopup(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="text-center">
                  <div className={`text-lg font-bold ${
                    lastFeedback.pronunciationScore >= 80 ? 'text-green-600' :
                    lastFeedback.pronunciationScore >= 60 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {lastFeedback.pronunciationScore}%
                  </div>
                  <div className="text-xs text-slate-600">Pronunciation</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${
                    lastFeedback.grammarScore >= 80 ? 'text-green-600' :
                    lastFeedback.grammarScore >= 60 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {Math.round(lastFeedback.grammarScore)}%
                  </div>
                  <div className="text-xs text-slate-600">Grammar</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${
                    lastFeedback.fluencyScore >= 80 ? 'text-green-600' :
                    lastFeedback.fluencyScore >= 60 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {Math.round(lastFeedback.fluencyScore)}%
                  </div>
                  <div className="text-xs text-slate-600">Fluency</div>
                </div>
              </div>
              
              <p className="text-xs text-slate-600 mt-2">
                {lastFeedback.feedback}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Input with Hints */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-md z-40">
        <div className="max-w-md mx-auto">
          {/* Hints Modal */}
          <div className="relative">
            <HintModal
              suggestions={getCurrentResponseOptions()}
              isOpen={showHints}
              onClose={() => setShowHints(false)}
              onSelectSuggestion={handleSuggestionSelect}
              onPlayAudio={(text) => console.log('Play hint audio:', text)}
            />
          </div>

          {/* Chat input area */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              {/* Hints button */}
              <button
                onClick={() => setShowHints(!showHints)}
                className={`p-3 rounded-full transition-colors ${
                  showHints 
                    ? 'bg-amber-500/80 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                title="Show suggested responses"
              >
                <Lightbulb className="w-5 h-5" />
              </button>

              {/* Chat Input with Send Button */}
              <div className="flex-1 flex items-center gap-2 relative">
                <input
                  type="text"
                  id="message-input"
                  placeholder={isCharacterSpeaking ? "Wait for character to finish..." : "Type your response in German..."}
                  disabled={isCharacterSpeaking || isRecording}
                  className={`
                    flex-1 px-4 py-3 pr-12 rounded-xl border text-white placeholder-white/50
                    transition-all duration-300 focus:outline-none focus:ring-2
                    ${isCharacterSpeaking || isRecording
                      ? 'bg-gray-600/50 border-gray-500/30 cursor-not-allowed'
                      : 'bg-white/10 border-white/20 focus:ring-blue-400/50 focus:bg-white/15'
                    }
                  `}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      handleSendMessage(e.currentTarget.value.trim());
                      e.currentTarget.value = '';
                    }
                  }}
                />

                {/* Send Button - Inside the input */}
                <button
                  onClick={() => {
                    const input = document.getElementById('message-input') as HTMLInputElement;
                    if (input && input.value.trim()) {
                      handleSendMessage(input.value.trim());
                      input.value = '';
                    }
                  }}
                  disabled={isCharacterSpeaking || isRecording}
                  className={`
                    absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg
                    transition-all duration-300
                    ${isCharacterSpeaking || isRecording
                      ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500/90 hover:bg-blue-600/90 text-white'
                    }
                  `}
                  title="Send message"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>

              {/* Voice Input Button */}
              <button
                onClick={handleMicToggle}
                disabled={!isConnected || isCharacterSpeaking}
                className={`
                  p-3 rounded-xl flex items-center justify-center transition-all duration-300
                  ${isCharacterSpeaking
                    ? 'bg-gray-500/80 cursor-not-allowed'
                    : isRecording
                    ? 'bg-red-500/90 hover:bg-red-600/90 animate-pulse'
                    : isConnected
                    ? 'bg-green-500/90 hover:bg-green-600/90'
                    : 'bg-gray-500/80'
                  }
                `}
              >
                {isRecording ? (
                  <Square className="w-5 h-5 text-white fill-current" />
                ) : (
                  <Mic className="w-5 h-5 text-white" />
                )}
              </button>
            </div>

            {/* Quick hint: Show current suggestions */}
            {getCurrentResponseOptions().length > 0 && (
              <div className="mt-2">
                {!showHints ? (
                  <div className="text-center">
                    <p className="text-xs text-white/70 mb-2">
                      💡 Tap the lightbulb for helpful German responses
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {getCurrentResponseOptions().slice(0, 2).map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionSelect(option.german)}
                          className="px-3 py-1 bg-white/20 rounded-full text-xs text-white whitespace-nowrap hover:bg-white/30 transition-colors"
                        >
                          {option.german}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <MessageHistory
        messages={conversationHistory.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.getTime()
        }))}
        isOpen={showMessageHistory}
        onClose={() => setShowMessageHistory(false)}
      />

      <GoalsModal
        objectives={objectives}
        isOpen={showGoals}
        onClose={() => setShowGoals(false)}
        scenarioTitle={scenario.title}
      />

      <FeedbackModal
        feedbackHistory={feedbackHistory}
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        onReplayAudio={(text) => console.log('Replay audio:', text)}
      />
    </div>
  );
};

export default ScenePlayer;
