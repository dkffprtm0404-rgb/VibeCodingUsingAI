'use client'
/**
 * error.tsx — 전역 에러 바운더리
 *
 * Next.js App Router에서 페이지/컴포넌트에서 에러 발생 시
 * 전체 앱이 터지지 않고 이 화면을 보여줍니다.
 *
 * 'use client' 필수 — useEffect로 에러 로깅 처리
 */

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void // 에러 복구 시도 함수 (Next.js 제공)
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 실무에서는 Sentry 등 에러 모니터링 서비스로 전송
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">

        {/* 아이콘 */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-red-50 border-2 border-dashed border-red-200" />
          <div className="absolute inset-0 flex items-center justify-center text-4xl">⚠️</div>
        </div>

        {/* 텍스트 */}
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-widest text-red-400 uppercase">
            Error
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            문제가 발생했어요
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            일시적인 오류가 발생했어요.
            <br />
            잠시 후 다시 시도해주세요.
          </p>
          {/* 개발 환경에서만 에러 메시지 표시 */}
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-red-400 bg-red-50 px-3 py-2 rounded-lg font-mono">
              {error.message}
            </p>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* reset: 에러가 난 컴포넌트를 다시 렌더링 시도 */}
          <Button variant="outline" size="lg" onClick={reset} className="w-full sm:w-auto">
            다시 시도
          </Button>
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              홈으로 가기
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
