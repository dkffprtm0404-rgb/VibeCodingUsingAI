# 보안 사전 점검과 조치 — 2026-10-22

## 범위와 현재 판정

후속 적용: 사용자가 선택한 AI 호출 제한·회원가입 이메일 인증·로그인 CSRF 방어는 구현·검증했다. 실행 조건과 최종 199개 테스트·독립 리뷰 결과는 [보안 강화 기록](SECURITY_HARDENING.md)을 참고한다. 키 교체와 패키지 업데이트는 사용자 선택에 따라 이번 범위에서 제외했다. 아래는 최초 점검 시점의 근거이며 전체 보안 조치 완료를 뜻하지 않는다.

인증·주문·AI API, 클라이언트 이동 주소, 서버 비밀키 경계, Git의 환경변수 파일 이력, 설치된 패키지 버전과 공식 보안 공지를 확인했다. **전체 보안 조치 완료 판정은 아니다.** 실제 DB RLS, 원격 배포·접근 로그, 기존 키의 서버 유효성은 확인하지 않았다. 실제 사용자 데이터 조회·계정 생성·AI 호출 없이 외부 경계를 대체해 재현했다.

## 최우선: 현재 설정과 일치하는 비밀키가 과거 Git 기록에 남음

- 현재 추적 파일에서는 비밀키 패턴을 찾지 못했지만, 과거 백업 ref의 `.env.example`에 Supabase secret 형식 값이 남아 있다.
- 해당 값은 `.env.local`과 `.env`의 `SUPABASE_SERVICE_ROLE_KEY` 설정과 일치한다. 비교는 프로세스 메모리 안에서만 했으며 원문·해시·키 일부도 출력하거나 이 문서에 기록하지 않았다.
- 관련 과거 기록은 로컬 `refs/original/refs/heads/main`에서 도달 가능하다. 그 기록을 포함하는 원격 추적 브랜치는 없었다. 이 사실만으로 과거 GitHub 공개·복제·악용 여부나 현재 키의 유효성을 판단할 수 없다.
- 비밀키는 RLS를 우회하는 서버 권한이다. 키 교체를 우선하며, Git 기록 정리만으로 이미 알려진 키의 권한이 사라지지는 않는다. [Supabase 키 보안·교체 절차](https://supabase.com/docs/guides/getting-started/api-keys)

### 키 교체 실행안 — 외부 설정·환경변수 변경 필요

1. Supabase Dashboard의 **Settings → API Keys**에서 새 secret key를 만든다. 키를 채팅·문서·소스에 붙이지 않는다.
2. 서버 전용 `SUPABASE_SERVICE_ROLE_KEY`에 새 값을 적용한다. 이 프로젝트는 `.env.local`과 `.env` 양쪽에 기존 값이 있어 함께 정리하고, 배포 환경에서 사용 중인 설정도 확인한다.
3. 서버를 다시 시작하고 해당 키를 사용하는 회원가입·주문 쓰기를 별도 테스트 계정/환경에서 확인한다. 공급자 키는 브라우저 번들에 넣지 않는다.
4. 새 키 적용을 모두 확인한 뒤 기존 secret key를 삭제한다. 이 삭제는 되돌릴 수 없으므로 먼저 의존 서비스를 확인한다.
5. 그 뒤 로컬 백업 ref·다른 복제본·원격 기록의 잔존 여부를 점검한다. 이번 점검에서는 Git ref 삭제·이력 재작성·push를 하지 않았다.

키 생성·삭제, 환경변수 파일 수정, 배포 서버 재시작은 이번 변경에 포함하지 않았다.

## 다음 조치 우선순위

### 1. 미반영 Next.js 보안 패치

설치된 버전은 Next.js `16.2.6`, React/React DOM `19.2.4`, sharp `0.34.5`다. Next.js는 이후 여러 보안 공지를 발표했고, 10월 14일 공지의 수정 버전은 `16.4.1`이다. 확인한 같은 메이저의 후속 안정 릴리스는 [`16.4.2`](https://github.com/vercel/next.js/releases/tag/v16.4.2)다. `next`와 `eslint-config-next`를 함께 검토·업데이트한 후 전체 테스트·타입·린트·빌드·브라우저 검증이 필요하다.

- [10월 공식 공지](https://nextjs.org/blog/nextjs-security-update-october-14-2026): Cache Components/typed arrays RCE, glibc Linux의 이미지 처리 RCE, Server Actions DoS 등 조건별 공지다. 이 저장소에서는 Cache Components·`use cache`·Server Actions를 발견하지 못했고 Docker 기반은 Alpine이다. 모든 항목이 현재 구성에서 악용된다고 단정하지 않는다.
- [8월 공식 공지](https://nextjs.org/blog/august-2026-security-release): AVIF 최적화와 Windows 서버의 RCE를 다룬다. Windows 항목은 Pages/App Router 등 공지의 구성 조건을 함께 확인해야 한다. 현재 소스에서는 App Router만 확인했다.
- [이미지 최적화 SSRF 공지](https://github.com/advisories/GHSA-cjq9-62q9-8jv4): 이 프로젝트는 `images.remotePatterns`를 사용하지만 허용 호스트는 `images.unsplash.com`이다. 공격자가 허용 URL/DNS 등을 제어할 수 있는지도 필요하며 실제 SSRF는 재현하지 않았다.
- `npm audit`는 일반·승인된 실행 모두 시도했으나 레지스트리 응답을 얻지 못해 전체 전이 의존성 취약점 개수는 확인하지 못했다. 패키지 버전·공식 공지 확인을 전체 의존성 검사 통과로 간주하지 않는다.

이번에는 `package.json`·잠금 파일을 바꾸거나 패키지를 설치하지 않았다.

### 2. 공개 AI API의 비용·계정 사용량 소진

최초 점검 당시 `app/api/chat/route.ts`, `app/api/style-quiz/route.ts`에는 인증·호출량 제한이 없었다. 쿠키 없는 반복 요청도 공급자 호출로 이어짐을 실제 핸들러와 대체 전송 경계에서 확인했다. 이후 로그인·확인된 이메일 검사와 공통 5회/분·30회/일·앱 프로세스 100회/일 제한을 적용했다.

비회원 데모 허용 여부를 정한 뒤, 공급자 호출 전에 사용자/신뢰 가능한 접속 경로별 요청 제한과 전체 사용량 상한을 적용한다. 여러 서버에서는 제한 상태를 공유해야 한다. 아무 출처에서 온 `X-Forwarded-For` 값을 그대로 신뢰하는 IP 제한만으로 해결하지 않는다. 기존 Claude 우선 → Codex 대체 순서는 유지한다.

### 3. 회원가입의 이메일 소유권 확인 생략

최초 점검 당시 `app/api/auth/signup/route.ts`는 공개 요청에 관리자 `createUser`와 `email_confirm: true`를 적용했다. 이후 일반 `signUp`·이메일 확인·PKCE 콜백으로 교체했고, 확인 설정이 꺼졌거나 조회할 수 없으면 가입을 막는다. 기존 관리자 생성 계정은 소급 변경하지 않았다.

일반 `auth.signUp` + 이메일 확인/완료 안내를 쓰는 것이 대응안이다. 이는 현재의 즉시 가입·로그인 정책을 바꾸므로 인증 설정과 UI를 함께 정해야 한다. [Supabase 관리자 사용자 생성](https://supabase.com/docs/reference/javascript/auth-admin-createuser), [이메일 확인 설정](https://supabase.com/docs/guides/auth/general-configuration)

### 4. 로그인 CSRF 방어와 API 경계 보강

최초 점검 당시 로그인 핸들러가 외부 `Origin`과 `text/plain` JSON을 거부하지 않고 인증 경계까지 전달함을 확인했다. 이후 모든 쓰기 API에서 인증·DB·모델 처리 전에 출처와 JSON 형식을 검사하도록 수정했다. 실제 브라우저의 세션 쿠키 수락까지 공격을 재현한 것은 아니다.

변경 API에 신뢰 가능한 동일 출처와 JSON 미디어 타입 검증을 적용하는 것이 대응안이다. 정상 클라이언트는 상대 API 주소와 JSON을 사용한다. 별도 외부 클라이언트 허용 여부와 프록시 구성을 확인한 뒤 정책을 확정한다. 찜·재입고 API의 원시 DB 오류 노출·상품 ID 검증도 함께 보강할 수 있다.

## 이번에 수정한 두 경로

- **주문 소유자 검사:** 주문 GET API·목록 페이지·상세 페이지 쿼리에 인증된 `user.id` 조건을 추가했다. 느슨한 DB 정책을 가정한 테스트에서 다른 사용자 주문/배송지가 반환되지 않으며 본인 주문은 유지된다. 실제 RLS의 활성화·`order_items` 직접 접근 정책은 여전히 별도 확인이 필요하다.
- **로그인 이동 주소:** 공통 `getSafeCallbackUrl`을 `useLogin`에 적용했다. 외부 URL·프로토콜 상대 주소·특수 스킴·제어문자·역슬래시·인코딩된 우회·dot segment는 `/`로 돌리고 정상 내부 경로와 쿼리/해시는 유지한다. 설치된 Next.js에도 기본 `javascript:` 차단이 있어 이 결과를 실제 XSS 실행 재현으로 보고하지 않는다.

변경 파일:

- `app/api/orders/route.ts`
- `app/orders/page.tsx`
- `app/orders/[id]/page.tsx`
- `src/hooks/useAuth.ts`
- `src/lib/utils.ts`
- `tests/security-boundaries.test.mjs`
- `docs/SECURITY_REVIEW.md`, `README.md`

## 검증 기록

- 새 보안 경계 테스트: **19개**. 첫 버전에서 권한·콜백 10개가 실패했고, 추가 dot segment 2개도 실패를 먼저 확인한 뒤 수정했다.
- 전체 `node --test tests/*.test.mjs`: **135/135 통과**. 실제 DB·Auth·외부 AI 호출 없음.
- 전체 ESLint·TypeScript: 종료 코드 0.
- 프로덕션 빌드: 최종 dot segment 차단까지 반영한 코드로 22개 페이지 생성 성공.
- 독립 검토: 보안 경계 테스트 **19/19** 독립 재실행, 변경분 한정 PASS. 주문 쿼리·콜백의 최소 수정과 기존 보안 위험을 별도로 검토했다. 전체 서비스 보안 PASS로 해석하지 않는다.
- 환경변수 파일·DB 스키마·외부 설정·패키지·Git 이력은 변경하지 않았다.
