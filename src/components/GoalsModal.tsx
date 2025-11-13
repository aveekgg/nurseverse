import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, X, CheckCircle, Circle } from 'lucide-react';

interface GoalsModalProps {
  objectives: Array<{
    id: string;
    text: string;
    completed: boolean;
    progress?: number;
  }>;
  isOpen: boolean;
  onClose: () => void;
  scenarioTitle?: string;
}

export function GoalsModal({ objectives, isOpen, onClose, scenarioTitle }: GoalsModalProps) {
  const completedCount = objectives.filter(obj => obj.completed).length;
  const totalCount = objectives.length;
  const overallProgress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

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
          
          {/* Goals Modal - slides up from bottom */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-50 max-h-[70vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-emerald-600" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Learning Goals</h2>
                  {scenarioTitle && (
                    <p className="text-sm text-slate-500">{scenarioTitle}</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Progress Overview */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                <span className="text-sm text-slate-600">{completedCount}/{totalCount}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                />
              </div>
              {overallProgress === 100 && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-sm text-emerald-700 font-medium mt-2 text-center"
                >
                  🎉 All goals completed! Great job!
                </motion.p>
              )}
            </div>

            {/* Objectives List */}
            <div className="flex-1 overflow-y-auto max-h-96">
              {objectives.length === 0 ? (
                <div className="p-8 text-center">
                  <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No learning objectives defined</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {objectives.map((objective, index) => (
                    <motion.div
                      key={objective.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border transition-colors ${
                        objective.completed
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {objective.completed ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm leading-relaxed ${
                            objective.completed 
                              ? 'text-emerald-800 line-through' 
                              : 'text-slate-700'
                          }`}>
                            {objective.text}
                          </p>
                          {objective.progress !== undefined && !objective.completed && (
                            <div className="mt-2">
                              <div className="w-full bg-slate-200 rounded-full h-1.5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${objective.progress}%` }}
                                  transition={{ duration: 0.3 }}
                                  className="h-full bg-emerald-500 rounded-full"
                                />
                              </div>
                              <span className="text-xs text-slate-500 mt-1">
                                {objective.progress}% complete
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Tips */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-600 text-center">
                💡 Goals are checked automatically as you progress through the conversation
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}