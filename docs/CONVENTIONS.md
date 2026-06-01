# CONVENTIONS.md — 코딩 컨벤션

> 하네스 엔지니어링 원칙: 공유 유틸리티를 직접 구현 대신 사용해서 불변조건을 중앙화한다.

## 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `ProductCard.tsx` |
| 일반 파일/폴더 | kebab-case | `mock-data.ts`, `style-quiz/` |
| 컴포넌트 함수 | PascalCase | `function ProductCard()` |
| 변수/함수 | camelCase | `const totalPrice` |
| 상수 | UPPER_SNAKE_CASE | `MAX_ITEMS_PER_PAGE` |
| 타입/인터페이스 | PascalCase | `Product`, `OrderItem` |

## 컴포넌트 작성

```tsx
// ✅ 올바른 예시
interface ProductCardProps {
  product: Product  // any 금지, 명확한 타입
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="rounded-lg border p-4">  {/* Tailwind, 인라인 style 지양 */}
      {/* 내용 */}
    </div>
  )
}

// ❌ 잘못된 예시
export default function ProductCard(props: any) {  // any, default export 금지
  return <div style={{ padding: '16px' }}>...</div>  // 인라인 style 금지
}
```

## className 병합

```tsx
// cn() 유틸 사용 (clsx 기반)
import { cn } from '@/lib/utils'

className={cn(
  '기본 스타일',
  isActive && '조건부 스타일',
  className  // 외부 override 허용
)}
```

## Import 순서

```tsx
// 1. React/Next
import { useState } from 'react'
import Link from 'next/link'

// 2. 외부 라이브러리
import { useCartStore } from '@/store/cartStore'

// 3. 내부 컴포넌트
import { Button } from '@/components/ui/Button'

// 4. 타입 (type 키워드 명시)
import type { Product } from '@/types/product'
```

## Server vs Client Component

```tsx
// Server Component (기본값, 'use client' 없음)
// → 데이터 fetch, SEO, 인증 체크에 사용

// Client Component ('use client' 필수)
// → useState, useEffect, 이벤트 핸들러, Zustand 스토어

// 패턴: 최소한의 범위만 Client로
// Server에서 data fetch → Client에 props로 전달
```

## 커밋 메시지

```
[날짜] type: 작업 내용

type 종류:
  feat   새 기능
  fix    버그 수정
  style  UI/스타일 변경 (기능 변경 없음)
  refactor 코드 개선 (기능 변경 없음)
  docs   문서 변경
  chore  설정, 패키지, 기타

예시:
  [2026-05-28] feat: AI 스타일 진단 기능 추가
  [2026-05-28] fix: CartIcon Hydration 오류 수정
```
