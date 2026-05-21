/**
 * app/login/page.tsx — 로그인 페이지 (/login)
 *
 * Server Component: 이미 로그인된 상태면 홈으로 리다이렉트
 * 폼 렌더링은 Client Component(LoginForm)에 위임
 */

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { LoginForm } from '@/components/features/auth/LoginForm'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '로그인',
}

export default async function LoginPage() {
  // 이미 로그인된 상태면 홈으로 보내기
  const session = await auth()
  if (session) redirect('/')

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">

        {/* 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">

          {/* 헤더 */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
            <p className="text-sm text-gray-500">MyShop에 오신 걸 환영해요</p>
          </div>

          {/* 로그인 폼 */}
          {/*
            Suspense: useSearchParams() 사용하는 Client Component를
            감싸야 하는 Next.js 요구사항
          */}
          <Suspense fallback={<div className="h-64 animate-pulse bg-gray-50 rounded-xl" />}>
            <LoginForm />
          </Suspense>

        </div>
      </div>
    </div>
  )
}
