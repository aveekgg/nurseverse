import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface ScenarioBuilderProps {
  isVisible: boolean;
  onClose: () => void;
  onScenarioCreated: (scenario: any) => void;
}

export function ScenarioBuilder({ isVisible, onClose, onScenarioCreated }: ScenarioBuilderProps) {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    setting: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration: '4-6 min'
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI scenario generation
    setTimeout(() => {
      const generatedScenario = {
        id: `custom-${Date.now()}`,
        title: generateTitle(formData.description),
        description: formData.description,
        category: "Custom Scenario",
        duration: formData.duration,
        difficulty: formData.difficulty,
        image: "/src/assets/custom-scenario.jpg",
        
        context: {
          situation: formData.description,
          learningObjectives: generateLearningObjectives(formData.description),
          culturalNotes: generateCulturalNotes(formData.setting),
          conversationGoals: generateConversationGoals(formData.description)
        },
        
        character: generateCharacter(formData.setting),
        scenes: generateScenes(formData.description, formData.setting),
        
        assistantConfig: {
          systemPrompt: generateSystemPrompt(formData.description, formData.setting),
          firstMessage: generateFirstMessage(formData.setting),
          voice: { provider: "11labs", voiceId: "21m00Tcm4TlvDq8ikWAM" },
          model: { provider: "openai", model: "gpt-4", temperature: 0.7 }
        }
      };
      
      setIsGenerating(false);
      onScenarioCreated(generatedScenario);
      onClose();
      setStep(1);
      setFormData({ description: '', setting: '', difficulty: 'beginner', duration: '4-6 min' });
    }, 3000);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl mx-4"
        >
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-indigo-600" />
                  <CardTitle className="text-indigo-800">Create Custom Scenario</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-indigo-600 hover:bg-indigo-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-indigo-700">
                Describe your ideal German conversation scenario and we'll create goals, characters, and dialogue for you!
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-indigo-800 mb-2">
                      What scenario would you like to practice?
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="E.g., Ordering coffee at a Berlin café, Asking for directions to Brandenburg Gate, Job interview at a tech company..."
                      className="w-full h-24 px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-indigo-800 mb-2">
                      Setting/Location
                    </label>
                    <input
                      type="text"
                      value={formData.setting}
                      onChange={(e) => setFormData({ ...formData, setting: e.target.value })}
                      placeholder="E.g., Café, Train station, Office, Hospital..."
                      className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 placeholder-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-indigo-800 mb-2">
                        Difficulty Level
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                        className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-indigo-800 mb-2">
                        Duration
                      </label>
                      <select
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
                      >
                        <option value="2-3 min">2-3 minutes</option>
                        <option value="4-6 min">4-6 minutes</option>
                        <option value="8-10 min">8-10 minutes</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!formData.description.trim() || !formData.setting.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
                    <h3 className="font-semibold text-emerald-800 mb-2">Preview Your Scenario</h3>
                    <div className="space-y-2 text-sm text-emerald-700">
                      <p><strong>Scenario:</strong> {formData.description}</p>
                      <p><strong>Setting:</strong> {formData.setting}</p>
                      <p><strong>Level:</strong> {formData.difficulty}</p>
                      <p><strong>Duration:</strong> {formData.duration}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">What we'll create for you:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Conversation goals and objectives</li>
                      <li>• Realistic German character with personality</li>
                      <li>• Cultural context and learning tips</li>
                      <li>• Dialogue scenarios and responses</li>
                      <li>• Voice interactions and feedback</li>
                    </ul>
                  </div>

                  {!isGenerating && (
                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleGenerate}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Scenario
                      </Button>
                    </div>
                  )}

                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-indigo-800 mb-2">Creating your scenario...</h3>
                      <p className="text-sm text-indigo-600">
                        Our AI is generating goals, characters, and dialogue. This may take a moment.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper functions for AI scenario generation (simplified)
function generateTitle(description: string): string {
  const keywords = description.toLowerCase();
  if (keywords.includes('coffee') || keywords.includes('café')) return "Coffee Shop Conversation";
  if (keywords.includes('direction') || keywords.includes('travel')) return "Getting Directions";
  if (keywords.includes('job') || keywords.includes('interview')) return "Job Interview";
  if (keywords.includes('shopping') || keywords.includes('store')) return "Shopping Experience";
  return "Custom German Conversation";
}

function generateLearningObjectives(description: string): string[] {
  return [
    "Practice relevant German vocabulary",
    "Use appropriate formal/informal language",
    "Understand cultural context",
    "Communicate effectively in the scenario"
  ];
}

function generateCulturalNotes(setting: string): string[] {
  return [
    "Germans appreciate direct and clear communication",
    "Punctuality is highly valued in German culture",
    "Use formal 'Sie' unless invited to use 'du'"
  ];
}

function generateConversationGoals(description: string) {
  return {
    title: "Complete Your Custom Scenario",
    description: `Successfully navigate your custom German conversation scenario: ${description}`,
    objectives: [
      "Initiate the conversation appropriately",
      "Ask relevant questions",
      "Provide necessary information",
      "Conclude the interaction politely"
    ],
    completionTriggers: [
      "greeting",
      "question",
      "information",
      "goodbye"
    ]
  };
}

function generateCharacter(setting: string) {
  const characters = {
    café: { name: "Maria Müller", role: "Barista" },
    office: { name: "Herr Schmidt", role: "Manager" },
    hospital: { name: "Dr. Weber", role: "Doctor" },
    default: { name: "Alex Fischer", role: "Local Helper" }
  };
  
  const char = characters[setting.toLowerCase() as keyof typeof characters] || characters.default;
  
  return {
    name: char.name,
    role: char.role,
    personality: "Friendly, helpful, and patient with German learners",
    background: `Works in a ${setting} and is experienced in helping people`,
    voiceSettings: {
      provider: "11labs" as const,
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      speed: 0.9,
      stability: 0.8
    }
  };
}

function generateScenes(description: string, setting: string) {
  return [
    {
      id: "main-interaction",
      title: "Main Interaction",
      description: description,
      background: "/src/assets/custom-scenario.jpg",
      characterPrompt: `You are helping someone in a ${setting}. Be friendly and helpful.`,
      expectedUserInput: ["greeting", "request", "question"],
      hints: [
        { german: "Guten Tag", pronunciation: "GOO-ten TAHK", english: "Good day" },
        { german: "Können Sie mir helfen?", pronunciation: "KUH-nen zee meer HEL-fen", english: "Can you help me?" },
        { german: "Vielen Dank", pronunciation: "FEE-len dank", english: "Thank you very much" }
      ],
      triggers: ["help", "thank", "bye"]
    }
  ];
}

function generateSystemPrompt(description: string, setting: string): string {
  return `You are a helpful German speaker in a ${setting}. The user is practicing German conversation about: ${description}. 
  
  Respond only in German at a beginner level. Be encouraging and patient. Keep responses to 1-2 sentences. 
  Use simple vocabulary and speak naturally but clearly.`;
}

function generateFirstMessage(setting: string): string {
  const greetings = {
    café: "Guten Morgen! Was möchten Sie heute trinken?",
    office: "Willkommen! Wie kann ich Ihnen helfen?",
    hospital: "Guten Tag! Sind Sie hier für einen Termin?",
    default: "Hallo! Schön Sie zu sehen. Wie kann ich helfen?"
  };
  
  return greetings[setting.toLowerCase() as keyof typeof greetings] || greetings.default;
}