/**
 * not-found.tsx — 커스텀 404 페이지
 *
 * Next.js App Router에서 notFound() 호출 시 또는
 * 존재하지 않는 URL 접근 시 자동으로 이 페이지가 표시됩니다.
 */

import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* 일러스트 영역 */}
        <div className="relative mx-auto w-48 h-48">
          {/* 배경 원 */}
          <div className="absolute inset-0 rounded-full bg-gray-50 border-2 border-dashed border-gray-200" />
          {/* 아이콘 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="text-6xl">🛍️</span>
          </div>
        </div>

        {/* 텍스트 영역 */}
        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
            Error 404
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            페이지를 찾을 수 없어요
          </h1>
          <p className="text-gray-500 leading-relaxed">
            찾으시는 페이지가 삭제되었거나 주소가 잘못 입력되었어요.
            <br />
            아래 버튼을 눌러 쇼핑을 계속해보세요.
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              홈으로 가기
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" className="w-full sm:w-auto">
              상품 둘러보기 →
            </Button>
          </Link>
        </div>

        {/* 도움말 링크 */}
        <p className="text-xs text-gray-400">
          문제가 계속된다면{' '}
          <button className="underline underline-offset-2 hover:text-gray-600 transition-colors">
            고객센터
          </button>
          로 문의해주세요.
        </p>

      </div>
    </div>
  )
}
