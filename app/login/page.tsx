/**
 * app/login/page.tsx — 로그인 페이지 (다크모드 지원)
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LoginForm } from '@/components/features/auth/LoginForm'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '로그인' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ signup?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/')

  const { signup } = await searchParams

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 space-y-8">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">로그인</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">MyShop에 오신 걸 환영해요</p>
          </div>

          {signup === 'success' && (
            <div className="px-4 py-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl">
              <p className="text-sm text-green-700 dark:text-green-300 text-center">
                🎉 회원가입 완료! 이메일을 확인한 후 로그인해주세요.
              </p>
            </div>
          )}

          <Suspense fallback={<div className="h-64 animate-pulse bg-gray-50 dark:bg-gray-800 rounded-xl" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
