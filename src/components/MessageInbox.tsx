import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  translation?: string;
  timestamp: Date;
}

interface MessageInboxProps {
  messages: Message[];
  isVisible: boolean;
  onClose: () => void;
  characterName: string;
}

export function MessageInbox({
  messages,
  isVisible,
  onClose,
  characterName,
}: MessageInboxProps) {
  // Get last 10 messages for inbox
  const recentMessages = messages.slice(-10).reverse();

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed inset-4 z-50 flex items-center justify-center"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Message Inbox */}
        <Card className="relative w-full max-w-md h-[70vh] bg-black/90 backdrop-blur-md border-white/20 text-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold">Recent Messages</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message, index) => (
                  <motion.div
                    key={message.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      message.role === 'assistant'
                        ? 'bg-blue-500/20 border-blue-400/30'
                        : 'bg-green-500/20 border-green-400/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {message.role === 'assistant' ? characterName : 'You'}
                      </span>
                      <span className="text-xs text-white/60">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    {/* Original Message */}
                    <div className="mb-2">
                      <p className="text-sm font-medium text-white">
                        {message.content}
                      </p>
                    </div>
                    
                    {/* Translation (if available) */}
                    {message.translation && (
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-white/70 font-medium mb-1">
                          Translation:
                        </p>
                        <p className="text-sm text-white/90 italic">
                          {message.translation}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-white/60">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start your conversation to see messages here</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}