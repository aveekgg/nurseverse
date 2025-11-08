import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Clock, Award } from "lucide-react";

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  image: string;
}

interface ScenarioCardProps {
  scenario: Scenario;
  onPlay: (scenarioId: string) => void;
  delay?: number;
}

const ScenarioCard = ({ scenario, onPlay, delay = 0 }: ScenarioCardProps) => {
  const difficultyColors = {
    beginner: "text-success",
    intermediate: "text-encourage",
    advanced: "text-destructive",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card-soft overflow-hidden hover:shadow-scene transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={scenario.image}
          alt={scenario.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-medium text-foreground">
          {scenario.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {scenario.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {scenario.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{scenario.duration}</span>
          </div>
          <div className={`flex items-center gap-1 ${difficultyColors[scenario.difficulty]}`}>
            <Award className="w-4 h-4" />
            <span className="capitalize">{scenario.difficulty}</span>
          </div>
        </div>

        {/* Play Button */}
        <Button
          onClick={() => onPlay(scenario.id)}
          className="w-full rounded-full bg-primary hover:bg-primary/90"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Scene
        </Button>
      </div>
    </motion.div>
  );
};

export default ScenarioCard;
