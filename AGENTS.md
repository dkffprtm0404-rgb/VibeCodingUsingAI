# AGENTS.md — AI 에이전트 공통 규칙

> **하네스 엔지니어링(Harness Engineering)** 원칙 기반
> OpenAI "Harness Engineering: leveraging Codex in an agent-first world" (2026.02) 참조
>
> 핵심: 에이전트가 실수할 때마다 그 실수를 다시는 반복하지 못하도록 시스템을 개선한다.
> "Humans steer. Agents execute."

---

## 하네스 3원칙

### 1. 컨텍스트 엔지니어링 (Context Engineering)
에이전트가 접근할 수 없는 정보는 존재하지 않는 것과 같다.

- 에이전트에게 필요한 정보는 반드시 in-context로 제공한다
- 지침 파일은 **짧고 명확하게** 유지한다 (컨텍스트는 희소 자원)
- 모든 것이 "중요"하면 아무것도 중요하지 않다 — 우선순위를 명확히

### 2. 아키텍처 제약 (Architectural Constraints)
에이전트가 잘못된 방향으로 갈 수 없도록 구조적으로 막는다.

- 공유 유틸리티 패키지를 직접 구현 대신 사용 (`@/lib/utils`, `@/lib/supabase`)
- 데이터 경계는 반드시 검증하거나 타입 SDK에 의존 (YOLO-style 탐색 금지)
- 파일 크기 제한: 컴포넌트 500줄 초과 시 분리 필수

### 3. 엔트로피 관리 (Entropy Management)
코드베이스의 부채와 드리프트를 주기적으로 정리한다.

- 반복되는 패턴 발견 시 → 즉시 추상화
- 사용하지 않는 코드/파일 → 제거
- 오래된 규칙 → 업데이트 또는 삭제

---

## 이 프로젝트 적용 규칙

### 적용 도구
Cursor, Claude, Copilot 등 모든 AI 코딩 도구에 적용

### 프로젝트 개요
- **서비스**: MyShop — AI 패션 쇼핑몰
- **목적**: 포트폴리오 + Docker 배포
- **스택**: Next.js 16 / React 19 / TypeScript / Tailwind CSS v4

### AI가 임의로 하면 안 되는 것
- 패키지 추가 (사용자 승인 후)
- 환경변수 파일 생성/수정
- 기존 컴포넌트 삭제
- DB 스키마 변경
- 배포 설정 변경
- Git push (사용자가 직접)

### 코드 스타일 요약
- 언어: TypeScript (`any` 금지)
- 스타일: Tailwind CSS (인라인 `style` 최소화)
- 컴포넌트: 함수형만 사용
- export: named export 우선, page만 default export
- 폴더: kebab-case / 컴포넌트: PascalCase.tsx

### 응답 형식
코드 작성 시 아래 형식을 따른다:
```
[작업 내용 요약]
[생성/수정한 파일 목록]
[품질 자가 평가: X/10]
[개선 가능한 부분]
```

---

## 피드백 루프 (PEV Loop)

하네스 엔지니어링의 핵심: **Plan → Execute → Verify**

```
Plan     사용자가 의도를 명확히 지정
Execute  에이전트가 제약 안에서 실행
Verify   결과 검증 → 실패 시 제약 조건 업데이트
```

에이전트가 같은 실수를 반복하면:
1. 해당 패턴을 `docs/DO_NOT.md` 에 추가
2. 이 파일에 방어 규칙 추가
3. 재발 방지 구조 확보
