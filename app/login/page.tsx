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
  searchParams: Promise<{ signup?: string; confirmation?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/')

  const { signup, confirmation } = await searchParams

  return (
    <div className="shop-page flex min-h-[75svh] items-center justify-center py-10 sm:py-16">
      <div className="grid w-full max-w-4xl gap-5 lg:grid-cols-2">
        <aside className="relative hidden min-h-[560px] flex-col justify-between overflow-hidden rounded-3xl bg-gray-900 p-10 text-white lg:flex dark:bg-gray-800">
          <p className="text-xs font-medium tracking-[0.24em] text-sage-200">MYSHOP · YOUR DAILY EDIT</p>
          <div aria-hidden="true" className="absolute -right-20 top-24 size-72 rounded-full border border-sage-300/25" />
          <div aria-hidden="true" className="absolute -right-6 top-36 size-44 rounded-full bg-sage-300/15" />
          <div className="relative space-y-5">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-sage-200 text-2xl text-gray-900" aria-hidden="true">✳</span>
            <p className="text-4xl font-medium leading-[1.45] tracking-tight">취향을 발견하는<br />나만의 셀렉트숍.</p>
            <p className="max-w-xs text-sm leading-7 text-gray-300">마음에 드는 옷을 찜하고,<br />AI 스타일 진단으로 나를 알아가세요.</p>
          </div>
          <p className="relative text-xs tracking-wider text-gray-400">A little more you, every day.</p>
        </aside>
        <div className="shop-surface space-y-8 p-6 sm:p-10 lg:flex lg:flex-col lg:justify-center">
          <div className="space-y-3">
            <p className="shop-kicker">Welcome back</p>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">로그인</h1>
            <p className="shop-muted text-sm leading-6">다시 만나 반가워요. 나의 취향을 이어가 볼까요?</p>
          </div>

          {signup === 'success' && (
            <div className="rounded-2xl border border-sage-200 bg-sage-100 px-4 py-4 dark:border-sage-800 dark:bg-sage-900">
              <p className="text-sm leading-7 text-sage-800 dark:text-sage-100">
                확인 메일을 요청했어요. 가입할 때 사용한 브라우저에서 메일의 인증 링크를 열어주세요.
              </p>
            </div>
          )}

          {confirmation === 'error' && (
            <p role="alert" className="px-4 py-3 bg-red-50 dark:bg-red-950/40 rounded-xl text-sm text-red-700 dark:text-red-300">
              인증 링크가 만료되었거나 확인할 수 없어요. 이메일 확인을 마쳤다면 아래에서 로그인해주세요.
            </p>
          )}

          <Suspense fallback={<div className="h-64 animate-pulse bg-gray-50 dark:bg-gray-800 rounded-xl" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
