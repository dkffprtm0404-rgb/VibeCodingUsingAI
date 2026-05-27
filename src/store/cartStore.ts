/**
 * cartStore.ts — 장바구니 전역 상태 (Zustand)
 *
 * Zustand: 가볍고 간단한 전역 상태 관리 라이브러리
 * Redux보다 보일러플레이트가 훨씬 적어서 실무에서 많이 씁니다.
 *
 * 실무 패턴:
 * - create()로 스토어 생성
 * - 상태(state)와 액션(action)을 한 곳에서 관리
 * - persist 미들웨어로 새로고침해도 장바구니 유지 (localStorage)
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types/product'

// 장바구니 아이템 타입
interface CartItem {
  product: Product
  quantity: number
  selectedSize?: string
}

// 스토어 전체 타입 (상태 + 액션)
interface CartStore {
  // 상태
  items: CartItem[]

  // 액션 (상태를 변경하는 함수들)
  addItem: (product: Product, quantity?: number, selectedSize?: string) => void
  removeItem: (productId: number, selectedSize?: string) => void
  updateQuantity: (productId: number, quantity: number, selectedSize?: string) => void
  clearCart: () => void

  // 계산된 값 (getter)
  getTotalCount: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  /**
   * persist 미들웨어:
   * 스토어 상태를 localStorage에 자동 저장/복원합니다.
   * 새로고침해도 장바구니가 유지되는 이유입니다.
   */
  persist(
    (set, get) => ({
      items: [],

      /**
       * addItem: 상품 추가
       * - 이미 있는 상품이면 수량만 증가
       * - 없는 상품이면 새로 추가
       */
      addItem: (product, quantity = 1, selectedSize) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id && i.selectedSize === selectedSize
          )

          if (existing) {
            const maxStock = selectedSize
              ? (product.sizes.find((s) => s.size === selectedSize)?.stock ?? product.stock)
              : product.stock
            return {
              items: state.items.map((i) =>
                i.product.id === product.id && i.selectedSize === selectedSize
                  ? { ...i, quantity: Math.min(i.quantity + quantity, maxStock) }
                  : i
              ),
            }
          }

          return { items: [...state.items, { product, quantity, selectedSize }] }
        })
      },

      /**
       * removeItem: 상품 제거
       */
      removeItem: (productId, selectedSize) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product.id === productId && i.selectedSize === selectedSize)
          ),
        }))
      },

      /**
       * updateQuantity: 수량 변경
       * 수량이 0 이하가 되면 자동으로 제거
       */
      updateQuantity: (productId, quantity, selectedSize) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedSize)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId && i.selectedSize === selectedSize ? { ...i, quantity } : i
          ),
        }))
      },

      /**
       * clearCart: 장바구니 전체 비우기
       */
      clearCart: () => set({ items: [] }),

      /**
       * getTotalCount: 전체 상품 수량 합계 (헤더 뱃지에 표시)
       */
      getTotalCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      /**
       * getTotalPrice: 전체 금액 합계
       */
      getTotalPrice: () => {
        return get().items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        )
      },
    }),
    {
      name: 'myshop-cart', // localStorage 키 이름
    }
  )
)
