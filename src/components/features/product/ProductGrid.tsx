/**
 * ProductGrid.tsx — 상품 목록 그리드 컴포넌트
 *
 * 상품 카드들을 그리드 레이아웃으로 배치하는 컴포넌트입니다.
 * ProductCard를 직접 렌더링하는 역할만 합니다. (단일 책임 원칙)
 */

import { ProductCard } from './ProductCard'
import type { Product } from '@/types/product'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  // 상품이 없을 때 빈 상태(Empty State) 처리
  // 실무에서 빈 상태 처리는 UX상 매우 중요합니다
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-4xl mb-4">🛍️</p>
        <p className="text-gray-500 text-lg font-medium">상품이 없습니다</p>
        <p className="text-gray-400 text-sm mt-1">다른 카테고리를 선택해보세요</p>
      </div>
    )
  }

  return (
    // 반응형 그리드: 모바일 1열 → 태블릿 2열 → 데스크탑 3~4열
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        // key: React가 리스트 아이템을 추적하기 위해 필수 (고유한 id 사용)
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
