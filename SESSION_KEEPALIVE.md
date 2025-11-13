# Session Keepalive & Auto-Reconnect Implementation

## Problem
VAPI connection was dropping after periods of inactivity, showing error toasts to the user and breaking the conversation flow.

## Solution Implemented

### 1. Inactivity Timer Management
- Added `inactivityTimerRef` to track user activity
- Added `lastActivityRef` to record timestamp of last activity
- Timer resets on any user interaction (speech, messages, etc.)

### 2. Configurable Timeout
New environment variables added to `.env`:

```env
# Session Configuration
VITE_SESSION_TIMEOUT_MINUTES=5        # Configurable timeout (default: 5 minutes)
VITE_ENABLE_AUTO_RECONNECT=true       # Enable/disable auto-reconnect
```

### 3. Activity Detection
The timer resets on these events:
- ✅ Call start
- ✅ Speech start (user speaking)
- ✅ Speech end (user finished speaking)
- ✅ Message received (any transcript)
- ✅ Text message sent

### 4. Auto-Reconnect Feature
If connection drops unexpectedly (not due to inactivity):
- Stores the session configuration (`sessionConfigRef`)
- Automatically reconnects after 2 seconds
- Restores previous session context
- No user intervention needed

### 5. User-Friendly Notifications
**Before:**
```
❌ "Voice Error: Connection lost"  // Red error toast
```

**After:**
```
✅ "Session Active: Keeping your session alive (5 min timeout)"  // Green info toast
🔄 Auto-reconnecting... (silent, happens in background)
```

## How It Works

### Normal Flow:
```
1. User connects → Start inactivity timer (5 minutes)
2. User speaks → Reset timer
3. AI responds → Reset timer
4. User sends message → Reset timer
5. [Repeat - timer keeps resetting]
```

### Inactivity Flow (with auto-reconnect enabled):
```
1. User idle for 5 minutes → Timer fires
2. Check if auto-reconnect enabled
3. Show "Session Active" toast (not an error)
4. Reset timer → Session continues
5. [Cycle repeats - session never drops]
```

### Unexpected Disconnect Flow:
```
1. Connection drops (network issue, VAPI error, etc.)
2. Check time since last activity
3. If < timeout AND auto-reconnect enabled:
   → Wait 2 seconds
   → Reconnect with same config
   → Restore session
4. If > timeout OR auto-reconnect disabled:
   → Show error, require manual reconnect
```

## Configuration Options

### Long Sessions (10 minutes):
```env
VITE_SESSION_TIMEOUT_MINUTES=10
VITE_ENABLE_AUTO_RECONNECT=true
```

### Short Sessions (2 minutes):
```env
VITE_SESSION_TIMEOUT_MINUTES=2
VITE_ENABLE_AUTO_RECONNECT=true
```

### Disable Auto-Reconnect:
```env
VITE_SESSION_TIMEOUT_MINUTES=5
VITE_ENABLE_AUTO_RECONNECT=false
```
*Will show error toast and require manual reconnection*

### Very Long Sessions (30 minutes):
```env
VITE_SESSION_TIMEOUT_MINUTES=30
VITE_ENABLE_AUTO_RECONNECT=true
```
*Good for extended practice sessions*

## Code Changes

### useVapiConversation.ts

**Added Refs:**
```typescript
const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
const lastActivityRef = useRef<number>(Date.now());
const sessionConfigRef = useRef<any>(null);
```

**Added Function:**
```typescript
const resetInactivityTimer = useCallback(() => {
  lastActivityRef.current = Date.now();
  
  if (inactivityTimerRef.current) {
    clearTimeout(inactivityTimerRef.current);
  }
  
  const timeoutMinutes = parseInt(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES || '5');
  const timeoutMs = timeoutMinutes * 60 * 1000;
  
  inactivityTimerRef.current = setTimeout(() => {
    // Show friendly toast, reset timer
  }, timeoutMs);
}, [isConnected, toast]);
```

**Updated Events:**
```typescript
// All these now call resetInactivityTimer()
- call-start
- speech-start
- speech-end
- message (any transcript)
- sendTextMessage
```

**Auto-Reconnect Logic:**
```typescript
vapiRef.current.on('call-end', () => {
  // Check if unexpected disconnect
  const timeSinceLastActivity = Date.now() - lastActivityRef.current;
  const timeoutMs = timeoutMinutes * 60 * 1000;
  
  if (enableAutoReconnect && timeSinceLastActivity < timeoutMs) {
    // Auto-reconnect after 2 seconds
    setTimeout(() => connect(sessionConfigRef.current), 2000);
  }
});
```

## Benefits

✅ **No More Interruptions** - Sessions stay alive during natural pauses
✅ **Configurable Timeout** - Adjust based on use case (2-30 minutes)
✅ **Auto-Recovery** - Network blips don't break the conversation
✅ **Better UX** - No scary error messages for normal timeouts
✅ **Session Preservation** - Context maintained across reconnections
✅ **Flexible Configuration** - Enable/disable via environment variables

## Testing

### Test Inactivity Keepalive:
1. Set `VITE_SESSION_TIMEOUT_MINUTES=1` (1 minute for testing)
2. Start conversation
3. Wait 1 minute without interaction
4. Should see: "Session Active: Keeping your session alive"
5. Session continues working

### Test Auto-Reconnect:
1. Start conversation
2. Simulate network issue (disconnect WiFi briefly)
3. Should see connection restore automatically
4. Session context preserved

### Test Disable Auto-Reconnect:
1. Set `VITE_ENABLE_AUTO_RECONNECT=false`
2. Simulate disconnect
3. Should show error, require manual reconnect button

## Default Configuration

```env
VITE_SESSION_TIMEOUT_MINUTES=5      # 5 minutes default
VITE_ENABLE_AUTO_RECONNECT=true     # Enabled by default
```

Perfect for language learning sessions with natural pauses for thinking and formulating responses!
