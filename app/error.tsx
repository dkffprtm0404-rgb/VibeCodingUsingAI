'use client'
/**
 * app/error.tsx — 전역 에러 바운더리 (다크모드 지원)
 */

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div className="shop-page flex min-h-[65vh] items-center justify-center">
      <div className="shop-surface w-full max-w-lg space-y-8 p-8 text-center sm:p-12">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-red-50 dark:bg-red-950/30 border-2 border-dashed border-red-200 dark:border-red-800" />
          <div className="absolute inset-0 flex items-center justify-center text-4xl">⚠️</div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-widest text-red-400 uppercase">Error</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">문제가 발생했어요</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            일시적인 오류가 발생했어요.<br />잠시 후 다시 시도해주세요.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg font-mono">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" size="lg" onClick={reset} className="w-full sm:w-auto">다시 시도</Button>
          <Link href="/" className="shop-primary-link w-full sm:w-auto">홈으로 가기</Link>
        </div>
      </div>
    </div>
  )
}
