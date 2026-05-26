FROM oven/bun:1.2-debian AS deps

WORKDIR /app

COPY package.json bun.lock ./
COPY api/package.json ./api/
COPY www/package.json ./www/
COPY packages/shared/package.json ./packages/shared/

RUN bun install --frozen-lockfile --production

FROM oven/bun:1.2-debian AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/api/node_modules ./api/node_modules
COPY package.json bun.lock ./
COPY api ./api
COPY packages/shared ./packages/shared

EXPOSE 2040

WORKDIR /app/api

CMD ["bun", "run", "index.ts"]
