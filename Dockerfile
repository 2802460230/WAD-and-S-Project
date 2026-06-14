FROM node:22-bookworm-slim AS base
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build?sslmode=disable
RUN npx prisma generate

RUN npm run build

FROM base AS runner

LABEL org.opencontainers.image.title="mathmentor"
LABEL org.opencontainers.image.url="https://e2526-wads-b4ac-04.csbihub.id"

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3013
ENV NODE_ENV=production
ENV PORT=3013
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]