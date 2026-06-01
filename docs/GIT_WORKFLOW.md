# GIT_WORKFLOW.md — Git 형상관리 규칙

## 브랜치 전략

```
main          배포 가능한 안정 브랜치
└── feat/xxx  기능 개발
└── fix/xxx   버그 수정
└── chore/xxx 설정, 문서 기타
```

## 커밋 메시지 규칙

```
[날짜] type: 작업 내용

예시:
[2026-05-28] feat: AI 스타일 진단 기능 추가
[2026-05-28] fix: CartIcon Hydration 오류 수정
[2026-05-28] docs: README 포트폴리오 요약본 추가
[2026-05-28] chore: docker-compose 포트 변경
```

## AI(Claude) Git 규칙

```
1. 작업 완료
2. Claude → 변경 파일 목록 + 커밋 메시지 제안
3. 사용자 검토 및 승인
4. git add → git commit 실행
5. push는 사용자가 직접 실행
```

**Claude는 절대 임의로 push 하지 않는다.**

## 작업 로그

| 날짜 | 작업 내용 | 타입 |
|------|----------|------|
| 2026-05-28 | 하네스 MD 파일 전면 정리 | chore |
| 2026-05-28 | 포트폴리오 페이지 밝은 테마 개선 | style |
| 2026-05-28 | 포트폴리오 페이지 추가 (/portfolio) | feat |
| 2026-05-28 | README 포트폴리오 요약본 추가 | docs |
| 2026-05-28 | 404 이미지 URL 교체 | fix |
| 2026-05-28 | StyleQuiz 타입 분리 | fix |
| 2026-05-26 | AI 스타일 진단 기능 추가 | feat |
| 2026-05-26 | error.tsx / loading.tsx 추가 | feat |
| 2026-05-26 | docker-compose 포트 80:3000 변경 | chore |
| 2026-05-21 | Supabase Auth 연동 | feat |
| 2026-05-21 | 주문/결제, 장바구니, AI 챗봇 구현 | feat |
| 2026-05-21 | 초기 프로젝트 구조 세팅 | chore |
