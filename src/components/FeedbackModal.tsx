import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, TrendingUp, Volume2, RotateCcw } from 'lucide-react';

interface FeedbackItem {
  id: string;
  germanText: string;
  pronunciationScore: number;
  grammarScore: number;
  fluencyScore: number;
  feedback: string;
  timestamp: number;
}

interface FeedbackModalProps {
  feedbackHistory: FeedbackItem[];
  isOpen: boolean;
  onClose: () => void;
  onReplayAudio?: (text: string) => void;
}

export function FeedbackModal({ 
  feedbackHistory, 
  isOpen, 
  onClose, 
  onReplayAudio 
}: FeedbackModalProps) {
  // Calculate average scores
  const avgPronunciation = feedbackHistory.length > 0 
    ? feedbackHistory.reduce((sum, item) => sum + item.pronunciationScore, 0) / feedbackHistory.length 
    : 0;
  const avgGrammar = feedbackHistory.length > 0 
    ? feedbackHistory.reduce((sum, item) => sum + item.grammarScore, 0) / feedbackHistory.length 
    : 0;
  const avgFluency = feedbackHistory.length > 0 
    ? feedbackHistory.reduce((sum, item) => sum + item.fluencyScore, 0) / feedbackHistory.length 
    : 0;
  const overallScore = (avgPronunciation + avgGrammar + avgFluency) / 3;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-500';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

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
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Feedback Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 bg-white rounded-xl shadow-xl z-50 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Pronunciation Feedback</h2>
                  <p className="text-sm text-slate-500">Track your speaking progress</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Latest Feedback - Prominent Display */}
            {feedbackHistory.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Latest Feedback</h3>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-center">
                      <div className={`text-xl font-bold ${getScoreColor(feedbackHistory[feedbackHistory.length - 1].pronunciationScore)}`}>
                        {feedbackHistory[feedbackHistory.length - 1].pronunciationScore}%
                      </div>
                      <div className="text-xs text-slate-600">Pronunciation</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xl font-bold ${getScoreColor(feedbackHistory[feedbackHistory.length - 1].grammarScore)}`}>
                        {Math.round(feedbackHistory[feedbackHistory.length - 1].grammarScore)}%
                      </div>
                      <div className="text-xs text-slate-600">Grammar</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xl font-bold ${getScoreColor(feedbackHistory[feedbackHistory.length - 1].fluencyScore)}`}>
                        {Math.round(feedbackHistory[feedbackHistory.length - 1].fluencyScore)}%
                      </div>
                      <div className="text-xs text-slate-600">Fluency</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 italic text-center mt-2">
                    "{feedbackHistory[feedbackHistory.length - 1].germanText}"
                  </p>
                  <p className="text-xs text-slate-700 mt-1">
                    {feedbackHistory[feedbackHistory.length - 1].feedback}
                  </p>
                </div>
              </div>
            )}

            {/* Overall Stats */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Conversation Average</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore.toFixed(0)}%
                  </div>
                  <div className="text-xs text-slate-600">Overall</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(avgPronunciation)}`}>
                    {avgPronunciation.toFixed(0)}%
                  </div>
                  <div className="text-xs text-slate-600">Pronunciation</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(avgGrammar)}`}>
                    {avgGrammar.toFixed(0)}%
                  </div>
                  <div className="text-xs text-slate-600">Grammar</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(avgFluency)}`}>
                    {avgFluency.toFixed(0)}%
                  </div>
                  <div className="text-xs text-slate-600">Fluency</div>
                </div>
              </div>
            </div>

            {/* Feedback History */}
            <div className="flex-1 overflow-y-auto">
              {feedbackHistory.length === 0 ? (
                <div className="p-8 text-center">
                  <Mic className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No feedback yet</h3>
                  <p className="text-slate-500 text-sm">Start speaking to get pronunciation feedback</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {feedbackHistory.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                    >
                      {/* Message and timestamp */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-sm text-slate-800 font-medium">"{item.germanText}"</p>
                          <p className="text-xs text-slate-500 mt-1">{formatTimestamp(item.timestamp)}</p>
                        </div>
                        {onReplayAudio && (
                          <button
                            onClick={() => onReplayAudio(item.germanText)}
                            className="p-2 rounded-full hover:bg-slate-200 transition-colors"
                            title="Replay your pronunciation"
                          >
                            <RotateCcw className="w-4 h-4 text-slate-600" />
                          </button>
                        )}
                      </div>

                      {/* Scores */}
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Pronunciation</span>
                            <span className={getScoreColor(item.pronunciationScore)}>
                              {item.pronunciationScore}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div
                              className={`h-full rounded-full ${getScoreBarColor(item.pronunciationScore)}`}
                              style={{ width: `${item.pronunciationScore}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Grammar</span>
                            <span className={getScoreColor(item.grammarScore)}>
                              {item.grammarScore}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div
                              className={`h-full rounded-full ${getScoreBarColor(item.grammarScore)}`}
                              style={{ width: `${item.grammarScore}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Fluency</span>
                            <span className={getScoreColor(item.fluencyScore)}>
                              {item.fluencyScore}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div
                              className={`h-full rounded-full ${getScoreBarColor(item.fluencyScore)}`}
                              style={{ width: `${item.fluencyScore}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Feedback text */}
                      {item.feedback && (
                        <div className="bg-white rounded-lg p-3 border border-slate-200">
                          <p className="text-sm text-slate-700 leading-relaxed">{item.feedback}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-600 text-center">
                🎯 Feedback is generated after each voice message to help improve your German
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}