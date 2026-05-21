/**
 * app/products/[id]/page.tsx — 상품 상세 페이지 (/products/1, /products/2 ...)
 *
 * [id] = 동적 라우트 (Dynamic Route)
 * URL의 숫자가 자동으로 params.id 로 들어옵니다.
 * ex) /products/3 접속 → params.id = "3"
 *
 * 실무 패턴:
 * - Server Component에서 데이터 fetch (SEO 유리)
 * - notFound() 로 없는 상품 404 처리
 * - generateMetadata 로 상품별 SEO 메타데이터 동적 생성
 */

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { AddToCartSection } from '@/components/features/product/AddToCartSection'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { formatPrice, getStockStatus } from '@/lib/utils'

// Next.js가 동적 라우트 페이지에 넘겨주는 props 타입
interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

/**
 * generateMetadata — 페이지별 동적 SEO 메타데이터
 * 상품명, 설명을 검색 엔진에 노출시킵니다.
 * ex) "클래식 화이트 티셔츠 | MyShop"
 */
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const product = MOCK_PRODUCTS.find((p) => p.id === Number(id))

  // 상품이 없으면 기본 메타데이터 반환
  if (!product) return { title: '상품을 찾을 수 없습니다' }

  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params

  // id를 숫자로 변환해서 상품 찾기
  const product = MOCK_PRODUCTS.find((p) => p.id === Number(id))

  /**
   * notFound(): Next.js 내장 함수
   * 호출하면 자동으로 404 페이지로 이동합니다.
   * app/not-found.tsx 파일이 있으면 커스텀 404 페이지 표시
   */
  if (!product) notFound()

  const stockStatus = getStockStatus(product.stock)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* 뒤로가기 */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
      >
        ← 상품 목록으로
      </Link>

      {/* 상세 컨텐츠 — 좌(이미지) / 우(정보) 2열 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

        {/* 왼쪽: 상품 이미지 */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            // 상세 페이지 메인 이미지는 priority로 즉시 로드 (LCP 최적화)
            priority
          />
          {/* 품절 오버레이 */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="bg-white text-gray-900 font-bold text-lg px-6 py-2 rounded-full">
                품절
              </span>
            </div>
          )}
        </div>

        {/* 오른쪽: 상품 정보 */}
        <div className="flex flex-col space-y-6">

          {/* 카테고리 뱃지 */}
          <Badge variant="secondary">{product.category}</Badge>

          {/* 상품명 */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
            {product.name}
          </h1>

          {/* 가격 */}
          <p className="text-3xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>

          {/* 재고 상태 */}
          <p className={`text-sm font-medium ${stockStatus.color}`}>
            {stockStatus.label}
            {product.stock > 0 && product.stock <= 10 && (
              <span className="ml-2 text-gray-400">(잔여 {product.stock}개)</span>
            )}
          </p>

          {/* 구분선 */}
          <hr className="border-gray-200" />

          {/* 상품 설명 */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-700">상품 설명</h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* 구분선 */}
          <hr className="border-gray-200" />

          {/*
            장바구니 담기 섹션 — Client Component
            수량 선택 + 장바구니 버튼 (상호작용 필요)
          */}
          <AddToCartSection
            productId={product.id}
            productName={product.name}
            price={product.price}
            stock={product.stock}
          />
        </div>
      </div>
    </div>
  )
}
