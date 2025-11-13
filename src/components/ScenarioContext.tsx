import { motion } from "framer-motion";
import { ArrowLeft, Play, Users, Clock, BarChart3, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScenarioData } from "@/data/scenarios";

interface ScenarioContextProps {
  scenario: ScenarioData;
  onBack: () => void;
  onStart: () => void;
}

const ScenarioContext = ({ scenario, onBack, onStart }: ScenarioContextProps) => {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
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
            <h1 className="text-3xl font-bold text-foreground">{scenario.title}</h1>
            <p className="text-muted-foreground">{scenario.description}</p>
          </div>
        </motion.div>

        {/* Scenario Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-xl overflow-hidden"
        >
          <img
            src={scenario.image}
            alt={scenario.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          
          {/* Scenario Stats */}
          <div className="absolute bottom-4 left-4 flex gap-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {scenario.duration}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              {scenario.difficulty}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {scenario.category}
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scenario Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {scenario.context.situation}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-primary">Key Skills</h4>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    {scenario.context.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Character & Context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Who You'll Talk To
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div>
                    <h4 className="font-semibold text-lg">{scenario.character.name}</h4>
                    <p className="text-sm text-primary font-medium">{scenario.character.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {scenario.character.background}
                  </p>
                </div>

                <div className="pt-3 border-t">
                  <h4 className="font-semibold text-sm mb-2 text-primary">Cultural Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    {scenario.context.culturalNotes.map((note, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">💡</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Conversation Goals - More Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-800 flex items-center gap-2 text-lg">
                <Target className="w-5 h-5" />
                Your Mission
              </CardTitle>
              <CardDescription className="text-emerald-700 text-sm">
                {scenario.context.conversationGoals.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {scenario.context.conversationGoals.objectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-2 text-emerald-700 bg-white/50 p-2 rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-sm leading-snug">{objective}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center pt-6"
        >
          <Button
            size="lg"
            onClick={onStart}
            className="flex items-center gap-3 px-8 py-6 text-lg"
          >
            <Play className="w-6 h-6" />
            Start Role-Play
          </Button>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Instructions:</strong> The character will speak only in German. 
                Use the microphone button to speak, and click the help button for translations. 
                Try to stay within the scenario context for the most immersive experience.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ScenarioContext;