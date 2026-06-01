# AGENTS.md — AI 에이전트 공통 규칙

> **하네스 엔지니어링(Harness Engineering)** 원칙 기반
> OpenAI "Harness Engineering: leveraging Codex in an agent-first world" (2026.02) 참조
>
> 핵심: 에이전트가 실수할 때마다 그 실수를 다시는 반복하지 못하도록 시스템을 개선한다.
> **"Humans steer. Agents execute."**

---

## 하네스 3원칙

### 1. 컨텍스트 엔지니어링 (Context Engineering)
에이전트가 접근할 수 없는 정보는 존재하지 않는 것과 같다.
- 필요한 정보는 반드시 in-context로 제공한다
- 지침 파일은 **짧고 명확하게** 유지한다 (컨텍스트는 희소 자원)
- 모든 것이 "중요"하면 아무것도 중요하지 않다

### 2. 아키텍처 제약 (Architectural Constraints)
에이전트가 잘못된 방향으로 갈 수 없도록 구조적으로 막는다.
- 공유 유틸리티를 직접 구현 대신 사용 (`@/lib/utils`, `@/lib/supabase`)
- 데이터 경계는 반드시 검증하거나 타입 SDK에 의존
- 파일 크기 제한: 컴포넌트 500줄 초과 시 분리 필수

### 3. 엔트로피 관리 (Entropy Management)
코드베이스의 부채와 드리프트를 주기적으로 정리한다.
- 반복 패턴 발견 시 → 즉시 추상화
- 사용하지 않는 코드/파일 → 제거
- 오래된 규칙 → 업데이트 또는 삭제

---

## 3 에이전트 워크플로우

모든 작업은 아래 3단계 에이전트를 순서대로 거친다.

```
사용자 요청
    ↓
┌─────────────────────────────┐
│  🗺️  PLANNER (계획 에이전트)   │  ← AGENT_PLANNER.md
│  요청 분석 → 실행 계획 수립     │
│  영향 파일 파악 → 순서 결정     │
└─────────────┬───────────────┘
              ↓ 계획 전달
┌─────────────────────────────┐
│  ⚙️  EXECUTOR (실행 에이전트)  │  ← AGENT_EXECUTOR.md
│  계획대로 코드 작성/수정        │
│  컨벤션 준수 → 완료 보고       │
└─────────────┬───────────────┘
              ↓ 완료 보고
┌─────────────────────────────┐
│  🔍 REVIEWER (검토 에이전트)   │  ← AGENT_REVIEWER.md
│  품질 스코어 산정 (100점 만점)  │
│  개선 필요 사항 목록화         │
│  PASS / FAIL 판정             │
└─────────────┬───────────────┘
              ↓ 최종 보고
         사용자 확인
              ↓ 승인
         git commit
```

### 판정에 따른 처리

```
✅ PASS (90점↑)        → 즉시 커밋
⚡ CONDITIONAL (75~89) → 경미한 수정 후 커밋
⚠️ NEEDS WORK (60~74)  → EXECUTOR 재작업 → REVIEWER 재검토
🔴 FAIL (59점↓)        → EXECUTOR 전면 재작업
```

---

## 에이전트별 참조 문서

| 에이전트 | 파일 | 주요 역할 |
|---------|------|----------|
| 🗺️ PLANNER | `AGENT_PLANNER.md` | 계획 수립, 범위 파악 |
| ⚙️ EXECUTOR | `AGENT_EXECUTOR.md` | 코드 작성, 컨벤션 준수 |
| 🔍 REVIEWER | `AGENT_REVIEWER.md` | 품질 검토, 점수 산정 |
| 📏 스코어 기준 | `docs/QUALITY_SCORE.md` | 100점 만점 채점 기준 |

---

## 이 프로젝트 공통 규칙

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
- **Git push (사용자가 직접)**

### 코드 스타일 요약
- 언어: TypeScript (`any` 금지)
- 스타일: Tailwind CSS (인라인 `style` 최소화)
- 컴포넌트: 함수형만 사용
- export: named export 우선, page만 default export
- 폴더: kebab-case / 컴포넌트: PascalCase.tsx

---

## 피드백 루프 (PEV Loop)

```
Plan     사용자가 의도를 명확히 지정
Execute  에이전트가 제약 안에서 실행
Verify   결과 검증 → 실패 시 제약 조건 업데이트
```

에이전트가 같은 실수를 반복하면:
1. 해당 패턴을 `docs/DO_NOT.md` 에 추가
2. 이 파일에 방어 규칙 추가
3. `docs/QUALITY_SCORE.md` 자동 FAIL 조건에 추가
