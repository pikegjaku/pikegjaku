FROM oven/bun:1.2-debian AS deps

WORKDIR /app

COPY package.json bun.lock ./
COPY api/package.json ./api/
COPY web/package.json ./web/
COPY packages/shared/package.json ./packages/shared/
COPY packages/envless/package.json ./packages/envless/

RUN bun install

FROM oven/bun:1.2-debian AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/api/node_modules ./api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY package.json bun.lock ./
COPY api ./api
COPY packages/shared ./packages/shared
COPY packages/envless ./packages/envless

EXPOSE 2040

WORKDIR /app/api

CMD ["bun", "--env-file=/dev/null", "../packages/envless/src/Inject.ts", "--", "bun", "index.ts"]
