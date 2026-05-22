'use client'
/**
 * ChatBot.tsx — AI 쇼핑 도우미 챗봇
 *
 * 상품 추천 시 텍스트 + 상품 카드 형태로 표시합니다.
 */

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
  recommendedProducts?: Product[]  // 추천 상품 카드 데이터
}

const SUGGESTIONS = [
  '따뜻한 아우터 추천해줘',
  '5만원 이하 상품 뭐 있어?',
  '청바지랑 어울리는 상의',
]

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '안녕하세요! MyShop 쇼핑 도우미예요 🛍️\n어떤 상품을 찾고 계신가요?',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content }
    // API에는 텍스트만 전달 (상품 카드 제외)
    const apiMessages = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }))

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.content ?? '죄송해요, 다시 시도해주세요.',
          recommendedProducts: data.recommendedProducts ?? [],
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '일시적인 오류가 발생했어요. 다시 시도해주세요 😅' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      {/* 챗봇 창 */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 max-h-[620px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">

          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gray-900 text-white flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-base">🤖</div>
              <div>
                <p className="text-sm font-semibold">쇼핑 도우미</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <p className="text-[10px] text-gray-400">AI가 상품을 추천해드려요</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[85%] space-y-2">
                  {/* 말풍선 */}
                  <div className={`
                    px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line
                    ${msg.role === 'user'
                      ? 'bg-gray-900 text-white rounded-br-sm ml-auto'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }
                  `}>
                    {msg.content}
                  </div>

                  {/* 추천 상품 카드 */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="space-y-2 mt-1">
                      {msg.recommendedProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex gap-3 p-2.5 bg-white border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-sm transition-all group"
                        >
                          {/* 상품 이미지 */}
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              sizes="56px"
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          {/* 상품 정보 */}
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <p className="text-xs font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
                            <p className="text-sm font-bold text-gray-900 mt-1">{formatPrice(product.price)}</p>
                          </div>
                          {/* 화살표 */}
                          <div className="flex items-center text-gray-300 group-hover:text-gray-600 transition-colors flex-shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* 로딩 */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 빠른 질문 */}
          {messages.length === 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* 입력창 */}
          <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t border-gray-100 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-400 focus:bg-white transition-all placeholder:text-gray-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-6 w-14 h-14 rounded-full shadow-lg z-50 flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110 active:scale-95 bg-gray-900"
        aria-label="쇼핑 도우미 열기"
      >
        {isOpen ? '✕' : '🤖'}
      </button>
    </>
  )
}
