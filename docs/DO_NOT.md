# DO_NOT.md — 절대 하면 안 되는 것들

> AI와 개발자 모두 이 규칙을 반드시 따른다.

## 🚫 TypeScript
- `any` 타입 사용 금지 → `unknown` 또는 명확한 타입 사용
- 타입 단언(`as`) 남발 금지 → 타입 가드 사용
- 타입 없이 함수 파라미터 작성 금지

## 🚫 컴포넌트
- 클래스형 컴포넌트 사용 금지 (함수형만)
- 인라인 `style={{}}` 사용 금지 → Tailwind 클래스 사용
- 컴포넌트 내 직접 API 호출 금지 → 커스텀 훅 또는 서버 컴포넌트로 분리
- 500줄 이상 컴포넌트 금지 → 분리 필요

## 🚫 보안
- `.env` 파일 Git 커밋 금지
- API 키/시크릿 하드코딩 금지
- `dangerouslySetInnerHTML` 사용 금지 (XSS 위험)

## 🚫 성능
- `useEffect` 내 불필요한 전체 재렌더링 유발 금지
- 이미지 `<img>` 직접 사용 금지 → Next.js `<Image>` 사용
- Client Component를 불필요하게 남용 금지 (Server Component 우선)

## 🚫 코드 품질
- `console.log` 프로덕션 코드에 남기기 금지
- 주석 없는 복잡한 비즈니스 로직 금지
- 하드코딩된 URL/경로 금지 → constants로 분리
- 중복 코드 3번 이상 반복 금지 → 함수/컴포넌트로 추출

## 🚫 Git
- `main` 브랜치 직접 push 금지
- 테스트 안 된 코드 push 금지
- `node_modules`, `.next`, `.env.local` 커밋 금지

## ⚠️ 주의 (금지는 아니지만 신중하게)
- `useEffect` 의존성 배열 비우기 (`[]`) — 의도한 경우에만
- 전역 상태 남용 — 로컬 상태로 해결 가능하면 로컬 우선
- `!` (non-null assertion) — 정말 확실한 경우에만
