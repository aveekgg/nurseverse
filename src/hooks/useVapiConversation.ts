import { useState, useRef, useEffect, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { useToast } from '@/hooks/use-toast';
import { SessionManager } from '@/utils/sessionManager';
import { generateSystemPrompt, getDefaultGreeting, getTargetLanguageLabel, getVoiceIdForLanguage } from '@/utils/languageConfig';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface UseVapiConversationReturn {
  isConnected: boolean;
  isAISpeaking: boolean;
  messages: Message[];
  userTranscriptLive: string;
  assistantTranscriptLive: string;
  connect: (scenarioConfig?: any) => Promise<void>;
  disconnect: () => void;
  sendTextMessage: (text: string) => void;
  startListening: () => void;
  stopListening: () => void;
}

export const useVapiConversation = (): UseVapiConversationReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userTranscriptLive, setUserTranscriptLive] = useState('');
  const [assistantTranscriptLive, setAssistantTranscriptLive] = useState('');
  
  const vapiRef = useRef<Vapi | null>(null);
  const { toast } = useToast();
  
  // Accumulate assistant response until complete
  const assistantMessageBuffer = useRef<string>('');
  const isAccumulatingAssistant = useRef<boolean>(false);
  
  // Track if user input should be captured (push-to-talk)
  const shouldListenRef = useRef<boolean>(false);
  
  // Inactivity tracking
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const sessionConfigRef = useRef<any>(null);

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    // Get timeout from env (default 5 minutes)
    const timeoutMinutes = parseInt(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES || '5');
    const timeoutMs = timeoutMinutes * 60 * 1000;
    
    inactivityTimerRef.current = setTimeout(() => {
      const enableAutoReconnect = import.meta.env.VITE_ENABLE_AUTO_RECONNECT === 'true';
      
      if (isConnected && enableAutoReconnect) {
        console.log('⚠️ Connection idle for', timeoutMinutes, 'minutes. Maintaining session...');
        
        // Don't show error toast for auto-maintained sessions
        toast({
          title: "Session Active",
          description: `Keeping your session alive (${timeoutMinutes} min timeout)`,
        });
        
        // Reset timer to keep session alive
        resetInactivityTimer();
      }
    }, timeoutMs);
  }, [isConnected, toast]);

  // Initialize VAPI
  useEffect(() => {
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    if (publicKey) {
      vapiRef.current = new Vapi(publicKey);
      setupVapiEventListeners();
    }

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const setupVapiEventListeners = useCallback(() => {
    if (!vapiRef.current) return;

    // Connection events
    vapiRef.current.on('call-start', () => {
      console.log('VAPI call started');
      setIsConnected(true);
      resetInactivityTimer();
      toast({
        title: "Connected",
        description: "Voice conversation started with VAPI",
      });
    });

    vapiRef.current.on('call-end', () => {
      console.log('VAPI call ended');
      setIsConnected(false);
      setIsAISpeaking(false);
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      
      // Auto-reconnect if enabled and it was an unexpected disconnect
      const enableAutoReconnect = import.meta.env.VITE_ENABLE_AUTO_RECONNECT === 'true';
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      const timeoutMinutes = parseInt(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES || '5');
      const timeoutMs = timeoutMinutes * 60 * 1000;
      
      if (enableAutoReconnect && timeSinceLastActivity < timeoutMs && sessionConfigRef.current) {
        console.log('🔄 Auto-reconnecting...');
        setTimeout(() => {
          connect(sessionConfigRef.current);
        }, 2000); // Reconnect after 2 seconds
      }
    });

    // Speech events
    vapiRef.current.on('speech-start', () => {
      // Only process if we're expecting user input (push-to-talk active)
      if (!shouldListenRef.current) {
        console.log('Speech detected but not in listening mode - ignoring');
        return;
      }
      console.log('User started speaking');
      setUserTranscriptLive('🎤 Listening...');
      resetInactivityTimer(); // User is active
    });

    vapiRef.current.on('speech-end', () => {
      console.log('User stopped speaking');
      setUserTranscriptLive('⏳ Processing...');
      resetInactivityTimer(); // User activity detected
      
      // If assistant was accumulating, finalize the message
      if (isAccumulatingAssistant.current && assistantMessageBuffer.current.trim()) {
        console.log('✅ Finalizing buffered assistant message on speech-end');
        setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          const bufferedContent = assistantMessageBuffer.current;
          
          if (lastMsg?.content === bufferedContent && lastMsg?.role === 'assistant') {
            console.log('⚠️ Message already added, skipping');
            return prev;
          }
          
          return [...prev, {
            role: 'assistant',
            content: bufferedContent,
            timestamp: Date.now()
          }];
        });
        
        // Reset accumulation state
        assistantMessageBuffer.current = '';
        isAccumulatingAssistant.current = false;
        setAssistantTranscriptLive('');
        setIsAISpeaking(false);
      }
    });

    // Message events
    vapiRef.current.on('message', (message: any) => {
      console.log('VAPI message:', message);
      resetInactivityTimer(); // Activity detected
      
      if (message.type === 'transcript') {
        const isFinal = message.transcriptType === 'final';
        
        if (message.role === 'user') {
          // Only process user transcripts if we're in listening mode
          if (!shouldListenRef.current) {
            console.log('User transcript received but not in listening mode - ignoring');
            return;
          }
          
          if (isFinal && message.transcript) {
            // Add final user message with deduplication
            setMessages(prev => {
              // Check if this exact message was just added
              const lastMsg = prev[prev.length - 1];
              if (lastMsg?.content === message.transcript && lastMsg?.role === 'user') {
                console.log('⚠️ Duplicate user message prevented');
                return prev;
              }
              console.log('✅ Adding final user message:', message.transcript);
              return [...prev, {
                role: 'user',
                content: message.transcript,
                timestamp: Date.now()
              }];
            });
            setUserTranscriptLive('');
            // Reset listening mode after message is complete
            shouldListenRef.current = false;
          } else if (message.transcript) {
            // Update live transcript for partial messages
            setUserTranscriptLive(message.transcript);
          }
        } else if (message.role === 'assistant') {
          // Handle assistant messages by accumulating until complete
          if (message.transcript) {
            if (!isFinal) {
              // Partial transcript - accumulate and show live
              if (!isAccumulatingAssistant.current) {
                isAccumulatingAssistant.current = true;
                assistantMessageBuffer.current = '';
                console.log('🎙️ Assistant started speaking...');
              }
              
              // Keep the latest partial transcript
              assistantMessageBuffer.current = message.transcript;
              setAssistantTranscriptLive(message.transcript);
              setIsAISpeaking(true);
            } else {
              // Final transcript - this is the complete message
              console.log('✅ Assistant finished speaking');
              
              const completeMessage = message.transcript || assistantMessageBuffer.current;
              
              if (completeMessage.trim()) {
                // Add the complete message once
                setMessages(prev => {
                  // Check if this exact message was just added
                  const lastMsg = prev[prev.length - 1];
                  if (lastMsg?.content === completeMessage && lastMsg?.role === 'assistant') {
                    console.log('⚠️ Duplicate assistant message prevented');
                    return prev;
                  }
                  console.log('📝 Adding complete assistant message:', completeMessage);
                  return [...prev, {
                    role: 'assistant',
                    content: completeMessage,
                    timestamp: Date.now()
                  }];
                });
              }
              
              // Reset accumulation
              setAssistantTranscriptLive('');
              setIsAISpeaking(false);
              assistantMessageBuffer.current = '';
              isAccumulatingAssistant.current = false;
            }
          }
        }
      }
    });

    // Error handling
    vapiRef.current.on('error', (error: any) => {
      console.error('VAPI error:', error);
      toast({
        title: "Voice Error",
        description: error.message || "An error occurred with voice service",
        variant: "destructive",
      });
    });

  }, [toast]);

  const connect = async (scenarioConfig?: any) => {
    if (!vapiRef.current) {
      toast({
        title: "Configuration Error",
        description: "VAPI not properly configured. Please check your API key.",
        variant: "destructive",
      });
      return;
    }

    // Store config for potential reconnection
    sessionConfigRef.current = scenarioConfig;

    try {
      const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
      
      if (assistantId) {
        // Use pre-configured assistant
        await vapiRef.current.start(assistantId);
      } else {
        // Get session messages for context
        const sessionMessages = SessionManager.getSessionMessagesForVAPI();
        const conversationContext = sessionMessages.length > 0 
          ? `\n\nPrevious conversation context:\n${sessionMessages.map(m => `${m.role}: ${m.content}`).join('\n')}`
          : '';
        
        // Use scenario-specific config or default with language configuration
        const config = scenarioConfig || {
          name: `${getTargetLanguageLabel()} Language Tutor`,
          model: {
            provider: "openai",
            model: "gpt-4",
            messages: [{
              role: "system",
              content: generateSystemPrompt("Hospital scenarios for healthcare professionals.") + conversationContext
            }],
            temperature: 0.8
          },
          voice: {
            provider: "11labs",
            voiceId: getVoiceIdForLanguage() // Language-appropriate voice
          },
          transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: "multi", // Support multiple languages
            // Push-to-talk configuration - disable automatic speech detection
            keywords: [],
            endpointing: 255, // High value to prevent auto-stop
          },
          firstMessage: getDefaultGreeting()
        };
        
        // If scenario config provided, inject session context into system prompt
        if (scenarioConfig?.model?.messages) {
          config.model.messages = scenarioConfig.model.messages.map((msg: any) => {
            if (msg.role === 'system') {
              return {
                ...msg,
                content: msg.content + conversationContext
              };
            }
            return msg;
          });
        }
        
        console.log('🔄 Starting VAPI with session context:', sessionMessages.length, 'previous messages');
        await vapiRef.current.start(config);
      }

    } catch (error) {
      console.error('Error starting VAPI call:', error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to start voice conversation",
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    if (vapiRef.current && isConnected) {
      vapiRef.current.stop();
    }
    setIsConnected(false);
    setIsAISpeaking(false);
    setUserTranscriptLive('');
    setAssistantTranscriptLive('');
  };

  const sendTextMessage = (text: string) => {
    if (!vapiRef.current || !isConnected) {
      toast({
        title: "Not connected",
        description: "Please start the voice conversation first",
        variant: "destructive",
      });
      return;
    }

    resetInactivityTimer(); // User is active - sending a message

    try {
      // Don't manually add the message - let VAPI handle it via transcript
      // Just send it to VAPI and wait for the transcript event
      
      // Send the message to VAPI to trigger AI response
      if (vapiRef.current.send) {
        vapiRef.current.send({
          type: 'add-message',
          message: {
            role: 'user',
            content: text,
          },
        });
      }
      
      // Manually add to messages since VAPI might not echo text messages back
      // Use a slight delay to avoid race conditions
      setTimeout(() => {
        setMessages(prev => {
          // Check if this message was already added by VAPI
          const lastMsg = prev[prev.length - 1];
          if (lastMsg?.content === text && lastMsg?.role === 'user') {
            return prev; // Already added by VAPI
          }
          return [...prev, {
            role: 'user',
            content: text,
            timestamp: Date.now()
          }];
        });
      }, 100);
    } catch (error) {
      console.error('Error sending text message:', error);
      toast({
        title: "Send Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const startListening = () => {
    if (!isConnected) {
      console.log('Not connected - cannot start listening');
      return;
    }
    console.log('🎤 Push-to-talk: Started listening');
    shouldListenRef.current = true;
    setUserTranscriptLive('🎤 Listening...');
  };

  const stopListening = () => {
    console.log('🎤 Push-to-talk: Stopped listening');
    shouldListenRef.current = false;
    // Don't clear transcript immediately - let it process
  };

  return {
    isConnected,
    isAISpeaking,
    messages,
    userTranscriptLive,
    assistantTranscriptLive,
    connect,
    disconnect,
    sendTextMessage,
    startListening,
    stopListening,
  };
};