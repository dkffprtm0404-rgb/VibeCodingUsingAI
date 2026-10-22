import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { getAvailableStock, isRecord } from '@/lib/utils'
import type { PersistStorage } from 'zustand/middleware'
import type { CartItem, PersistedCart } from '@/types/cart'

function restoreCartItems(input: unknown): CartItem[] {
  if (!Array.isArray(input)) return []
  const items: CartItem[] = []
  const productQuantities = new Map<number, number>()

  for (const item of input) {
    if (!isRecord(item) || !isRecord(item.product)
      || typeof item.product.id !== 'number'
      || typeof item.quantity !== 'number' || !Number.isSafeInteger(item.quantity) || item.quantity <= 0
      || (item.selectedSize !== undefined && typeof item.selectedSize !== 'string')) continue

    const productId = item.product.id
    const product = MOCK_PRODUCTS.find((candidate) => candidate.id === productId)
    if (!product) continue

    const selectedSize = item.selectedSize
    const existing = items.find((row) => row.product.id === productId && row.selectedSize === selectedSize)
    const used = productQuantities.get(productId) ?? 0
    const quantity = Math.min(
      item.quantity,
      getAvailableStock(product, selectedSize) - (existing?.quantity ?? 0),
      product.stock - used,
    )
    if (quantity <= 0) continue
    if (existing) existing.quantity += quantity
    else items.push({ product, quantity, selectedSize })
    productQuantities.set(productId, used + quantity)
  }
  return items
}

/** 저장 데이터의 items만 검증해 복원하고, 스토어 액션 덮어쓰기를 막는다. */
export const cartStorage: PersistStorage<PersistedCart> = {
  getItem: (name) => {
    try {
      const raw = window.localStorage.getItem(name)
      if (raw === null) return null
      const saved: unknown = JSON.parse(raw)
      if (!isRecord(saved) || (saved.version !== undefined && saved.version !== 0)) return null
      return {
        state: { items: restoreCartItems(isRecord(saved.state) ? saved.state.items : undefined) },
        version: 0,
      }
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, JSON.stringify(value))
    } catch {
      // 저장소가 차단돼도 메모리의 장바구니 액션은 계속 동작한다.
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name)
    } catch {
      // 저장소 접근 실패는 장바구니 사용을 막지 않는다.
    }
  },
}
