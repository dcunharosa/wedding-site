# Quick Start Guide - Wedding Site

## Prerequisites Checklist

- [ ] Node.js 20+ installed (`node --version`)
- [ ] pnpm 8+ installed (`pnpm --version`)
- [ ] Docker Desktop running
- [ ] Git installed

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# From project root
pnpm install
```

This will install all dependencies for all packages in the monorepo.

### 2. Set Up Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env if needed (defaults should work for local development)
# The critical settings are already configured for localhost
```

### 3. Start Docker Services

```bash
# Start PostgreSQL and Redis
docker compose up -d

# Verify services are running
docker compose ps

# Should show:
# - postgres on port 5432
# - redis on port 6379
```

### 4. Set Up Database

```bash
# Generate Prisma client
cd packages/database
pnpm prisma generate

# Run migrations to create tables
pnpm prisma migrate dev

# Seed database with sample data
pnpm prisma db seed

# IMPORTANT: Note the RSVP tokens printed by the seed script!
```

Expected output from seed:
```
✅ Database seeded successfully!
📋 Summary:
   - Admin users: 2
   - Households: 4
   - Guests: 7
   - RSVP submissions: 2
   - Gifts: 2
   - Content pages: 5

🔑 Login credentials:
   Email: admin@wedding.com
   Password: admin123

   Email: couple@wedding.com
   Password: couple123

🔗 RSVP Links:
   Smith Family: http://localhost:3000/rsvp?t=<TOKEN>
   Jones Household: http://localhost:3000/rsvp?t=<TOKEN>
   ...
```

**SAVE THESE TOKENS** - you'll need them to test the RSVP flow!

### 5. Start the API Server

```bash
# From project root
cd apps/api
pnpm dev

# API will start on http://localhost:3001
# Swagger docs: http://localhost:3001/api/docs
```

Wait for:
```
✅ Database connected
🚀 API server running on http://localhost:3001
📚 API docs available at http://localhost:3001/api/docs
```

## Testing the API

### Option 1: Using Swagger UI (Recommended)

1. Open http://localhost:3001/api/docs in your browser
2. You'll see all available endpoints organized by tags:
   - **auth**: Login and authentication
   - **public**: Public endpoints (content, RSVP)
   - **admin**: Protected admin endpoints

### Option 2: Using cURL

#### Test Public Endpoints

```bash
# Get public content
curl "http://localhost:3001/api/public/content?keys=HOME_HERO,SCHEDULE"

# Get household RSVP data (use token from seed output)
curl "http://localhost:3001/api/public/rsvp/household?t=YOUR_TOKEN_HERE"
```

#### Test Auth & Admin Endpoints

```bash
# 1. Login as admin
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wedding.com","password":"admin123"}'

# Response includes access token:
# {"accessToken":"eyJhbGc...","expiresIn":"7d"}

# 2. Use token for admin endpoints
export TOKEN="YOUR_ACCESS_TOKEN_HERE"

# Get current user info
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# List households
curl "http://localhost:3001/api/admin/households?page=1&pageSize=20" \
  -H "Authorization: Bearer $TOKEN"

# Get specific household
curl http://localhost:3001/api/admin/households/HOUSEHOLD_ID \
  -H "Authorization: Bearer $TOKEN"

# Query audit logs
curl "http://localhost:3001/api/admin/audit?page=1" \
  -H "Authorization: Bearer $TOKEN"
```

### Option 3: Using Postman/Insomnia

1. Import the Swagger JSON from http://localhost:3001/api/docs-json
2. Create an environment with `baseUrl=http://localhost:3001/api`
3. Test endpoints with the GUI

## Testing RSVP Flow (Critical Business Logic)

### Test 1: Normal RSVP Submission

```bash
# Use a token from the seed output (Smith family has no submission yet)
TOKEN="<SMITH_FAMILY_TOKEN>"

# 1. Get household data
curl "http://localhost:3001/api/public/rsvp/household?t=$TOKEN"

# Response shows 2 guests with no current responses

# 2. Submit RSVP
curl -X POST "http://localhost:3001/api/public/rsvp/submit?t=$TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "responses": [
      {
        "guestId": "JOHN_SMITH_ID",
        "attending": true,
        "dietaryRestrictions": "Vegetarian"
      },
      {
        "guestId": "SARAH_SMITH_ID",
        "attending": true,
        "dietaryRestrictions": null
      }
    ],
    "songRequestText": "Your Song by Elton John",
    "songRequestSpotifyUrl": null
  }'

# Should return: {"ok":true,"submittedAt":"2025-..."}

# 3. Verify submission by getting household data again
curl "http://localhost:3001/api/public/rsvp/household?t=$TOKEN"

# Now shows current responses
```

### Test 2: Dependency Rule Enforcement

The Jones household has a dependency: Emma Wilson cannot attend without Michael Jones.

```bash
TOKEN="<JONES_HOUSEHOLD_TOKEN>"

# Try to submit with Emma attending but Michael not attending
curl -X POST "http://localhost:3001/api/public/rsvp/submit?t=$TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "responses": [
      {
        "guestId": "MICHAEL_JONES_ID",
        "attending": false
      },
      {
        "guestId": "EMMA_WILSON_ID",
        "attending": true
      }
    ]
  }'

# Response includes correction:
# {
#   "ok": true,
#   "submittedAt": "...",
#   "corrected": [{
#     "guestId": "EMMA_WILSON_ID",
#     "reason": "Dependent guest cannot attend without required guest",
#     "correctedValue": false
#   }]
# }
```

### Test 3: Change Request (Post-Deadline)

To test this, you'd need to set `RSVP_DEADLINE_AT` in `.env` to a past date, or wait until after your configured deadline.

```bash
# If deadline has passed, submit endpoint returns 403
# Instead use change-request endpoint

curl -X POST "http://localhost:3001/api/public/rsvp/change-request?t=$TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Sorry, we can no longer attend due to a family emergency."}'

# Returns: {"ok":true}
# Creates audit log and should notify couple (when email is implemented)
```

## Testing Admin Features

### Create a Household

```bash
# Login first
TOKEN="<YOUR_JWT_TOKEN>"

curl -X POST http://localhost:3001/api/admin/households \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "The Johnson Family",
    "notes": "Friends from work",
    "guests": [
      {
        "firstName": "Tom",
        "lastName": "Johnson",
        "email": "tom@example.com",
        "phone": "+447700900999",
        "isPrimary": true
      },
      {
        "firstName": "Jane",
        "lastName": "Johnson",
        "email": "jane@example.com",
        "isPrimary": false
      }
    ]
  }'

# Response includes the household and a FRESH rsvpToken
# SAVE THIS TOKEN to send in the invitation email!
```

### Search & Filter Households

```bash
TOKEN="<YOUR_JWT_TOKEN>"

# Search by name
curl "http://localhost:3001/api/admin/households?search=Smith&page=1" \
  -H "Authorization: Bearer $TOKEN"

# Filter by status
curl "http://localhost:3001/api/admin/households?status=responded" \
  -H "Authorization: Bearer $TOKEN"

curl "http://localhost:3001/api/admin/households?status=not_responded" \
  -H "Authorization: Bearer $TOKEN"
```

### View Audit Logs

```bash
TOKEN="<YOUR_JWT_TOKEN>"

# All logs
curl "http://localhost:3001/api/admin/audit?page=1" \
  -H "Authorization: Bearer $TOKEN"

# Filter by action
curl "http://localhost:3001/api/admin/audit?action=RSVP_SUBMITTED" \
  -H "Authorization: Bearer $TOKEN"

# Filter by actor type
curl "http://localhost:3001/api/admin/audit?actorType=GUEST" \
  -H "Authorization: Bearer $TOKEN"

# Search
curl "http://localhost:3001/api/admin/audit?search=Smith" \
  -H "Authorization: Bearer $TOKEN"
```

## Database Inspection

### Using Prisma Studio

```bash
cd packages/database
pnpm prisma studio

# Opens GUI at http://localhost:5555
# Browse all tables visually
```

### Using psql

```bash
# Connect to database
docker exec -it $(docker compose ps -q db) psql -U wedding_user -d wedding_db

# Run queries
wedding_db=# SELECT * FROM households;
wedding_db=# SELECT * FROM guests WHERE household_id = '...';
wedding_db=# SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;
wedding_db=# \q
```

## Common Issues & Solutions

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3001  # API
lsof -i :5432  # Postgres

# Kill the process or change port in .env
```

### Database Connection Error

```bash
# Check if Docker is running
docker compose ps

# Restart services
docker compose down
docker compose up -d

# Check logs
docker compose logs db
```

### Prisma Client Not Generated

```bash
cd packages/database
pnpm prisma generate
```

### Module Not Found Errors

```bash
# From root
pnpm install

# Make sure shared package is built
cd packages/shared
pnpm build
```

## Next Development Steps

### 1. Complete Additional Admin Endpoints

The pattern is established in `households`. Create similar modules for:
- `admin/guests` - Individual guest management
- `admin/media` - Media library & uploads
- `admin/exports` - CSV downloads
- `admin/gifts` - Gift tracking
- `admin/invites` - Email sending

### 2. Add Email Service

Create `apps/api/src/email/` with:
- Provider abstraction interface
- Console provider (dev mode - logs to console)
- SendGrid/Mailgun/Resend implementations
- Template system for invite emails

### 3. Build Frontend Applications

Start with Next.js apps:
- `apps/public-web` - Public website
- `apps/admin-web` - Admin dashboard

Use the API you've just built!

### 4. Generate OpenAPI Spec

The Swagger decorators are in place. Export the full spec:

```bash
# Start API
cd apps/api && pnpm dev

# In another terminal
curl http://localhost:3001/api/docs-json > openapi.json
```

### 5. Add Tests

Create test files following the pattern:
- `*.spec.ts` for unit tests
- `*.e2e-spec.ts` for integration tests

Focus on critical business logic:
- RSVP dependency rule enforcement
- Token security (hashing)
- Deadline enforcement
- Audit logging

## Useful Commands Reference

```bash
# Development
pnpm dev                    # Start all apps
pnpm build                  # Build all
pnpm lint                   # Lint all

# Database
pnpm db:migrate             # Run migrations
pnpm db:seed                # Seed data
pnpm db:studio              # Open Prisma Studio

# Docker
docker compose up -d        # Start services
docker compose down         # Stop services
docker compose logs -f api  # Follow API logs
docker compose ps           # List services

# Testing
pnpm test                   # Run all tests
pnpm test:watch             # Watch mode
pnpm test:cov               # With coverage
```

## Success Criteria

You've successfully set up the project when:

- [x] API starts without errors on http://localhost:3001
- [x] Swagger docs load at http://localhost:3001/api/docs
- [x] You can login and get a JWT token
- [x] You can query households with authentication
- [x] You can get public content without authentication
- [x] You can fetch RSVP household data with a token
- [x] You can submit an RSVP successfully
- [x] Dependency rules are enforced (test with Jones household)
- [x] Audit logs are created for all actions
- [x] Prisma Studio shows all seeded data

## Getting Help

1. Check [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for what's built
2. Review [README.md](./README.md) for architecture overview
3. Open Swagger docs to understand API structure
4. Use Prisma Studio to inspect database state
5. Check Docker logs: `docker compose logs -f`

---

**You're all set! Happy coding! 🎉**
