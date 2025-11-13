import { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, Lightbulb, Square } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface Message {
  id: string;
  content: string;
  speaker: 'user' | 'character';
  timestamp: Date;
  showTranslation?: boolean;
}

interface ScenePlayerProps {
  scenarioId: string;
  onBack: () => void;
}

export function ScenePlayer({ scenarioId, onBack }: ScenePlayerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scenario = {
    title: "Hospital Reception",
    character: "Receptionist Sarah",
    backgroundImage: "/src/assets/hospital-reception.jpg",
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      content: "Guten Tag! Willkommen in unserem Krankenhaus. Wie kann ich Ihnen helfen?",
      speaker: 'character',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      speaker: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setError(null);

    try {
      setTimeout(() => {
        const responses = [
          "Das ist kein Problem. Können Sie mir bitte Ihren Namen sagen?",
          "Sehr gut. Haben Sie einen Termin bei uns?",
          "Perfekt! Können Sie mir Ihre Versicherungskarte zeigen?",
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const characterMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: randomResponse,
          speaker: 'character',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, characterMessage]);
        setIsTyping(false);
      }, 1500);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setInputValue("Ich habe einen Termin um zwei Uhr.");
        setIsListening(false);
      }, 3000);
    }
  };

  const toggleTranslation = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, showTranslation: !msg.showTranslation }
          : msg
      )
    );
  };

  const getMessageTranslation = (content: string) => {
    const translations: Record<string, string> = {
      "Guten Tag! Willkommen in unserem Krankenhaus. Wie kann ich Ihnen helfen?": "Good day! Welcome to our hospital. How can I help you?",
      "Das ist kein Problem. Können Sie mir bitte Ihren Namen sagen?": "That's no problem. Could you please tell me your name?",
      "Sehr gut. Haben Sie einen Termin bei uns?": "Very good. Do you have an appointment with us?",
      "Perfekt! Können Sie mir Ihre Versicherungskarte zeigen?": "Perfect! Could you show me your insurance card?",
      "Ich habe einen Termin um zwei Uhr.": "I have an appointment at two o'clock."
    };
    return translations[content] || "Translation not available";
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-emerald-50 to-slate-100">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${scenario.backgroundImage})` }}
      />
      
      <div className="relative z-10 flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-emerald-200">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">{scenario.title}</h2>
          <p className="text-sm text-slate-600">Speaking with {scenario.character}</p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-slate-600 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto p-4 pb-32">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className={`max-w-md ${message.speaker === 'user' ? 'ml-auto bg-emerald-100' : 'mr-auto bg-white'}`}>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm mb-1">
                      {message.speaker === 'character' ? scenario.character : 'You'}
                    </p>
                    <p className="text-slate-700 mb-2">{message.content}</p>
                    {message.showTranslation && (
                      <p className="text-slate-500 text-sm italic">
                        {getMessageTranslation(message.content)}
                      </p>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTranslation(message.id)}
                      className="text-xs text-emerald-600 p-0 h-auto"
                    >
                      {message.showTranslation ? 'Hide' : 'Show'} Translation
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-2 text-slate-500">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm">{scenario.character} is typing...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-t border-emerald-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your response in German..."
                className="min-h-[60px] pr-24 border-emerald-200 focus:border-emerald-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              
              <div className="absolute right-2 bottom-2 flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVoiceInput}
                  className={`text-emerald-600 hover:text-emerald-700 ${isListening ? 'bg-emerald-100' : ''}`}
                >
                  {isListening ? <Square className="w-4 h-4" /> : '🎤'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
          
          {isListening && (
            <div className="mt-2 text-center text-sm text-emerald-600">
              🔴 Listening... Speak in German
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
