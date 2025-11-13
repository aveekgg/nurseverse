import { motion } from "framer-motion";
import { Mic, MessageCircle, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

interface TurnIndicatorProps {
  isAISpeaking: boolean;
  isUserSpeaking: boolean;
  isProcessing: boolean;
  isConnected: boolean;
}

export function TurnIndicator({ 
  isAISpeaking, 
  isUserSpeaking,
  isProcessing,
  isConnected
}: TurnIndicatorProps) {
  const wasAISpeakingRef = useRef(isAISpeaking);
  
  // Play a subtle notification sound when it becomes user's turn
  useEffect(() => {
    // Detect transition from AI speaking to user's turn
    if (wasAISpeakingRef.current && !isAISpeaking && !isProcessing && !isUserSpeaking && isConnected) {
      // Optional: Add a subtle sound effect here
      // For now, we'll just use visual cues
      console.log("🔔 Your turn to speak!");
    }
    wasAISpeakingRef.current = isAISpeaking;
  }, [isAISpeaking, isProcessing, isUserSpeaking, isConnected]);
  
  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gray-500/20 border border-gray-400/30 shadow-lg"
      >
        <div className="w-2 h-2 rounded-full bg-gray-400" />
        <span className="text-sm font-medium text-gray-300">
          Not Connected
        </span>
      </motion.div>
    );
  }

  if (isAISpeaking) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-blue-500/30 border-2 border-blue-400/60 backdrop-blur-sm shadow-lg"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex gap-1"
        >
          <motion.div 
            animate={{ scaleY: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
            className="w-1 h-4 bg-blue-400 rounded-full" 
          />
          <motion.div 
            animate={{ scaleY: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
            className="w-1 h-4 bg-blue-400 rounded-full" 
          />
          <motion.div 
            animate={{ scaleY: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
            className="w-1 h-4 bg-blue-400 rounded-full" 
          />
        </motion.div>
        <MessageCircle className="w-4 h-4 text-blue-300" />
        <span className="text-sm font-semibold text-blue-100">
          AI is speaking...
        </span>
      </motion.div>
    );
  }

  if (isUserSpeaking) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-red-500/30 border-2 border-red-400/60 backdrop-blur-sm shadow-lg"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"
        />
        <Mic className="w-4 h-4 text-red-300" />
        <span className="text-sm font-semibold text-red-100">
          🎤 Listening...
        </span>
      </motion.div>
    );
  }

  if (isProcessing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-yellow-500/30 border-2 border-yellow-400/60 backdrop-blur-sm shadow-lg"
      >
        <Loader2 className="w-4 h-4 text-yellow-300 animate-spin" />
        <span className="text-sm font-semibold text-yellow-100">
          Processing...
        </span>
      </motion.div>
    );
  }

  // Your turn! - Enhanced with more prominent animation
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: 0,
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-green-500/30 border-2 border-green-400/60 backdrop-blur-sm shadow-lg"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.4, 1],
          boxShadow: [
            "0 0 0px rgba(74, 222, 128, 0)",
            "0 0 15px rgba(74, 222, 128, 0.6)",
            "0 0 0px rgba(74, 222, 128, 0)"
          ]
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-3 h-3 bg-green-400 rounded-full"
      />
      <Mic className="w-5 h-5 text-green-300" />
      <motion.span 
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-sm font-bold text-green-100"
      >
        Your Turn - Press Mic to Talk 👇
      </motion.span>
    </motion.div>
  );
}
