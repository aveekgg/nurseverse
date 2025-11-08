import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Welcome from "@/components/Welcome";
import ScenarioSelector from "@/components/ScenarioSelector";
import ScenePlayer from "@/components/ScenePlayer";

type View = "welcome" | "scenarios" | "scene";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("welcome");
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const handleStart = () => {
    setCurrentView("scenarios");
  };

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setCurrentView("scene");
  };

  const handleBackToScenarios = () => {
    setCurrentView("scenarios");
    setSelectedScenario(null);
  };

  const handleBackToWelcome = () => {
    setCurrentView("welcome");
    setSelectedScenario(null);
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentView === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Welcome onStart={handleStart} />
          </motion.div>
        )}

        {currentView === "scenarios" && (
          <motion.div
            key="scenarios"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <ScenarioSelector
              onBack={handleBackToWelcome}
              onSelectScenario={handleSelectScenario}
            />
          </motion.div>
        )}

        {currentView === "scene" && selectedScenario && (
          <motion.div
            key="scene"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <ScenePlayer
              scenarioId={selectedScenario}
              onBack={handleBackToScenarios}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
