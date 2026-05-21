/**
 * not-found.tsx — 커스텀 404 페이지
 *
 * Next.js App Router에서 app/not-found.tsx 파일을 만들면
 * notFound() 호출 시 또는 존재하지 않는 URL 접근 시 이 페이지가 표시됩니다.
 */

import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center">
      <p className="text-8xl font-bold text-gray-200 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        페이지를 찾을 수 없어요
      </h1>
      <p className="text-gray-500 mb-8">
        존재하지 않는 상품이거나 삭제된 페이지입니다.
      </p>
      <Link href="/products">
        <Button>상품 목록으로 돌아가기</Button>
      </Link>
    </div>
  )
}
