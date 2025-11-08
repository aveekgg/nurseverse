import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScenarioCard, { Scenario } from "./ScenarioCard";
import hospitalEntrance from "@/assets/hospital-entrance.jpg";
import hospitalReception from "@/assets/hospital-reception.jpg";

interface ScenarioSelectorProps {
  onBack: () => void;
  onSelectScenario: (scenarioId: string) => void;
}

const scenarios: Scenario[] = [
  {
    id: "first-day",
    title: "First Day at Hospital",
    description: "Meet your new colleagues and learn about hospital procedures in your first day orientation.",
    category: "Hospital",
    duration: "5-7 min",
    difficulty: "beginner",
    image: hospitalEntrance,
  },
  {
    id: "patient-greeting",
    title: "Patient Greeting & Care",
    description: "Practice greeting patients warmly and understanding their basic needs in a comforting way.",
    category: "Patient Care",
    duration: "4-6 min",
    difficulty: "beginner",
    image: hospitalReception,
  },
  // More scenarios can be added here
];

const ScenarioSelector = ({ onBack, onSelectScenario }: ScenarioSelectorProps) => {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Choose Your Scenario</h2>
            <p className="text-muted-foreground">Select a real-life situation to practice</p>
          </div>
        </motion.div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onPlay={onSelectScenario}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioSelector;
