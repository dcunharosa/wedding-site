# Wedding Website - Full-Stack Platform

A production-ready wedding website platform with a public-facing site for guests and a private admin backend for the couple to manage their wedding.

## 🌟 Features

### Public Website
- **Modern Editorial Design**: Premium typography, generous whitespace, high-quality photography
- **RSVP System**: Secure tokenized RSVP links per household
- **Guest Management**: One RSVP per household, support for plus-ones with dependency rules
- **Dietary Tracking**: Track food allergies and dietary restrictions
- **Song Requests**: Optional feature for guests to request songs
- **Content Pages**: Schedule, Venue, Gifts, FAQ

### Admin Backend
- **Dashboard**: Real-time statistics on RSVPs, attendance, dietary needs
- **Household Management**: Create, edit, manage guest households
- **RSVP Tracking**: View current state and full history of submissions
- **Email Invites**: Bulk send with templating
- **WhatsApp Export**: Generate CSV for manual WhatsApp sending
- **Media Library**: Upload and manage photos with focal point selection
- **Content Management**: Edit all public page content
- **Gift Tracking**: Record cash gifts per household
- **CSV Exports**: Download all data types
- **Audit Log**: Complete activity tracking

## 🏗️ Architecture

### Tech Stack
- **Monorepo**: pnpm workspaces
- **Backend**: NestJS (Node.js/TypeScript)
- **Frontend**: Next.js (React/TypeScript) - 2 apps (public + admin)
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queue**: Redis
- **Auth**: JWT with Argon2 password hashing
- **Validation**: Zod schemas
- **Storage**: Local/S3/Cloudflare R2 (configurable)
- **Email**: Pluggable providers (Console/SendGrid/Mailgun/Resend)

### Project Structure
```
wedding-site/
├── apps/
│   ├── api/          # NestJS REST API
│   ├── public-web/   # Public Next.js site
│   └── admin-web/    # Admin Next.js dashboard
├── packages/
│   ├── database/     # Prisma schema & migrations
│   └── shared/       # Shared types & validation
├── docs/             # Documentation
└── blueprint/        # Design specifications
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 15+ (or use Docker)

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd wedding-site
pnpm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start Docker services**:
```bash
docker compose up -d
```

4. **Run database migrations**:
```bash
pnpm db:migrate
```

5. **Seed database with sample data**:
```bash
pnpm db:seed
```

6. **Start development servers**:
```bash
# Start all apps
pnpm dev

# Or individually:
cd apps/api && pnpm dev          # API on :3001
cd apps/public-web && pnpm dev   # Public on :3000
cd apps/admin-web && pnpm dev    # Admin on :3002
```

### Access Points

- **Public Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3002
- **API**: http://localhost:3001
- **API Docs (Swagger)**: http://localhost:3001/api/docs
- **Prisma Studio**: `pnpm db:studio`

### Default Credentials

After seeding, you can log in with:

**Super Admin**:
- Email: `admin@wedding.com`
- Password: `admin123`

**Couple Admin**:
- Email: `couple@wedding.com`
- Password: `couple123`

**Sample RSVP Links** (printed by seed script)

## 📋 Available Scripts

### Root Level
```bash
pnpm dev              # Start all apps in development mode
pnpm build            # Build all apps
pnpm lint             # Lint all packages
pnpm test             # Run all tests
```

### Database
```bash
pnpm db:migrate       # Run Prisma migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio
```

### Per-App
```bash
cd apps/api
pnpm dev              # Start API with hot reload
pnpm build            # Build for production
pnpm start:prod       # Run production build
pnpm test             # Run tests

cd apps/public-web
pnpm dev              # Start Next.js dev server
pnpm build            # Production build
pnpm start            # Start production server

cd apps/admin-web
pnpm dev              # Start Next.js dev server
pnpm build            # Production build
pnpm start            # Start production server
```

## 🔐 Security Features

- **RSVP Token Security**: Tokens stored as SHA-256 hashes, never in plain text
- **Admin Authentication**: JWT with Argon2 password hashing
- **Rate Limiting**: Configurable rate limits on all endpoints
- **CORS**: Strict origin policies
- **Helmet**: Security headers
- **Input Validation**: Zod schemas on all inputs
- **SQL Injection Protection**: Prisma parameterized queries

## 📊 Data Model

### Core Entities
- **AdminUser**: System administrators
- **Household**: Guest household with shared RSVP link
- **Guest**: Individual guests within households
- **RsvpSubmission**: Append-only RSVP submissions (latest wins)
- **RsvpGuestResponse**: Per-guest attendance & dietary info
- **RsvpHouseholdExtras**: Song requests per household
- **ChangeRequest**: Post-deadline change requests
- **Gift**: Cash gift tracking
- **Content**: CMS for public pages
- **MediaAsset**: Photo library with focal points
- **AuditLog**: Complete activity audit trail

### Business Rules

1. **One RSVP Per Household**: Latest submission wins
2. **RSVP Deadline**: Configurable cutoff, post-deadline = change requests only
3. **Dependency Rule**: Some guests can't attend without another (partner rule)
4. **Plus-Ones**: Always named, no TBD allowed
5. **Audit Trail**: All admin and guest actions logged

## 🎨 Design System

### Public Website
- **Typography**: Serif for headings (editorial), sans-serif for body
- **Color Palette**: Off-white (#F9F9F7), Deep Charcoal (#1A1A1A), accent
- **Layout**: Editorial style with generous whitespace
- **Components**: Hero, EditorialSection, StickyNav, ImageBlock
- **Motion**: Subtle animations, scroll-triggered fades
- **Performance**: next/image, lazy loading, optimized LCP

### Admin Dashboard
- **Components**: shadcn/ui based
- **Layout**: Dashboard with sidebar navigation
- **Forms**: React Hook Form + Zod validation
- **Tables**: Server-side pagination and filtering

## 🔧 Configuration

Key environment variables (see `.env.example`):

### Database
- `DATABASE_URL`: PostgreSQL connection string

### API
- `API_PORT`: API server port (default: 3001)
- `JWT_SECRET`: Secret for JWT signing
- `JWT_EXPIRES_IN`: Token expiration (default: 7d)

### RSVP
- `RSVP_DEADLINE_AT`: ISO 8601 datetime
- `SONG_REQUEST_ENABLED`: Enable song requests (true/false)

### Email
- `EMAIL_PROVIDER`: console | sendgrid | mailgun | resend
- `EMAIL_FROM`: Sender email address
- `COUPLE_NOTIFY_EMAILS`: Comma-separated emails for notifications

### Storage
- `STORAGE_PROVIDER`: local | s3 | r2
- `STORAGE_LOCAL_PATH`: Local upload directory
- `AWS_*`: S3/R2 configuration

## 📦 Deployment

### Production Checklist

1. **Environment Variables**:
   - Set strong `JWT_SECRET`
   - Configure production `DATABASE_URL`
   - Set up email provider credentials
   - Configure storage provider

2. **Database**:
   ```bash
   pnpm db:migrate
   # Create initial admin user manually or via seed
   ```

3. **Build Applications**:
   ```bash
   pnpm build
   ```

4. **Run Production**:
   ```bash
   # API
   cd apps/api && pnpm start:prod

   # Web apps
   cd apps/public-web && pnpm start
   cd apps/admin-web && pnpm start
   ```

### Deployment Platforms

- **API**: Deploy to any Node.js host (Fly.io, Railway, Render, AWS ECS)
- **Web Apps**: Deploy to Vercel, Netlify, or any Next.js host
- **Database**: Managed PostgreSQL (Supabase, Neon, AWS RDS)
- **Storage**: S3, Cloudflare R2, or any S3-compatible service

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run tests in watch mode
pnpm test:watch
```

### Test Strategy
- **Unit Tests**: Business logic, validation rules
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Critical user flows (RSVP submission, admin login)

## 📚 Documentation

- [Implementation Status](./IMPLEMENTATION_STATUS.md) - Current progress
- [Runbook](./docs/runbook.md) - Operations guide
- [API Specification](./docs/api-spec.md) - OpenAPI docs
- [Blueprint](./blueprint/) - Original design specifications

## 🤝 Contributing

This is a custom wedding website project. If you're building your own:

1. Fork the repository
2. Customize content in seed script
3. Update design tokens and styling
4. Configure your domain and email
5. Deploy and celebrate! 🎉

## 📄 License

Private/Personal Project

## 🎯 Roadmap

- [x] Database schema & migrations
- [x] Shared validation schemas
- [x] API infrastructure
- [ ] Auth module with JWT
- [ ] Public RSVP endpoints
- [ ] Admin CRUD endpoints
- [ ] Email system
- [ ] Media upload pipeline
- [ ] CSV exports
- [ ] Public Next.js site
- [ ] Admin dashboard
- [ ] OpenAPI specification
- [ ] Comprehensive tests
- [ ] Deployment guide

## 💡 Tips

### Development
- Use `pnpm db:studio` to inspect database visually
- Check `http://localhost:3001/api/docs` for API documentation
- Seed script creates realistic test data
- All validation schemas are in `packages/shared`

### Customization
- **Content**: Edit seed data in `packages/database/prisma/seed.ts`
- **Styling**: Design tokens will be in web apps' `tailwind.config`
- **Email Templates**: Templates in `apps/api/src/email/templates/`
- **Business Rules**: Adjust deadline, enable/disable features via env vars

## 🆘 Support

For issues or questions:
1. Check [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)
2. Review [docs/runbook.md](./docs/runbook.md)
3. Check API logs and Prisma Studio for data issues

---

**Built with ❤️ for our special day**
# wedding-site
