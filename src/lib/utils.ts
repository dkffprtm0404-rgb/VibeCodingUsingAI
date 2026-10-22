/**
 * utils.ts — 공통 유틸리티 함수
 */

import { clsx, type ClassValue } from 'clsx'
import type { Product } from '@/types/product'

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

/** 선택한 사이즈의 재고. 사이즈가 생략된 기존 항목만 전체 재고를 사용합니다. */
export function getAvailableStock(product: Product, selectedSize?: string): number {
  if (selectedSize === undefined) return product.stock
  return product.sizes.find((size) => size.size === selectedSize)?.stock ?? 0
}

/**
 * 재고 상태 텍스트와 색상 반환
 */
export function getStockStatus(stock: number): { label: string; color: string } {
  if (stock === 0) return { label: '품절', color: 'text-red-500' }
  if (stock <= 5) return { label: '품절 임박', color: 'text-orange-500' }
  return { label: '구매 가능', color: 'text-green-600' }
}
