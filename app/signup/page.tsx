/**
 * app/signup/page.tsx — 회원가입 페이지 (Supabase Auth 버전)
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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">

          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
            <p className="text-sm text-gray-500">MyShop의 새 멤버가 되어보세요</p>
          </div>

          <Suspense fallback={<div className="h-80 animate-pulse bg-gray-50 rounded-xl" />}>
            <SignUpForm />
          </Suspense>

        </div>
      </div>
    </div>
  )
}
