#!/bin/sh
set -e

echo "🗄️ Running database migrations..."
cd "$(dirname "$0")/.."
REPO_ROOT="$(pwd)"

# Run migrations using the database package
node_modules/.bin/prisma migrate deploy --schema="$REPO_ROOT/packages/database/prisma/schema.prisma"

echo "✅ Migrations complete. Starting API server..."
node "$REPO_ROOT/apps/api/dist/main.js"
