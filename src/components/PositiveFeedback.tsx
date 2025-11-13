import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Star, ThumbsUp, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

interface PositiveFeedbackProps {
  isVisible: boolean;
  feedbackType: "excellent" | "good" | "correct";
  message: string;
  onComplete: () => void;
  autoHideDuration?: number;
}

const feedbackConfig = {
  excellent: {
    icon: Award,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    message: "Ausgezeichnet! (Excellent!)"
  },
  good: {
    icon: ThumbsUp,
    color: "text-green-500", 
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    message: "Gut! (Good!)"
  },
  correct: {
    icon: CheckCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-50", 
    borderColor: "border-blue-200",
    message: "Richtig! (Correct!)"
  }
};

const PositiveFeedback = ({ 
  isVisible, 
  feedbackType, 
  message, 
  onComplete, 
  autoHideDuration = 3000 
}: PositiveFeedbackProps) => {
  const config = feedbackConfig[feedbackType];
  const IconComponent = config.icon;

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onComplete, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete, autoHideDuration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { 
              type: "spring", 
              damping: 25, 
              stiffness: 300 
            }
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8, 
            y: -20,
            transition: { duration: 0.2 }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        >
          <Card className={`${config.bgColor} ${config.borderColor} shadow-2xl pointer-events-auto`}>
            <CardContent className="pt-6 pb-6 px-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 20 }}
                className="flex flex-col items-center space-y-4"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ rotate: -180 }}
                  animate={{ rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className={`p-4 rounded-full bg-white shadow-md`}
                >
                  <IconComponent className={`w-12 h-12 ${config.color}`} />
                </motion.div>

                {/* Feedback Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center space-y-2"
                >
                  <h3 className={`text-xl font-bold ${config.color.replace('text-', 'text-').replace('-500', '-700')}`}>
                    {config.message}
                  </h3>
                  <p className="text-sm text-gray-600 max-w-xs">
                    {message}
                  </p>
                </motion.div>

                {/* Stars Animation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-1"
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.6 + i * 0.1, 
                        type: "spring",
                        damping: 20
                      }}
                    >
                      <Star className={`w-4 h-4 ${config.color} fill-current`} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Progress indicator */}
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: autoHideDuration / 1000, ease: "linear" }}
                  className={`h-1 ${config.color.replace('text-', 'bg-').replace('-500', '-300')} rounded-full`}
                />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PositiveFeedback;