/**
 * app/signup/page.tsx — 회원가입 페이지 (다크모드 지원)
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SignUpForm } from '@/components/features/auth/SignUpForm'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '회원가입' }

export default async function SignUpPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/')

  return (
    <div className="shop-page flex min-h-[75svh] items-center justify-center py-10 sm:py-16">
      <div className="grid w-full max-w-4xl gap-5 lg:grid-cols-2">
        <aside className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden rounded-3xl bg-sage-100 p-10 text-sage-950 lg:flex dark:bg-sage-900 dark:text-sage-50">
          <p className="text-xs font-medium tracking-[0.24em]">MYSHOP · A NEW CHAPTER</p>
          <div aria-hidden="true" className="absolute -left-20 top-36 size-72 rounded-full border border-sage-700/20 dark:border-sage-200/20" />
          <div aria-hidden="true" className="absolute -left-2 top-52 size-40 rounded-full border border-sage-700/20 dark:border-sage-200/20" />
          <div className="relative space-y-5">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/70 text-2xl text-sage-800 dark:bg-sage-800 dark:text-sage-100" aria-hidden="true">✳</span>
            <p className="text-4xl font-medium leading-[1.45] tracking-tight">새로운 취향과<br />만나는 첫인사.</p>
            <p className="max-w-xs text-sm leading-7 text-sage-800 dark:text-sage-200">나를 위한 스타일을 찾고,<br />좋아하는 순간을 옷장에 담아보세요.</p>
          </div>
          <p className="relative text-xs tracking-wider text-sage-700 dark:text-sage-300">Make room for your own style.</p>
        </aside>
        <div className="shop-surface space-y-8 p-6 sm:p-10">
          <div className="space-y-3">
            <p className="shop-kicker">Join the edit</p>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">회원가입</h1>
            <p className="shop-muted text-sm leading-6">나만의 스타일 여정을 MyShop과 함께 시작해요.</p>
          </div>
          <Suspense fallback={<div className="h-80 animate-pulse bg-gray-50 dark:bg-gray-800 rounded-xl" />}>
            <SignUpForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
