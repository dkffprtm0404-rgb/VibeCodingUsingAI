/**
 * app/products/page.tsx — 상품 목록 페이지
 */

import type { Metadata } from 'next'
import { ProductListView } from '@/components/features/product/ProductListView'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: '상품 목록',
  description: '패션부터 뷰티, 스포츠, 킥스와 키즈까지 나만의 취향을 찾아보세요.',
}

export default async function ProductsPage() {
  const products = MOCK_PRODUCTS

  return (
    <div className="shop-page py-10 sm:py-14">
      <ProductListView products={products} />
    </div>
  )
}
