/**
 * app/style-quiz/page.tsx — AI 스타일 진단 페이지 (다크모드 지원)
 */

import type { Metadata } from 'next'
import { StyleQuiz } from '@/components/features/style/StyleQuiz'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI 스타일 진단',
  description: '4가지 질문으로 나만의 스타일 유형을 찾아보세요.',
}

export default async function StyleQuizPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950">
      <div className="bg-gray-950 text-white py-14 text-center space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">
          AI Personal Stylist
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold">나의 스타일 유형은?</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
          4가지 질문에 답하면 AI가 나만의 스타일을 분석하고
          <br />맞춤 코디와 상품을 추천해드려요
        </p>
      </div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {user ? <StyleQuiz /> : (
          <div className="space-y-4 text-center text-gray-700 dark:text-gray-200">
            <p>스타일 진단은 로그인한 회원만 이용할 수 있어요.</p>
            <Link href="/login?callbackUrl=/style-quiz" className="inline-block rounded-xl bg-gray-900 px-6 py-3 text-white dark:bg-white dark:text-gray-900">
              로그인하고 스타일 진단하기
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
