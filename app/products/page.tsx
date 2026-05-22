/**
 * app/products/page.tsx — 상품 목록 페이지
 */

import type { Metadata } from 'next'
import { ProductListView } from '@/components/features/product/ProductListView'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: '상품 목록',
  description: '다양한 패션 아이템을 만나보세요.',
}

export default async function ProductsPage() {
  const products = MOCK_PRODUCTS

  return (
    <div>
      {/* 페이지 헤더 배너 */}
      <div className="bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Collection</p>
          <h1 className="text-3xl font-bold">상품 목록</h1>
          <p className="text-gray-500 mt-2 text-sm">트렌디한 패션 아이템을 만나보세요</p>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ProductListView products={products} />
      </div>
    </div>
  )
}
