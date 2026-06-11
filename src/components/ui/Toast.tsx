'use client'
/**
 * Toast.tsx — 토스트 알림 시스템
 *
 * 요즘 서비스에서 필수인 UX 패턴.
 * 장바구니 담기, 찜하기, 오류 등 모든 액션 피드백에 사용.
 * zustand로 전역 상태 관리 → 어디서든 호출 가능.
 */

import { useEffect } from 'react'
import { create } from 'zustand'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastStore {
  toasts: Toast[]
  add: (message: string, type?: ToastType) => void
  remove: (id: string) => void
}

// 전역 Toast 스토어
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type = 'success') => {
    const id = crypto.randomUUID()
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    // 3초 후 자동 제거
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 3000)
  },
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

// 편의 함수 — 컴포넌트 밖에서도 호출 가능
export const toast = {
  success: (message: string) => useToastStore.getState().add(message, 'success'),
  error: (message: string) => useToastStore.getState().add(message, 'error'),
  info: (message: string) => useToastStore.getState().add(message, 'info'),
}

const typeStyles: Record<ToastType, string> = {
  success: 'bg-gray-900 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
}

const typeIcon: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
}

// Toast 컨테이너 — layout.tsx에 추가
export function ToastContainer() {
  const { toasts, remove } = useToastStore()

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium',
            'pointer-events-auto cursor-pointer',
            'animate-in slide-in-from-bottom-4 duration-300',
            typeStyles[t.type]
          )}
          onClick={() => remove(t.id)}
        >
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 text-xs font-bold flex-shrink-0">
            {typeIcon[t.type]}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  )
}
