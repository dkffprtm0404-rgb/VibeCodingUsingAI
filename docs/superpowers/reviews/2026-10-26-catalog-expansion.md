# 스토어·모델 착용 카탈로그 구현 및 검증

사용자가 요청한 무신사 참고 분류와 모델 착용컷 중심 카탈로그를 기존 반응형 벤토·AI 개인화·셰이더 화면에 적용했다.

## 구현 결과

- 전체 탐색과 패션·뷰티·스포츠·아울렛·부티크·킥스·키즈의 7개 스토어를 추가했다.
- 고유 상품 34개, 로컬 이미지 32개를 사용한다. 동일 코디의 서로 다른 아이템 2개는 같은 착용 사진을 사용한다.
- 스토어별 상품 수: 패션 18, 뷰티 4, 스포츠 5, 아울렛 8, 부티크 4, 킥스 4, 키즈 4. 중복 소속이 있으므로 합계는 전체 상품 수와 다르다.
- 의류·키즈·스포츠 의류는 모델 착용 사진, 뷰티·킥스는 제품 사진을 사용한다. 원문 워터마크를 유지했고 상품 상세에서 출처로 이동할 수 있다.
- 홈에는 스토어 사진 카드와 스토어를 섞은 최대 8개 기본 셀렉션이 표시된다. AI 진단 결과가 있으면 추천 순서를 보존한다.
- `store` + `cat` + `q` 조합을 URL에 보관한다. 현재 스토어에 실제 존재하는 상품 종류만 표시하고 잘못된 값은 기본 탐색으로 복구한다.
- 모바일 스토어 메뉴는 가로로 스크롤되며 직접 URL 진입·화면 크기 변경 시 현재 선택 탭을 컨테이너 안에 보이게 한다.
- 뷰티 용량·구성, 신발/키즈 사이즈, 가방 FREE 옵션을 구분했다. 장바구니·주문서에는 공통 '옵션' 문구를 사용한다.
- 기존 ID 1~8의 가격·옵션명·옵션별 재고와 총 재고는 유지했다. 상품명·사진·설명은 새 착용 사진에 맞췄다.
- 스타일 진단 프롬프트와 결과 검증에서 뷰티·키즈를 함께 제외했다. 쇼핑 챗은 모든 스토어를 탐색할 수 있다.

## 변경 파일

이전 재설계의 미커밋 변경은 보존했다. 이번 카탈로그 확장 관련 변경 파일은 다음과 같다.

- 분류/데이터: `src/constants/catalog.ts`, `src/lib/catalog.ts`, `src/lib/mock-data.ts`, `src/types/product.ts`
- 홈: `src/components/features/home/HomeDashboard.tsx`, `src/components/features/home/StoreDiscovery.tsx`
- 탐색: `src/components/features/layout/Header.tsx`, `StoreNavigation.tsx`, `MobileMenu.tsx`, `ShopFooter.tsx`
- 상품: `app/products/page.tsx`, `app/products/[id]/page.tsx`, `src/components/features/product/ProductListView.tsx`, `CategoryFilter.tsx`, `SearchBar.tsx`, `ProductCard.tsx`, `AddToCartSection.tsx`, `ProductDetailTabs.tsx`
- 옵션 문구/헤더 간격: `src/components/features/cart/CartView.tsx`, `src/components/features/order/CheckoutForm.tsx`, `app/globals.css`
- 스타일 후보 경계: `src/lib/ai/shopping.ts`
- 이미지: `public/catalog/*.jpg`, `public/catalog/catalog-sources.json`, `scripts/download-catalog-images.mjs`
- 검증: `tests/catalog.test.mjs`, `catalog-data.test.mjs`, `catalog-style-context.test.mjs`, `catalog-product-ui.test.mjs`, `home-personalization.test.mjs`; 새 상품명 반영을 위한 `ai-routes.test.mjs`, `cart-store.test.mjs`, `orders-api.test.mjs`
- 문서: `README.md`, `docs/superpowers/plans/2026-10-23-catalog-expansion.md`, 이 검증 기록

## 실행한 검증

- `node --test tests/*.test.mjs`: 250개 통과, 실패 0. 분류·후보 경계·기본 셀렉션·가방 옵션/관리 문구는 실패 테스트를 확인한 뒤 구현했다.
- `node node_modules/eslint/bin/eslint.js .`: 종료 코드 0.
- `node node_modules/typescript/bin/tsc --noEmit --incremental false`: 종료 코드 0. 마지막 탐색 변경까지 포함한 프로덕션 빌드의 TypeScript 검사도 통과했다.
- `node node_modules/next/dist/bin/next build`: 마지막 모바일 선택 탭 보완 포함, 종료 코드 0.
- `git diff --check`: 종료 코드 0.
- 이미지 32개를 Sharp로 실제 파싱했다. 모두 가로·세로 500px 이상, 오류 없음, 원본 파일 합계 2,092,549바이트.
- 실제 브라우저에서 7개 스토어의 제목·상품 수·선택 표시를 확인했다. 360/390/768/1440px에서 상품 34개가 렌더링되고 문서 가로 넘침이 없었다.
- 뷰티 브랜드 검색 '에스트라'는 1개, 검색 지우기는 뷰티 4개로 복구했다.
- 스포츠+신발+푸마는 1개, 상품 종류를 스포츠웨어로 바꾸면 빈 결과, 검색을 지우면 해당 종류 3개로 복구했다.
- 잘못된 스토어/종류 URL은 전체 34개로 복구했다.
- 모바일 메뉴에서 킥스 이동 후 대화상자가 닫히고, 키즈 직접 URL 진입 시 현재 탭이 화면 안에 보이는 것을 확인했다.
- 상세에서 Enter 키로 100ml 옵션을 선택하고 원문 출처 링크 및 잘못된 '전체' 탭 강조가 없는 것을 확인했다.

## 독립 검토

초기 88/100 CONDITIONAL PASS에서 지적한 3건을 수정했다: 상세의 전체 스토어 오표시, 뷰티/가방의 '사이즈' 고정 문구, 가방에 적용된 확인되지 않은 의류 세탁법. 가방 FREE 옵션과 선택 탭 자동 노출도 함께 재검토했다. 최종 소스 검토 결과는 96/100 PASS이며 추가 필수 수정 사항은 없었다.

## 확인 범위와 제한

- 상품 가격·옵션·실측·재고는 데모 정보다. 실제 무신사 재고나 판매 API와 연동하지 않았다. 외부 이미지의 상업적 사용 권한은 이번 작업에서 확인하지 않았다.
- 실제 사용자 주문/결제·DB 쓰기·유료 AI 호출은 실행하지 않았다. 해당 경계는 기존 및 추가 자동 테스트로 검증했다.
- 실제 모바일 가상 키보드와 브라우저 자체 뒤로가기 버튼은 수동 검증하지 않았다. in-app browser의 Alt+ArrowLeft 입력은 브라우저 뒤로가기를 실행하지 않아 통과로 집계하지 않았다. URL 직접 진입·검색 지우기·종류 변경은 실제 브라우저에서 검증했다.
- 패키지·환경변수·DB 스키마·배포 설정을 변경하지 않았으며 Git commit/push는 하지 않았다.
