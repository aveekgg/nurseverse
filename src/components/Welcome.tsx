import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, Globe, Heart } from "lucide-react";
import heroImage from "@/assets/hero-nurse.jpg";

interface WelcomeProps {
  onStart: () => void;
}

const Welcome = ({ onStart }: WelcomeProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-calm-light via-background to-background -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full text-center space-y-8"
      >
        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-64 md:h-96 rounded-3xl overflow-hidden shadow-scene"
        >
          <img
            src={heroImage}
            alt="Confident nurse in hospital corridor"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-calm bg-clip-text text-transparent">
            Welcome to NurseVerse
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Immersive language learning for nurses going abroad. Live through real scenarios, not just study them.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          <div className="card-soft p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Voice Practice</h3>
            <p className="text-sm text-muted-foreground">
              Speak naturally and get real-time feedback
            </p>
          </div>

          <div className="card-soft p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-encourage/10 flex items-center justify-center mx-auto">
              <Globe className="w-6 h-6 text-encourage" />
            </div>
            <h3 className="font-semibold text-foreground">Real Scenarios</h3>
            <p className="text-sm text-muted-foreground">
              Hospital shifts, patient care, daily life
            </p>
          </div>

          <div className="card-soft p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold text-foreground">Build Confidence</h3>
            <p className="text-sm text-muted-foreground">
              Feel ready for your new journey abroad
            </p>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
          >
            Start Your Journey
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Welcome;
