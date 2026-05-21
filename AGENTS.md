# AGENTS.md — AI 에이전트 공통 규칙

> Cursor, Claude, Copilot 등 모든 AI 도구에 적용되는 공통 규칙입니다.

## 프로젝트 개요
- **서비스**: 쇼핑몰 (커머스) 웹 애플리케이션
- **스택**: Next.js 16 / React 19 / TypeScript / Tailwind CSS v4
- **목표**: 포트폴리오 + Docker 배포

## AI가 절대 임의로 하면 안 되는 것
- 패키지 추가 (반드시 사용자 승인 후)
- 환경변수 파일(.env) 생성 또는 수정
- 기존 컴포넌트 삭제
- DB 스키마 변경
- 배포 설정 변경

## 코드 스타일 요약
- 언어: TypeScript (any 금지)
- 스타일: Tailwind CSS (인라인 style 금지)
- 컴포넌트: 함수형 컴포넌트만 사용
- export: named export 우선, page만 default export
- 폴더: kebab-case, 컴포넌트 파일: PascalCase.tsx

## 응답 형식
코드 작성 시 아래 형식으로 응답한다:

```
[작업 내용 요약]
[생성/수정한 파일 목록]
[품질 자가 평가: X/10]
[개선 가능한 부분]
```
