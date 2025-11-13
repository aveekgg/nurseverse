import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Target, X } from 'lucide-react';
import { Button } from './ui/button';

interface ConversationGoal {
  title: string;
  description: string;
  objectives: string[];
  completionTriggers: string[];
}

interface ObjectiveTrackerProps {
  conversationGoal: ConversationGoal;
  conversationHistory: string[];
  isVisible: boolean;
  onClose: () => void;
  onObjectiveComplete: () => void;
}

export function ObjectiveTracker({
  conversationGoal,
  conversationHistory,
  isVisible,
  onClose,
  onObjectiveComplete
}: ObjectiveTrackerProps) {
  const [completedObjectives, setCompletedObjectives] = useState<boolean[]>(
    new Array(conversationGoal.objectives.length).fill(false)
  );

  // Track completion based on conversation history
  useEffect(() => {
    const conversationText = conversationHistory.join(' ').toLowerCase();
    const newCompletedStates = conversationGoal.objectives.map((objective, index) => {
      if (completedObjectives[index]) return true; // Already completed
      
      // Check if any completion trigger words are mentioned
      const relatedTriggers = conversationGoal.completionTriggers.filter(trigger =>
        conversationText.includes(trigger.toLowerCase())
      );
      
      return relatedTriggers.length > 0;
    });

    setCompletedObjectives(newCompletedStates);

    // Check if all objectives are completed
    if (newCompletedStates.every(completed => completed)) {
      onObjectiveComplete();
    }
  }, [conversationHistory, conversationGoal.completionTriggers, conversationGoal.objectives, completedObjectives, onObjectiveComplete]);

  const completionPercentage = Math.round(
    (completedObjectives.filter(Boolean).length / conversationGoal.objectives.length) * 100
  );

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed top-4 right-4 z-50 w-80"
      >
        {/* Backdrop for mobile */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-xl" />
        
        {/* Objective Panel */}
        <div className="relative bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-md rounded-xl border border-slate-200/50 text-slate-800 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200/50">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold text-sm text-slate-800">{conversationGoal.title}</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="p-4 border-b border-slate-200/50">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-600">Progress</span>
              <span className="text-emerald-600 font-semibold">{completionPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                initial={{ width: "0%" }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="p-4 border-b border-slate-200/50">
            <p className="text-slate-700 text-xs leading-relaxed">
              {conversationGoal.description}
            </p>
          </div>

          {/* Objectives List */}
          <div className="p-4">
            <h4 className="text-slate-600 text-xs font-semibold mb-3 uppercase tracking-wide">
              Objectives to Complete:
            </h4>
            <div className="space-y-2">
              {conversationGoal.objectives.map((objective, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start space-x-3 p-2 rounded-lg transition-colors ${
                    completedObjectives[index] 
                      ? 'bg-emerald-50 border border-emerald-200' 
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  <motion.div
                    initial={false}
                    animate={{ scale: completedObjectives[index] ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {completedObjectives[index] ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    )}
                  </motion.div>
                  <span 
                    className={`text-xs leading-relaxed ${
                      completedObjectives[index] 
                        ? 'text-emerald-700 line-through' 
                        : 'text-slate-700'
                    }`}
                  >
                    {objective}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Success Message */}
          {completionPercentage === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-50 border-t border-emerald-200"
            >
              <div className="flex items-center space-x-2 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-semibold">🎉 All objectives completed!</span>
              </div>
              <p className="text-emerald-600 text-xs mt-1">
                Great job! You can now end the conversation or continue practicing.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}