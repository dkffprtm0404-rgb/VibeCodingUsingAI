# DOCKER.md — Docker 배포 가이드

## 구성 파일

```
Dockerfile            멀티스테이지 프로덕션 빌드
docker-compose.yml    로컬 Docker 실행 (80:3000)
.dockerignore         빌드 컨텍스트 제외 파일
```

## 멀티스테이지 빌드 구조

```
Stage 1: deps      패키지 설치 (node_modules)
Stage 2: builder   Next.js 프로덕션 빌드 (standalone)
Stage 3: runner    최소 실행 이미지 (nextjs 전용 유저)
```

## 로컬 실행

```bash
# .env 파일 생성 (docker-compose가 읽는 파일)
copy .env.local .env   # Windows
cp .env.local .env     # Mac/Linux

# 빌드 + 실행 (처음 실행 시 5~10분 소요)
docker-compose up --build

# 백그라운드 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down
```

## 접속

| 환경 | URL |
|------|-----|
| 개발 서버 | http://localhost:3000 |
| Docker | http://localhost (포트 80) |

## ⚠️ 중요 — NEXT_PUBLIC_* 변수

`NEXT_PUBLIC_` 으로 시작하는 변수는 **빌드 타임에 번들에 포함**된다.
`env_file` 만으로는 부족하고 `docker-compose.yml` 의 `args` 에도 반드시 포함해야 한다.

```yaml
build:
  args:
    NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}   # ← 필수
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}  # ← 필수
```

## next.config.ts 설정

Docker 배포를 위해 `output: 'standalone'` 필수:

```ts
const nextConfig: NextConfig = {
  output: 'standalone',  // ← 이게 없으면 Docker 이미지 크기 폭증
  // ...
}
```

## 이미지 캐시 문제 발생 시

```bash
docker-compose down
docker system prune -a --volumes -f
docker-compose up --build
```
