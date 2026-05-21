# CONVENTIONS.md — 코딩 컨벤션

## 네이밍 규칙
| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `ProductCard.tsx` |
| 일반 파일/폴더 | kebab-case | `product-list/` |
| 컴포넌트 함수 | PascalCase | `function ProductCard()` |
| 변수/함수 | camelCase | `const productList` |
| 상수 | UPPER_SNAKE_CASE | `MAX_ITEMS_PER_PAGE` |
| 타입/인터페이스 | PascalCase + I prefix (선택) | `Product`, `ICartItem` |

## 컴포넌트 작성 규칙
```tsx
// ✅ 올바른 예시
interface ProductCardProps {
  id: number
  name: string
  price: number
  imageUrl: string
}

export function ProductCard({ id, name, price, imageUrl }: ProductCardProps) {
  return (
    <div className="rounded-lg border p-4">
      {/* 내용 */}
    </div>
  )
}

// ❌ 잘못된 예시 - any 사용, default export, 인라인 스타일
export default function ProductCard(props: any) {
  return <div style={{ padding: '16px' }}>...</div>
}
```

## Import 순서
```tsx
// 1. React/Next
import { useState } from 'react'
import Link from 'next/link'

// 2. 외부 라이브러리
import { useQuery } from '@tanstack/react-query'

// 3. 내부 컴포넌트
import { Button } from '@/components/ui/Button'

// 4. 타입
import type { Product } from '@/types/product'

// 5. 스타일 (필요시)
import styles from './styles.module.css'
```

## 파일 구조 (컴포넌트)
```
components/features/product/
├── ProductCard.tsx       # 컴포넌트
├── ProductCard.test.tsx  # 테스트 (추후)
└── index.ts              # re-export
```

## 커밋 메시지 규칙
```
feat: 상품 목록 페이지 추가
fix: 장바구니 수량 버그 수정
style: ProductCard 레이아웃 수정
refactor: 상품 fetching 로직 분리
docs: README 업데이트
chore: 패키지 업데이트
```
