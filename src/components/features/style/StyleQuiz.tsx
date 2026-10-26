'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { usePersonalization } from '@/hooks/usePersonalization'
import { useStyleQuiz } from '@/hooks/useStyleQuiz'
import { cn, formatPrice } from '@/lib/utils'
import type { StyleQuizAnswer } from '@/types/style'

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

export function StyleQuiz() {
  const [showResult, setShowResult] = useState(true)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Partial<StyleQuizAnswer>>({})
  const { result, products, analyze, isAnalyzing, error, loginRequired, clearError } = useStyleQuiz()
  const { clearProfile } = usePersonalization()
  const progress = (currentQ / QUESTIONS.length) * 100

  const handleSelect = async (value: string) => {
    const key = QUESTIONS[currentQ].key
    const newAnswers = { ...answers, [key]: value }
    setAnswers(newAnswers)

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      if (await analyze(newAnswers)) setShowResult(true)
    }
  }

  const handleRestart = () => {
    setShowResult(false)
    setCurrentQ(0)
    setAnswers({})
    clearError()
  }

  if (isAnalyzing) {
    return (
      <section className="shop-surface px-6 py-16 text-center sm:px-10" role="status" aria-live="polite">
        <div className="mx-auto mb-7 flex size-20 items-center justify-center rounded-full bg-sage-100 text-sage-800 dark:bg-sage-900/40 dark:text-sage-200">
          <span className="size-8 rounded-full border-2 border-sage-300 border-t-sage-800 motion-safe:animate-spin dark:border-sage-700 dark:border-t-sage-200" aria-hidden="true" />
        </div>
        <p className="shop-kicker">Finding your style</p>
        <h2 className="shop-heading mt-3 text-2xl">당신의 취향을 살펴보고 있어요</h2>
        <p className="shop-muted mx-auto mt-3 max-w-sm text-sm leading-relaxed">
          네 가지 답변으로 스타일과 코디를 제안해드려요. 잠시만 기다려주세요.
        </p>
      </section>
    )
  }

  if (!showResult || !result) {
    const q = QUESTIONS[currentQ]
    return (
      <section className="shop-surface p-5 sm:p-9" aria-labelledby="style-question">
        <div className="mb-9 space-y-3">
          <div className="flex items-center justify-between gap-3 text-xs font-medium">
            <span className="shop-kicker">Your preference</span>
            <span className="shop-muted" aria-live="polite">질문 {currentQ + 1} / {QUESTIONS.length}</span>
          </div>
          <progress value={currentQ} max={QUESTIONS.length} aria-label={`스타일 진단 진행률 ${Math.round(progress)}%`}
            className="block h-2 w-full overflow-hidden rounded-full accent-sage-700 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-gray-100 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-sage-700 dark:[&::-webkit-progress-bar]:bg-gray-800" />
        </div>
        <div className="mb-7 space-y-3 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-sage-50 text-3xl dark:bg-sage-900/30" aria-hidden="true">{q.emoji}</span>
          <h2 id="style-question" className="shop-heading text-xl sm:text-2xl">{q.title}</h2>
          <p className="shop-muted text-sm">가장 마음에 드는 하나를 선택해주세요.</p>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}
        {loginRequired && (
          <Link href="/login?callbackUrl=/style-quiz" className="mb-5 flex min-h-11 items-center justify-center rounded-xl bg-sage-800 px-4 py-3 text-center text-sm font-semibold text-white dark:bg-sage-200 dark:text-sage-950">
            로그인하고 스타일 진단하기
          </Link>
        )}

        <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2" role="group" aria-labelledby="style-question">
          {q.options.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              aria-pressed={answers[q.key] === opt.value}
              className={cn(
                'group flex min-h-32 items-center gap-4 rounded-2xl border p-5 text-left transition-colors sm:min-h-36 sm:flex-col sm:gap-2 sm:text-center',
                answers[q.key] === opt.value
                  ? 'border-sage-600 bg-sage-50 dark:border-sage-400 dark:bg-sage-900/30'
                  : 'border-gray-200 bg-white hover:border-sage-500 hover:bg-sage-50/60 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-sage-400 dark:hover:bg-sage-900/20',
              )}
            >
              <span className="text-2xl" aria-hidden="true">{opt.emoji}</span>
              <span className="space-y-1">
                <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{opt.label}</span>
                <span className="shop-muted block text-xs">{opt.desc}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <Button variant="ghost" size="sm" disabled={currentQ === 0} onClick={() => setCurrentQ(currentQ - 1)}>
            ← 이전 질문
          </Button>
          {result && <Button variant="ghost" size="sm" onClick={() => { clearError(); setShowResult(true) }}>이전 진단 결과 보기</Button>}
        </div>
        <p className="shop-muted mt-5 border-t border-gray-100 pt-5 text-xs leading-relaxed dark:border-gray-800">
          진단 결과는 현재 로그인 계정으로 이 탭에 저장돼요. 새 진단이 완료될 때까지 이전 결과가 유지됩니다.
        </p>
      </section>
    )
  }

  return (
    <div className="space-y-5">
      <section className="shop-surface overflow-hidden p-6 text-center sm:p-10" aria-labelledby="style-result">
        <p className="shop-kicker">Your style, discovered</p>
        <div className="mx-auto my-5 flex size-24 items-center justify-center rounded-3xl bg-sage-100 text-5xl dark:bg-sage-900/40" aria-hidden="true">{result.emoji}</div>
        <h2 id="style-result" className="shop-heading text-2xl sm:text-3xl">{result.type}</h2>
        <p className="shop-muted mx-auto mt-4 max-w-md text-sm leading-relaxed">{result.description}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {[...new Set(result.keywords)].map((keyword) => (
            <span key={keyword} className="rounded-full bg-sage-50 px-3 py-1.5 text-xs font-medium text-sage-800 dark:bg-sage-900/40 dark:text-sage-200">#{keyword}</span>
          ))}
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        <section className="shop-surface p-6">
          <p className="shop-kicker">Outfit idea</p>
          <h3 className="shop-heading mb-3 mt-2 text-lg">이렇게 입어보세요</h3>
          <p className="shop-muted text-sm leading-relaxed">{result.coordi}</p>
        </section>
        <section className="rounded-3xl border border-sage-200 bg-sage-50 p-6 dark:border-sage-800 dark:bg-sage-900/25">
          <p className="shop-kicker">Styling note</p>
          <h3 className="shop-heading mb-3 mt-2 text-lg">작은 스타일링 팁</h3>
          <p className="text-sm leading-relaxed text-sage-900 dark:text-sage-200">{result.tip}</p>
        </section>
      </div>

      <section className="shop-surface p-5 sm:p-7" aria-labelledby="style-products">
        <p className="shop-kicker">Selected for you</p>
        <h3 id="style-products" className="shop-heading mb-2 mt-2 text-xl">진단으로 찾은 상품</h3>
        <p className="shop-muted mb-5 text-xs leading-relaxed">방금 진단한 스타일을 바탕으로 AI가 제안한 상품이에요.</p>
        {products.length > 0 ? (
          <div className="space-y-3">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-gray-100 p-3 transition-colors hover:border-sage-400 dark:border-gray-800 dark:hover:border-sage-600">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  <Image src={product.imageUrl} alt={product.name} fill sizes="80px"
                    className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <span className="shop-muted text-xs">{product.category}</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatPrice(product.price)}</p>
                </div>
                <span className="shop-muted pr-1" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-gray-50 p-5 dark:bg-gray-800/60">
            <p className="shop-heading text-sm">스타일 진단이 완료됐어요.</p>
            <p className="shop-muted mt-2 text-sm leading-relaxed">지금 구매 가능한 추천 상품이 없어요. 전체 셀렉션에서 마음에 드는 상품을 찾아보세요.</p>
            <Link href="/products" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-sage-800 underline underline-offset-4 dark:text-sage-200">전체 셀렉션 둘러보기 →</Link>
          </div>
        )}
      </section>

      <div className="space-y-3 pt-2">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="outline" size="lg" onClick={handleRestart}>다시 진단하기</Button>
          <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-sage-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-900 dark:bg-sage-200 dark:text-sage-950 dark:hover:bg-sage-100">홈에서 나의 추천 보기 →</Link>
        </div>
        <button type="button" onClick={() => { clearProfile(); handleRestart() }}
          className="shop-muted mx-auto flex min-h-11 items-center px-4 text-xs underline underline-offset-4">개인화 초기화</button>
      </div>
    </div>
  )
}
