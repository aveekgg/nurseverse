import { motion } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ScenarioCard, { Scenario } from "./ScenarioCard";
import { scenarios } from "@/data/scenarios";
import { ScenarioBuilder } from "./ScenarioBuilder";
import { useState } from "react";

interface ScenarioSelectorProps {
  onBack: () => void;
  onSelectScenario: (scenarioId: string) => void;
}

const ScenarioSelector = ({ onBack, onSelectScenario }: ScenarioSelectorProps) => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [customScenarios, setCustomScenarios] = useState<any[]>([]);

  // Convert the new scenario data to the format expected by ScenarioCard
  const scenarioCards: Scenario[] = [...scenarios, ...customScenarios].map(scenario => ({
    id: scenario.id,
    title: scenario.title,
    description: scenario.description,
    category: scenario.category,
    duration: scenario.duration,
    difficulty: scenario.difficulty,
    image: scenario.image,
  }));

  const handleCustomScenarioCreated = (newScenario: any) => {
    setCustomScenarios([...customScenarios, newScenario]);
  };

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
          {/* Create Custom Scenario Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed border-emerald-300 hover:border-emerald-400 bg-gradient-to-br from-emerald-25 to-white"
            onClick={() => setShowBuilder(true)}
          >
            <CardContent className="flex flex-col items-center justify-center h-64 p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                Create Custom Scenario
              </h3>
              <p className="text-sm text-emerald-600">
                Build your own practice scenario
              </p>
            </CardContent>
          </Card>

          {/* Existing Scenario Cards */}
          {scenarioCards.map((scenario, index) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onPlay={onSelectScenario}
              delay={index * 0.1}
            />
          ))}
        </div>

      {/* Scenario Builder Modal */}
      {showBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ScenarioBuilder
              isVisible={showBuilder}
              onClose={() => setShowBuilder(false)}
              onScenarioCreated={handleCustomScenarioCreated}
            />
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ScenarioSelector;
