/**
 * page.tsx — 홈 페이지 (/)
 *
 * Next.js App Router에서 page.tsx는 해당 경로의 페이지 컴포넌트입니다.
 * Server Component가 기본값 ('use client' 없으면 서버에서 렌더링).
 */

import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    // 히어로 섹션: 사이트 접속 시 첫 화면
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center">
      {/* 100vh - 헤더 높이(64px) = 실제 컨텐츠 영역 */}

      <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        트렌디한 패션을
        <br />
        <span className="text-gray-400">한 곳에서</span>
      </h1>

      <p className="text-lg text-gray-500 mb-10 max-w-md">
        매일 새로운 스타일을 발견하세요. 클래식부터 모던까지 다양한 패션 아이템이 준비되어 있습니다.
      </p>

      {/* Link + Button 조합: 네비게이션 + 버튼 스타일 */}
      <Link href="/products">
        <Button size="lg">
          쇼핑 시작하기 →
        </Button>
      </Link>
    </section>
  )
}
