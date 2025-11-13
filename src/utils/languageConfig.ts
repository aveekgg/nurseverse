// Language Configuration
// Supports any language pair through environment variables

export interface LanguageConfig {
  targetLanguage: string;        // e.g., "German", "Hindi", "Spanish"
  targetLanguageCode: string;    // e.g., "de", "hi", "es"
  knownLanguage: string;         // e.g., "English"
  knownLanguageCode: string;     // e.g., "en"
}

// Get language configuration from environment
export const getLanguageConfig = (): LanguageConfig => {
  return {
    targetLanguage: import.meta.env.VITE_LANGUAGE_TO_LEARN || 'German',
    targetLanguageCode: import.meta.env.VITE_LANGUAGE_TO_LEARN_CODE || 'de',
    knownLanguage: import.meta.env.VITE_LANGUAGE_KNOWN || 'English',
    knownLanguageCode: import.meta.env.VITE_LANGUAGE_KNOWN_CODE || 'en'
  };
};

// Get the language display name for UI
export const getTargetLanguageLabel = (): string => {
  const config = getLanguageConfig();
  return config.targetLanguage;
};

export const getKnownLanguageLabel = (): string => {
  const config = getLanguageConfig();
  return config.knownLanguage;
};

// Generate system prompt based on language configuration
export const generateSystemPrompt = (scenarioContext: string = ''): string => {
  const config = getLanguageConfig();
  
  return `You are a helpful ${config.targetLanguage} language instructor helping a student learn conversational ${config.targetLanguage}. 
The student knows ${config.knownLanguage} and wants to learn ${config.targetLanguage}.

Speak naturally and provide encouragement. Keep responses concise and contextual.
Always respond ONLY in ${config.targetLanguage} - never use ${config.knownLanguage} in your responses.

${scenarioContext ? `Context: ${scenarioContext}` : ''}`;
};

// Language-specific greetings
const GREETINGS: Record<string, string> = {
  'de': 'Guten Morgen! Wie kann ich Ihnen helfen?',
  'hi': 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूं?',
  'es': '¡Buenos días! ¿Cómo puedo ayudarte?',
  'fr': 'Bonjour! Comment puis-je vous aider?',
  'it': 'Buongiorno! Come posso aiutarti?',
  'pt': 'Bom dia! Como posso ajudá-lo?',
  'ja': 'おはようございます！どのようにお手伝いできますか？',
  'zh': '早上好！我能帮你什么？',
  'ko': '좋은 아침입니다! 어떻게 도와드릴까요?',
  'ar': 'صباح الخير! كيف يمكنني مساعدتك؟',
  'ru': 'Доброе утро! Как я могу вам помочь?',
  'nl': 'Goedemorgen! Hoe kan ik u helpen?',
  'sv': 'God morgon! Hur kan jag hjälpa dig?',
  'pl': 'Dzień dobry! Jak mogę ci pomóc?',
  'tr': 'Günaydın! Size nasıl yardımcı olabilirim?',
};

// Language-specific voice IDs (11labs voices)
const VOICE_IDS: Record<string, string> = {
  'de': '21m00Tcm4TlvDq8ikWAM', // Rachel - works well for German
  'hi': 'pNInz6obpgDQGcFmaJgB', // Adam - clear, works for Hindi
  'es': 'EXAVITQu4vr4xnSDxMaL', // Bella - Spanish female
  'fr': '21m00Tcm4TlvDq8ikWAM', // Rachel - works for French
  'it': 'EXAVITQu4vr4xnSDxMaL', // Bella - Italian
  'pt': 'EXAVITQu4vr4xnSDxMaL', // Bella - Portuguese
  'ja': 'pNInz6obpgDQGcFmaJgB', // Adam - Japanese
  'zh': 'pNInz6obpgDQGcFmaJgB', // Adam - Chinese
  'ko': 'pNInz6obpgDQGcFmaJgB', // Adam - Korean
  'ar': 'pNInz6obpgDQGcFmaJgB', // Adam - Arabic
  'ru': '21m00Tcm4TlvDq8ikWAM', // Rachel - Russian
  'nl': '21m00Tcm4TlvDq8ikWAM', // Rachel - Dutch
  'sv': '21m00Tcm4TlvDq8ikWAM', // Rachel - Swedish
  'pl': '21m00Tcm4TlvDq8ikWAM', // Rachel - Polish
  'tr': 'EXAVITQu4vr4xnSDxMaL', // Bella - Turkish
};

export const getDefaultGreeting = (): string => {
  const config = getLanguageConfig();
  return GREETINGS[config.targetLanguageCode] || 'Hello! How can I help you?';
};

// Get language-appropriate voice ID
export const getVoiceIdForLanguage = (): string => {
  // Check for env override first
  const overrideVoiceId = import.meta.env.VITE_VOICE_ID;
  if (overrideVoiceId) {
    return overrideVoiceId;
  }
  
  // Otherwise use language-specific voice
  const config = getLanguageConfig();
  return VOICE_IDS[config.targetLanguageCode] || '21m00Tcm4TlvDq8ikWAM'; // Default to Rachel
};

// Language labels for UI
export const getLanguageLabels = () => {
  const config = getLanguageConfig();
  return {
    targetText: `${config.targetLanguage} Text`,
    knownTranslation: `${config.knownLanguage} Translation`,
    practicing: `Practicing ${config.targetLanguage}`,
    learning: `Learning ${config.targetLanguage}`,
    speakIn: `Speak in ${config.targetLanguage}`,
    typeIn: `Type in ${config.targetLanguage}`
  };
};

// Example translations for common phrases (can be extended)
export const getCommonPhrases = () => {
  const config = getLanguageConfig();
  
  // You can add more language pairs here
  const phrases: Record<string, Record<string, string>> = {
    'de': {
      'Guten Morgen': 'Good morning',
      'Wie geht es Ihnen': 'How are you',
      'Danke': 'Thank you',
      'Bitte': 'Please',
      'Ja': 'Yes',
      'Nein': 'No',
      'Entschuldigung': 'Excuse me'
    },
    'hi': {
      'नमस्ते': 'Hello',
      'धन्यवाद': 'Thank you',
      'कृपया': 'Please',
      'हां': 'Yes',
      'नहीं': 'No',
      'माफ़ करें': 'Excuse me'
    },
    'es': {
      'Buenos días': 'Good morning',
      '¿Cómo estás?': 'How are you',
      'Gracias': 'Thank you',
      'Por favor': 'Please',
      'Sí': 'Yes',
      'No': 'No',
      'Perdón': 'Excuse me'
    }
  };
  
  return phrases[config.targetLanguageCode] || {};
};

// Contextual response suggestions based on conversation context
export const generateContextualResponses = (characterMessage: string) => {
  const config = getLanguageConfig();
  
  // Language-specific responses
  const responses: Record<string, any> = {
    'de': {
      greeting: [
        { german: "Guten Morgen! Ich bin die neue Krankenschwester.", english: "Good morning! I'm the new nurse.", pronunciation: "GOO-ten MOR-gen! ikh bin dee NOY-eh KRANK-en-shvess-ter" },
        { german: "Vielen Dank für die Begrüßung.", english: "Thank you for the welcome.", pronunciation: "FEE-len dank fuer dee beh-GRUESS-ung" }
      ],
      help: [
        { german: "Ja, ich brauche Hilfe beim Eingang.", english: "Yes, I need help with the entrance procedure.", pronunciation: "yah, ikh BROW-kheh HIL-feh baym AYN-gang" },
        { german: "Können Sie mir zeigen, wo ich hin muss?", english: "Can you show me where I need to go?", pronunciation: "KUH-nen zee meer TSAY-gen, vo ikh hin muss" }
      ],
      default: [
        { german: "Ja, verstehe.", english: "Yes, I understand.", pronunciation: "yah, fer-SHTAY-eh" },
        { german: "Können Sie mir mehr sagen?", english: "Can you tell me more?", pronunciation: "KUH-nen zee meer mayr ZAH-gen" }
      ]
    },
    'hi': {
      greeting: [
        { german: "नमस्ते! मैं नई नर्स हूं।", english: "Hello! I'm the new nurse.", pronunciation: "na-mas-te! main na-yee nurse hoon" },
        { german: "स्वागत के लिए धन्यवाद।", english: "Thank you for the welcome.", pronunciation: "swa-gat ke li-ye dhan-ya-vaad" }
      ],
      help: [
        { german: "हां, मुझे मदद चाहिए।", english: "Yes, I need help.", pronunciation: "haan, mu-jhe ma-dad chaa-hi-ye" },
        { german: "क्या आप मुझे दिखा सकते हैं?", english: "Can you show me?", pronunciation: "kya aap mu-jhe di-kha sak-te hain" }
      ],
      default: [
        { german: "हां, समझ गया।", english: "Yes, I understand.", pronunciation: "haan, samajh ga-ya" },
        { german: "कृपया और बताएं।", english: "Please tell me more.", pronunciation: "kri-pa-ya aur ba-taa-yen" }
      ]
    },
    'es': {
      greeting: [
        { german: "¡Buenos días! Soy la nueva enfermera.", english: "Good morning! I'm the new nurse.", pronunciation: "bwe-nos dee-as! soy la nwe-va en-fer-me-ra" },
        { german: "Gracias por la bienvenida.", english: "Thank you for the welcome.", pronunciation: "gra-syas por la byen-ve-nee-da" }
      ],
      help: [
        { german: "Sí, necesito ayuda.", english: "Yes, I need help.", pronunciation: "see, ne-se-see-to a-yu-da" },
        { german: "¿Puede mostrarme dónde ir?", english: "Can you show me where to go?", pronunciation: "pwe-de mos-trar-me don-de eer" }
      ],
      default: [
        { german: "Sí, entiendo.", english: "Yes, I understand.", pronunciation: "see, en-tyen-do" },
        { german: "¿Puede decirme más?", english: "Can you tell me more?", pronunciation: "pwe-de de-seer-me mas" }
      ]
    }
  };
  
  const langResponses = responses[config.targetLanguageCode] || responses['de'];
  const message = characterMessage.toLowerCase();
  
  // Detect context and return appropriate responses
  if (message.includes('hello') || message.includes('welcome') || message.includes('good morning') || 
      message.includes('नमस्ते') || message.includes('buenos días')) {
    return langResponses.greeting;
  }
  
  if (message.includes('help') || message.includes('need') || message.includes('मदद') || message.includes('ayuda')) {
    return langResponses.help;
  }
  
  return langResponses.default;
};
