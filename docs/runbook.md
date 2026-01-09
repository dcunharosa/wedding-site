# Runbook: Development & Deployment

## Local Development

### Prerequisites
- Node.js 20+
- pnpm 8+ (install with `npm install -g pnpm` or `corepack enable`)
- Docker & Docker Compose

### Quick Start
```bash
# 1. Start database services
docker compose up -d

# 2. Install dependencies
pnpm install

# 3. Generate Prisma client
cd packages/database && pnpm prisma generate && cd ../..

# 4. Run database migrations
cd packages/database && pnpm prisma migrate dev && cd ../..

# 5. Seed the database (optional)
pnpm db:seed

# 6. Start all development servers
# Option A: Run individually in separate terminals
cd apps/api && pnpm dev          # API at http://localhost:3001
cd apps/public-web && pnpm dev   # Public site at http://localhost:3000
cd apps/admin-web && pnpm dev    # Admin at http://localhost:3002

# Option B: Use root-level command (if configured)
pnpm dev
```

### Service Ports
| Service | URL |
|---------|-----|
| Public Website | http://localhost:3000 |
| API Server | http://localhost:3001 |
| API Documentation | http://localhost:3001/api/docs |
| Admin Dashboard | http://localhost:3002 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

### Test Credentials (after seeding)
- **Super Admin**: admin@wedding.com / admin123
- **Couple Admin**: couple@wedding.com / couple123

### Common Issues & Fixes

**Port already in use:**
```bash
lsof -ti:3000 | xargs kill -9  # Kill process on port 3000
```

**Prisma client not generated:**
```bash
cd packages/database && pnpm prisma generate
```

**Database connection failed:**
- Ensure Docker is running: `docker compose ps`
- Check .env file has correct DATABASE_URL

## Deployment Strategy
- **Frontend**: Deploy `apps/public-web` and `apps/admin-web` to Vercel or Netlify.
- **Backend**: Deploy `apps/api` to AWS ECS, Railway, or Heroku.
- **Database**: Managed Postgres (e.g., Supabase, Neon, or RDS).
- **Storage**: S3-compatible (AWS S3, Cloudflare R2).

## Key Operations
- **Exporting Data**: Access `/admin/exports` in the Admin Dashboard.
- **Media Management**: Assign focal points in `/admin/media` to ensure correct cropping on mobile.
- **Audit Logs**: Monitor `/admin/audit` for critical system changes.

## Backup & Recovery
- Run daily `pg_dump` on the production database.
- Store backups in a separate S3 bucket with lifecycle policies.
