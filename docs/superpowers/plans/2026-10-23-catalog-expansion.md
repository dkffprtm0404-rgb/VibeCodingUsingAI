# 스토어 분류와 모델 착용 카탈로그 확장

사용자 요청: 무신사 참고 화면처럼 뷰티·스포츠·아울렛·부티크·킥스·키즈로 분류를 다양화하고 의류 사진을 모델 착용컷 중심으로 교체한다. 기존 반응형 벤토·AI 개인화·셰이더 작업에 이어 현재 작업 폴더에서 구현한다.

## 범위와 결정

- 상위 스토어: 전체·패션·뷰티·스포츠·아울렛·부티크·킥스·키즈. 하위 상품 종류와 별도로 관리한다.
- 상품 목록은 `store` + 기존 `cat` + `q`를 함께 적용한다. 잘못된 URL 값은 안전한 기본 상태로 처리한다.
- 모든 스토어에 상품이 존재하도록 카탈로그를 확대한다. 의류는 모델 착용 사진, 뷰티·신발은 적합한 제품 사진을 사용한다. 확인한 공개 이미지와 출처를 기록하며 데모 상품 정보와 실제 판매 정보를 혼동하지 않게 한다.
- 기존 ID1~8의 가격·사이즈·재고는 유지해 저장된 장바구니와 주문 규칙을 보존한다. 사진·카탈로그 설명은 요청에 따라 교체 가능하다. 추가 상품은 고유한 ID를 사용한다.
- 실제 결제·DB·AI 제공자·사용량 제한을 바꾸지 않는다. 패키지·환경변수·배포 설정·Git commit/push 변경 없음.
- 확장된 뷰티·키즈는 기존 성인 의류 스타일 진단의 후보에서 제외한다. 프롬프트와 응답 검증에 같은 경계를 적용하고, 쇼핑 챗은 전체 스토어를 탐색할 수 있게 유지한다.
- 홈 기본 셀렉션은 스토어별로 중복 없이 최대 8개를 고르며, 실제 AI 진단 결과가 있으면 그 추천 순서를 유지한다.

## 실행 계획

1. **PLANNER / ROOT**: 참고 화면과 현재 구조·테스트 확인, 출처 있는 이미지 선별, 작업 경계 확정.
2. **EXECUTOR A — 분류 로직**: `src/constants/catalog.ts`, `src/lib/catalog.ts`, `src/types/product.ts`, `tests/catalog.test.mjs` 소유. 타입·상위 스토어·카테고리 상수와 필터 도우미, 실패 테스트부터 구현. `mock-data.ts`는 ROOT 소유.
3. **EXECUTOR B — 탐색 UI**: 신규 `StoreNavigation.tsx`, 상품 목록/검색/필터/카드/상세 표시, Header·MobileMenu·푸터에 탐색 연결. A의 고정 인터페이스를 사용. 홈·카탈로그·공통 CSS·이미지 자산은 ROOT 소유.
4. **ROOT — 카탈로그·홈**: 공개 이미지와 출처 정리, `mock-data.ts` 데이터 확장, 홈 스토어 카드와 더 풍부한 셀렉션 연결. 사진 로딩·사진과 상품 문구의 일치 확인.
5. **REVIEWER**: 기존 변경을 보존하며 이번 추가 변경을 독립 검토. 전체 테스트·lint·타입·빌드·실제 브라우저 검증 후 완료 보고.

## 공유 인터페이스

- `src/types/product.ts`: `StoreChannelId = 'fashion' | 'beauty' | 'sports' | 'outlet' | 'boutique' | 'kicks' | 'kids'`; Product에 선택 필드 `channels?: StoreChannelId[]`, `brand?: string`, `optionLabel?: string` 추가.
- `src/constants/catalog.ts`: `STORE_CHANNELS` (전체 포함, id/label/eyebrow/description), `CATEGORIES`, `Category`, `StoreId = 'all' | StoreChannelId`.
- `src/lib/catalog.ts`: `getStoreId(value: string | null | undefined): StoreId`, `matchesStore(product: Product, store: StoreId): boolean`, `getStoreCategories(products: Product[], store: StoreId): Category[]`, `filterCatalog(products: Product[], {store, category, query}): Product[]`.
- 채널이 없는 기존 상품/테스트 fixture는 패션으로 취급한다. 필터는 품절 상태를 숨기지 않으며 재고 처리는 기존 구매·추천 경계가 담당한다.
- `mock-data.ts`의 기존 `CATEGORIES`와 `Category` export는 새 상수를 재export해 기존 import 호환을 유지한다.

## 검증 기준

- 모든 상위 스토어에 상품 존재. 중복 ID 없음, 옵션 재고 합계와 총 재고 일치, 모든 이미지 경로 유효.
- `store`·`cat`·`q` 조합, 잘못된 값, 검색 지우기·뒤로 가기와 직접 URL 접근 검증.
- 360/390/768/1440px에서 상위 분류의 가로 스크롤이 문서 넘침을 만들지 않음. 키보드 초점·선택 표시·하위 종류가 동작.
- 의류 사진이 실제 착용컷인지, 썸네일/상세가 같은 상품/코디인지 직접 확인.
- 기존 전체 Node 테스트, 새 분류 테스트, ESLint, TypeScript, 프로덕션 빌드, diff 검사.
- 실제 사용자 주문·결제·유료 AI 호출은 검증에 포함하지 않는다.
