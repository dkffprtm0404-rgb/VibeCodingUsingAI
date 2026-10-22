# DO_NOT.md — 절대 하면 안 되는 것들

> 하네스 엔지니어링 원칙: 에이전트가 실수할 때마다 이 파일에 추가한다.
> 이 파일은 과거의 실수로부터 배운 제약 조건 목록이다.

---

## 🚫 TypeScript

- `any` 타입 사용 금지 → `unknown` 또는 명확한 타입 사용
- 타입 단언(`as`) 남발 금지 → 타입 가드 사용
- `!` (non-null assertion) 남발 금지 → 조건부 체크 사용
- **API Route에서 타입 import 금지** → `src/types/` 에 분리 후 양쪽에서 import
  - 이유: Docker 빌드 시 경로 해석 실패 (2026-05-28 발생)

## 🚫 컴포넌트

- 클래스형 컴포넌트 금지 (함수형만)
- 인라인 `style={{}}` 남용 금지 → Tailwind 클래스 사용
- 컴포넌트 내 직접 API 호출 금지 → 커스텀 훅 또는 Server Component로 분리
- 500줄 이상 컴포넌트 금지 → 분리 필수
- **Zustand persist 스토어를 SSR에서 직접 렌더링 금지**
  - 이유: Hydration 오류 발생 (서버=0, 클라이언트=N 불일치)
  - 해결: `isMounted` 패턴 사용 (2026-05-21 발생)
  - effect에서 마운트 상태를 즉시 변경하는 대신 `useHydrated` 또는 외부 저장소의 서버 스냅샷을 사용한다. 첫 방문 기록을 마운트 플래그로 건너뛰지 않는다. (2026-10-22)

## 🚫 외부 데이터 경계

- 주문 JSON을 바로 구조 분해하거나 잘못된 상품만 조용히 제외하지 않는다. 전체 상품·양의 정수 수량·사이즈별 누적 재고·배송지를 검증한 뒤 DB에 저장한다. (2026-10-22)
- 저장된 장바구니 상태를 스토어에 그대로 병합하지 않는다. 현재 카탈로그로 항목을 복원하고, 저장 데이터가 스토어 액션을 덮어쓰지 못하게 한다. (2026-10-22)

## 🚫 보안

- `.env`, `.env.local` Git 커밋 금지
- **`.env.example` 에 실제 키 값 입력 금지** (설명용 placeholder만)
  - 이유: GitHub secret scanning에 의해 push 차단됨 (2026-05-26 발생)
- API 키/시크릿 하드코딩 금지
- `dangerouslySetInnerHTML` 사용 금지 (XSS 위험)
- `SUPABASE_SERVICE_ROLE_KEY` 클라이언트 컴포넌트에서 사용 금지 (서버 전용)

## 🚫 성능

- `useEffect` 내 불필요한 전체 재렌더링 유발 금지
- 이미지 `<img>` 직접 사용 금지 → Next.js `<Image>` 사용
- Client Component 불필요한 남용 금지 → Server Component 우선

## 🚫 코드 품질

- `console.log` 프로덕션 코드에 남기기 금지
- 하드코딩된 URL/경로 금지 → `@/constants` 로 분리
- 중복 코드 3회 이상 반복 금지 → 함수/컴포넌트 추출

## 🚫 Git

- `main` 브랜치 직접 push 금지 (사용자 직접 실행)
- 빌드 실패 상태 커밋 금지 (`npm run build` 확인 후)
- `node_modules`, `.next`, `.env.local`, `.env` 커밋 금지

## 🚫 Docker

- `NEXT_PUBLIC_*` 변수는 빌드 타임에 번들에 포함됨
  - `docker-compose.yml` 의 `args` 에 반드시 포함해야 함
  - `env_file` 만으로는 부족 (런타임 주입은 서버 변수에만 적용)
- `&&` 연산자 PowerShell에서 사용 금지 → 명령어 분리 실행
