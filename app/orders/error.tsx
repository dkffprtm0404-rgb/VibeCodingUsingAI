'use client'
/**
 * app/orders/error.tsx — 주문 페이지 에러 바운더리
 */

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function OrdersError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[OrdersError]', error)
  }, [error])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
      <p className="text-5xl mb-4">📦</p>
      <h2 className="text-xl font-bold text-gray-900 mb-2">주문 정보를 불러오지 못했어요</h2>
      <p className="text-gray-500 text-sm mb-8">잠시 후 다시 시도해주세요.</p>
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={reset}>다시 시도</Button>
        <Link href="/products"><Button>쇼핑 계속하기</Button></Link>
      </div>
    </div>
  )
}
