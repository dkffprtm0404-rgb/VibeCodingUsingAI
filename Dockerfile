# ================================
# Dockerfile — MyShop Next.js App
# ================================
# 멀티 스테이지 빌드 사용:
# 1. deps    → 패키지 설치
# 2. builder → 앱 빌드
# 3. runner  → 실행 (최소 이미지)
#
# 멀티 스테이지 빌드를 쓰는 이유:
# 빌드 도구(node_modules 전체)는 실행에 불필요
# → 최종 이미지에서 제외해서 크기를 최소화

# ================================
# Stage 1: 패키지 설치
# ================================
FROM node:20-alpine AS deps

# alpine: 경량 Linux (ubuntu 대비 이미지 크기 1/10)
# libc6-compat: alpine에서 Node.js 바이너리 호환성 패키지
RUN apk add --no-cache libc6-compat

WORKDIR /app

# package.json, lock 파일만 먼저 복사
# → 소스코드 변경 시 패키지 재설치 방지 (Docker 레이어 캐싱 활용)
COPY package.json package-lock.json ./

RUN npm ci --only=production

# ================================
# Stage 2: 앱 빌드
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# 전체 패키지 설치 (devDependencies 포함, 빌드에 필요)
COPY package.json package-lock.json ./
RUN npm ci

# 소스코드 복사
COPY . .

# 빌드 시 환경변수 주입 (ARG: 빌드 타임에만 사용)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_APP_NAME

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

# 프로덕션 빌드 실행
RUN npm run build

# ================================
# Stage 3: 실행 이미지 (최소화)
# ================================
FROM node:20-alpine AS runner

WORKDIR /app

# 보안: root 대신 전용 유저로 실행
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# standalone 빌드 결과물만 복사
# (next.config.ts의 output: 'standalone' 설정 필요)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# nextjs 유저로 전환 (보안)
USER nextjs

# 포트 노출
EXPOSE 3000

# 환경변수: 런타임에 주입
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

# 앱 실행
CMD ["node", "server.js"]
