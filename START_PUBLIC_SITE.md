# Start the Public Wedding Website

## What You Can See Now 🎉

The **public wedding website** is fully built and ready to view! It includes:

- ✅ Stunning editorial home page with hero section
- ✅ Schedule page with timeline
- ✅ Venue page with map and travel info
- ✅ Gifts page with bank details
- ✅ FAQ page
- ✅ **Complete RSVP flow with all business logic**
  - Token-based secure access
  - Dependency rule enforcement (UI enforces partner rules)
  - Deadline handling (shows change request form after deadline)
  - Song requests
  - Dietary restrictions
  - Success/error handling

## Quick Start (3 Steps)

### 1. Make Sure API is Running

```bash
# In one terminal - Start API
cd apps/api
pnpm dev

# Should see:
# ✅ Database connected
# 🚀 API server running on http://localhost:3001
```

### 2. Start the Public Website

```bash
# In another terminal - Start public website
cd apps/public-web
pnpm dev

# Should see:
# ▲ Next.js 14.x.x
# - Local: http://localhost:3000
# ✓ Ready in Xms
```

### 3. Open Your Browser

Visit **http://localhost:3000**

You'll see the beautiful wedding website!

## Testing the Full Experience

### Navigate Through Pages

1. **Home** (http://localhost:3000) - Hero + story + quick info
2. **Schedule** - Timeline of the day
3. **Venue** - Location details with map link
4. **Gifts** - Bank transfer details
5. **FAQ** - Common questions
6. **Click "RSVP"** in navigation - This requires a token...

### Test the RSVP Flow

You need an RSVP token from the seed data. When you ran the seed script, it printed tokens like this:

```
🔗 RSVP Links:
   Smith Family: http://localhost:3000/rsvp?t=abc123def456...
   Jones Household: http://localhost:3000/rsvp?t=xyz789uvw012...
```

**Don't have the tokens?** Re-run the seed:

```bash
cd packages/database
pnpm prisma db seed
```

Copy one of the tokens and visit the RSVP URL!

### What You Can Test in RSVP

1. **Smith Family** (no dependency rules):
   - See household name
   - Toggle Yes/No for each guest
   - Add dietary restrictions when attending
   - Add song request
   - Submit successfully

2. **Jones Household** (has dependency rule - Emma requires Michael):
   - Try to make Emma attend without Michael
   - See UI automatically disable/correct (just like API does)
   - Submit and see it works correctly

3. **Brown Family** (already submitted RSVP):
   - See their current RSVP pre-filled
   - Can edit and resubmit (latest wins)

4. **After Deadline** (to test):
   - Change `RSVP_DEADLINE_AT` in `.env` to a past date
   - Restart API
   - Visit RSVP link
   - See change request form instead of RSVP form

## Features to Admire ✨

### Design System
- **Premium editorial typography** (Cormorant Garamond + Inter)
- **Sophisticated color palette** (Cream, Charcoal, Sage accents)
- **Generous whitespace** and clean layout
- **Smooth animations** on scroll and interaction
- **Fully responsive** - try resizing your browser
- **Mobile menu** that works beautifully

### RSVP Intelligence
- **Real-time validation** in the UI
- **Dependency rules enforced** client-side AND server-side
- **Clear error messages**
- **Loading states** and spinners
- **Success confirmation** with corrections shown
- **Deadline-aware** UI changes

### Performance
- **Server-side rendering** for SEO
- **Revalidation** every 60 seconds for content
- **Smooth page transitions**
- **Optimized fonts** with variable font loading

## Troubleshooting

### Port Already in Use

```bash
# Public site trying to use port 3000?
lsof -i :3000
# Kill the process or change port in package.json
```

### API Connection Error

Make sure the API is running on port 3001:

```bash
# Check API is running
curl http://localhost:3001/api/public/content

# Should return JSON with content
```

### Content Not Loading

If you see placeholder content, the API might not be connected:

1. Check `.env` has `NEXT_PUBLIC_API_URL=http://localhost:3001/api`
2. Check browser console for errors (F12)
3. Verify API is accessible: `curl http://localhost:3001/api/public/content`

### RSVP Token Invalid

- Make sure you're using the exact token from the seed output
- Tokens are 64 characters long
- Check you copied the full URL including `?t=...`

## What's Working

✅ **Visual Design**
- Editorial layout with premium typography
- Smooth animations and transitions
- Fully responsive mobile/desktop
- Sticky navigation with scroll behavior
- Beautiful color scheme

✅ **Content Management**
- All pages fetch from API
- Content is cached and revalidated
- Graceful fallbacks if API fails

✅ **RSVP System**
- Secure token-based access
- Dependency rule enforcement
- Deadline handling
- Song requests (if enabled)
- Dietary restrictions per guest
- Change requests after deadline
- Success/error states

✅ **User Experience**
- Loading states
- Error handling
- Form validation
- Mobile-friendly
- Accessible navigation

## What's Still TODO

The public site is **complete**. What remains for the full system:

- ⚪ Admin dashboard (for couple to manage)
- ⚪ Additional admin endpoints (guests, media, exports)
- ⚪ Email sending system
- ⚪ CSV exports
- ⚪ Media library

But the **guest-facing wedding website is fully functional right now!**

## Customize It

Want to make it yours?

### 1. Change the Content

Edit the seed data in [packages/database/prisma/seed.ts](packages/database/prisma/seed.ts):

```typescript
// Change names, dates, location
{
  key: 'HOME_HERO',
  json: {
    heading: 'Your Names',
    subheading: 'are getting married',
    date: 'Your Date',
    location: 'Your Venue',
  },
}
```

Then re-seed:

```bash
cd packages/database
pnpm prisma db seed
```

### 2. Change Colors

Edit [apps/public-web/tailwind.config.js](apps/public-web/tailwind.config.js):

```javascript
colors: {
  cream: '#F9F9F7',  // Background
  charcoal: '#1A1A1A', // Text
  sage: {...},  // Accent colors
}
```

### 3. Change Fonts

Edit [apps/public-web/src/app/layout.tsx](apps/public-web/src/app/layout.tsx):

```typescript
import { Your_Font } from 'next/font/google'
```

## Take It for a Spin! 🚀

1. Start API: `cd apps/api && pnpm dev`
2. Start website: `cd apps/public-web && pnpm dev`
3. Visit: http://localhost:3000
4. Get RSVP token from seed output
5. Test the full RSVP flow
6. Admire the beautiful design!

---

**The public wedding website is ready to impress your guests!** 💒✨
