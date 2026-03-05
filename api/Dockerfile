# ── Stage 1: builder ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies (including devDependencies for the build)
COPY package*.json ./
RUN npm ci

# Copy source and Prisma schema
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# Generate Prisma client and compile TypeScript
RUN npx prisma generate
RUN npm run build

# ── Stage 2: runner ───────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output and Prisma artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

# Expose the port the app listens on (Render injects $PORT at runtime)
EXPOSE 3333

# Run migrations then start the server
# Migrations run here so Render's pre-deploy command isn't strictly required,
# but you can also move "prisma migrate deploy" to a Render pre-deploy command.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
