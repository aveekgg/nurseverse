import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResponseOption {
  german: string;
  english: string;
  pronunciation: string;
}

interface ResponseSuggestionsProps {
  options: ResponseOption[];
  isVisible: boolean;
  onClose: () => void;
  onOptionSelect: (option: ResponseOption) => void;
}

export function ResponseSuggestions({
  options,
  isVisible,
  onClose,
  onOptionSelect,
}: ResponseSuggestionsProps) {
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
        
        {/* Response Suggestions */}
        <Card className="relative w-full max-w-md h-[70vh] bg-black/90 backdrop-blur-md border-white/20 text-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <h3 className="font-semibold">Response Suggestions</h3>
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

          {/* Suggestions */}
          <ScrollArea className="flex-1 p-4">
            {options.length > 0 ? (
              <div className="space-y-3">
                {options.map((option, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      onOptionSelect(option);
                      onClose();
                    }}
                    className="w-full p-4 rounded-xl border border-white/20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-left transition-all duration-300 shadow-lg"
                  >
                    <div className="space-y-3">
                      {/* German Text */}
                      <div className="bg-blue-500/20 rounded-lg p-3 border-l-4 border-blue-400">
                        <div className="text-blue-100 text-xs font-semibold mb-1">GERMAN</div>
                        <div className="text-white font-medium text-lg">
                          {option.german}
                        </div>
                      </div>
                      
                      {/* English Translation */}
                      <div className="bg-green-500/20 rounded-lg p-3 border-l-4 border-green-400">
                        <div className="text-green-100 text-xs font-semibold mb-1">ENGLISH</div>
                        <div className="text-white/90 text-base">
                          {option.english}
                        </div>
                      </div>
                      
                      {/* Pronunciation Guide */}
                      <div className="bg-orange-500/20 rounded-lg p-2 border-l-4 border-orange-400">
                        <div className="text-orange-100 text-xs font-semibold mb-1">PRONUNCIATION</div>
                        <div className="text-white/70 text-sm italic font-mono">
                          [{option.pronunciation}]
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-white/60">
                <div className="text-center">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No suggestions available</p>
                  <p className="text-sm">Continue the conversation naturally</p>
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Footer tip */}
          <div className="p-4 border-t border-white/20">
            <p className="text-white/60 text-xs text-center">
              💡 Select a response or speak naturally in German
            </p>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}