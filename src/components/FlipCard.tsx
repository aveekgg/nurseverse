import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FlipHorizontal, Volume2 } from 'lucide-react';

interface FlipCardProps {
  frontText: string;
  backText: string;
  characterName?: string;
  isVisible: boolean;
  onPlayAudio?: () => void;
}

export function FlipCard({ 
  frontText, 
  backText, 
  characterName = "Character", 
  isVisible,
  onPlayAudio 
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip when clicking audio button
    onPlayAudio?.();
  };

  if (!isVisible || !frontText) {
    return (
      <div className="w-full max-w-sm mx-auto px-4 mb-6 h-32 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-6 py-3">
          <p className="text-white/60 text-sm text-center">
            💬 {characterName} will speak here...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto px-4 mb-6">
      <motion.div
        className="relative h-32 cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={handleFlip}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
          }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Front Side - German Text */}
          <motion.div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-500/90 to-blue-600/90 backdrop-blur-md rounded-xl border border-blue-400/30 shadow-lg p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-100 text-sm font-medium">{characterName}</span>
                <div className="flex items-center space-x-2">
                  {onPlayAudio && (
                    <button
                      onClick={handlePlayAudio}
                      className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Volume2 className="w-4 h-4 text-white" />
                    </button>
                  )}
                  <FlipHorizontal className="w-4 h-4 text-blue-200" />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-start pt-1">
                <div className="w-full h-20 overflow-hidden relative">
                  <p 
                    className="text-white text-center text-sm font-medium leading-tight px-2"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {frontText}
                  </p>
                  {/* Gradient fade for long text */}
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-blue-600/60 to-transparent pointer-events-none" />
                </div>
              </div>
              
              <div className="text-center">
                <span className="text-blue-200 text-xs">Tap to translate</span>
              </div>
            </div>
          </motion.div>

          {/* Back Side - English Translation */}
          <motion.div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-green-500/90 to-green-600/90 backdrop-blur-md rounded-xl border border-green-400/30 shadow-lg p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-100 text-sm font-medium">Translation</span>
                <div className="flex items-center space-x-2">
                  {onPlayAudio && (
                    <button
                      onClick={handlePlayAudio}
                      className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Volume2 className="w-4 h-4 text-white" />
                    </button>
                  )}
                  <FlipHorizontal className="w-4 h-4 text-green-200" />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-start pt-1">
                <div className="w-full h-20 overflow-hidden relative">
                  <p 
                    className="text-white text-center text-sm leading-tight px-2"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {backText}
                  </p>
                  {/* Gradient fade for long text */}
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-green-600/60 to-transparent pointer-events-none" />
                </div>
              </div>
              
              <div className="text-center">
                <span className="text-green-200 text-xs">Tap to see German</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}