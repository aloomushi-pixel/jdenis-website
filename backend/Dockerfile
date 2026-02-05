# Multi-stage build for Node.js backend
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including devDependencies for build)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma client (DATABASE_URL required but not used for connection during build)
ENV DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder"
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-slim

# Install OpenSSL and wget for Prisma and healthchecks
RUN apt-get update && apt-get install -y openssl ca-certificates wget && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install ALL dependencies (not just production) to ensure npx and prisma CLI are available
# This is needed because prisma CLI commands run in the CMD
RUN npm ci --legacy-peer-deps

# Copy Prisma schema and seed files
COPY prisma ./prisma/

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose port (configurable via PORT env var, default 4000 in production)
EXPOSE 4000

# Run prisma generate, migrations, and start server
# Added debug logging to identify where process hangs
CMD echo "=== Starting J DENIS Backend ===" && \
    echo "DATABASE_URL=$DATABASE_URL" > .env && \
    echo "=== Step 1: Running prisma generate ===" && \
    npx prisma generate && \
    echo "=== Step 2: Running prisma migrate deploy ===" && \
    npx prisma migrate deploy && \
    echo "=== Step 3: Starting server ===" && \
    npm start
