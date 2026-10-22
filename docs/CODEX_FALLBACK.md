# AI 응답 전환 — 2026-10-22

## 목표와 정책

사용자 요청: 기존 Claude API를 살리고 API로 응답할 수 없을 때, 서버 PC에 이미 로그인된 ChatGPT 계정의 Codex App Server에서 `gpt-6-sol`로 답변한다.

- 쇼핑 도우미와 스타일 진단 모두 Claude API → Codex App Server 순서다.
- Claude 키 누락, HTTP 오류, 통신 실패·시간 초과, 사용할 수 없는 응답이면 Codex로 전환한다. 채팅의 기존 일반 텍스트 답변은 정상 응답으로 유지한다.
- 요청 입력 검증은 모델 호출 전에 한다. 두 경로가 모두 실패하면 503과 사용자용 오류를 반환한다.
- Codex는 ChatGPT 로그인만 허용한다. 별도 OpenAI API 키를 사용하거나 다른 모델로 바꾸지 않는다.
- 요청별 임시 대화와 빈 임시 작업 폴더를 사용한다. 도구·MCP·셸 실행을 비활성화하고 읽기 전용 권한과 JSON 스키마를 적용한다.
- 추천 상품은 서버 카탈로그에서 품절·알 수 없는 ID·중복을 제외하고 최대 3개로 제한한다.
- 패키지·환경변수 파일·DB·배포 설정은 변경하지 않는다. Docker/원격 서버에는 해당 실행 환경의 Codex 설치와 ChatGPT 로그인이 별도로 필요하다.

## 실행 계획

- [x] 정상 API·키 누락·HTTP/통신 오류·잘못된 응답·양쪽 실패·잘못된 요청의 회귀 테스트를 먼저 작성한다.
- [x] App Server JSON-RPC 클라이언트와 인증·모델·시간 제한·종료·동시 호출 제어를 구현하고 프로세스 경계 테스트로 확인한다.
- [x] 공통 AI 응답 전환과 JSON 응답 검증을 두 API에 연결한다. 기존 프론트 응답 형식은 유지한다.
- [x] 실제 `gpt-6-sol` 응답, 전체 테스트·린트·타입·빌드, 독립 리뷰를 확인하고 결과를 기록한다.

## 사전 확인

- 다른 프로젝트의 `CodexClient` / `CodexProcessFactory`를 읽어 ChatGPT 인증 확인·임시 대화·출력 스키마·도구 차단 방식을 확인했다.
- 현재 PC: Codex CLI `0.163.0-alpha.10.2`, `Logged in using ChatGPT`.
- `account/read`: `chatgpt`, `model/list`: `gpt-6-sol` 확인. 이후 실제 완료 응답까지 확인했다.
- 공식 프로토콜: [Codex App Server](https://learn.chatgpt.com/docs/app-server). 설치된 CLI의 JSON 스키마도 확인해 해당 버전의 `sandbox` / `sandboxPolicy` 형식을 사용했다.

## 로컬 실행 조건

Next.js 서버를 실행하는 **같은 OS 사용자**에 Codex CLI와 ChatGPT 로그인이 있어야 한다. 확인 명령은 `codex login status`이며, 로그인되지 않았다면 해당 사용자로 `codex login`을 진행한다. API 키 로그인은 이 연동에서 거부한다.

Windows에서는 데스크톱 앱의 `OpenAI/Codex/bin/*/codex.exe`, npm의 `@openai/codex/bin/codex.js`, PATH 순서로 찾는다. 다른 경로가 필요하면 서버 프로세스의 선택 환경변수 `MYSHOP_CODEX_EXECUTABLE`로 네이티브 실행 파일 또는 JS 진입점을 지정한다. `.cmd` / `.bat`는 직접 실행하지 않는다. 이번 작업에서는 환경변수 파일을 생성·수정하지 않았다.

- Claude 대기 제한: 15초. Codex 대기 제한: 기본 90초. 사용자가 요청을 취소하면 대체 호출도 중단한다.
- 동일 모듈 인스턴스의 Codex 호출은 한 번에 하나만 허용한다. 사용 중이거나 인증·모델·실행이 불가능하면 503 안내를 반환한다.
- 정상 응답 헤더: `X-AI-Provider: claude` 또는 `codex`, `X-AI-Model: claude-haiku-4-5-20251001` 또는 `gpt-6-sol`.
- Docker·원격 서버는 호스트 PC의 로그인과 실행 파일을 자동 사용하지 않는다. 현재 배포 구성에는 Codex 설치·인증을 추가하지 않았다.
- 기존 Claude 호출은 기존 API 과금 경로이며, 대체 호출은 로그인된 ChatGPT 계정의 Codex 사용 한도를 사용한다.

## 검증 결과

2026-10-22에 확인했다.

- 테스트를 먼저 추가했을 때 기존 코드에서 20개가 실패했고, 응답 전환·입력/출력 검증 구현 후 모두 통과했다.
- `node --test tests/*.test.mjs`: **116/116 통과**. 기존 쇼핑 흐름 83개 + 실제 AI 라우트/공통 공급자 경계 23개 + App Server 클라이언트/자식 프로세스 경계 10개다.
- `node node_modules/eslint/bin/eslint.js .`: 종료 코드 0, 오류·경고 없음.
- `node node_modules/typescript/bin/tsc --noEmit --incremental false`: 통과.
- `node node_modules/next/dist/bin/next build`: 프로덕션 빌드 통과, 22개 페이지 생성. 두 AI 라우트는 Node 런타임이다.
- 실제 로그인 계정의 App Server `gpt-6-sol` 스타일 진단이 완료됐고, JSON을 서버 파서로 검증했다.
- 실행 중인 로컬 웹 서버의 `POST /api/chat`: **200**, `X-AI-Provider: codex`, `X-AI-Model: gpt-6-sol`. 실제 한국어 추천 답변과 상품 ID 1을 받았다.
- 브라우저: 쇼핑 도우미의 답변·추천 상품 카드 3개, 스타일 진단 4문항 완료 후 유형·코디·팁·상품 카드 3개를 확인했다. 해당 확인에서 AI 관련 브라우저 오류는 없었다. 홈 셰이더 라이브러리의 기존 경고 2건은 별도 범위다.
- 독립 읽기 전용 리뷰: **96/100, PASS**. 인증·도구 차단, 프로세스 종료/취소, 두 API의 호환성을 검토했고 AI 경계 테스트 33개를 독립 재실행했다. 수정이 필요한 확정 결함은 없었다.

자동 테스트에서는 외부 Claude 전송과 Codex 자식 프로세스 경계만 대체한다. 실제 Claude 서비스의 성공·장애를 강제로 발생시키는 검증은 하지 않았으며, 해당 전환은 회귀 테스트와 실제 Codex 응답으로 확인했다.

비차단 보강 여지: Windows 자동 탐색과 잘못된/과대한 프로토콜 출력의 테스트 확장, 프로세스 종료 직후 빈 임시폴더 정리의 Windows 잔류 여부 확인. 현재는 직접 만든 빈 폴더만 비재귀 삭제하며 삭제 실패는 응답 실패로 바꾸지 않는다.

## 변경 파일

- `app/api/chat/route.ts`, `app/api/style-quiz/route.ts`: 입력 검증, 공통 응답 전환, 기존 JSON 구조와 공급자 헤더.
- `src/lib/ai/provider.ts`, `shopping.ts`: Claude 우선 호출, 프롬프트·결과·추천 상품 검증.
- `src/lib/ai/codex-app-server.ts`, `codex-command.ts`: ChatGPT 인증과 고정 모델의 JSON-RPC, CLI 탐색·종료·취소·시간 제한.
- `src/constants/ai.ts`, `src/types/ai.ts`: 모델·제한 상수와 공통 타입.
- `src/components/features/chat/ChatBot.tsx`: HTTP 실패를 기존 오류 안내로 연결.
- `tests/ai-routes.test.mjs`, `tests/codex-app-server.test.mjs`: 전환 정책과 프로세스 경계 회귀 테스트.
- `README.md`, `docs/CODEX_FALLBACK.md`: 실행 조건·구조·검증 기록.
