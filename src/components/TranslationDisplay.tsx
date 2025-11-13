import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface TranslationDisplayProps {
  germanText: string;
  englishTranslation: string;
  pronunciation: string;
  isVisible: boolean;
  onToggle?: () => void;
}

// Mock translation function - in real app, this would use a translation API
const getTranslation = (germanText: string) => {
  const translations: Record<string, { english: string; pronunciation: string }> = {
    "Guten Morgen! Willkommen im Krankenhaus. Wie kann ich Ihnen helfen?": {
      english: "Good morning! Welcome to the hospital. How can I help you?",
      pronunciation: "GOO-ten MOR-gen! vil-KOM-men im KRAN-ken-hows. vee kan ikh EE-nen HEL-fen?"
    },
    "Ah, guten Morgen! Schön, dass Sie da sind.": {
      english: "Ah, good morning! Nice that you are here.",
      pronunciation: "ah, GOO-ten MOR-gen! shön, das zee dah zint."
    },
    "Haben Sie alle erforderlichen Dokumente dabei?": {
      english: "Do you have all the required documents with you?",
      pronunciation: "HAH-ben zee AH-leh er-FOR-der-li-khen do-koo-MEN-teh dah-BY?"
    },
    "Bitte füllen Sie diese Formulare aus.": {
      english: "Please fill out these forms.",
      pronunciation: "BIT-teh FÜL-len zee DEE-zeh for-moo-LAH-reh ows."
    }
  };

  // Try exact match first, then fallback to basic translation
  const exactMatch = translations[germanText];
  if (exactMatch) return exactMatch;

  // Basic fallback - in real app, use translation API
  return {
    english: "Translation not available - would use translation API",
    pronunciation: "Pronunciation guide would be generated"
  };
};

const TranslationDisplay = ({ germanText, englishTranslation, pronunciation, isVisible, onToggle }: TranslationDisplayProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const translation = getTranslation(germanText);
  const finalEnglish = englishTranslation || translation.english;
  const finalPronunciation = pronunciation || translation.pronunciation;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl mx-auto"
        >
          <Card className="bg-blue-50 border-blue-200 shadow-md">
            <CardContent className="pt-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Character said in German:</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDetails(!showDetails)}
                      className="h-8 px-2 text-blue-600 hover:text-blue-800"
                    >
                      {showDetails ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                    {onToggle && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggle}
                        className="h-8 px-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                </div>

                {/* German Text */}
                <div className="bg-white p-3 rounded-md border border-blue-100">
                  <p className="text-sm font-medium text-gray-800 leading-relaxed">
                    "{germanText}"
                  </p>
                </div>

                {/* English Translation */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  className="bg-green-50 p-3 rounded-md border border-green-100"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-green-600 font-medium mt-0.5">🇺🇸</span>
                    <p className="text-sm text-green-800 leading-relaxed flex-1">
                      {finalEnglish}
                    </p>
                  </div>
                </motion.div>

                {/* Pronunciation Guide */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-purple-50 p-3 rounded-md border border-purple-100"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xs text-purple-600 font-medium mt-0.5">🗣️</span>
                        <div className="flex-1">
                          <p className="text-xs text-purple-600 font-medium mb-1">Pronunciation:</p>
                          <p className="text-sm text-purple-800 font-mono leading-relaxed">
                            {finalPronunciation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Instructions */}
                <div className="text-center">
                  <p className="text-xs text-blue-600">
                    Read this, then click the microphone when ready to respond
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TranslationDisplay;