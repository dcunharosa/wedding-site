# Wedding Site - Implementation Status

## ✅ COMPLETED

### Phase 0: Repository & Tooling
- [x] Monorepo structure with pnpm workspaces
- [x] Docker Compose setup (PostgreSQL + Redis)
- [x] TypeScript configuration
- [x] Environment variables structure (.env.example)

### Phase 1: Database & Schema
- [x] Complete Prisma schema with all entities:
  - AdminUser (with roles)
  - Household & Guest (with dependency rules)
  - RsvpSubmission, RsvpGuestResponse, RsvpHouseholdExtras
  - ChangeRequest
  - Gift
  - Content (CMS)
  - MediaAsset (with focal point support)
  - AuditLog
- [x] Database seed script with sample data
- [x] Seed includes 4 households, 7 guests, 2 RSVPs, sample content

### Phase 2: Shared Package
- [x] Zod validation schemas for all DTOs:
  - Auth (login, create/update admin)
  - Household (create/update household & guests)
  - RSVP (submit, change request)
  - Content (CMS keys)
  - Media (upload, register, update)
  - Gift (create/update)
  - Audit (query, create log)
- [x] TypeScript types and interfaces
- [x] Constants (enums, validation rules)

### Phase 3: API Infrastructure
- [x] NestJS project setup
- [x] Prisma module & service
- [x] Config module & service
- [x] Main application with Swagger docs
- [x] Security (Helmet, CORS, rate limiting)
- [x] Global validation pipe

## 🚧 IN PROGRESS

### Phase 4: Core API Modules
- [ ] Auth Module (JWT + Argon2)
- [ ] Audit Module (logging service)
- [ ] Public Module (RSVP endpoints)
- [ ] Admin Module (household/guest management)

## 📋 TODO

### Phase 5: Business Logic
- [ ] RSVP token security (SHA-256 hashing)
- [ ] RSVP deadline enforcement
- [ ] Dependency rule enforcement (partner can't attend alone)
- [ ] Latest submission wins logic

### Phase 6: Admin Features
- [ ] Household CRUD operations
- [ ] Guest CRUD operations
- [ ] RSVP history & current state
- [ ] Email invite system
- [ ] WhatsApp export CSV

### Phase 7: Media & Content
- [ ] Media upload pipeline (signed URLs)
- [ ] Storage providers (local, S3, R2)
- [ ] Content management endpoints
- [ ] Media library with focal points

### Phase 8: Exports & Reports
- [ ] CSV exports for all entities
- [ ] Dashboard statistics
- [ ] Dietary restrictions summary
- [ ] Gift tracking

### Phase 9: Frontend Apps
- [ ] Public Next.js website
  - Home with hero
  - Schedule, Venue, Gifts, FAQ pages
  - RSVP flow with validation
  - Editorial design system
- [ ] Admin Next.js dashboard
  - Authentication
  - Household management
  - RSVP tracking
  - Content & media management
  - Exports

### Phase 10: Testing & Documentation
- [ ] Unit tests for business logic
- [ ] Integration tests for API
- [ ] OpenAPI 3.1 specification
- [ ] README with setup instructions
- [ ] Runbook with deployment guide

## 🔑 CRITICAL BUSINESS RULES IMPLEMENTED

1. **Token Security**: RSVP tokens stored as SHA-256 hashes (schema defined)
2. **Dependency Rules**: Guest.attendanceRequiresGuestId field (schema defined)
3. **Latest Submission Wins**: Household.rsvpLastSubmittedAt tracking (schema defined)
4. **Audit Trail**: Complete audit log schema with actor tracking

## 📊 DATABASE SEEDED WITH

- 2 admin users:
  - `admin@wedding.com` / `admin123` (SUPER_ADMIN)
  - `couple@wedding.com` / `couple123` (ADMIN)

- 4 households with different RSVP states:
  - Smith Family (not responded)
  - Jones Household (not responded, has dependency rule)
  - Brown Family (responded - both attending)
  - Wilson Family (responded - declined)

- 5 content pages: HOME_HERO, SCHEDULE, VENUE, GIFTS_PAGE, FAQ

## 🚀 NEXT STEPS

### Immediate Priority (API Core):

1. **Create Auth Module** (`apps/api/src/auth/`):
   - `auth.service.ts` - Argon2 hashing, JWT generation
   - `auth.controller.ts` - POST /auth/login, GET /auth/me
   - `jwt.strategy.ts` - Passport JWT strategy
   - `jwt-auth.guard.ts` - Protect admin routes

2. **Create Audit Module** (`apps/api/src/audit/`):
   - `audit.service.ts` - Log all actions
   - `audit.controller.ts` - GET /admin/audit (query logs)

3. **Create Public Module** (`apps/api/src/public/`):
   - `rsvp/` subdirectory:
     - `rsvp.service.ts` - Token validation, deadline check, dependency enforcement
     - `rsvp.controller.ts` - GET/POST /public/rsvp endpoints
   - `content/` subdirectory:
     - `content.controller.ts` - GET /public/content

4. **Create Admin Module** (`apps/api/src/admin/`):
   - `households/` - Full CRUD
   - `guests/` - Full CRUD
   - `media/` - Upload & library
   - `exports/` - CSV downloads
   - `gifts/` - Recording

### Testing Local Setup:

```bash
# 1. Install dependencies
pnpm install

# 2. Start Docker services
docker compose up -d

# 3. Run Prisma migrations
cd packages/database
pnpm prisma migrate dev

# 4. Seed database
pnpm prisma db seed

# 5. Generate Prisma client
pnpm prisma generate

# 6. Start API
cd ../../apps/api
pnpm dev

# API will run on http://localhost:3001
# Swagger docs: http://localhost:3001/api/docs
```

## 📝 NOTES

- Password hashing in seed uses SHA-256 for simplicity; production auth will use Argon2
- All schemas follow the blueprint specifications
- Rate limiting configured but needs Redis connection
- Email providers abstracted but implementations pending
- Storage providers abstracted but implementations pending

## 🔗 USEFUL COMMANDS

```bash
# Database
pnpm db:migrate      # Run migrations
pnpm db:seed         # Seed database
pnpm db:studio       # Open Prisma Studio

# Development
pnpm dev             # Start all in watch mode
pnpm build           # Build all packages
pnpm lint            # Lint all packages

# API specific
cd apps/api
pnpm dev             # Start API in watch mode
pnpm test            # Run tests
```

## 📚 ARCHITECTURE DECISIONS

1. **Monorepo**: Easier code sharing, unified dependencies
2. **NestJS**: Enterprise-grade, TypeScript-first, great for this scale
3. **Prisma**: Type-safe ORM, excellent migrations
4. **Zod**: Runtime validation + type inference
5. **JWT**: Stateless auth, simpler for 2-admin system
6. **Argon2**: Industry standard for password hashing
7. **SHA-256**: For RSVP tokens (one-way, secure enough for use case)

