FROM node:22-alpine AS build
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ARG APP_VERSION=0.1.0
ARG GIT_SHA=local
ARG BUILD_TIME=unknown
ENV NEXT_PUBLIC_APP_VERSION=$APP_VERSION
ENV NEXT_PUBLIC_GIT_SHA=$GIT_SHA
ENV NEXT_PUBLIC_BUILD_TIME=$BUILD_TIME

RUN echo "==> 代码检查" \
  && npm run lint \
  && echo "==> 单元测试" \
  && npm run test \
  && echo "==> 生产构建" \
  && npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ARG APP_VERSION=0.1.0
ARG GIT_SHA=local
ARG BUILD_TIME=unknown
ENV APP_VERSION=$APP_VERSION
ENV GIT_SHA=$GIT_SHA
ENV BUILD_TIME=$BUILD_TIME

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
