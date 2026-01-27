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

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install production dependencies 
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps

# Copy Prisma schema and seed files
COPY prisma ./prisma/

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose port
EXPOSE 3000

# Run prisma generate, migrations, seed (optional), and start server
CMD echo "DATABASE_URL=$DATABASE_URL" > .env && \
    npx prisma generate && \
    npx prisma migrate deploy && \
    (npx prisma db seed || echo "Seed skipped or already done") && \
    npm start
