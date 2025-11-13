# Image Loading Fix for Vercel Deployment

## 🐛 Problem

Images are not loading after deploying to Vercel because they use **incorrect absolute paths** instead of proper Vite imports.

## 🔍 Root Cause

### ❌ Current (Broken) Approach:
```typescript
// In scenarios.ts
image: "/src/assets/hospital-entrance.jpg"
background: "/src/assets/hospital-reception.jpg"
```

**Why it fails:**
- `/src/assets/` paths don't exist in production build
- Vite doesn't process these as assets during build
- Images aren't copied to the `dist` folder
- Works locally because of Vite dev server, breaks in production

### ✅ Correct Approach:
```typescript
// Import at top of file
import hospitalEntrance from "@/assets/hospital-entrance.jpg";

// Use imported variable
image: hospitalEntrance
```

**Why it works:**
- Vite processes imports during build
- Images are optimized and copied to `dist`
- Paths are rewritten to correct production URLs
- Works in both development and production

## 📁 Affected Files

1. **src/data/scenarios.ts** - All image paths (16 references)
2. **src/components/ScenarioBuilder.tsx** - Custom scenario image (2 references)
3. **src/components/ScenePlayer_Original.tsx** - Background image (1 reference)

## 🎯 Files Already Correct

✅ **src/components/Welcome.tsx** - Uses proper imports

## 🔧 Solution

### Step 1: Import All Images at Top of File

```typescript
// At the top of scenarios.ts
import hospitalEntrance from "@/assets/hospital-entrance.jpg";
import hospitalReception from "@/assets/hospital-reception.jpg";
import orderingRestaurant from "@/assets/Ordering at a restaurant.png";
import shiftHandover from "@/assets/Shift handover.png";
import preparingProcedure from "@/assets/Preparing for a procedure or surgery.png";
import requestSupplies from "@/assets/Request Supplies:Equipment.png";
```

### Step 2: Replace String Paths with Variables

```typescript
// Before:
image: "/src/assets/hospital-entrance.jpg"

// After:
image: hospitalEntrance
```

## ⚠️ Special Cases

### Images with Spaces and Special Characters

Some image files have problematic names:
- `Ordering at a restaurant.png` - Contains spaces
- `Request Supplies:Equipment.png` - Contains colon (`:`)
- `Preparing for a procedure or surgery.png` - Contains spaces

**These work fine when imported**, but it's better to rename them for consistency.

### Recommended Renames:
```bash
"Ordering at a restaurant.png" → "ordering-restaurant.png"
"Request Supplies:Equipment.png" → "request-supplies-equipment.png"
"Preparing for a procedure or surgery.png" → "preparing-procedure.png"
"Shift handover.png" → "shift-handover.png"
```

## 📋 Implementation Checklist

- [ ] Add image imports to scenarios.ts
- [ ] Replace all string paths with imported variables
- [ ] Add image imports to ScenarioBuilder.tsx
- [ ] Fix ScenePlayer_Original.tsx if used
- [ ] (Optional) Rename image files for consistency
- [ ] Test locally with `npm run build && npm run preview`
- [ ] Deploy to Vercel
- [ ] Verify images load in production

## 🚀 Quick Fix Commands

### Option 1: Keep Current Filenames
```typescript
// Just import and use as-is
import orderingRestaurant from "@/assets/Ordering at a restaurant.png";
```

### Option 2: Rename Files (Recommended)
```bash
cd src/assets
mv "Ordering at a restaurant.png" "ordering-restaurant.png"
mv "Request Supplies:Equipment.png" "request-supplies-equipment.png"
mv "Preparing for a procedure or surgery.png" "preparing-procedure.png"
mv "Shift handover.png" "shift-handover.png"
```

## 🧪 Testing Production Build Locally

Before deploying:
```bash
npm run build
npm run preview
```

Then open http://localhost:4173 and check if images load.

## 📝 Example Fix

### Before (Broken):
```typescript
{
  id: "1",
  title: "Hospital Reception",
  image: "/src/assets/hospital-entrance.jpg",  // ❌ Won't work in production
  scenes: [
    {
      background: "/src/assets/hospital-reception.jpg"  // ❌ Won't work
    }
  ]
}
```

### After (Fixed):
```typescript
import hospitalEntrance from "@/assets/hospital-entrance.jpg";
import hospitalReception from "@/assets/hospital-reception.jpg";

{
  id: "1",
  title: "Hospital Reception",
  image: hospitalEntrance,  // ✅ Works everywhere
  scenes: [
    {
      background: hospitalReception  // ✅ Works everywhere
    }
  ]
}
```

## 🎯 Why This Matters

**Development vs Production:**
- **Dev server**: Vite serves `/src/assets/` directly (works by accident)
- **Production**: Only files in `/dist` exist (absolute paths break)

**Vite Asset Handling:**
- Imported assets → Processed, optimized, copied to dist
- String paths → Ignored, treated as external URLs

## 🔗 Related Issues

This is a common issue with Vite/React deployments:
- Absolute paths work locally but fail in production
- Relative paths from components work but are fragile
- Import statements are the recommended solution

## ✅ Benefits of Using Imports

1. **Type Safety** - TypeScript checks if file exists
2. **Build Optimization** - Vite optimizes images
3. **Cache Busting** - Automatic hash in filename
4. **Works Everywhere** - Dev, preview, production
5. **No Broken Links** - Compile-time errors if image missing

---

**Status**: Ready to implement
**Priority**: High (blocks production image loading)
**Estimated Time**: 15 minutes
