# CLAUDE.md

> 이 파일은 Claude가 이 프로젝트에서 작업할 때 읽는 최상위 지침입니다.
> **Humans steer. Agents execute.** — OpenAI Harness Engineering 원칙

@AGENTS.md

## 프로젝트 컨텍스트

- **서비스**: MyShop — AI 패션 쇼핑몰
- **스택**: Next.js 16 / TypeScript / Supabase / Tailwind CSS v4 / Zustand / Docker
- **AI 연동**: Anthropic Claude API (챗봇, 스타일 진단)
- **배포**: Docker 멀티스테이지 빌드 (80:3000)

## 세부 규칙 참조

| 문서 | 내용 |
|------|------|
| `docs/ARCHITECTURE.md` | 폴더 구조, 렌더링 전략, 데이터 흐름 |
| `docs/CONVENTIONS.md` | 네이밍, 컴포넌트 작성, 커밋 규칙 |
| `docs/DO_NOT.md` | 절대 금지 패턴 목록 |
| `docs/GIT_WORKFLOW.md` | 커밋/푸시 규칙 (사용자 승인 필수) |
| `docs/DOCKER.md` | Docker 빌드 및 배포 가이드 |

## Claude 행동 원칙

### 작업 전
- 관련 파일 구조를 먼저 파악한다
- `docs/DO_NOT.md` 를 확인하고 금지 패턴을 쓰지 않는다
- 기존 컨벤션과 일관성을 유지한다

### 작업 후 자가 검토
- [ ] TypeScript `any` 없이 타입이 명확한가?
- [ ] 컴포넌트가 단일 책임 원칙을 지키는가?
- [ ] 하드코딩된 값이 없는가? (상수/env 분리)
- [ ] 에러 처리가 되어 있는가?
- [ ] 불필요한 `console.log` 가 없는가?

### 품질 평가
- 코드 작성 후 객관적으로 품질을 평가한다 (1~10점)
- 개선 가능한 부분을 명시한다
- "완벽하다"고 단정짓지 않는다

### Git 규칙
- 작업 완료 후 변경 파일 목록과 커밋 메시지를 사용자에게 보고한다
- **반드시 사용자 승인 후에만 커밋한다**
- push는 사용자가 직접 한다
