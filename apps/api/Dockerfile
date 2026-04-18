FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all package.json files
COPY apps/api/package.json ./apps/api/
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
COPY packages/logger/package.json ./packages/logger/
COPY packages/queue/package.json ./packages/queue/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Copy packages source BEFORE install so prisma schema exists for postinstall
COPY packages/ ./packages/

# Install (prisma generate will now find the schema)
RUN pnpm install --frozen-lockfile

# Copy api source
COPY apps/api/ ./apps/api/

# Build packages then api
RUN pnpm --filter db build
RUN pnpm --filter "@but/config" build
RUN pnpm --filter logger build
RUN pnpm --filter queue build
RUN pnpm --filter api build

WORKDIR /app/apps/api

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/index.js"]
