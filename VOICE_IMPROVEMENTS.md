# Voice & Transcript Improvements

## Issues Fixed

### 1. **Voice vs Text Mismatch**
**Problem:** What you hear (voice audio) is different from what you see (transcript text)

**Root Cause:** VAPI transcription can have slight delays or variations

**Solution:** 
- Show live transcript as it's being generated
- Display "Processing..." indicator when transcription is being finalized
- Clear visual feedback for user speech vs AI speech

### 2. **Voice Input Not Shown Immediately**
**Problem:** When speaking, users couldn't see their words appearing

**Solution:**
- Added real-time user transcript display
- Shows partial transcripts as you speak
- Visual indicators:
  - 🎤 "Listening..." when you start speaking
  - Live transcript appearing as you speak
  - ⏳ "Processing..." when speech ends
  - Final message appears once processed

### 3. **Voice ID Language Mismatch**
**Problem:** Hardcoded voice (Rachel - German) used for all languages including Hindi

**Solution:**
- Language-specific voice IDs mapping:
```typescript
'de': Rachel  // Good for German
'hi': Adam    // Clear, works for Hindi
'es': Bella   // Spanish female
'fr': Rachel  // French
// ... etc
```
- Automatically selects appropriate voice based on `VITE_LANGUAGE_TO_LEARN_CODE`
- Optional override via `VITE_VOICE_ID` in `.env`

## Visual Feedback Improvements

### User Speaking States:

**1. Just Started Speaking:**
```
┌─────────────────────────────────┐
│  🎤 Listening...                │
│  ● ● ●  (pulsing dots)          │
└─────────────────────────────────┘
```

**2. While Speaking (Partial Transcript):**
```
┌─────────────────────────────────┐
│  नमस्ते! मैं नई नर्स...         │
│  You are saying...               │
└─────────────────────────────────┘
```

**3. Finished Speaking:**
```
┌─────────────────────────────────┐
│  ⏳ Processing...                │
│  ● ● ●  (pulsing dots)          │
└─────────────────────────────────┘
```

**4. Final Message:**
```
┌─────────────────────────────────┐
│  नमस्ते! मैं नई नर्स हूं।       │
│  [English translation toggle]    │
└─────────────────────────────────┘
```

### AI Speaking States:

**1. Just Started Speaking:**
```
┌─────────────────────────────────┐
│  Character is speaking...        │
│  ○ ○ ○  (bouncing dots)         │
└─────────────────────────────────┘
```

**2. While Speaking (Partial Transcript):**
```
┌─────────────────────────────────┐
│  धन्यवाद! आपका स्वागत...       │
│  [Show translation]              │
└─────────────────────────────────┘
```

**3. Final Message:**
```
┌─────────────────────────────────┐
│  धन्यवाद! आपका स्वागत है।      │
│  [English translation toggle]    │
└─────────────────────────────────┘
```

## Configuration

### Language-Specific Voices

**Automatically Selected Based on Language:**

| Language | Code | Voice | ID |
|----------|------|-------|-----|
| German | de | Rachel | 21m00Tcm4TlvDq8ikWAM |
| Hindi | hi | Adam | pNInz6obpgDQGcFmaJgB |
| Spanish | es | Bella | EXAVITQu4vr4xnSDxMaL |
| French | fr | Rachel | 21m00Tcm4TlvDq8ikWAM |
| Italian | it | Bella | EXAVITQu4vr4xnSDxMaL |

### Override Voice (Optional)

If you want to use a specific voice regardless of language:

```env
# Use a specific 11labs voice
VITE_VOICE_ID="your-custom-voice-id"
```

Leave empty to use language-appropriate defaults:
```env
# VITE_VOICE_ID=""  # Commented out = use language default
```

## Code Changes

### useVapiConversation.ts

**Updated Speech Events:**
```typescript
// Speech start
vapiRef.current.on('speech-start', () => {
  setUserTranscriptLive('🎤 Listening...');
});

// Speech end
vapiRef.current.on('speech-end', () => {
  setUserTranscriptLive('⏳ Processing...');
});

// Transcript events
if (message.role === 'user' && message.transcript) {
  // Show live transcript as user speaks
  setUserTranscriptLive(message.transcript);
}
```

**Language-Specific Voice:**
```typescript
voice: {
  provider: "11labs",
  voiceId: getVoiceIdForLanguage() // Auto-selects based on language
}
```

### ScenePlayer.tsx

**Added User Transcript Display:**
```tsx
{/* User is speaking/processing indicator */}
{userTranscriptLive && (
  <motion.div className="ml-auto">
    {userTranscriptLive.includes('Listening') || userTranscriptLive.includes('Processing') ? (
      // Show loader with pulsing dots
      <div className="bg-emerald-500/20">
        {userTranscriptLive}
        <div className="animate-pulse dots">● ● ●</div>
      </div>
    ) : (
      // Show actual transcript
      <DialogueMessage
        germanText={userTranscriptLive}
        englishText="You are saying..."
        isFromUser={true}
      />
    )}
  </motion.div>
)}
```

### languageConfig.ts

**Added Voice Mapping:**
```typescript
const VOICE_IDS: Record<string, string> = {
  'de': '21m00Tcm4TlvDq8ikWAM', // Rachel
  'hi': 'pNInz6obpgDQGcFmaJgB', // Adam
  'es': 'EXAVITQu4vr4xnSDxMaL', // Bella
  // ... more languages
};

export const getVoiceIdForLanguage = (): string => {
  // Check for env override
  const overrideVoiceId = import.meta.env.VITE_VOICE_ID;
  if (overrideVoiceId) return overrideVoiceId;
  
  // Use language-specific voice
  const config = getLanguageConfig();
  return VOICE_IDS[config.targetLanguageCode] || '21m00Tcm4TlvDq8ikWAM';
};
```

## Benefits

✅ **Real-Time Feedback** - See transcripts as they're generated
✅ **Clear Status Indicators** - Know when listening vs processing
✅ **Language-Appropriate Voices** - Better pronunciation and natural sound
✅ **Reduced Confusion** - Visual alignment with audio
✅ **Better UX** - Smooth loading states instead of sudden appearances
✅ **Customizable** - Override voice if needed

## Testing

### Test Voice Transcript Sync:
1. Start conversation
2. Speak into microphone
3. **Expect:**
   - "🎤 Listening..." appears immediately
   - Your words appear as you speak
   - "⏳ Processing..." when you stop
   - Final message appears with translation toggle

### Test Language-Specific Voice:
1. Set Hindi: `VITE_LANGUAGE_TO_LEARN_CODE="hi"`
2. Restart server
3. Start conversation
4. **Expect:** Voice sounds more natural for Hindi (Adam voice)

### Test Voice Override:
1. Set `VITE_VOICE_ID="your-preferred-voice-id"`
2. Restart server
3. Start conversation
4. **Expect:** Uses your specified voice regardless of language

## No More Confusion!

- ✅ What you speak → Shows immediately
- ✅ Processing state → Clear loader
- ✅ Voice matches language → Better pronunciation
- ✅ Transcripts sync with audio → Less confusion
- ✅ Visual feedback throughout → Confidence in system working
