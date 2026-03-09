FROM node:24-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

# Copy workspace config
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY turbo.json ./
COPY .npmrc* ./

# Copy all package.json files for dependency resolution
COPY apps/api/package.json ./apps/api/
COPY apps/scheduler/package.json ./apps/scheduler/
COPY apps/worker/package.json ./apps/worker/
COPY apps/verifier/package.json ./apps/verifier/
COPY packages/queue/package.json ./packages/queue/
COPY packages/db/package.json ./packages/db/
COPY packages/logger/package.json ./packages/logger/
COPY packages/config/package.json ./packages/config/
COPY packages/typescript-config/ ./packages/typescript-config/
COPY packages/eslint-config/ ./packages/eslint-config/

# Install all dependencies (--ignore-scripts skips husky prepare)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source
COPY apps/api/ ./apps/api/
COPY apps/scheduler/ ./apps/scheduler/
COPY apps/worker/ ./apps/worker/
COPY apps/verifier/ ./apps/verifier/
COPY packages/ ./packages/

# Generate Prisma client (skipped by --ignore-scripts, must be explicit)
RUN cd packages/db && npx prisma generate

# Build all shared packages
RUN pnpm --filter "@but/config" build
RUN pnpm --filter "logger" build
RUN pnpm --filter "queue" build

# Build db to dist/ for production (source-based in dev, compiled in prod)
RUN cd packages/db && npx tsc -p tsconfig.json

# Point db package.json main to dist/ for pnpm deploy
RUN sed -i 's|"main": "src/index.ts"|"main": "dist/index.js"|' packages/db/package.json && \
    sed -i 's|"types": "src/index.ts"|"types": "dist/index.d.ts"|' packages/db/package.json

# Build the verifier app
RUN pnpm --filter verifier build

# Use pnpm deploy to create a self-contained production bundle with correct workspace links
RUN pnpm --filter verifier deploy --prod /deploy/verifier --legacy

FROM node:24-alpine AS production
WORKDIR /app

# Copy the self-contained deploy directory (has its own node_modules with workspace links resolved)
COPY --from=base /deploy/verifier .
COPY --from=base /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=base /app/node_modules/@prisma ./node_modules/@prisma

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
