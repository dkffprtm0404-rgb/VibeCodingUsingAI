/**
 * api.ts — 공통 API fetch 함수
 *
 * 하네스 원칙: 반복되는 패턴은 추상화한다.
 * fetch + JSON 파싱 + 에러 처리가 컴포넌트마다 중복되므로 중앙화.
 */

import { API_ROUTES } from '@/constants'

// API 에러 타입
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// 공통 fetch 래퍼
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new ApiError(res.status, data.error ?? '요청에 실패했어요.')
  return data as T
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<{ user: { id: string; email: string } }>(API_ROUTES.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (name: string, email: string, password: string) =>
    fetchApi<{ autoLogin?: boolean; requireLogin?: boolean }>(API_ROUTES.AUTH.SIGNUP, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  logout: () =>
    fetchApi<{ success: boolean }>(API_ROUTES.AUTH.LOGOUT, { method: 'POST' }),
}

// Wishlist API
export const wishlistApi = {
  getAll: () =>
    fetchApi<{ productIds: number[] }>(API_ROUTES.WISHLIST),

  add: (productId: number) =>
    fetchApi<{ success: boolean }>(API_ROUTES.WISHLIST, {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),

  remove: (productId: number) =>
    fetchApi<{ success: boolean }>(API_ROUTES.WISHLIST, {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    }),
}

// Chat API
export const chatApi = {
  send: (messages: { role: string; content: string }[]) =>
    fetchApi<{ content: string; recommendedProducts: unknown[] }>(API_ROUTES.CHAT, {
      method: 'POST',
      body: JSON.stringify({ messages }),
    }),
}

// Style Quiz API
export const styleQuizApi = {
  analyze: (answers: Record<string, string>) =>
    fetchApi<{ result: unknown; recommendedProducts: unknown[] }>(API_ROUTES.STYLE_QUIZ, {
      method: 'POST',
      body: JSON.stringify(answers),
    }),
}

// Orders API
export const ordersApi = {
  create: (payload: Record<string, unknown>) =>
    fetchApi<{ orderId: string }>(API_ROUTES.ORDERS, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
