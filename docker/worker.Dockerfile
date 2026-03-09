FROM node:24-alpine
RUN npm install -g pnpm
WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY apps/ ./apps/
COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile --ignore-scripts
RUN cd packages/db && npx prisma generate
RUN pnpm --filter "@but/config" build
RUN pnpm --filter "logger" build
RUN pnpm --filter "queue" build
RUN cd packages/db && npx tsc -p tsconfig.json
RUN sed -i 's|"main": "src/index.ts"|"main": "dist/index.js"|' packages/db/package.json && \
    sed -i 's|"types": "src/index.ts"|"types": "dist/index.d.ts"|' packages/db/package.json
RUN pnpm --filter worker build

ENV NODE_ENV=production
CMD ["node", "apps/worker/dist/index.js"]
