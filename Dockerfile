# Multi-stage build for optimized production image

# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set dummy environment variables for build
# (External services not actually accessed during build, just need valid values)
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cyberacademy"
ENV RESEND_API_KEY="dummy_build_key"
ENV AWS_ACCESS_KEY_ID="dummy_build_access_key"
ENV AWS_SECRET_ACCESS_KEY="dummy_build_secret_key"
ENV AWS_REGION="us-east-1"
ENV AWS_S3_BUCKET_NAME="dummy-bucket"
ENV STRIPE_SECRET_KEY="sk_test_dummy_build_key"
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_dummy_build_key"
ENV NEXTAUTH_SECRET="dummy_build_nextauth_secret_32chars"
ENV NEXTAUTH_URL="http://localhost:3000"

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js application
RUN npm run build

# Stage 3: Runner (Production)
FROM node:18-alpine AS runner
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Change ownership to nextjs user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
