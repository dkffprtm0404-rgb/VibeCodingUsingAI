# 🛍️ MyShop — 패션 쇼핑몰 포트폴리오

> Next.js 16 기반 풀스택 쇼핑몰 프로젝트입니다.
> 실무 수준의 구조와 기술 스택을 적용해 포트폴리오용으로 개발했습니다.

---

## 🚀 기술 스택 & 선택 이유

| 분야 | 기술 | 선택 이유 |
|------|------|----------|
| 프레임워크 | Next.js 16 (App Router) | SSR/SEO 지원, 서버 컴포넌트로 성능 최적화 |
| 언어 | TypeScript | 타입 안정성, 런타임 에러 사전 방지 |
| 스타일링 | Tailwind CSS v4 | 유틸리티 클래스로 빠른 UI 개발, 번들 크기 최소화 |
| 데이터베이스 | Supabase (PostgreSQL) | 무료 클라우드 DB, Row Level Security로 보안 처리 |
| 인증 | Supabase Auth | 이메일 인증, Admin API로 즉시 가입 처리 |
| 상태관리 | Zustand | Redux 대비 보일러플레이트 없음, persist로 장바구니 영속성 |
| AI 챗봇 | Anthropic Claude API | 상품 데이터 기반 쇼핑 도우미, 상품 카드 추천 |
| 배포 | Docker (멀티스테이지 빌드) | 환경 일관성, 이미지 크기 최소화 |

---

## ✨ 주요 기능

### 쇼핑
- 상품 목록 — 카테고리 필터 + 키워드 검색 (URL 기반)
- 상품 상세 — 이미지 갤러리, 사이즈 선택 & 실측 정보, 상세탭(설명/사이즈가이드/배송안내)
- 장바구니 — Zustand persist, 무료배송 프로그레스 바
- 찜하기 — Supabase DB 연동 위시리스트

### 주문
- 주문/결제 — 배송지 입력, 배송 메모 선택
- 주문 완료 — 주문 상세 확인
- 주문 내역 — 전체 주문 히스토리 조회

### 인증
- 회원가입 / 로그인 — Supabase Auth
- 인증 보호 라우트 — proxy.ts (미들웨어)

### AI
- 쇼핑 도우미 챗봇 — Claude API + 상품 카드 형태 추천

### 기술적 완성도
- Server/Client Component 분리 (SEO + 성능)
- Hydration 오류 처리 (isMounted 패턴)
- Error Boundary (`error.tsx`)
- Loading Skeleton UI (`loading.tsx`)
- 반응형 + 모바일 햄버거 메뉴
- Docker 멀티스테이지 빌드 (80:3000 포트)

---

## 🏗️ 프로젝트 구조

```
src/
├── app/                 # Next.js App Router 페이지
│   ├── api/            # API Routes (auth, orders, wishlist, chat)
│   ├── products/       # 상품 목록/상세 + error/loading
│   ├── cart/           # 장바구니
│   ├── checkout/       # 주문/결제
│   ├── orders/         # 주문 내역 + error/loading
│   ├── mypage/         # 마이페이지 (찜목록)
│   ├── login/          # 로그인
│   ├── signup/         # 회원가입
│   ├── error.tsx       # 전역 에러 바운더리
│   └── loading.tsx     # 전역 로딩 UI
├── components/
│   ├── ui/             # 공통 UI (Button, Badge)
│   └── features/       # 기능별 컴포넌트
│       ├── auth/       # 로그인/회원가입 폼
│       ├── cart/       # 장바구니 뷰
│       ├── chat/       # AI 챗봇
│       ├── layout/     # 헤더, 모바일 메뉴
│       ├── order/      # 주문 폼
│       └── product/    # 상품 카드, 갤러리, 필터 등
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

RLS(Row Level Security) 적용 — 본인 데이터만 조회/수정 가능

---

## 🛠️ 로컬 실행

```bash
# 1. 패키지 설치
npm install

# 2. 환경변수 설정
cp .env.example .env.local
# .env.local에 실제 값 입력

# 3. 개발 서버 실행
npm run dev
# http://localhost:3000
```

---

## 🐳 Docker 실행

```bash
# .env 파일 생성 (docker-compose가 읽는 파일)
copy .env.local .env   # Windows
cp .env.local .env     # Mac/Linux

# 빌드 + 실행 (처음 실행 시 5~10분 소요)
docker-compose up --build

# 백그라운드 실행
docker-compose up -d

# 접속
# http://localhost (포트 80)
```

---

## 🌐 환경변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon 키 | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role 키 | ✅ |
| `ANTHROPIC_API_KEY` | Claude API 키 (챗봇) | ✅ |

---

## 📌 개선 예정

- [ ] 실제 결제 연동 (토스페이먼츠)
- [ ] 이미지 업로드 (Supabase Storage)
- [ ] 단위 테스트 (Jest)
- [ ] GitHub Actions CI/CD

---

## 👤 개발

정성윤 | 2026
