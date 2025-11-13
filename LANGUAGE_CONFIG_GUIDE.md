# Multi-Language Configuration Guide

## Overview
This language learning app now supports **any language pair** through simple environment configuration!

## Quick Start

### 1. Configure Your Language Pair

Edit the `.env` file and set these variables:

```env
VITE_LANGUAGE_TO_LEARN="German"         # The language you want to learn
VITE_LANGUAGE_TO_LEARN_CODE="de"        # ISO language code
VITE_LANGUAGE_KNOWN="English"           # The language you already know
VITE_LANGUAGE_KNOWN_CODE="en"           # ISO language code
```

### 2. Restart the Development Server

```bash
npm run dev
```

The app will automatically:
- Generate AI prompts in your target language
- Use appropriate greetings
- Provide translations to your known language
- Adapt all UI labels

## Examples

### Learning Hindi from English
```env
VITE_LANGUAGE_TO_LEARN="Hindi"
VITE_LANGUAGE_TO_LEARN_CODE="hi"
VITE_LANGUAGE_KNOWN="English"
VITE_LANGUAGE_KNOWN_CODE="en"
```

**AI will:**
- Speak only in Hindi
- Greet with: "नमस्ते! मैं आपकी कैसे मदद कर सकता हूं?"
- Provide English translations
- System prompt: "You are a helpful Hindi language instructor..."

### Learning Spanish from English
```env
VITE_LANGUAGE_TO_LEARN="Spanish"
VITE_LANGUAGE_TO_LEARN_CODE="es"
VITE_LANGUAGE_KNOWN="English"
VITE_LANGUAGE_KNOWN_CODE="en"
```

**AI will:**
- Speak only in Spanish
- Greet with: "¡Buenos días! ¿Cómo puedo ayudarte?"
- Provide English translations
- System prompt: "You are a helpful Spanish language instructor..."

### Learning French from English
```env
VITE_LANGUAGE_TO_LEARN="French"
VITE_LANGUAGE_TO_LEARN_CODE="fr"
VITE_LANGUAGE_KNOWN="English"
VITE_LANGUAGE_KNOWN_CODE="en"
```

## Supported Languages

| Language   | Code | Default Greeting                              |
|------------|------|-----------------------------------------------|
| German     | de   | Guten Morgen! Wie kann ich Ihnen helfen?     |
| Hindi      | hi   | नमस्ते! मैं आपकी कैसे मदद कर सकता हूं?        |
| Spanish    | es   | ¡Buenos días! ¿Cómo puedo ayudarte?          |
| French     | fr   | Bonjour! Comment puis-je vous aider?          |
| Italian    | it   | Buongiorno! Come posso aiutarti?              |
| Portuguese | pt   | Bom dia! Como posso ajudá-lo?                 |
| Japanese   | ja   | おはようございます！どのようにお手伝いできますか？       |
| Chinese    | zh   | 早上好！我能帮你什么？                              |
| Korean     | ko   | 좋은 아침입니다! 어떻게 도와드릴까요?                 |
| Arabic     | ar   | صباح الخير! كيف يمكنني مساعدتك؟                |
| Russian    | ru   | Доброе утро! Как я могу вам помочь?           |
| Dutch      | nl   | Goedemorgen! Hoe kan ik u helpen?            |
| Swedish    | sv   | God morgon! Hur kan jag hjälpa dig?          |
| Polish     | pl   | Dzień dobry! Jak mogę ci pomóc?              |
| Turkish    | tr   | Günaydın! Size nasıl yardımcı olabilirim?    |

## How It Works

### 1. Language Configuration (`src/utils/languageConfig.ts`)
- Reads environment variables
- Provides language-specific greetings
- Generates appropriate system prompts
- Returns language labels for UI

### 2. VAPI Integration (`src/hooks/useVapiConversation.ts`)
- Uses `generateSystemPrompt()` to create language-specific instructions
- Uses `getDefaultGreeting()` for initial message
- AI assistant speaks ONLY in the target language

### 3. Session Management
- Each conversation session is isolated per scenario
- Sessions store messages in the configured language pair
- Historical context preserved for continuity

### 4. UI Adaptation
- Labels automatically update based on language config
- Example: "German Text" becomes "Hindi Text"
- Translations show your known language

## Testing Different Languages

### Test Hindi:
1. Update `.env`:
   ```env
   VITE_LANGUAGE_TO_LEARN="Hindi"
   VITE_LANGUAGE_TO_LEARN_CODE="hi"
   ```
2. Restart server
3. Start a conversation
4. AI will respond in Hindi with English translations

### Test Spanish:
1. Update `.env`:
   ```env
   VITE_LANGUAGE_TO_LEARN="Spanish"
   VITE_LANGUAGE_TO_LEARN_CODE="es"
   ```
2. Restart server
3. Start a conversation
4. AI will respond in Spanish with English translations

## Adding New Languages

To add a language not in the list:

1. Add the language code to `VITE_LANGUAGE_TO_LEARN_CODE`
2. Optionally add a greeting in `languageConfig.ts`:
   ```typescript
   const GREETINGS: Record<string, string> = {
     // ... existing greetings
     'your_code': 'Your greeting in target language',
   };
   ```
3. The AI will still work with any language, even without a custom greeting!

## Benefits

✅ **Easy Testing** - Switch languages in seconds
✅ **Universal** - Works with any language pair
✅ **Consistent** - AI always speaks target language only
✅ **Flexible** - No code changes needed to switch languages
✅ **Scalable** - Add new languages through configuration

## Technical Details

**Environment Variables:**
- `VITE_LANGUAGE_TO_LEARN`: Display name (e.g., "German", "Hindi")
- `VITE_LANGUAGE_TO_LEARN_CODE`: ISO 639-1 code (e.g., "de", "hi")
- `VITE_LANGUAGE_KNOWN`: Your known language (e.g., "English")
- `VITE_LANGUAGE_KNOWN_CODE`: ISO 639-1 code (e.g., "en")

**Auto-Generated Prompts:**
```typescript
You are a helpful ${targetLanguage} language instructor 
helping a student learn conversational ${targetLanguage}. 
The student knows ${knownLanguage} and wants to learn ${targetLanguage}.
Always respond ONLY in ${targetLanguage} - never use ${knownLanguage}.
```

**Dynamic Greetings:**
The app uses language-specific greetings stored in a lookup table, ensuring culturally appropriate first messages.
