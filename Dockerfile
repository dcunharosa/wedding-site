FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Install openssl for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN cd packages/database && pnpm prisma generate

# Build the API
RUN pnpm --filter @wedding/shared build
RUN pnpm --filter @wedding/api build

# Expose port
EXPOSE 3001

# Start the API
CMD ["node", "apps/api/dist/main.js"]
