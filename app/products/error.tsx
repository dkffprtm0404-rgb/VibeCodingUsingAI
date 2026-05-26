'use client'
/**
 * app/products/error.tsx — 상품 페이지 에러 바운더리
 * 상품 목록/상세 페이지에서 에러 발생 시 표시
 */

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ProductsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[ProductsError]', error)
  }, [error])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p className="text-5xl mb-4">🛍️</p>
      <h2 className="text-xl font-bold text-gray-900 mb-2">상품을 불러오지 못했어요</h2>
      <p className="text-gray-500 text-sm mb-8">잠시 후 다시 시도해주세요.</p>
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={reset}>다시 시도</Button>
        <Link href="/"><Button>홈으로</Button></Link>
      </div>
    </div>
  )
}
