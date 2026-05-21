/**
 * app/products/page.tsx — 상품 목록 페이지 (/products)
 *
 * 실무 패턴 - Server Component로 데이터 fetch:
 * - 이 컴포넌트는 서버에서 실행되므로 DB, API 직접 호출 가능
 * - SEO에 유리 (검색 엔진이 상품 데이터를 크롤링 가능)
 * - 현재는 mock 데이터 사용, 추후 실제 API로 교체 예정
 */

import type { Metadata } from 'next'
import { ProductListView } from '@/components/features/product/ProductListView'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

// 페이지별 SEO 메타데이터 설정
// layout.tsx의 template에 의해 "상품 목록 | MyShop" 으로 표시됨
export const metadata: Metadata = {
  title: '상품 목록',
  description: '다양한 패션 아이템을 만나보세요.',
}

export default async function ProductsPage() {
  /**
   * 실무에서는 여기서 API를 호출합니다:
   * const products = await fetch('https://api.example.com/products').then(r => r.json())
   *
   * 지금은 mock 데이터 사용
   * async 함수로 만들어두면 나중에 API 교체가 쉽습니다
   */
  const products = MOCK_PRODUCTS

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 페이지 타이틀 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">상품 목록</h1>
        <p className="text-gray-500 mt-1">트렌디한 패션 아이템을 만나보세요</p>
      </div>

      {/*
        ProductListView: Client Component
        - 카테고리 필터 상태(useState) 관리
        - 필터링 된 상품 목록 렌더링
        - Server Component에서 가져온 products 데이터를 props로 전달
      */}
      <ProductListView products={products} />
    </div>
  )
}
