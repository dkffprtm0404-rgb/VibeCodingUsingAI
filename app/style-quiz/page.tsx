/**
 * app/style-quiz/page.tsx — AI 스타일 진단 페이지 (/style-quiz)
 */

import type { Metadata } from 'next'
import { StyleQuiz } from '@/components/features/style/StyleQuiz'

export const metadata: Metadata = {
  title: 'AI 스타일 진단',
  description: '4가지 질문으로 나만의 스타일 유형을 찾아보세요.',
}

export default function StyleQuizPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      {/* 헤더 */}
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

      {/* 퀴즈 */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <StyleQuiz />
      </div>
    </div>
  )
}
