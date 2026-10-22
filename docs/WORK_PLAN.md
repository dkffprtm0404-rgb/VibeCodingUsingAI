# 쇼핑 흐름 안정화 — 2026-10-22

**목표:** 모바일 메뉴 → 주문 검증 → 린트·최근 본 상품 → 장바구니 복원 순서로 개선한다.
**설계 기준:** README의 다음 개선 우선순위와 사용자가 선택한 복원 정책을 따른다. 기존 Next.js·React·Zustand와 Node 테스트를 사용한다.
**제약:** 패키지·환경변수·DB 스키마·배포 설정 변경과 Git commit/push는 포함하지 않는다. 실제 사용자 데이터에 테스트 주문을 저장하지 않는다.

## 실행 계획

- [x] 모바일 메뉴: 네이티브 dialog로 가로 스크롤·높이·Escape·초점 복귀를 수정했다. 데스크톱 전환 시 닫기와 낮은 화면의 메뉴 독립 스크롤도 확인했다.
- [x] 주문 API: 실제 POST 핸들러의 외부 인증·DB 경계만 대체해 테스트했다. 잘못된 JSON·수량·상품·배송지는 400, 미인증은 401로 거부하고 저장 호출이 없음을 확인했다. 서버 가격·쿠폰·배송비 계산은 유지했다.
- [x] 린트·최근 본 상품: 첫 방문 누락을 재현해 저장·구독 흐름을 수정했다. 마운트 상태의 즉시 effect 변경을 없애고 검색 URL·테마 전환·최근 기록 유지 동작을 확인했다.
- [x] 장바구니 복원: 사용자가 선택한 정책대로 현재 상품 정보 갱신·수량 축소·품절/손상 항목 제외·중복 병합을 구현하고, 실제 persist 재수화 테스트로 확인했다.
- [x] 마무리: 전체 검사와 브라우저 검증, 독립 리뷰를 완료하고 README와 이 문서를 갱신했다.

## 검토 초점

- 주문의 일부 항목만 잘못돼도 전체 요청을 저장 전에 거부하는가.
- 같은 상품·사이즈를 여러 줄로 나눠 재고 검증을 우회할 수 없는가.
- 최근 본 상품의 첫 방문·재방문·저장소 접근 실패에서 페이지가 동작하는가.
- 저장소의 상품 정보·중복 항목·잘못된 수량이 장바구니 계산과 액션을 오염시키지 않는가.
- 메뉴를 닫으면 가로 스크롤과 숨은 포커스가 없고, 열면 스크롤·닫기·포커스가 정상인가.

## 검증 결과

### 자동 검사

- `node --test tests/*.test.mjs`: **83/83 통과** — 장바구니 45, 주문 API 28, 최근 본 상품 10.
- `node node_modules/eslint/bin/eslint.js .`: **오류 0, 경고 0** (수정 전 오류 6, 경고 2).
- `node node_modules/typescript/bin/tsc --noEmit --incremental false`: 통과.
- `node node_modules/next/dist/bin/next build`: 최종 메뉴 보완 후 통과. Google Fonts 다운로드를 위한 네트워크 접근이 필요했다.
- `git diff --check`: 통과.

### 브라우저 검사

- 390×844: 수정 전 문서 가로 폭 672px → 수정 후 384px(스크롤바 제외 영역), 가로 넘침 없음. 열린 메뉴 높이 844px.
- 메뉴 닫기/Escape 이후 메뉴 버튼으로 초점 복귀, 본문 스크롤 잠금 해제.
- 열린 메뉴에서 1024px 폭으로 전환: dialog와 modal 상태 해제, 본문 스크롤 복구.
- 390×320: 수정 전 메뉴 영역 끝 213px와 하단 버튼 시작 189px가 겹침 → 수정 후 메뉴 끝과 하단 시작 모두 189px, 겹침 없음.
- 상세 상품 1 → 2 방문에서 최근 본 상품이 나오지 않던 현상 재현. 수정 후 2 → 3 → 4 방문과 새로고침에서 이전 상품 표시·유지 확인.
- 검색 URL의 `린넨` → 공백을 포함한 `후드` 제출 → 정리된 `후드`와 결과 1개 → 검색 초기화 후 결과 8개 확인.
- 라이트/다크 전환 및 최종 검증 탭의 브라우저 오류 로그 0개 확인. 임시 화면 크기는 검증 후 복원했다.

### REVIEWER

독립 리뷰 **96/100, PASS** — 타입 19, 설계 20, 컨벤션 19, 오류 처리 19, 성능·보안 19. 독립 테스트 재실행 83/83 통과와 diff 검사 통과. 데이터 경계·저장소 무결성·SSR·메뉴 수명주기 관점에서 검토했고, 리사이즈·낮은 화면 문제 보완 후 신규 확정 결함은 없었다.

### 남은 범위

- 로그인 상태의 장바구니 배지와 실제 Supabase 주문 저장·RLS까지 포함한 E2E는 수행하지 않았다.
- 주문과 주문 상품의 원자적 저장, 중복 주문 방지, 주문 행의 사이즈 저장, DB 재고 차감·동시 주문 제어는 별도 DB 설계가 필요하다.
- 시스템 테마 강제 변경과 저장소 차단은 브라우저 설정으로 재현하지 않았다. 저장소 차단은 단위 테스트로, 시스템 테마 처리는 `resolvedTheme` 사용과 코드 검토로 확인했다.

### 변경 파일

```text
README.md
docs/DO_NOT.md
docs/WORK_PLAN.md
app/api/orders/route.ts
app/portfolio/page.tsx
src/components/features/cart/CartView.tsx
src/components/features/layout/CartIcon.tsx
src/components/features/layout/MobileMenu.tsx
src/components/features/product/RecentlyViewed.tsx
src/components/features/product/SearchBar.tsx
src/components/ui/ThemeToggle.tsx
src/components/ui/Toast.tsx
src/hooks/useHydrated.ts
src/hooks/useRecentlyViewed.ts
src/lib/cart-storage.ts
src/lib/order-validation.ts
src/lib/recently-viewed.ts
src/lib/utils.ts
src/store/cartStore.ts
src/types/cart.ts
src/types/order.ts
tests/cart-store.test.mjs
tests/helpers/load-typescript.mjs
tests/orders-api.test.mjs
tests/recently-viewed.test.mjs
```

설계 보완: 사이즈 미선택 기존 항목과 사이즈별 항목이 섞여 있으면 복원 직후의 수량 변경으로 전체 재고를 다시 초과할 수 있었다(테스트에서 총 50개가 54개로 증가). 복원 정책이 유지되도록 스토어와 수량 선택기가 같은 행별 상한 계산을 사용한다.
