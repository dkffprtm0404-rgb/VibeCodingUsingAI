# MyShop Personalized Bento Redesign Implementation Plan

> **For agentic workers:** Use the approved PLANNER → EXECUTOR → REVIEWER workflow. Track steps below; independent executors own disjoint files and the final reviewer checks the integrated change.

**Goal:** 기존 셰이더를 활용한 반응형 벤토 홈과 실제 AI 진단 결과 개인화를 구현하고 전체 쇼핑 화면의 시각 체계를 통일한다.

**Architecture:** 기존 Next.js Server Components, Supabase 인증, API, 목 카탈로그와 Zustand 계산을 보존한다. 홈의 개인화 부분과 계정 동기화만 클라이언트 상태를 사용하며 계정별 진단을 현재 탭 세션에 보관한다. 공통 CSS 토큰/컴포넌트로 페이지 외관을 통일한다.

**Tech Stack:** 설치된 Next.js 16 / React 19 / TypeScript / Tailwind 4 / shaders / Zustand / Supabase / Node test.

**Spec:** `docs/superpowers/specs/2026-10-23-personalized-bento-redesign-design.md`

## Global Constraints

- 사용자 승인과 셰이더 활용 요청을 반영한다. 현재 지정된 작업 폴더에서 진행한다.
- 패키지·환경변수·DB 스키마·배포 설정·공개 API 계약·Git commit/push 변경 없음. 기존 컴포넌트 삭제 없음.
- 기존 상품 재고·사이즈·수량·쿠폰·배송비·인증·AI quota를 유지한다.
- 새 컴포넌트는 named export, 명확한 TypeScript 타입, 500줄 미만. 기존 공유 유틸 사용.
- 단순 스타일은 브라우저로 검증한다. 개인화 데이터 경계는 의미 있는 실패 테스트를 먼저 실행한다.

## Review Focus

- 계정 전환/로그아웃 뒤 늦은 AI 응답이 다른 계정에 저장되거나 노출되지 않는다.
- 손상된 저장소·차단된 저장소·빈 추천·품절 ID에서도 일반 쇼핑이 가능하다.
- 모바일 하단 탐색·챗봇·토스트·구매 CTA가 겹치지 않는다.
- GPU 미지원·모션 감소·다크 모드에서 메인 카드의 문구/CTA가 읽힌다.
- 기존 검색 URL·주문 검증·장바구니 계산과 SSR 재수화가 유지된다.

## Task 1: 개인화 상태와 AI 진단 연결 (EXECUTOR A)

**Files:** 새 `src/lib/personalization.ts`, `src/hooks/usePersonalization.ts`, `src/hooks/useStyleQuiz.ts`, `src/components/features/style/PersonalizationIdentity.tsx`, `tests/personalization.test.mjs`; 수정 `src/components/features/style/StyleQuiz.tsx`, `app/style-quiz/page.tsx`, `src/types/style.ts`, `src/lib/api.ts`, 필요한 기존 logout 테스트.

**Interfaces:**
- `PersonalizationIdentity({ userId }: { userId: string | null })`: 서버가 확인한 사용자와 브라우저 auth 이벤트를 동기화하는 무표시 컴포넌트.
- `usePersonalization()`: `{ profile, clearProfile }`; `profile`은 null 또는 `{ result: StyleResult, ownerId: string, createdAt: number }`로 읽을 수 있다.
- 스타일 진단 성공 결과만 현재 계정으로 저장. 요청 당시 계정과 현재 계정/세대가 다르면 응답을 버린다.
- `authApi.logout()` 성공 후 개인화 초기화. 실패하면 보존.

- [x] 실패 테스트: 잘못된 저장소, 소유자 불일치, 재진단 실패 보존, 로그아웃/계정 전환 뒤 늦은 응답, 쓰기 차단, 구독과 SSR 안정성.
- [x] RED 확인 후 최소 저장소/구독/진단 연결 구현.
- [x] 기존 스타일 진단 UI를 신규 카드/버튼 체계에 맞추고 진행률·뒤로·실패/로그인·결과 상태를 보존.
- [x] 해당 테스트 GREEN 확인, 파일 목록과 정확한 인터페이스 보고.

## Task 2: 상품·구매·사용자 화면 (EXECUTOR B)

**Files:** `app/products/**`(API 제외), `app/cart/page.tsx`, `app/checkout/page.tsx`, `app/orders/**`, `app/mypage/wishlist/page.tsx`, `app/login/page.tsx`, `app/signup/page.tsx`, `src/components/features/product/**`, `src/components/features/cart/CartView.tsx`, `src/components/features/order/**`, `src/components/features/auth/**`.

**Interfaces:** 공통 클래스 `shop-page`, `shop-surface`, `shop-kicker`, `shop-heading`, `shop-input`, `shop-muted`를 root executor가 정의. 기존 Product/Order/API/props 계약 유지.

- [x] 기존 파일/동작을 읽고 화이트 카드·세이지 포인트·차콜 제목·여백을 적용.
- [x] 상품 카드는 사진 비율·가격·품절·상세 링크를 명확히 하고 검색/필터 URL 유지.
- [x] 상세 2열→1열, 장바구니/결제 요약, 인증/주문/찜의 모바일 읽기 순서와 터치 영역 정리.
- [x] 인증·가격·주문·쿠폰 계산 변경 없이 컴포넌트 크기·타입 검사.

## Task 3: 공통 디자인·셰이더 벤토 홈·탐색 (ROOT EXECUTOR)

**Files:** `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, 새 `src/components/features/home/HomeDashboard.tsx`, `ShopFooter.tsx`, 새 `src/components/features/layout/MobileBottomNav.tsx`, `HeaderNavigation.tsx`, `ShopFooter.tsx`, `src/hooks/useShoppingChat.ts`, 새 `src/components/ui/Icon.tsx`; 수정 Header/MobileMenu/CartIcon, HeroShaderBackground/Canvas, ChatBot, Button/Badge/SectionHeader/EmptyState/ThemeToggle/Toast/ScrollToTop, 전역 loading/error/not-found.

**Interfaces:** HomeDashboard는 `{ products: Product[], userName?: string }`를 받고 `usePersonalization()`과 기존 최근 기록 훅을 사용. Header가 PersonalizationIdentity에 서버 인증 ID 전달. 링크는 기존 경로 및 실제 `cat` 파라미터 사용.

- [x] 공통 토큰·44px 터치 영역·focus·reduced-motion·safe-area·카드/페이지 유틸 정의.
- [x] 기존 셰이더 색상을 세이지·차콜로 변경하고 동적 GPU/정적 대체/모션 감소 기능 유지.
- [x] 12컬럼 메인 벤토(셰이더 셀렉션·스타일·카테고리·최근 기록)와 실제 추천 영역 구현. 일반 콘텐츠와 AI 결과를 명확히 구분.
- [x] 데스크톱 헤더와 모바일 하단 탐색, 모바일 메뉴·상담 창·토스트·상단 이동 버튼 간 간격 적용.
- [x] 오류·빈 상태·로딩·푸터를 동일한 시각 체계로 정리.

## Task 4: 통합 검증·독립 REVIEWER

- [x] `node --test tests/*.test.mjs` — 기존+새 테스트 실패 0.
- [x] `node node_modules/eslint/bin/eslint.js .` 및 `node node_modules/typescript/bin/tsc --noEmit --incremental false` — 오류 0.
- [x] `node node_modules/next/dist/bin/next build` — 성공. 네트워크/샌드박스 문제 발생 시 승인된 실행 경로로 재시도.
- [x] 브라우저 360/390/768/1024/1440px 공개 화면, 다크 모드, 메뉴 키보드/초점, 하단 탐색/상담 확인. 추천 전후·초기화는 Node 경계·렌더 테스트로 검증했으며 실제 인증·AI E2E는 미실행. 실제 계정·주문·유료 AI 호출은 하지 않는다.
- [x] `git diff --check`, 변경 파일·컴포넌트 500줄 한도·금지된 설정 변경 여부 확인.
- [x] 독립 REVIEWER에게 전체 diff와 spec/plan, 검증 근거를 전달. 실제 발견 문제 수정 후 필요한 검사 재실행.
- [x] 구현·검증 결과, 남은 외부 서비스 E2E 한계와 변경 파일을 이 문서에 기록하고 사용자에게 미리보기 제공.

## Execution notes

- 사용자 `그대로 진행` 승인을 추가 계획 승인으로 다시 묻지 않는다.
- 제품 스타일은 ROOT, 개인화는 A, 나머지 쇼핑 화면은 B로 파일 소유권을 나누어 충돌을 피한다.
- 현재 작업 폴더 적용은 사용자가 지정한 대상이다. 별도 checkout이나 브랜치/커밋을 생성하지 않는다.

## 최종 구현·검증 기록 (2026-10-23)

- 기준 HEAD: `f9aa097`. 변경은 현재 작업 폴더에 있으며 Git commit/push는 하지 않았다.
- 최종 전체 테스트: **230/230 통과**, 실패/건너뜀 0. 이전 199개에 개인화 24, 홈 추천 렌더 6, 쿠폰 취소 렌더 1을 추가했다.
- 최종 ESLint 및 TypeScript `--noEmit --incremental false`: exit 0.
- 최종 Next.js 프로덕션 빌드: exit 0, 컴파일·타입 검사·23개 페이지 생성 성공. 기존 Google Fonts 다운로드를 허용한 실행으로 검증했다.
- `git diff --check` 통과. 변경/신규 TSX 모두 500줄 미만. 패키지·환경변수·API Route·DB·배포 설정 변경 없음.
- 독립 REVIEWER **94/100 PASS**: 타입20 / 설계19 / 컨벤션18 / 오류19 / 성능·보안18. 리뷰어가 집중 테스트35개와 diff 검사를 별도로 실행했다.

### 브라우저에서 확인한 내용

- 홈, 상품 목록, 상품 상세, 스타일 진단, 로그인, 회원가입을 360/390/768/1024/1440px에서 확인했다. 문서 가로 넘침이 없었다. 비회원의 장바구니 접근은 기존 보호 규칙대로 로그인으로 이동했다.
- 기존 셰이더는 실제 canvas 1개로 메인 벤토에 로드됐다. 기존 GPU 미지원 정적 배경과 모션 감소 분기는 소스 검토로 유지 여부를 확인했다.
- 상품 목록에서 상의 선택 시 결과4개, 린넨 검색 시 카테고리와 검색어가 URL에 함께 남고 결과1개였다.
- 라이트/다크 전환과 본문 가독성을 확인했다. 최종 탭의 브라우저 오류 로그는0개였다.
- 390×320 상담: 수정 전 dialog 하단166px보다 입력 하단301px가 아래로 벗어남 → 수정 후 dialog12~308px 안에 입력247~295px가 들어왔다. Escape로 닫으면 실행 버튼 초점과 본문 스크롤이 복구됐다.
- 390×320 메뉴: 메뉴 탐색 하단과 하단 버튼 시작이 모두189px로 겹치지 않음. Escape 초점 복귀 확인.
- 모바일 홈의 접근성/읽기 순서: 메인 셀렉션 → 스타일 → 상품 추천 → 최근 기록/카테고리. 데스크톱·모바일 기록 분기 중 표시된 것만 초점 대상이 된다.

### 구현 중 확인하고 수정한 문제

- 개인화 요청 중 계정이 바뀌거나 로그아웃된 뒤 늦은 응답이 결과를 복원하지 않도록 요청 세대·인증 재확인을 적용했다.
- 다른 계정의 저장 프로필과 손상된 저장소를 초기화하고, 저장소 차단 시 메모리 상태로 쇼핑을 유지한다.
- 추천 ID 중복은 첫 순서를 유지하며 제거하고 품절/없는 상품은 제외한다. 실패한 재진단은 마지막 성공 결과를 유지한다.
- 모바일 토스트를 하단 탐색+148px 위치로 옮겨 상담·상단 이동 버튼을 덮지 않게 했다.
- 모바일 추천/최근 기록의 시각·키보드 순서를 맞추고, 좁은 메인 카드에서는 장식 사진을 숨겨 셰이더 위 문구를 읽기 쉽게 했다.
- 주문 폼 안 쿠폰 취소 버튼에 `type="button"`을 지정해 취소로 주문이 제출되는 것을 방지했다. 실패 테스트 후 수정했다.

### 검증 한계·기존 과제

- 실제 로그인부터 AI 응답·DB 주문 저장까지의 E2E는 수행하지 않았다. 서버 인증/AI 경계를 대체한 실제 핸들러·훅·저장소·렌더 테스트와 비회원 공개 브라우저 흐름을 검증했다.
- 실제 모바일 기기·가상 키보드, GPU를 강제로 차단한 환경, 운영 DB/RLS와 기기 간 동기화는 검증하지 않았다.
- 리뷰에서 기존 ProductCard의 `isLoggedIn` 전달 누락과 주문 조회 오류가 빈 목록처럼 보이는 기존 처리를 별도 과제로 기록했다. 이번에 인증·주문 정책을 재설계하지 않았다.
- 초기 빌드는 생성 디렉터리 `.next` 안에 로그를 열어 빌드 정리와 충돌했다. 로그를 산출물 폴더로 이동해 해결했고, 이후 폰트 네트워크 실패는 허용된 빌드 실행으로 재검증했다.

### 변경 파일

아래는 최종 작업 폴더의 변경·신규 파일이다. 기존 완료 기록인 `docs/WORK_PLAN.md`는 보존했다.

```text
app/cart/page.tsx
app/checkout/page.tsx
app/error.tsx
app/globals.css
app/layout.tsx
app/loading.tsx
app/login/page.tsx
app/mypage/wishlist/page.tsx
app/not-found.tsx
app/orders/[id]/page.tsx
app/orders/error.tsx
app/orders/loading.tsx
app/orders/page.tsx
app/page.tsx
app/products/[id]/loading.tsx
app/products/[id]/page.tsx
app/products/error.tsx
app/products/loading.tsx
app/products/page.tsx
app/signup/page.tsx
app/style-quiz/page.tsx
docs/superpowers/plans/2026-10-23-personalized-bento-redesign.md
docs/superpowers/specs/2026-10-23-personalized-bento-redesign-design.md
README.md
src/components/features/auth/LoginForm.tsx
src/components/features/auth/SignUpForm.tsx
src/components/features/cart/CartView.tsx
src/components/features/chat/ChatBot.tsx
src/components/features/home/HomeDashboard.tsx
src/components/features/layout/CartIcon.tsx
src/components/features/layout/Header.tsx
src/components/features/layout/HeaderNavigation.tsx
src/components/features/layout/HeroShaderCanvas.tsx
src/components/features/layout/LogoutButton.tsx
src/components/features/layout/MobileBottomNav.tsx
src/components/features/layout/MobileMenu.tsx
src/components/features/layout/ShopFooter.tsx
src/components/features/order/AvailableCoupons.tsx
src/components/features/order/CheckoutForm.tsx
src/components/features/order/CouponInput.tsx
src/components/features/product/AddToCartSection.tsx
src/components/features/product/CategoryFilter.tsx
src/components/features/product/ProductCard.tsx
src/components/features/product/ProductDetailTabs.tsx
src/components/features/product/ProductGrid.tsx
src/components/features/product/ProductImageGallery.tsx
src/components/features/product/ProductListView.tsx
src/components/features/product/QuantitySelector.tsx
src/components/features/product/RecentlyViewed.tsx
src/components/features/product/RestockAlert.tsx
src/components/features/product/SearchBar.tsx
src/components/features/product/ShareButton.tsx
src/components/features/product/WishlistButton.tsx
src/components/features/style/PersonalizationIdentity.tsx
src/components/features/style/StyleQuiz.tsx
src/components/ui/Badge.tsx
src/components/ui/Button.tsx
src/components/ui/EmptyState.tsx
src/components/ui/Icon.tsx
src/components/ui/ScrollToTop.tsx
src/components/ui/SectionHeader.tsx
src/components/ui/ThemeToggle.tsx
src/components/ui/Toast.tsx
src/hooks/usePersonalization.ts
src/hooks/useShoppingChat.ts
src/hooks/useStyleQuiz.ts
src/lib/api.ts
src/lib/personalization.ts
src/types/style.ts
tests/coupon-ui.test.mjs
tests/home-personalization.test.mjs
tests/personalization.test.mjs
```
