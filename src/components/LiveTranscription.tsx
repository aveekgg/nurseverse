import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface LiveTranscriptionProps {
  text: string;
  isCharacterSpeaking: boolean;
  characterName: string;
  onTranscriptionComplete?: () => void;
  shouldAccumulate?: boolean; // New prop to control accumulation
}

export function LiveTranscription({
  text,
  isCharacterSpeaking,
  characterName,
  onTranscriptionComplete,
  shouldAccumulate = true,
}: LiveTranscriptionProps) {
  const [displayText, setDisplayText] = useState("");
  const [accumulatedText, setAccumulatedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle text accumulation and display
  useEffect(() => {
    if (isCharacterSpeaking && text) {
      setIsVisible(true);
      
      // Clear any existing hide timeout
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        setHideTimeout(null);
      }

      if (shouldAccumulate) {
        // Add new text to accumulated text if it's not already included
        const newText = text.trim();
        if (newText && !accumulatedText.includes(newText)) {
          const updatedAccumulated = accumulatedText 
            ? `${accumulatedText} ${newText}`
            : newText;
          setAccumulatedText(updatedAccumulated);
          setCurrentIndex(displayText.length); // Continue from where we left off
        }
      } else {
        setAccumulatedText(text);
        setCurrentIndex(0);
      }
    } else if (!isCharacterSpeaking && accumulatedText) {
      // Character stopped speaking, show for 10 seconds then hide
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setAccumulatedText("");
        setDisplayText("");
        setCurrentIndex(0);
      }, 10000); // 10 seconds

      setHideTimeout(timeout);
      onTranscriptionComplete?.();
    }

    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [text, isCharacterSpeaking, shouldAccumulate]);

  // Typing animation effect
  useEffect(() => {
    if (!accumulatedText || !isVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next <= accumulatedText.length) {
          setDisplayText(accumulatedText.substring(0, next));
          return next;
        }
        clearInterval(interval);
        return prev;
      });
    }, 50); // Faster typing for accumulated text

    return () => clearInterval(interval);
  }, [accumulatedText, isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="p-6 bg-black/70 backdrop-blur-md border-white/20 text-white">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-semibold border border-white/30"
            >
              {characterName.charAt(0)}
            </motion.div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-white">{characterName}</span>
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex space-x-1"
              >
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              </motion.div>
            </div>
            
            <div className="text-lg leading-relaxed text-white">
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-0.5 h-6 bg-white/80 ml-1"
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}