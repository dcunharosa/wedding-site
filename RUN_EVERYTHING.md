# 🚀 Run the Complete Wedding Website System

## What You Have Now

A **complete, working wedding website system** with:

1. ✅ **Backend API** (NestJS) - Full RSVP + admin functionality
2. ✅ **Public Website** (Next.js) - Beautiful guest-facing site with RSVP
3. ✅ **Admin Dashboard** (Next.js) - Management interface for the couple

All three work together as one integrated system!

## Quick Start (3 Terminals)

### Terminal 1: Start the API

```bash
cd apps/api
pnpm dev
```

Wait for:
```
✅ Database connected
🚀 API server running on http://localhost:3001
```

### Terminal 2: Start the Public Website

```bash
cd apps/public-web
pnpm dev
```

Wait for:
```
▲ Next.js ready on http://localhost:3000
```

### Terminal 3: Start the Admin Dashboard

```bash
cd apps/admin-web
pnpm dev
```

Wait for:
```
▲ Next.js ready on http://localhost:3002
```

## Access Everything

### 1. Public Wedding Website
**URL**: http://localhost:3000

What guests see:
- Beautiful home page with hero
- Schedule, Venue, Gifts, FAQ pages
- Complete RSVP flow (requires token from seed)

**Test RSVP**:
- Run `pnpm db:seed` if you haven't already
- Copy an RSVP token from the seed output
- Visit `http://localhost:3000/rsvp?t=YOUR_TOKEN`

### 2. Admin Dashboard
**URL**: http://localhost:3002

What the couple sees:
- Login page
- Dashboard with statistics
- Household management
- RSVP tracking
- Audit log

**Login Credentials** (from seed):
```
Email: admin@wedding.com
Password: admin123
```

Or:
```
Email: couple@wedding.com
Password: couple123
```

### 3. API Documentation
**URL**: http://localhost:3001/api/docs

Swagger documentation for all endpoints.

## Complete Workflow Example

### As Admin (Couple):

1. **Login to Dashboard**
   - Go to http://localhost:3002
   - Login with admin@wedding.com / admin123

2. **View Dashboard**
   - See household count, guest count, response rate
   - View recent households

3. **Create a New Household**
   - Click "Add Household"
   - Enter household name: "The Johnson Family"
   - Add guests:
     - First guest: Tom Johnson (mark as primary)
     - Second guest: Jane Johnson
   - Click "Create Household"
   - **SAVE THE RSVP TOKEN** that's displayed!

4. **View Households**
   - See all households in the list
   - Search by name
   - Filter by RSVP status (responded/not responded)
   - View details for any household

5. **Check Audit Log**
   - Go to "Audit Log" in sidebar
   - See all actions (household created, RSVPs submitted, etc.)

### As Guest:

1. **Receive RSVP Link**
   - In real life, this comes via email
   - For testing, use the token from creating a household
   - URL format: `http://localhost:3000/rsvp?t=TOKEN`

2. **Visit Wedding Website**
   - Go to http://localhost:3000
   - Browse pages: Home, Schedule, Venue, Gifts, FAQ

3. **Submit RSVP**
   - Click "RSVP" in navigation
   - Or visit the direct link with token
   - See household name and all guests
   - Select Yes/No for each guest
   - Add dietary restrictions
   - Optionally add song request
   - Click "Submit RSVP"
   - See success confirmation

4. **Admin Sees the Response**
   - Back in admin dashboard
   - Household now shows "Responded" status
   - View household details to see RSVP
   - Check audit log to see the submission

## Test Key Features

### 1. Dependency Rule (Partner Can't Attend Alone)

Use the Jones household from seed:
- Michael Jones (primary)
- Emma Wilson (dependent - requires Michael)

Test:
```bash
# Get Jones household token from seed output
# Visit RSVP page with that token
# Try to make Emma = Yes, Michael = No
# See UI disable Emma automatically
```

### 2. RSVP Editing (Latest Wins)

```bash
# Submit an RSVP for a household
# Visit the same RSVP link again
# See current responses pre-filled
# Change responses
# Submit again
# Admin sees updated responses
```

### 3. Deadline Handling

```bash
# Edit .env file
# Set RSVP_DEADLINE_AT to a past date
# Restart API
# Visit RSVP link
# See "change request" form instead
# Submit a change request message
# Admin sees it in audit log
```

### 4. Search and Filter

In admin dashboard:
```bash
# Go to Households page
# Search: type "Smith" - see only Smith family
# Filter by "Not Responded" - see pending households
# Filter by "Responded" - see completed RSVPs
```

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  GUESTS                                         │
│  ↓                                              │
│  Public Website (Next.js :3000)                 │
│  - Home, Schedule, Venue, Gifts, FAQ            │
│  - RSVP Flow with token                         │
│                                                 │
└──────────────────┬──────────────────────────────┘
                   │
                   │ API Calls
                   ↓
┌─────────────────────────────────────────────────┐
│                                                 │
│  API Server (NestJS :3001)                      │
│  - Authentication (JWT + Argon2)                │
│  - Public endpoints (content, RSVP)             │
│  - Admin endpoints (households, audit)          │
│  - Business logic (dependency rules, deadline)  │
│                                                 │
└──────────────────┬──────────────────────────────┘
                   │
      ┌────────────┴────────────┐
      │                         │
      ↓                         ↓
┌─────────────┐        ┌────────────────┐
│             │        │                │
│  PostgreSQL │        │  Admin Dashboard │
│  (Docker)   │        │  (Next.js :3002) │
│             │        │  - Login         │
│  - 11 tables│        │  - Statistics    │
│  - Sample   │        │  - Manage        │
│    data     │        │    households    │
│             │        │  - View RSVPs    │
└─────────────┘        │  - Audit log     │
                       │                │
                       └────────────────┘
                             ↑
                             │
                          COUPLE
```

## What Works

### Public Website ✅
- All pages render beautifully
- Content fetched from API
- RSVP flow with full validation
- Dependency rules enforced in UI
- Mobile responsive
- Smooth animations

### Admin Dashboard ✅
- Login/logout
- Dashboard with statistics
- Household list (search, filter, paginate)
- Create new households
- Get RSVP tokens
- Delete households
- View household details
- Audit log viewer

### API ✅
- All endpoints functional
- JWT authentication working
- RSVP token security (SHA-256)
- Business rules enforced
- Audit logging
- Swagger docs

### Database ✅
- Schema complete
- Migrations ready
- Seed data with examples
- All relationships working

## Common Tasks

### Create a New Admin User

```bash
# Via Prisma Studio
cd packages/database
pnpm prisma studio

# Or via SQL
docker exec -it $(docker compose ps -q db) psql -U wedding_user -d wedding_db
```

Then use API or directly insert:
```sql
INSERT INTO admin_users (id, email, name, password_hash, role)
VALUES (
  gen_random_uuid(),
  'newadmin@wedding.com',
  'New Admin',
  -- Hash "password123" with argon2
  '$argon2id$...',
  'ADMIN'
);
```

### Reset Database

```bash
cd packages/database
pnpm prisma migrate reset
pnpm prisma db seed
```

### View Database

```bash
# Prisma Studio (GUI)
cd packages/database
pnpm prisma studio

# Opens http://localhost:5555
```

### Check Logs

```bash
# API logs
cd apps/api
pnpm dev
# Watch terminal output

# Database logs
docker compose logs -f db

# All services
docker compose ps
docker compose logs
```

## Troubleshooting

### Port Conflicts

```bash
# Check what's using ports
lsof -i :3000  # Public site
lsof -i :3001  # API
lsof -i :3002  # Admin dashboard
lsof -i :5432  # PostgreSQL

# Kill process or change port in package.json
```

### API Not Connecting

```bash
# Check API is running
curl http://localhost:3001/api/public/content

# Check environment variables
cat apps/*/. env*

# Restart API
cd apps/api
pnpm dev
```

### Database Issues

```bash
# Check Docker is running
docker compose ps

# Restart database
docker compose restart db

# View database logs
docker compose logs db
```

### Clear Browser Cache

```bash
# For admin dashboard login issues
# Open browser console (F12)
# Application/Storage > Local Storage
# Delete "adminToken"
# Or use incognito mode
```

## Production Deployment

Ready to deploy? You'll need:

1. **Database**: PostgreSQL (Supabase, Neon, Railway, AWS RDS)
2. **API**: Node.js hosting (Fly.io, Railway, Render, AWS ECS)
3. **Frontends**: Vercel, Netlify, or any Next.js host

Environment variables to set:
- `DATABASE_URL`
- `JWT_SECRET` (strong secret!)
- `RSVP_DEADLINE_AT`
- Public URLs for CORS

See [docs/runbook.md](docs/runbook.md) for deployment details.

## Next Steps

The system is **fully functional**! You can:

✅ Run it locally and test everything
✅ Customize content by editing seed data
✅ Add your real guest list
✅ Change colors/fonts in tailwind configs
✅ Deploy to production

Optional enhancements still available:
- Email sending (provider abstraction ready)
- CSV exports (easy to add)
- Media upload (signed URLs ready)
- More admin features

**But the core system is DONE and WORKING!** 🎉

---

**Start all three servers and explore your wedding management system!**
