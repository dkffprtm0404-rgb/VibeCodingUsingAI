/**
 * utils.ts — 공통 유틸리티 함수
 */

import { clsx, type ClassValue } from 'clsx'
import type { Product } from '@/types/product'
import type { CartItem } from '@/types/cart'

/**
 * cn: Tailwind 클래스 병합 유틸
 * clsx로 조건부 클래스 처리 + 충돌 클래스 자동 해결
 * @example cn('px-4 py-2', isActive && 'bg-black', 'bg-white') → 'px-4 py-2 bg-white'
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

/**
 * 숫자를 한국 원화 형식으로 포맷
 * @example formatPrice(29000) → "29,000원"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR').format(price) + '원'
}

/** JSON 등 외부 입력에서 배열·null을 제외한 객체만 허용한다. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** 로그인 후 이동은 사이트 내부 경로만 허용한다. 외부·특수 스킴·우회 문자는 거부한다. */
export function getSafeCallbackUrl(value: string): string {
  if (!value.startsWith('/') || /[\\\u0000-\u0020\u007f]/.test(value)) return '/'
  try {
    const pathname = decodeURIComponent(value.split(/[?#]/, 1)[0])
    if (pathname.startsWith('//') || /[\\\u0000-\u0020\u007f]/.test(pathname)
      || pathname.split('/').some((segment) => segment === '.' || segment === '..')) return '/'
    return value
  } catch {
    return '/'
  }
}

/** 선택한 사이즈의 재고. 사이즈가 생략된 기존 항목만 전체 재고를 사용합니다. */
export function getAvailableStock(product: Product, selectedSize?: string): number {
  if (selectedSize === undefined) return product.stock
  return product.sizes.find((size) => size.size === selectedSize)?.stock ?? 0
}

/** 다른 사이즈·기존 사이즈 미선택 항목이 점유한 재고를 제외한 행별 수량 상한. */
export function getCartQuantityLimit(items: CartItem[], product: Product, selectedSize?: string): number {
  const reserved = items.reduce((sum, item) =>
    item.product.id === product.id && item.selectedSize !== selectedSize ? sum + item.quantity : sum, 0)
  return Math.max(0, Math.min(getAvailableStock(product, selectedSize), product.stock - reserved))
}

/**
 * 재고 상태 텍스트와 색상 반환
 */
export function getStockStatus(stock: number): { label: string; color: string } {
  if (stock === 0) return { label: '품절', color: 'text-red-500' }
  if (stock <= 5) return { label: '품절 임박', color: 'text-orange-500' }
  return { label: '구매 가능', color: 'text-green-600' }
}
