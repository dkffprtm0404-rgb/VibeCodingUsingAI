'use client'
/**
 * app/products/error.tsx — 상품 에러 바운더리 (다크모드 지원)
 */

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function ProductsError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error('[ProductsError]', error) }, [error])

  return (
    <div className="shop-page py-12 sm:py-20">
      <div className="shop-surface mx-auto max-w-2xl px-5 py-14 text-center sm:px-10">
        <p className="shop-kicker mb-5">A moment to reconnect</p>
        <h2 className="mb-3 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">상품을 불러오지 못했어요</h2>
        <p className="shop-muted mb-8 text-sm">잠시 후 다시 시도해주세요.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={reset}>다시 시도</Button>
          <Link href="/" className="shop-primary-link">홈으로</Link>
        </div>
      </div>
    </div>
  )
}
