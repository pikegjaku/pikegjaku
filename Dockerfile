FROM oven/bun:1.2-debian AS deps

WORKDIR /app

COPY package.json bun.lock ./
COPY api/package.json ./api/
COPY www/package.json ./www/
COPY packages/shared/package.json ./packages/shared/

RUN bun install

FROM oven/bun:1.2-debian AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/api/node_modules ./api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY package.json bun.lock ./
COPY api ./api
COPY packages/shared ./packages/shared

RUN cd api && bun build index.ts --outdir dist --target bun --packages external

FROM oven/bun:1.2-debian AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/api/node_modules ./api/node_modules
COPY --from=builder /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/api/dist ./api/dist
COPY --from=builder /app/api/package.json ./api/

EXPOSE 2040

WORKDIR /app/api

CMD ["bun", "dist/index.js"]
