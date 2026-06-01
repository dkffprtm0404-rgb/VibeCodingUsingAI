# ARCHITECTURE.md — 프로젝트 구조 및 아키텍처

## 기술 스택

| 역할 | 기술 | 버전 | 선택 이유 |
|------|------|------|----------|
| 프레임워크 | Next.js (App Router) | 16.x | SSR/SEO, 서버 컴포넌트 성능 최적화 |
| 언어 | TypeScript | 5.x | 타입 안정성, 런타임 에러 방지 |
| 스타일링 | Tailwind CSS | 4.x | 유틸리티 클래스, 번들 최소화 |
| DB/인증 | Supabase | 2.x | 무료 PostgreSQL, RLS 보안, Auth 내장 |
| 상태관리 | Zustand | 5.x | 보일러플레이트 없음, persist 영속성 |
| AI | Anthropic Claude API | Haiku | 챗봇 + 스타일 진단 |
| 배포 | Docker | - | 환경 일관성, 멀티스테이지 이미지 최소화 |

## 폴더 구조

```
app/                        # Next.js App Router
├── api/                    # API Routes (서버 전용)
│   ├── auth/               # 로그인, 회원가입, 로그아웃
│   ├── orders/             # 주문 생성/조회
│   ├── wishlist/           # 찜하기
│   ├── chat/               # AI 챗봇
│   └── style-quiz/         # AI 스타일 진단
├── (페이지)/
│   ├── products/[id]/      # 상품 상세 (동적 라우트)
│   ├── cart/               # 장바구니
│   ├── checkout/           # 주문/결제
│   ├── orders/[id]/        # 주문 상세
│   ├── mypage/wishlist/    # 찜 목록
│   ├── style-quiz/         # AI 스타일 진단
│   ├── portfolio/          # 포트폴리오 소개
│   ├── login/ signup/      # 인증
│   ├── error.tsx           # 전역 에러 바운더리
│   └── loading.tsx         # 전역 로딩 스켈레톤
src/
├── components/
│   ├── ui/                 # 재사용 UI (Button, Badge)
│   └── features/           # 기능별 컴포넌트
│       ├── auth/           # 로그인/회원가입 폼
│       ├── cart/           # 장바구니 뷰
│       ├── chat/           # AI 챗봇
│       ├── layout/         # 헤더, 모바일 메뉴, 로그아웃
│       ├── order/          # 주문 폼
│       ├── product/        # 상품 카드, 갤러리, 필터, 검색
│       └── style/          # AI 스타일 진단 퀴즈
├── lib/
│   ├── supabase/           # Supabase 클라이언트 (server/client 분리)
│   ├── mock-data.ts        # 상품 목 데이터 (API 교체 예정)
│   └── utils.ts            # cn, formatPrice, getStockStatus
├── store/
│   └── cartStore.ts        # Zustand 장바구니 (persist)
└── types/                  # TypeScript 타입 정의
    ├── product.ts
    ├── order.ts
    └── style.ts
```

## 렌더링 전략

```
기본값: Server Component (SSR)
  → SEO 필요, 데이터 fetch, 인증 체크

'use client' 사용:
  → useState / useEffect 필요
  → 이벤트 핸들러 필요
  → Zustand 스토어 접근

패턴: Server(data fetch) → Client(상호작용)
  예: products/page.tsx (Server) → ProductListView (Client)
      products/[id]/page.tsx (Server) → AddToCartSection (Client)
```

## 데이터 흐름

```
Server Component
  └── Supabase / mock-data fetch
       └── Client Component (props로 전달)
            └── Zustand (장바구니 등 전역 상태)
                └── API Route (주문, 찜, 챗봇)
                     └── Supabase DB
```

## 인증 흐름

```
회원가입: /api/auth/signup → Supabase Admin API (email_confirm: true)
로그인:   /api/auth/login  → supabase.auth.signInWithPassword
로그아웃: /api/auth/logout → supabase.auth.signOut
보호 라우트: proxy.ts → supabase.auth.getUser() → redirect /login
```

## 환경변수

```
.env.local          로컬 개발 (Git 제외)
.env.example        필요한 env 목록 (Git 포함, 실제 값 없음)
.env                Docker Compose용 (Git 제외)
```
