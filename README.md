# 🛍️ MyShop — AI 패션 쇼핑몰

> **정성윤** | Frontend Developer Portfolio
> Next.js 16 기반 풀스택 쇼핑몰 프로젝트

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-DB%20%26%20Auth-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com)
[![Docker](https://img.shields.io/badge/Docker-배포-2496ed?style=flat-square&logo=docker)](https://docker.com)

---

## 👨‍💻 포트폴리오 요약

| 항목 | 내용 |
|------|------|
| **프로젝트** | AI 기능 탑재 패션 쇼핑몰 (MyShop) |
| **개발 기간** | 2026.05.21 ~ 2026.05.28 |
| **총 커밋** | 28개 (기능 단위 커밋 관리) |
| **페이지 수** | 17개 페이지 & API 라우트 |
| **AI 연동** | Claude API (챗봇 + 스타일 진단) |
| **배포** | Docker 멀티스테이지 빌드 (80:3000) |
| **포트폴리오 페이지** | `/portfolio` 라우트에서 확인 가능 |

---

## ✨ 핵심 구현 기능

```
🔍 상품 탐색     카테고리 필터 + URL 기반 검색 (Server Component SSR)
🖼️ 상품 상세     이미지 갤러리, 사이즈 실측 정보, 탭 UI
🛒 장바구니      Zustand persist (새로고침 후에도 유지) + 무료배송 프로그레스 바
🔐 인증          Supabase Auth + Admin API (이메일 즉시 가입)
📦 주문/결제     배송지 입력 → DB 저장 → 주문 내역 조회 풀 플로우
❤️ 찜하기        Supabase RLS (본인 데이터만 접근)
💬 AI 챗봇       Claude API + 상품 데이터 주입 → 상품 카드 형태 추천
✨ AI 스타일진단  4문항 퀴즈 → 스타일 유형 분석 → 맞춤 코디 + 상품 추천
🐳 Docker 배포   멀티스테이지 빌드, 80:3000 포트
```

---

## 🚀 기술 스택

| 분야 | 기술 | 선택 이유 |
|------|------|----------|
| 프레임워크 | Next.js 16 (App Router) | SSR/SEO 지원, 서버 컴포넌트로 성능 최적화 |
| 언어 | TypeScript | 타입 안정성, 런타임 에러 사전 방지 |
| 스타일링 | Tailwind CSS v4 | 유틸리티 클래스로 빠른 UI 개발 |
| 데이터베이스 | Supabase (PostgreSQL) | 무료 클라우드 DB, RLS 보안 처리 |
| 인증 | Supabase Auth | Admin API로 즉시 가입 처리 |
| 상태관리 | Zustand | Redux 대비 보일러플레이트 없음, persist 영속성 |
| AI | Anthropic Claude API | 상품 데이터 기반 챗봇 + 스타일 진단 |
| 배포 | Docker (멀티스테이지) | 환경 일관성, 이미지 크기 최소화 |

---

## 📁 프로젝트 구조

```
src/
├── app/                 # Next.js App Router 페이지
│   ├── api/            # API Routes (auth, orders, wishlist, chat, style-quiz)
│   ├── products/       # 상품 목록/상세 + error/loading
│   ├── cart/           # 장바구니
│   ├── checkout/       # 주문/결제
│   ├── orders/         # 주문 내역
│   ├── mypage/         # 찜목록
│   ├── style-quiz/     # AI 스타일 진단
│   ├── portfolio/      # 포트폴리오 소개 페이지
│   ├── error.tsx       # 전역 에러 바운더리
│   └── loading.tsx     # 전역 로딩 스켈레톤 UI
├── components/
│   ├── ui/             # 공통 UI (Button, Badge)
│   └── features/       # 기능별 컴포넌트
│       ├── auth/       # 로그인/회원가입
│       ├── cart/       # 장바구니 뷰
│       ├── chat/       # AI 챗봇
│       ├── layout/     # 헤더, 모바일 메뉴
│       ├── order/      # 주문 폼
│       ├── product/    # 상품 카드, 갤러리, 필터
│       └── style/      # AI 스타일 진단 퀴즈
├── lib/
│   ├── supabase/       # Supabase 클라이언트 (server/client)
│   ├── mock-data.ts    # 상품 목 데이터
│   └── utils.ts        # cn, formatPrice 등 유틸
├── store/
│   └── cartStore.ts    # Zustand 장바구니 전역 상태
└── types/              # TypeScript 타입 정의
```

---

## 🗄️ DB 스키마

```sql
-- 주문
orders (id, user_id, status, total_price, shipping_fee, receiver_*, memo, created_at)

-- 주문 상품
order_items (id, order_id, product_id, product_name, product_price, product_image, quantity)

-- 찜하기
wishlists (id, user_id, product_id, created_at)
```

> RLS(Row Level Security) 적용 — 본인 데이터만 조회/수정 가능

---

## 🛠️ 로컬 실행

```bash
# 1. 패키지 설치
npm install

# 2. 환경변수 설정
cp .env.example .env.local
# .env.local 에 실제 값 입력

# 3. 개발 서버 실행
npm run dev
# http://localhost:3000
```

---

## 🐳 Docker 실행

```bash
# .env 파일 생성
copy .env.local .env   # Windows
cp .env.local .env     # Mac/Linux

# 빌드 + 실행
docker-compose up --build

# 접속: http://localhost (포트 80)
```

---

## 🌐 환경변수

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role 키 |
| `ANTHROPIC_API_KEY` | Claude API 키 (챗봇 + 스타일진단) |

---

## 📌 개선 예정

- [ ] 실제 결제 연동 (토스페이먼츠)
- [ ] 이미지 업로드 (Supabase Storage)
- [ ] 단위 테스트 (Jest)
- [ ] GitHub Actions CI/CD

---

<div align="center">

**정성윤** · Frontend Developer · 2026

[포트폴리오 페이지 보기](/portfolio) · [GitHub](https://github.com/dkffprtm0404-rgb/VibeCodingUsingAI)

</div>
