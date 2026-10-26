import type { Metadata } from 'next'
import Link from 'next/link'
import { StyleQuiz } from '@/components/features/style/StyleQuiz'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'AI 스타일 진단',
  description: '4가지 질문으로 나만의 스타일 유형을 찾아보세요.',
}

export default async function StyleQuizPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <div className="shop-page mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="mx-auto mb-9 max-w-2xl text-center sm:mb-12">
        <p className="shop-kicker">AI Personal Stylist</p>
        <h1 className="shop-heading mt-4 text-3xl leading-tight sm:text-4xl">취향을 알면, 쇼핑이 더 쉬워져요.</h1>
        <p className="shop-muted mx-auto mt-4 max-w-md text-sm leading-relaxed sm:text-base">
          네 가지 질문으로 나만의 스타일을 발견하고,<br className="hidden sm:block" /> 어울리는 코디와 상품을 만나보세요.
        </p>
      </header>
      <div className="mx-auto max-w-2xl">
        {user ? <StyleQuiz /> : (
          <section className="shop-surface px-6 py-12 text-center sm:p-12">
            <span className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-sage-100 text-2xl dark:bg-sage-900/40" aria-hidden="true">🌿</span>
            <h2 className="shop-heading text-xl">나만의 스타일을 찾아볼까요?</h2>
            <p className="shop-muted mb-7 mt-3 text-sm leading-relaxed">로그인하면 AI 진단 결과를 이 탭에 보관하고<br />홈에서 추천 상품을 이어서 볼 수 있어요.</p>
            <Link href="/login?callbackUrl=/style-quiz" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-sage-800 px-6 py-3 text-sm font-semibold text-white hover:bg-sage-900 dark:bg-sage-200 dark:text-sage-950 dark:hover:bg-sage-100">
              로그인하고 스타일 진단하기
            </Link>
            <Link href="/products" className="shop-muted mx-auto mt-3 flex min-h-11 w-fit items-center px-3 text-sm underline underline-offset-4">먼저 상품 둘러보기 →</Link>
          </section>
        )}
      </div>
    </div>
  )
}
