# 인증·AI 보안 강화 실행 계획

> **For agentic workers:** Use superpowers:executing-plans to implement these tasks in order. Preserve existing staged changes; do not commit or push.

**Goal:** 사용자가 선택한 AI 호출 제한, 가입 이메일 인증, 로그인 CSRF 방어를 구현한다.

**Architecture:** 기존 Next.js Route Handler와 Supabase SSR 클라이언트를 유지한다. 공통 요청 출처 검사, 인증된 사용자별 AI 할당량, 일반 가입과 PKCE 확인 콜백을 추가한다.

**Tech Stack:** 기존 TypeScript, Next.js, Supabase, Node 내장 테스트만 사용한다.

**Spec:** 사용자 요청과 이용 범위 답변(로그인한 회원만), 사전 근거는 `docs/SECURITY_REVIEW.md`.

## 공통 제약

- 키 교체·패키지 업데이트·DB 스키마·환경변수 파일·배포 설정 변경은 범위 밖이다.
- 기존 Claude 우선 → ChatGPT 로그인 Codex `gpt-6-sol` 대체 순서를 유지한다.
- AI 요청은 인증된 회원만 허용한다. 두 기능을 합쳐 회원당 분당 5회·한국시간 하루 30회, 앱 프로세스 전체 한국시간 하루 100회다. 유효한 요청을 모델 호출 전에 1회 예약하고 실패·취소에도 되돌리지 않는다.
- 새 인프라 없이 서버 프로세스 메모리에서 할당량을 공유한다. 재시작 시 초기화되며 여러 서버의 합산 제한은 제공하지 않는다. 이 제약을 완료 보고에 명시한다.
- 출처는 명시된 `NEXT_PUBLIC_APP_URL`이 있으면 그 origin, 없으면 서버 요청 URL의 origin을 사용한다. 전달된 프록시 호스트/IP 헤더를 신뢰하지 않는다.
- 변경 API는 같은 origin과 `application/json`을 요구한다. PKCE 콜백 GET은 브라우저의 코드 검증자로 보호한다.
- 공개 Auth 설정 GET을 읽기 전용 확인한 결과 이메일 확인 필수=true, 가입 허용=true였다. 가입 시에도 이메일 자동 확인 설정이면 계정 생성 전에 차단한다.

## 검토 초점

- 두 AI API의 비회원·미확인 사용자·잘못된 입력·할당량 초과에서 모델 호출이 없어야 한다.
- 동시 요청과 다른 AI API·사용자의 카운터를 공유하고 날짜 경계·Retry-After·재시도 우회를 검증한다.
- 외부/누락/null Origin·위조된 전달 헤더·일반 폼 콘텐츠 형식을 인증/DB 처리 전에 거부한다.
- 이메일 확인 비활성화/설정 조회 실패 때 가입을 막고 관리자 생성·자동 로그인은 사용하지 않는다.
- 잘못되거나 만료된 인증 코드는 안전한 로그인 안내로 이동하며 코드·토큰·외부 이동 주소를 노출하지 않는다.

## Task 1: 같은 출처의 JSON 요청만 허용

**Files:** `src/lib/request-security.ts`, 쓰기 API 9개, `tests/request-security.test.mjs`, 기존 주문·AI 테스트 요청 헤더.

**Interfaces:** `validateJsonMutation(request: Request): NextResponse | null`; 정상 요청은 기존 처리, 외부/출처 누락은 403, JSON 이외 형식은 415.

- [x] 실제 핸들러에서 외부 출처·폼 요청이 거부되지 않는 회귀 실패를 확인한다.
- [x] 공통 검사를 모든 POST/DELETE API 첫 단계에 적용한다.
- [x] 같은 출처 정상 호출과 인증/DB/모델 이전 차단을 확인한다.

## Task 2: 이메일 확인 가입과 콜백

**Files:** `src/lib/auth-validation.ts`, `src/lib/supabase/auth-settings.ts`, 가입/로그인 API, `app/auth/callback/route.ts`, 로그인 페이지·가입 훅·API 응답 타입, `tests/auth-api.test.mjs`.

**Interfaces:** 가입은 일반 `auth.signUp` 후 `{ requireEmailConfirmation: true }` 201, PKCE 콜백은 `exchangeCodeForSession` 성공 시 홈/실패 시 로그인 오류 안내.

- [x] 관리자 생성·자동 로그인·잘못된 입력·확인 설정 비활성화·콜백 실패 테스트를 먼저 작성한다.
- [x] 공개 Auth 설정이 확인 필수일 때만 가입시키고 이름·이메일·비밀번호를 검증한다.
- [x] 고정된 같은 출처 콜백 URL과 확인 안내를 연결한다.
- [x] 실제 계정/메일 생성 없이 경계 테스트와 브라우저 안내를 확인한다.

## Task 3: AI 인증과 할당량

**Files:** `src/lib/ai/access.ts`, `src/lib/ai/usage-limit.ts`, `src/constants/ai.ts`, 두 AI API·채팅/스타일 UI, `tests/ai-access.test.mjs`, 기존 AI 회귀 테스트.

**Interfaces:** `requireAiUser(): Promise<string | NextResponse>`, `consumeAiQuota(userId: string): NextResponse | null`; 미인증 401, 이메일 미확인 403, 한도 초과 429 + Retry-After.

- [x] 인증·5회/30회/100회·두 API 공유·시간 경계·호출 전 차단의 회귀 실패를 확인한다.
- [x] 검증된 요청만 공통 카운터를 예약하고 기존 공급자 호출을 이어간다.
- [x] UI에 로그인 이동과 서버의 제한 안내를 표시한다.
- [x] 전체 테스트·린트·타입·빌드·브라우저 확인과 독립 리뷰를 수행하고 문서를 갱신한다.

## 검증 결과

- 전체 `node --test tests/*.test.mjs`: **199/199 통과**. 기존 135 + 출처 검사 29 + 가입/인증 16 + AI 접근/한도 15 + 클라이언트 로그아웃 4.
- 전체 ESLint 오류·경고 0개, `tsc --noEmit --incremental false` 통과. 최종 프로덕션 빌드의 타입 검사도 통과했고 `/auth/callback`을 포함해 23개 페이지를 생성했다.
- 공개 Auth 설정 GET은 200이며 확인 필수·가입 허용을 확인했다. 관리 API로 설정이나 키를 변경하지 않았다.
- 브라우저: 비회원 스타일 진단 로그인 화면, 실제 쇼핑 도우미의 401 안내와 로그인 링크, 가입 후 메일 확인 안내, 코드 없는 콜백의 안전한 로그인 오류 안내를 확인했다. 해당 확인에서 브라우저 오류 로그는 없었다.
- 독립 리뷰: **95/100, 변경 범위 한정 PASS**. 요청 경계·PKCE·한도와 로그아웃 호환성을 확인했다. 리뷰에서 찾은 모바일 JSON 헤더 누락과 native dialog가 오류 토스트를 가리는 문제를 실패 테스트 후 수정했다.
- 실제 계정 생성·확인 메일 발송/수신·회원 로그인·모델 호출·주문 생성까지의 E2E는 하지 않았다. 공급자·Auth 경계를 대체한 회귀 검증과 위 공개 설정/비회원 브라우저 확인을 구분한다.

## 실행 조건과 한계

- Supabase **Confirm email** 활성화, 실제 메일 전송 설정, 실제 사이트의 `/auth/callback` Redirect URL 허용이 필요하다. 기본 확인 메일 링크의 PKCE 흐름을 사용하므로 가입 브라우저에서 링크를 연다. 다른 브라우저에서 이메일 확인을 마쳤다면 로그인 폼을 사용한다.
- 기존 `email_confirm: true`로 생성된 계정의 인증 이력은 소급 변경하지 않았다.
- 한도는 토큰 수나 공급자 결제 한도가 아니라 앱 요청 수다. Claude 실패 후 Codex 대체도 요청 1회이며, 실패/취소된 유효 요청도 차감한다. 여러 Node 프로세스·컨테이너·서버 합산 또는 재시작 후 유지가 필요하면 별도 공유 저장소가 필요하다.
- 키 교체·Next.js 업데이트·환경변수 파일·DB·배포 구성·Git 이력 변경은 하지 않았다.

## 변경 파일

- 요청 경계: `src/lib/request-security.ts`, `app/api/auth/{login,signup,logout}/route.ts`, `app/api/{chat,style-quiz,orders,wishlist,restock,coupon}/route.ts`.
- 인증: `src/lib/auth-validation.ts`, `src/lib/supabase/auth-settings.ts`, `app/auth/callback/route.ts`, `app/login/page.tsx`, `src/hooks/useAuth.ts`, `src/lib/api.ts`.
- AI: `src/constants/ai.ts`, `src/lib/ai/access.ts`, `src/lib/ai/usage-limit.ts`, `app/style-quiz/page.tsx`, `src/components/features/{chat/ChatBot,style/StyleQuiz}.tsx`.
- 호환성: `src/components/features/layout/MobileMenu.tsx`는 공통 JSON 로그아웃을 사용하고, 실패 시 모달을 닫아 오류 토스트를 볼 수 있게 한다. 데스크톱도 실패를 성공으로 처리하지 않는다.
- 테스트: `tests/{request-security,auth-api,ai-access,logout-client}.test.mjs`, 기존 `tests/{ai-routes,orders-api}.test.mjs` 요청 헤더·인증 경계.
- 문서: `README.md`, `docs/{SECURITY_HARDENING,SECURITY_REVIEW,CODEX_FALLBACK}.md`.
