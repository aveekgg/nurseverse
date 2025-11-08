import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, Volume2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import HintCard, { Hint } from "./HintCard";
import { useToast } from "@/hooks/use-toast";
import hospitalReception from "@/assets/hospital-reception.jpg";

interface ScenePlayerProps {
  scenarioId: string;
  onBack: () => void;
}

const ScenePlayer = ({ scenarioId, onBack }: ScenePlayerProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { toast } = useToast();

  // Sample hints for the first day scenario
  const hints: Hint[] = [
    {
      id: "1",
      type: "vocabulary",
      title: "Greeting Phrases",
      content: "In German hospitals, formal greetings are important. Use 'Guten Morgen' (Good morning) or 'Guten Tag' (Good day).",
      example: "Guten Morgen! Ich bin die neue Krankenschwester.",
    },
    {
      id: "2",
      type: "cultural",
      title: "Professional Etiquette",
      content: "German workplace culture values punctuality and formal address. Use 'Sie' (formal you) until invited to use 'du'.",
    },
  ];

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Recording started",
        description: "Speak naturally and we'll listen",
      });
    } else {
      toast({
        title: "Processing your response",
        description: "Great job! Keep practicing.",
      });
    }
  };

  const handlePlayAudio = () => {
    toast({
      title: "Playing scene audio",
      description: "Listen to the character's dialogue",
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Scene Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={hospitalReception}
          alt="Hospital reception"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      {/* Content Container */}
      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 flex items-center justify-between"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayAudio}
              className="rounded-full bg-background/80 backdrop-blur-sm"
            >
              <Volume2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHint(!showHint)}
              className="rounded-full bg-background/80 backdrop-blur-sm"
            >
              <Lightbulb className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Section */}
        <div className="p-4 space-y-4">
          {/* Hint Cards */}
          <AnimatePresence>
            {showHint && (
              <div className="flex justify-center">
                <HintCard hint={hints[0]} onClose={() => setShowHint(false)} />
              </div>
            )}
          </AnimatePresence>

          {/* Dialogue Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-soft p-6 space-y-4 max-w-2xl mx-auto"
          >
            <div className="space-y-2">
              <p className="text-xs uppercase font-medium text-muted-foreground tracking-wide">
                Hospital Administrator
              </p>
              <p className="text-lg text-foreground leading-relaxed">
                "Guten Morgen! Welcome to our hospital. I'm here to help you with your orientation paperwork. How are you feeling about starting today?"
              </p>
            </div>

            {/* Microphone Button */}
            <div className="flex justify-center pt-4">
              <motion.button
                onClick={handleMicClick}
                className={`
                  relative w-20 h-20 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${isRecording 
                    ? 'bg-encourage shadow-[0_0_30px_hsla(15,90%,65%,0.5)]' 
                    : 'bg-primary hover:bg-primary/90 shadow-lg'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                transition={isRecording ? { repeat: Infinity, duration: 1.5 } : {}}
              >
                <Mic className="w-8 h-8 text-white" />
                {isRecording && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-encourage"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.3, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
              </motion.button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {isRecording ? "Listening... speak naturally" : "Tap to respond"}
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Scene Progress</span>
              <span>1 of 5</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "20%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenePlayer;
