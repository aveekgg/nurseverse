import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { DialogueMessage } from './DialogueMessage';

interface MessageHistoryProps {
  messages: Array<{
    id: string;
    germanText: string;
    englishText: string;
    characterName: string;
    isFromUser: boolean;
    timestamp: number;
  }>;
  isOpen: boolean;
  onClose: () => void;
}

export function MessageHistory({ messages, isOpen, onClose }: MessageHistoryProps) {
  const [globalTranslationOpen, setGlobalTranslationOpen] = useState(false);

  // Auto-open translations for all future messages once user opens any translation
  useEffect(() => {
    const hasOpenTranslation = messages.some((_, index) => {
      // Check if any message has been clicked to show translation
      // This is a simplified approach - in real implementation, you'd track this per message
      return false;
    });
    
    if (hasOpenTranslation && !globalTranslationOpen) {
      setGlobalTranslationOpen(true);
    }
  }, [messages]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* History Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 bg-white rounded-xl shadow-xl z-50 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-800">Conversation History</h2>
                <span className="text-sm text-slate-500">({messages.length} messages)</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((message, index) => (
                    <div key={message.id} className="flex">
                      <DialogueMessage
                        germanText={message.germanText}
                        englishText={message.englishText}
                        characterName={message.characterName}
                        isFromUser={message.isFromUser}
                        defaultTranslationOpen={globalTranslationOpen}
                        onPlayAudio={() => {
                          // Handle audio playback for historical messages
                          console.log('Play audio for:', message.germanText);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer tip */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
              <p className="text-xs text-slate-600 text-center">
                💡 Tap any message to see the English translation
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}