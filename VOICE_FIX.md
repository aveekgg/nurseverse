# Voice ID Fix - Hindi Voice Not Changing

## Problem
Even though the language was set to Hindi in `.env` and the voice mapping was correctly configured, the app was still using the German voice (Rachel) instead of the Hindi voice (Adam).

## Root Cause
In `ScenePlayer.tsx`, the assistant configuration was being created with:
```typescript
voice: {
  provider: scenario.assistantConfig.voice.provider,
  voiceId: scenario.assistantConfig.voice.voiceId  // ❌ Using hardcoded voice from scenario
}
```

This was pulling the `voiceId` directly from the scenario data in `scenarios.ts`, which has hardcoded German voices. Even though we had `getVoiceIdForLanguage()` implemented, it wasn't being used in ScenePlayer!

## Solution
Updated `ScenePlayer.tsx` in **two places** where assistant config is created:

### 1. Initial Connection (line ~158)
```typescript
voice: {
  provider: scenario.assistantConfig.voice.provider,
  voiceId: getVoiceIdForLanguage()  // ✅ Now uses language-appropriate voice
}
```

### 2. Conversation Reset (line ~589)
```typescript
voice: {
  provider: scenario.assistantConfig.voice.provider,
  voiceId: getVoiceIdForLanguage()  // ✅ Also fixed in reset flow
}
```

## Voice Mapping (Already Correct)
From `languageConfig.ts`:
```typescript
const VOICE_IDS: Record<string, string> = {
  'hi': 'pNInz6obpgDQGcFmaJgB', // Adam - clear, works for Hindi
  'de': '21m00Tcm4TlvDq8ikWAM', // Rachel - German
  'es': 'EXAVITQu4vr4xnSDxMaL', // Bella - Spanish
  // ... more languages
};
```

## Testing
1. ✅ Server restarted on http://localhost:8081/
2. ✅ `.env` configured with Hindi:
   ```env
   VITE_LANGUAGE_TO_LEARN="Hindi"
   VITE_LANGUAGE_TO_LEARN_CODE="hi"
   ```
3. **Expected Behavior:**
   - Start any scenario
   - AI should now speak with Adam's voice (Hindi-appropriate)
   - Voice should match the language you're learning

## How Voice Selection Works Now

```
User starts scenario
    ↓
ScenePlayer creates assistantConfig
    ↓
Calls getVoiceIdForLanguage()
    ↓
Reads VITE_LANGUAGE_TO_LEARN_CODE from .env ("hi")
    ↓
Looks up "hi" in VOICE_IDS map
    ↓
Returns "pNInz6obpgDQGcFmaJgB" (Adam)
    ↓
VAPI uses Adam's voice for Hindi conversation ✅
```

## Override Voice (Optional)
If you want to test a specific voice ID:
```env
VITE_VOICE_ID="your-custom-voice-id"
```

This will override the language-specific selection.

## Files Changed
- ✅ `src/components/ScenePlayer.tsx` (2 locations fixed)
  - Added import for `getVoiceIdForLanguage`
  - Replaced hardcoded voiceId with dynamic function call

## Result
🎉 The Hindi voice (Adam) should now be used automatically when `VITE_LANGUAGE_TO_LEARN_CODE="hi"` is set!

The voice will properly match your target language configuration.
