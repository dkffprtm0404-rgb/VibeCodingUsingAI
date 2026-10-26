'use client'

import { useRef, useState } from 'react'
import { ApiError, chatApi } from '@/lib/api'
import type { Product } from '@/types/product'

interface ShoppingMessage {
  role: 'user' | 'assistant'
  content: string
  recommendedProducts?: Product[]
}

export function useShoppingChat() {
  const [messages, setMessages] = useState<ShoppingMessage[]>([
    { role: 'assistant', content: '안녕하세요. 당신의 취향을 함께 찾아드릴게요. 어떤 아이템을 찾고 계신가요?' },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginRequired, setLoginRequired] = useState(false)
  const pending = useRef(false)

  const sendMessage = async (value: string) => {
    const content = value.trim()
    if (!content || pending.current) return
    pending.current = true
    const userMessage: ShoppingMessage = { role: 'user', content }
    const apiMessages = [...messages, userMessage].map(({ role, content }) => ({ role, content }))
    setMessages((previous) => [...previous, userMessage])
    setInput('')
    setIsLoading(true)
    setLoginRequired(false)
    try {
      const data = await chatApi.send(apiMessages)
      setMessages((previous) => [...previous, {
        role: 'assistant', content: data.content ?? '답변을 받지 못했어요. 다시 시도해주세요.',
        recommendedProducts: data.recommendedProducts ?? [],
      }])
    } catch (error) {
      setLoginRequired(error instanceof ApiError && error.status === 401)
      setMessages((previous) => [...previous, {
        role: 'assistant', content: error instanceof ApiError ? error.message : '잠시 연결이 원활하지 않아요. 다시 시도해주세요.',
      }])
    } finally {
      pending.current = false
      setIsLoading(false)
    }
  }
  return { messages, input, setInput, isLoading, loginRequired, sendMessage }
}
