import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Hint {
  id: string;
  type: "vocabulary" | "grammar" | "cultural";
  title: string;
  content: string;
  example?: string;
}

interface HintCardProps {
  hint: Hint;
  onClose: () => void;
}

const HintCard = ({ hint, onClose }: HintCardProps) => {
  const typeColors = {
    vocabulary: "bg-primary/10 text-primary",
    grammar: "bg-encourage/10 text-encourage",
    cultural: "bg-success/10 text-success",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="card-soft p-6 space-y-4 max-w-md"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${typeColors[hint.type]}`}>
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs uppercase font-medium text-muted-foreground tracking-wide">
                {hint.type}
              </p>
              <h4 className="font-semibold text-foreground">{hint.title}</h4>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <p className="text-sm text-foreground leading-relaxed">{hint.content}</p>
          {hint.example && (
            <div className="mt-3 p-3 rounded-lg bg-muted">
              <p className="text-xs uppercase font-medium text-muted-foreground mb-1">
                Example
              </p>
              <p className="text-sm text-foreground italic">{hint.example}</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HintCard;
