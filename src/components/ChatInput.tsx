import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send, Square, Volume2 } from 'lucide-react';
import { Button } from './ui/button';

interface ChatInputProps {
  isConnected: boolean;
  isCharacterSpeaking: boolean;
  isRecording: boolean;
  onMicToggle: () => void;
  onSendMessage: (message: string) => void;
  placeholder?: string;
  pronunciationFeedback?: {
    score: number;
    feedback: string;
  } | null;
}

export function ChatInput({
  isConnected,
  isCharacterSpeaking,
  isRecording,
  onMicToggle,
  onSendMessage,
  placeholder = "Type your response in German...",
  pronunciationFeedback
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = () => {
    setInputMode('voice');
    onMicToggle();
  };

  useEffect(() => {
    if (!isRecording && inputMode === 'voice') {
      setInputMode('text');
    }
  }, [isRecording, inputMode]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-md">
      <div className="max-w-md mx-auto p-4">
        {/* Pronunciation Feedback */}
        {pronunciationFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-3 p-3 bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-400/30"
          >
            <div className="flex items-center justify-between text-blue-100 text-sm">
              <span className="font-semibold">Pronunciation Score:</span>
              <span className={`font-bold ${
                pronunciationFeedback.score >= 80 ? 'text-green-400' :
                pronunciationFeedback.score >= 60 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {pronunciationFeedback.score}%
              </span>
            </div>
            {pronunciationFeedback.feedback && (
              <p className="text-blue-200/80 text-xs mt-1">{pronunciationFeedback.feedback}</p>
            )}
          </motion.div>
        )}

        {/* Recording Status */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-3 p-3 bg-red-500/20 backdrop-blur-sm rounded-lg border border-red-400/30"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-3 h-3 bg-red-400 rounded-full"
              />
              <span className="text-red-100 text-sm font-medium">
                Recording... speak now or tap ⏹️ to stop
              </span>
            </div>
          </motion.div>
        )}

        {/* Chat Input Area */}
        <div className="flex items-end space-x-3">
          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isCharacterSpeaking ? "Wait for character to finish..." : placeholder}
              disabled={isCharacterSpeaking || isRecording}
              className={`
                w-full px-4 py-3 pr-12 rounded-xl border text-white placeholder-white/50
                transition-all duration-300 focus:outline-none focus:ring-2
                ${isCharacterSpeaking || isRecording
                  ? 'bg-gray-600/50 border-gray-500/30 cursor-not-allowed'
                  : 'bg-white/10 border-white/20 focus:ring-blue-400/50 focus:bg-white/15'
                }
              `}
            />
            
            {/* Send Button */}
            <Button
              size="sm"
              onClick={handleSend}
              disabled={!message.trim() || isCharacterSpeaking || isRecording}
              className={`
                absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg
                transition-all duration-300
                ${message.trim() && !isCharacterSpeaking && !isRecording
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Voice Input Button */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              onClick={handleMicClick}
              disabled={!isConnected || isCharacterSpeaking}
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                transition-all duration-300 shadow-lg border-2
                ${isCharacterSpeaking
                  ? 'bg-gray-500/80 border-gray-400 cursor-not-allowed'
                  : isRecording
                  ? 'bg-red-500/90 hover:bg-red-600/90 border-red-300 shadow-red-500/50'
                  : isConnected
                  ? 'bg-green-500/90 hover:bg-green-600/90 border-green-300 shadow-green-500/50'
                  : 'bg-gray-500/80 border-gray-400'
                }
              `}
            >
              {isRecording ? (
                <Square className="w-5 h-5 text-white fill-current" />
              ) : (
                <Mic className="w-5 h-5 text-white" />
              )}
              
              {/* Pulse animation when recording */}
              {isRecording && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-4 border-red-300/50"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}

              {/* Ready to speak pulse when connected */}
              {isConnected && !isCharacterSpeaking && !isRecording && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-4 border-green-300/30"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
              )}
            </Button>
          </motion.div>
        </div>

        {/* Input Mode Indicator */}
        <div className="flex items-center justify-center mt-2 space-x-4 text-xs text-white/60">
          <span className={inputMode === 'text' ? 'text-blue-400' : ''}>
            ⌨️ Type
          </span>
          <span className="text-white/30">or</span>
          <span className={inputMode === 'voice' ? 'text-green-400' : ''}>
            🎤 Speak
          </span>
        </div>
      </div>
    </div>
  );
}