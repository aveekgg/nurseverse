import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Star, TrendingUp } from 'lucide-react';

interface PronunciationAnalysis {
  score: number;
  feedback: string;
  suggestions: string[];
  strongPoints: string[];
}

interface PronunciationFeedbackProps {
  analysis: PronunciationAnalysis;
  originalText: string;
  isVisible: boolean;
  onPlayReference: () => void;
}

export function PronunciationFeedback({
  analysis,
  originalText,
  isVisible,
  onPlayReference
}: PronunciationFeedbackProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'Excellent!';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Practice';
  };

  const getEncouragement = (score: number) => {
    if (score >= 85) return "Outstanding pronunciation! You're sounding very natural.";
    if (score >= 70) return "Great job! Your German pronunciation is improving.";
    if (score >= 50) return "Good effort! Keep practicing to perfect your accent.";
    return "Don't worry - pronunciation takes practice. You're making progress!";
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-gradient-to-br from-purple-600/90 to-indigo-600/90 backdrop-blur-md rounded-xl border border-white/20 text-white p-6 shadow-2xl"
    >
      {/* Header with Score */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span>Pronunciation Analysis</span>
        </h3>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
            {analysis.score}%
          </div>
          <div className="text-sm text-white/70">{getScoreGrade(analysis.score)}</div>
        </div>
      </div>

      {/* Original Text with Playback */}
      <div className="bg-white/10 rounded-lg p-3 mb-4 border border-white/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white/80">Your pronunciation of:</span>
          <button
            onClick={onPlayReference}
            className="p-1.5 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-blue-300" />
          </button>
        </div>
        <p className="text-white font-medium">{originalText}</p>
      </div>

      {/* Encouragement Message */}
      <div className="bg-green-500/20 rounded-lg p-3 mb-4 border border-green-400/30">
        <p className="text-green-100 text-sm">{getEncouragement(analysis.score)}</p>
      </div>

      {/* Strong Points */}
      {analysis.strongPoints.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-green-300 mb-2 flex items-center space-x-1">
            <TrendingUp className="w-4 h-4" />
            <span>What you did well:</span>
          </h4>
          <div className="space-y-1">
            {analysis.strongPoints.map((point, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-sm text-green-100">{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions for Improvement */}
      {analysis.suggestions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-yellow-300 mb-2">Areas to improve:</h4>
          <div className="space-y-1">
            {analysis.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-yellow-100">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Feedback */}
      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
        <p className="text-white/90 text-sm leading-relaxed">{analysis.feedback}</p>
      </div>
    </motion.div>
  );
}

// Mock pronunciation analysis function (in real app, this would use speech recognition API)
export const analyzePronunciation = (spokenText: string, targetText: string): PronunciationAnalysis => {
  // Simulated scoring based on text similarity and common pronunciation patterns
  const similarity = spokenText.toLowerCase() === targetText.toLowerCase() ? 100 : 
                    Math.max(0, 85 - Math.abs(spokenText.length - targetText.length) * 5);
  
  const score = Math.min(100, Math.max(0, similarity + Math.random() * 20 - 10));
  
  const getRandomItems = <T,>(array: T[], count: number): T[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const allStrongPoints = [
    "Clear consonant pronunciation",
    "Good vowel sounds",
    "Natural rhythm and pace",
    "Proper stress on syllables", 
    "Smooth word transitions",
    "Accurate intonation patterns"
  ];

  const allSuggestions = [
    "Try rolling your 'R' sounds more",
    "Focus on the 'ü' and 'ö' vowel sounds",
    "Speak a bit slower for clearer pronunciation",
    "Emphasize the first syllable more",
    "Practice the 'ch' sound",
    "Work on consonant clusters"
  ];

  const strongPoints = score >= 70 ? getRandomItems(allStrongPoints, 2) : [];
  const suggestions = score < 85 ? getRandomItems(allSuggestions, score < 60 ? 3 : 2) : [];

  const feedback = score >= 85 
    ? "Your pronunciation is excellent! Keep up the great work."
    : score >= 70 
    ? "Good pronunciation overall. Minor adjustments will help you sound even more natural."
    : score >= 50
    ? "Your pronunciation is understandable. Focus on the specific sounds mentioned above."
    : "Keep practicing! Pronunciation improves with consistent effort.";

  return {
    score: Math.round(score),
    feedback,
    suggestions,
    strongPoints
  };
};