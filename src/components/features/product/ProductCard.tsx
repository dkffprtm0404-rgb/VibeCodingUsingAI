/**
 * ProductCard.tsx — 상품 카드 컴포넌트
 *
 * 상품 목록에서 각 상품을 카드 형태로 보여주는 컴포넌트입니다.
 * 실무 패턴:
 * - Next.js Image 컴포넌트 사용 (자동 최적화)
 * - Next.js Link 컴포넌트 사용 (클라이언트 사이드 라우팅)
 * - Server Component로 작성 (상호작용 없으므로 'use client' 불필요)
 */

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, getStockStatus } from '@/lib/utils'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // 재고 상태 계산 (유틸 함수 활용)
  const stockStatus = getStockStatus(product.stock)
  const isSoldOut = product.stock === 0

  return (
    // Link로 감싸면 카드 전체가 클릭 가능한 링크가 됩니다
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
    >
      {/* 상품 이미지 영역 */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill // fill: 부모 크기에 꽉 차게 (width/height 대신)
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          // sizes: 브라우저가 적절한 크기의 이미지를 로드하도록 힌트 제공 (성능 최적화)
          className={`
            object-cover transition-transform duration-300
            group-hover:scale-105
            ${isSoldOut ? 'opacity-50' : ''}
          `}
        />

        {/* 품절 오버레이 */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="bg-white text-gray-900 text-sm font-semibold px-3 py-1 rounded-full">
              품절
            </span>
          </div>
        )}

        {/* 카테고리 뱃지 (이미지 위에 오버레이) */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary">{product.category}</Badge>
        </div>
      </div>

      {/* 상품 정보 영역 */}
      <div className="p-4 space-y-1">
        {/* 상품명 */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors">
          {/* line-clamp-2: 2줄 초과 시 ... 처리 */}
          {product.name}
        </h3>

        {/* 가격 */}
        <p className="text-base font-bold text-gray-900">
          {formatPrice(product.price)}
        </p>

        {/* 재고 상태 */}
        <p className={`text-xs ${stockStatus.color}`}>
          {stockStatus.label}
        </p>
      </div>
    </Link>
  )
}
