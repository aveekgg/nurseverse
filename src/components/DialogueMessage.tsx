import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ChevronDown } from 'lucide-react';

interface DialogueMessageProps {
  germanText: string;
  englishText: string;
  characterName?: string;
  isFromUser?: boolean;
  onPlayAudio?: () => void;
  defaultTranslationOpen?: boolean;
}

export function DialogueMessage({ 
  germanText, 
  englishText, 
  characterName = "Character",
  isFromUser = false,
  onPlayAudio,
  defaultTranslationOpen = false
}: DialogueMessageProps) {
  const [showTranslation, setShowTranslation] = useState(defaultTranslationOpen);

  const handleToggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent translation toggle when clicking audio button
    onPlayAudio?.();
  };

  const messageStyle = isFromUser 
    ? "ml-auto bg-gradient-to-br from-emerald-500 to-emerald-600"
    : "mr-auto bg-gradient-to-br from-slate-100 to-slate-200";

  const textColor = isFromUser ? "text-white" : "text-slate-800";
  const translationBg = isFromUser ? "bg-emerald-600/20" : "bg-slate-300/50";
  const translationText = isFromUser ? "text-emerald-100" : "text-slate-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-xs rounded-2xl shadow-sm ${messageStyle} mb-3`}
    >
      {/* Main message */}
      <div 
        className={`p-4 cursor-pointer ${textColor}`}
        onClick={handleToggleTranslation}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs opacity-70 font-medium">
            {isFromUser ? "You" : characterName}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            {onPlayAudio && !isFromUser && (
              <button
                onClick={handlePlayAudio}
                className="p-1 rounded-full hover:bg-black/10 transition-colors"
              >
                <Volume2 className="w-3 h-3" />
              </button>
            )}
            <ChevronDown 
              className={`w-3 h-3 transition-transform ${showTranslation ? 'rotate-180' : ''}`} 
            />
          </div>
        </div>
        
        <p className="text-sm leading-relaxed">
          {germanText}
        </p>
      </div>

      {/* Translation fold-down */}
      <AnimatePresence>
        {showTranslation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className={`px-4 pb-4 ${translationBg} rounded-b-2xl`}>
              <div className="border-t border-white/20 pt-3">
                <p className={`text-xs ${translationText} italic leading-relaxed`}>
                  {englishText}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}