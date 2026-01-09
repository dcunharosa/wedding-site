# Wedding Site Deployment Guide

This guide covers deploying the complete wedding site stack:
- **API** (NestJS) → Railway
- **Public Web** (Next.js) → Vercel
- **Admin Web** (Next.js) → Vercel
- **Database** (PostgreSQL) → Railway

---

## Part 1: Deploy API + Database on Railway

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Find and select `dcunharosa/wedding-site`
4. Click "Deploy Now"

### Step 3: Add PostgreSQL Database
1. In your project, click "New" → "Database" → "Add PostgreSQL"
2. Wait for it to provision (takes ~30 seconds)
3. Click on the PostgreSQL service
4. Go to "Variables" tab
5. Copy the `DATABASE_URL` value (you'll need this)

### Step 4: Add Redis (for rate limiting)
1. Click "New" → "Database" → "Add Redis"
2. Wait for it to provision
3. Click on Redis service → "Variables"
4. Copy the `REDIS_URL` value

### Step 5: Configure API Service
1. Click on your main service (the GitHub deploy)
2. Go to "Settings" tab
3. Set **Root Directory**: `apps/api`
4. Set **Build Command**:
```
cd ../.. && pnpm install && pnpm --filter @wedding/database generate && pnpm --filter @wedding/api build
```
5. Set **Start Command**:
```
node dist/main.js
```

### Step 6: Set Environment Variables
1. Go to "Variables" tab
2. Click "Raw Editor" and paste:

```env
NODE_ENV=production
API_PORT=3001

# These are auto-filled if you link the databases:
DATABASE_URL=<paste from PostgreSQL service>
REDIS_URL=<paste from Redis service>

# IMPORTANT: Generate a secure secret!
# Run this in terminal: openssl rand -base64 32
JWT_SECRET=<your-generated-secret-here>
JWT_EXPIRES_IN=7d

# RSVP Settings
RSVP_DEADLINE_AT=2026-06-01T23:59:59Z
SONG_REQUEST_ENABLED=true

# Email (use console for testing, configure real provider later)
EMAIL_PROVIDER=console
EMAIL_FROM=noreply@yourwedding.com
EMAIL_FROM_NAME=Your Wedding
COUPLE_NOTIFY_EMAILS=you@example.com

# Storage
STORAGE_PROVIDER=local
STORAGE_LOCAL_PATH=./uploads
STORAGE_BASE_URL=https://your-api-url.railway.app/uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_RSVP_MAX=10
```

3. Click "Update Variables"

### Step 7: Deploy and Get API URL
1. Railway will auto-deploy after you save variables
2. Once deployed, go to "Settings" → "Networking"
3. Click "Generate Domain"
4. Copy your API URL (e.g., `https://wedding-site-api-production.up.railway.app`)

### Step 8: Run Database Migrations
1. Go to your API service
2. Click "Settings" → scroll to "Deploy"
3. In "Cron Jobs" or via Railway CLI, run:
```bash
pnpm --filter @wedding/database migrate:deploy
pnpm --filter @wedding/database db:seed
```

Or connect via Railway CLI:
```bash
npm install -g @railway/cli
railway login
railway link
railway run pnpm --filter @wedding/database migrate:deploy
railway run pnpm --filter @wedding/database db:seed
```

---

## Part 2: Deploy Public Website on Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Find `dcunharosa/wedding-site` and click "Import"

### Step 3: Configure Project Settings
1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: Click "Edit" → type `apps/public-web` → click "Continue"
3. **Build and Output Settings**: Leave as default

### Step 4: Set Environment Variables
Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-api-url.railway.app/api` |

Replace `your-api-url.railway.app` with your actual Railway API URL from Part 1.

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Copy your public site URL (e.g., `https://wedding-site-public.vercel.app`)

### Step 6: Set Custom Domain (Optional)
1. Go to project "Settings" → "Domains"
2. Add your domain (e.g., `ourwedding.com`)
3. Follow DNS instructions provided by Vercel

---

## Part 3: Deploy Admin Dashboard on Vercel

### Step 1: Create Second Vercel Project
1. Go to Vercel dashboard
2. Click "Add New..." → "Project"
3. Select the same repo `dcunharosa/wedding-site` again

### Step 2: Configure Project Settings
1. **Project Name**: Change to `wedding-site-admin` (to differentiate)
2. **Root Directory**: Click "Edit" → type `apps/admin-web` → click "Continue"

### Step 3: Set Environment Variables
Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-api-url.railway.app/api` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-public-site.vercel.app` |

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your admin dashboard URL will be something like `https://wedding-site-admin.vercel.app`

### Step 5: Set Custom Domain (Optional)
1. Go to "Settings" → "Domains"
2. Add subdomain (e.g., `admin.ourwedding.com`)

---

## Part 4: Final Configuration

### Update Railway API with Frontend URLs
Go back to Railway → API service → Variables and add/update:

```env
# Add CORS allowed origins
CORS_ORIGINS=https://your-public-site.vercel.app,https://your-admin-site.vercel.app
```

### Test Everything
1. **Public Site**: Visit your public URL, navigate all pages
2. **Admin Login**: Go to admin URL, login with:
   - Email: `admin@wedding.com`
   - Password: `admin123`
3. **API Health**: Visit `https://your-api.railway.app/api/health`

---

## Quick Reference

### Your URLs (fill in after deployment)
- **API**: `https://________________________.railway.app`
- **Public Site**: `https://________________________.vercel.app`
- **Admin Dashboard**: `https://________________________.vercel.app`

### Default Login Credentials
| Email | Password | Role |
|-------|----------|------|
| `admin@wedding.com` | `admin123` | Admin |
| `couple@wedding.com` | `couple123` | Couple |

**IMPORTANT**: Change these passwords after first login!

---

## Troubleshooting

### Build fails on Vercel
- Check that Root Directory is set correctly
- Verify `NEXT_PUBLIC_API_URL` doesn't have trailing slash

### API returns 500 errors
- Check Railway logs for errors
- Verify `DATABASE_URL` is correct
- Ensure migrations have been run

### CORS errors in browser
- Add your frontend URLs to `CORS_ORIGINS` in Railway
- Redeploy the API service

### Can't login to admin
- Run the seed script: `railway run pnpm --filter @wedding/database db:seed`
- Check API logs for authentication errors
