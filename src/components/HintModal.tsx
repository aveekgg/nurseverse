import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X, Volume2, Copy } from 'lucide-react';
import { getLanguageConfig } from '../utils/languageConfig';

interface SuggestionWithTranslation {
  german: string;      // Target language text
  english: string;     // Known language translation
  pronunciation?: string;
}

interface HintModalProps {
  suggestions: string[] | SuggestionWithTranslation[];
  isOpen: boolean;
  onClose: () => void;
  onSelectSuggestion: (suggestion: string) => void;
  onPlayAudio?: (text: string) => void;
}

export function HintModal({ 
  suggestions, 
  isOpen, 
  onClose, 
  onSelectSuggestion, 
  onPlayAudio 
}: HintModalProps) {
  const handleSuggestionClick = (suggestion: string) => {
    onSelectSuggestion(suggestion);
    onClose();
  };

  const handlePlayAudio = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayAudio?.(text);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - only for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
          />
          
          {/* Hints Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-full left-0 right-0 mb-4 bg-white rounded-xl shadow-lg border border-slate-200 z-50 max-h-64 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-medium text-slate-800">Suggested Responses</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Suggestions */}
            <div className="max-h-48 overflow-y-auto">
              {suggestions.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-slate-500">No suggestions available</p>
                </div>
              ) : (
                <div className="p-2">
                  {suggestions.map((suggestion, index) => {
                    const isObject = typeof suggestion === 'object';
                    const germanText = isObject ? suggestion.german : suggestion;
                    const englishText = isObject ? suggestion.english : '';
                    const pronunciation = isObject ? suggestion.pronunciation : '';
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                        onClick={() => handleSuggestionClick(germanText)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800 leading-relaxed">
                              {germanText}
                            </p>
                            {englishText && (
                              <p className="text-xs text-slate-500 mt-1">
                                → {englishText}
                              </p>
                            )}
                            {pronunciation && (
                              <p className="text-xs text-blue-600 mt-0.5 italic">
                                🔊 {pronunciation}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {onPlayAudio && (
                              <button
                                onClick={(e) => handlePlayAudio(germanText, e)}
                                className="p-1.5 rounded-full hover:bg-slate-200 transition-colors"
                                title="Listen to pronunciation"
                              >
                                <Volume2 className="w-3 h-3 text-slate-600" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(germanText);
                              }}
                              className="p-1.5 rounded-full hover:bg-slate-200 transition-colors"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-3 h-3 text-slate-600" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer tip */}
            <div className="p-2 border-t border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-600 text-center">
                💬 Tap to use suggestion or 🎵 to hear pronunciation
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}