'use client'
/**
 * StyleQuiz.tsx — AI 스타일 진단 퀴즈 컴포넌트
 *
 * 4단계 질문 → Claude AI 분석 → 스타일 유형 + 코디 추천 결과
 */

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { formatPrice, cn } from '@/lib/utils'
import type { Product } from '@/types/product'
import type { StyleResult, StyleQuizAnswer } from '@/app/api/style-quiz/route'

// 질문 데이터
const QUESTIONS = [
  {
    key: 'situation' as const,
    title: '주로 어떤 상황에 입나요?',
    emoji: '🗓️',
    options: [
      { value: '데일리 캐주얼', label: '데일리', emoji: '☀️', desc: '일상적인 외출' },
      { value: '출근/오피스', label: '오피스', emoji: '💼', desc: '직장이나 미팅' },
      { value: '데이트/약속', label: '데이트', emoji: '🌙', desc: '특별한 자리' },
      { value: '운동/활동적인 생활', label: '액티브', emoji: '⚡', desc: '움직임이 많은 날' },
    ],
  },
  {
    key: 'fit' as const,
    title: '어떤 핏을 선호하나요?',
    emoji: '👔',
    options: [
      { value: '오버핏 (넉넉하고 여유로운)', label: '오버핏', emoji: '🌊', desc: '편안하고 여유로운' },
      { value: '슬림핏 (몸에 맞는 라인)', label: '슬림핏', emoji: '✏️', desc: '깔끔한 실루엣' },
      { value: '레귤러핏 (딱 맞는 표준)', label: '레귤러', emoji: '⚖️', desc: '무난하고 균형잡힌' },
      { value: '와이드핏 (넓고 루즈한)', label: '와이드', emoji: '🎭', desc: '트렌디하고 개성있는' },
    ],
  },
  {
    key: 'vibe' as const,
    title: '선호하는 분위기는?',
    emoji: '✨',
    options: [
      { value: '미니멀/깔끔한', label: '미니멀', emoji: '⬜', desc: '심플하고 깔끔한' },
      { value: '캐주얼/편안한', label: '캐주얼', emoji: '😊', desc: '자연스럽고 편안한' },
      { value: '스트릿/트렌디한', label: '스트릿', emoji: '🔥', desc: '개성있고 힙한' },
      { value: '클래식/세련된', label: '클래식', emoji: '💎', desc: '우아하고 고급스러운' },
    ],
  },
  {
    key: 'color' as const,
    title: '좋아하는 색감은?',
    emoji: '🎨',
    options: [
      { value: '블랙/화이트/그레이 (무채색)', label: '무채색', emoji: '🖤', desc: '세련되고 타임리스' },
      { value: '베이지/브라운/카키 (어스톤)', label: '어스톤', emoji: '🌿', desc: '따뜻하고 자연스러운' },
      { value: '네이비/블루 (쿨톤)', label: '쿨톤', emoji: '🌊', desc: '시원하고 차분한' },
      { value: '다양한 컬러 (포인트)', label: '컬러풀', emoji: '🌈', desc: '밝고 활기찬' },
    ],
  },
]

type Step = 'quiz' | 'loading' | 'result'

export function StyleQuiz() {
  const [step, setStep] = useState<Step>('quiz')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Partial<StyleQuizAnswer>>({})
  const [result, setResult] = useState<StyleResult | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState('')

  const progress = ((currentQ) / QUESTIONS.length) * 100

  const handleSelect = async (value: string) => {
    const key = QUESTIONS[currentQ].key
    const newAnswers = { ...answers, [key]: value }
    setAnswers(newAnswers)

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      // 마지막 질문 → AI 분석 시작
      setStep('loading')
      try {
        const res = await fetch('/api/style-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAnswers),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setResult(data.result)
        setProducts(data.recommendedProducts)
        setStep('result')
      } catch {
        setError('분석 중 오류가 발생했어요. 다시 시도해주세요.')
        setStep('quiz')
        setCurrentQ(0)
        setAnswers({})
      }
    }
  }

  const handleReset = () => {
    setStep('quiz')
    setCurrentQ(0)
    setAnswers({})
    setResult(null)
    setProducts([])
    setError('')
  }

  // 퀴즈 단계
  if (step === 'quiz') {
    const q = QUESTIONS[currentQ]
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 진행바 */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{currentQ + 1} / {QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 질문 */}
        <div className="text-center space-y-2">
          <span className="text-4xl">{q.emoji}</span>
          <h2 className="text-xl font-bold text-gray-900">{q.title}</h2>
        </div>

        {/* 오류 메시지 */}
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        {/* 선택지 */}
        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="group flex flex-col items-center gap-2 p-5 bg-white border-2 border-gray-100
                         rounded-2xl hover:border-gray-900 hover:shadow-md transition-all duration-150
                         text-center"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-150">
                {opt.emoji}
              </span>
              <span className="font-semibold text-sm text-gray-900">{opt.label}</span>
              <span className="text-xs text-gray-400">{opt.desc}</span>
            </button>
          ))}
        </div>

        {/* 이전 버튼 */}
        {currentQ > 0 && (
          <button
            onClick={() => setCurrentQ(currentQ - 1)}
            className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← 이전 질문으로
          </button>
        )}
      </div>
    )
  }

  // 로딩 단계
  if (step === 'loading') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-16">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100 border-t-gray-900 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">🤖</div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">AI가 스타일을 분석하고 있어요</h2>
          <p className="text-gray-500 text-sm">답변을 바탕으로 맞춤 스타일을 찾고 있어요...</p>
        </div>
        {/* 로딩 단계 텍스트 */}
        <div className="flex flex-col gap-2 text-sm text-gray-400">
          {['스타일 패턴 분석 중...', '코디 조합 생성 중...', '맞춤 상품 선별 중...'].map((text, i) => (
            <p key={text} className="animate-pulse" style={{ animationDelay: `${i * 0.5}s` }}>
              {text}
            </p>
          ))}
        </div>
      </div>
    )
  }

  // 결과 단계
  if (step === 'result' && result) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">

        {/* 유형 카드 */}
        <div className="relative bg-gray-900 text-white rounded-3xl p-8 text-center space-y-4 overflow-hidden">
          {/* 배경 장식 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" />

          <div className="relative space-y-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">
              나의 스타일 유형
            </p>
            <div className="text-6xl">{result.emoji}</div>
            <h2 className="text-2xl font-bold">{result.type}</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
              {result.description}
            </p>
            {/* 키워드 */}
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {result.keywords.map((kw) => (
                <span key={kw} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">
                  # {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 추천 코디 */}
        <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <span>👗</span> 추천 코디
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{result.coordi}</p>
        </div>

        {/* 스타일링 팁 */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3">
          <span className="text-xl flex-shrink-0">💡</span>
          <div>
            <p className="text-xs font-semibold text-amber-700 mb-1">스타일링 TIP</p>
            <p className="text-sm text-amber-800">{result.tip}</p>
          </div>
        </div>

        {/* 추천 상품 */}
        {products.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span>🛍️</span> 당신을 위한 추천 상품
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center space-y-1">
                    <span className="text-xs text-gray-400">{product.category}</span>
                    <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                    <p className="font-bold text-gray-900">{formatPrice(product.price)}</p>
                  </div>
                  <div className="flex items-center text-gray-300 group-hover:text-gray-600 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" size="lg" className="flex-1" onClick={handleReset}>
            다시 진단하기
          </Button>
          <Link href="/products" className="flex-1">
            <Button size="lg" className="w-full">
              전체 상품 보기 →
            </Button>
          </Link>
        </div>

      </div>
    )
  }

  return null
}
