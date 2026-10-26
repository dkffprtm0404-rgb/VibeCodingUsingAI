'use client'
/**
 * app/orders/error.tsx — 주문 에러 바운더리 (다크모드 지원)
 */

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function OrdersError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error('[OrdersError]', error) }, [error])

  return (
    <div className="shop-page py-12 sm:py-20">
      <div className="shop-surface mx-auto max-w-2xl px-5 py-14 text-center sm:px-10">
        <p className="shop-kicker mb-5">A moment to reconnect</p>
        <h2 className="mb-3 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">주문 정보를 불러오지 못했어요</h2>
        <p className="shop-muted mb-8 text-sm">잠시 후 다시 시도해주세요.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={reset}>다시 시도</Button>
          <Link href="/products" className="shop-primary-link">쇼핑 계속하기</Link>
        </div>
      </div>
    </div>
  )
}
