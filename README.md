# 🛍️ MyShop — 패션 쇼핑몰 포트폴리오

Next.js 기반 풀스택 쇼핑몰 프로젝트입니다.

## 🚀 기술 스택

| 분야 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS v4 |
| 데이터베이스 | Supabase (PostgreSQL) |
| 인증 | Supabase Auth |
| 상태관리 | Zustand |
| AI 챗봇 | Anthropic Claude API |
| 배포 | Docker |

## ✨ 주요 기능

- **상품 목록/검색** — 카테고리 필터 + 키워드 검색
- **상품 상세** — 이미지, 재고 상태, 연관 상품
- **장바구니** — Zustand + localStorage 영속성, 무료배송 프로그레스 바
- **찜하기** — Supabase DB 연동 위시리스트
- **회원가입/로그인** — Supabase Auth 이메일 인증
- **주문/결제** — 배송지 입력, 주문 내역 조회
- **AI 쇼핑 도우미** — Claude API 기반 상품 추천 챗봇
- **반응형 UI** — 모바일 햄버거 메뉴 포함

## 🏗️ 프로젝트 구조

```
src/
├── app/                 # Next.js App Router 페이지
│   ├── api/            # API Routes
│   ├── products/       # 상품 목록/상세
│   ├── cart/           # 장바구니
│   ├── checkout/       # 주문/결제
│   ├── orders/         # 주문 내역
│   ├── mypage/         # 마이페이지 (찜목록)
│   ├── login/          # 로그인
│   └── signup/         # 회원가입
├── components/
│   ├── ui/             # 공통 UI (Button, Badge)
│   └── features/       # 기능별 컴포넌트
├── lib/                # 유틸, Supabase 클라이언트
├── store/              # Zustand 전역 상태
└── types/              # TypeScript 타입 정의
```

## 🛠️ 로컬 실행

```bash
# 1. 패키지 설치
npm install

# 2. 환경변수 설정
cp .env.example .env.local
# .env.local 에 실제 값 입력

# 3. 개발 서버 실행
npm run dev
```

## 🐳 Docker 실행

```bash
# 빌드 + 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d
```

## 🌐 환경변수

`.env.example` 참고

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role 키 |
| `ANTHROPIC_API_KEY` | Claude API 키 |
