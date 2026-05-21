# ARCHITECTURE.md — 프로젝트 구조 및 아키텍처

## 기술 스택
| 역할 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 16.x |
| UI 라이브러리 | React | 19.x |
| 언어 | TypeScript | 5.x |
| 스타일링 | Tailwind CSS | 4.x |
| 배포 | Docker + Vercel | - |

## 폴더 구조
```
src/
├── app/                    # Next.js App Router 페이지
│   ├── (auth)/             # 인증 관련 라우트 그룹
│   ├── (shop)/             # 쇼핑 관련 라우트 그룹
│   │   ├── products/       # 상품 목록 (/products)
│   │   └── products/[id]/  # 상품 상세 (/products/[id])
│   ├── layout.tsx          # 루트 레이아웃
│   └── page.tsx            # 홈 페이지
├── components/
│   ├── ui/                 # 재사용 가능한 기본 UI (Button, Input 등)
│   └── features/           # 기능별 컴포넌트 (ProductCard, Cart 등)
├── lib/                    # 유틸리티, API 클라이언트
├── hooks/                  # 커스텀 훅
├── types/                  # TypeScript 타입 정의
└── constants/              # 상수값
```

## 데이터 흐름
```
Page (Server Component)
  └── fetch data (server-side)
       └── Client Component (상호작용 필요한 부분만)
            └── UI Components
```

## 렌더링 전략
- **기본**: Server Component (SEO, 성능)
- **상호작용 필요**: Client Component (`'use client'` 명시)
- **상품 목록**: SSR (항상 최신 데이터)
- **정적 페이지**: SSG (about, 이용약관 등)

## 환경변수
```
.env.local          # 로컬 개발용 (Git 제외)
.env.example        # 필요한 env 목록 (Git 포함)
```
