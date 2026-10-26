'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import { useShoppingChat } from '@/hooks/useShoppingChat'
import { formatPrice } from '@/lib/utils'

const SUGGESTIONS = ['따뜻한 아우터 추천해줘', '5만원 이하 상품 뭐 있어?', '청바지랑 어울리는 상의']

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const messagesEnd = useRef<HTMLDivElement>(null)
  const { messages, input, setInput, isLoading, loginRequired, sendMessage } = useShoppingChat()

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (isOpen && !element.open) element.showModal()
    if (!isOpen && element.open) element.close()
    if (isOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = original }
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) messagesEnd.current?.scrollIntoView({ block: 'nearest' })
  }, [messages, isOpen])

  return (
    <>
      <button onClick={() => setIsOpen(true)} aria-label="쇼핑 도우미 열기" aria-haspopup="dialog"
        className="shop-chat-launcher fixed right-4 z-40 flex size-14 items-center justify-center rounded-full border border-white/10 bg-gray-900 text-sage-100 shadow-lg transition-transform hover:-translate-y-1 sm:right-6 dark:bg-sage-200 dark:text-gray-900">
        <Icon name="sparkles" className="size-6" />
      </button>
      <dialog ref={dialog} aria-labelledby="chat-title" className="shop-chat-panel"
        onCancel={() => setIsOpen(false)} onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return
          const bounds = event.currentTarget.getBoundingClientRect()
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setIsOpen(false)
        }}>
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-gray-700">
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-2xl bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-100"><Icon name="sparkles" /></span><div><h2 id="chat-title" className="text-sm font-semibold">나의 쇼핑 도우미</h2><p className="shop-muted mt-1 text-[10px]">취향에 맞는 상품을 함께 찾아요</p></div></div>
          <button onClick={() => setIsOpen(false)} aria-label="쇼핑 도우미 닫기" className="shop-icon-button"><Icon name="close" className="size-4" /></button>
        </div>
        <div role="log" aria-label="상담 대화" aria-live="polite" className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((message, index) => <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[90%] space-y-2">
              <div className={`rounded-2xl px-4 py-3 text-xs leading-6 whitespace-pre-line ${message.role === 'user' ? 'rounded-br-sm bg-gray-900 text-white dark:bg-sage-200 dark:text-gray-900' : 'rounded-bl-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}`}>{message.content}</div>
              {message.recommendedProducts?.map((product) => <Link key={product.id} href={`/products/${product.id}`} onClick={() => setIsOpen(false)} className="shop-surface flex items-center gap-3 p-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-gray-100"><Image src={product.imageUrl} alt="" fill sizes="56px" className="object-cover" /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{product.name}</p><p className="shop-muted mt-1 text-[11px]">{formatPrice(product.price)}</p></div><Icon name="chevron" className="size-3 shrink-0" />
              </Link>)}
            </div>
          </div>)}
          {isLoading && <p role="status" className="shop-muted flex items-center gap-2 text-xs"><Icon name="sparkles" className="size-4 animate-pulse" />어울리는 상품을 찾고 있어요...</p>}
          <div ref={messagesEnd} />
        </div>
        {messages.length === 1 && <div className="shop-chat-suggestions flex shrink-0 flex-wrap gap-1.5 px-4 pb-3">{SUGGESTIONS.map((suggestion) => <button key={suggestion} onClick={() => sendMessage(suggestion)} className="min-h-11 rounded-full border border-gray-200 px-3 text-[10px] hover:bg-sage-100 dark:border-gray-700 dark:hover:bg-gray-800">{suggestion}</button>)}</div>}
        {loginRequired && <Link href="/login" className="min-h-11 shrink-0 px-5 py-3 text-xs font-medium underline underline-offset-4">로그인하고 쇼핑 도우미 이용하기</Link>}
        <form onSubmit={(event) => { event.preventDefault(); void sendMessage(input) }} className="flex shrink-0 gap-2 border-t border-gray-200 p-3 dark:border-gray-700">
          <label htmlFor="shopping-message" className="sr-only">쇼핑 도우미에게 보낼 메시지</label>
          <input id="shopping-message" type="text" value={input} onChange={(event) => setInput(event.target.value)} placeholder="어떤 상품이 궁금하세요?" disabled={isLoading} className="shop-input flex-1 disabled:opacity-50" />
          <button type="submit" aria-label="메시지 보내기" disabled={!input.trim() || isLoading} className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-white disabled:opacity-35 dark:bg-sage-200 dark:text-gray-900"><Icon name="send" className="size-4" /></button>
        </form>
      </dialog>
    </>
  )
}
