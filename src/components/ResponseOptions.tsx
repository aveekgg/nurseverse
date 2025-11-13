import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResponseOption {
  german: string;
  english: string;
  pronunciation: string;
  context: string;
}

interface ResponseOptionsProps {
  options: ResponseOption[];
  isVisible: boolean;
  onOptionSelect: (option: ResponseOption) => void;
  onClose: () => void;
}

const ResponseOptions = ({ options, isVisible, onOptionSelect, onClose }: ResponseOptionsProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl mx-auto"
        >
          <Card className="bg-amber-50 border-amber-200 shadow-lg">
            <CardContent className="pt-4">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-700">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Response Options</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 px-2 text-amber-600 hover:text-amber-800"
                  >
                    ×
                  </Button>
                </div>

                <p className="text-xs text-amber-600 text-center">
                  Choose a response option and read it out when you press the microphone
                </p>

                {/* Response Options */}
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className="cursor-pointer hover:bg-amber-100 transition-colors border-amber-200 bg-white"
                        onClick={() => onOptionSelect(option)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            {/* German phrase */}
                            <div className="flex items-start gap-2">
                              <span className="text-xs text-gray-500 font-medium mt-0.5">🇩🇪</span>
                              <p className="text-sm font-medium text-gray-800 flex-1">
                                {option.german}
                              </p>
                            </div>

                            {/* Pronunciation */}
                            <div className="flex items-start gap-2">
                              <span className="text-xs text-blue-500 font-medium mt-0.5">🗣️</span>
                              <p className="text-xs font-mono text-blue-600 flex-1">
                                {option.pronunciation}
                              </p>
                            </div>

                            {/* English translation */}
                            <div className="flex items-start gap-2">
                              <span className="text-xs text-green-500 font-medium mt-0.5">🇺🇸</span>
                              <p className="text-xs text-green-700 flex-1">
                                {option.english}
                              </p>
                            </div>

                            {/* Context note */}
                            {option.context && (
                              <div className="flex items-start gap-2">
                                <span className="text-xs text-purple-500 font-medium mt-0.5">💡</span>
                                <p className="text-xs text-purple-600 italic flex-1">
                                  {option.context}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Instructions */}
                <div className="bg-amber-100 p-3 rounded-md">
                  <p className="text-xs text-amber-800 text-center">
                    💡 Tap any option above to see it highlighted, then speak it into the microphone
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResponseOptions;