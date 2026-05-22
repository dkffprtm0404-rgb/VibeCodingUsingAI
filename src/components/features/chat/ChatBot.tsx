'use client'
/**
 * ChatBot.tsx — AI 쇼핑 도우미 챗봇 UI
 *
 * 우측 하단 플로팅 버튼으로 열고 닫을 수 있습니다.
 * 실무에서 자주 쓰이는 채팅 UI 패턴입니다.
 */

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  '겨울 아우터 추천해줘',
  '5만원 이하 상품 있어?',
  '청바지랑 어울리는 상의 추천',
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

  // 새 메시지 올 때마다 스크롤 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()

      if (data.content) {
        setMessages([...newMessages, { role: 'assistant', content: data.content }])
      }
    } catch {
      setMessages([...newMessages, {
        role: 'assistant',
        content: '죄송해요, 일시적인 오류가 발생했어요. 다시 시도해주세요 😅',
      }])
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
        <div className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">

          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gray-900 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">🤖</div>
              <div>
                <p className="text-sm font-semibold">쇼핑 도우미</p>
                <p className="text-[10px] text-gray-400">AI가 상품을 추천해드려요</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-xl">
              ×
            </button>
          </div>

          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 max-h-96">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line
                  ${msg.role === 'user'
                    ? 'bg-gray-900 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }
                `}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* 로딩 인디케이터 */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 빠른 질문 (첫 메시지만) */}
          {messages.length === 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
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
          <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t border-gray-100">
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
        className={`
          fixed bottom-6 right-4 sm:right-6 w-14 h-14 rounded-full shadow-lg z-50
          flex items-center justify-center text-2xl
          transition-all duration-200 hover:scale-110 active:scale-95
          ${isOpen ? 'bg-gray-700 rotate-0' : 'bg-gray-900'}
        `}
        aria-label="쇼핑 도우미 열기"
      >
        {isOpen ? '✕' : '🤖'}
      </button>
    </>
  )
}
