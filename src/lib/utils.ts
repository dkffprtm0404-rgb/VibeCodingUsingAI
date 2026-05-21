/**
 * utils.ts — 공통 유틸리티 함수 모음
 *
 * 여러 컴포넌트에서 공통으로 쓰이는 함수들을 모아두는 파일이에요.
 * 실무에서도 이렇게 lib/utils.ts 에 공통 함수를 관리합니다.
 */

/**
 * 숫자를 한국 원화 형식으로 포맷하는 함수
 * @example formatPrice(29000) → "29,000원"
 */
export function formatPrice(price: number): string {
  // Intl.NumberFormat: 브라우저 내장 국제화 API
  return new Intl.NumberFormat('ko-KR').format(price) + '원'
}

/**
 * 재고 상태 텍스트와 색상을 반환하는 함수
 * @example getStockStatus(0) → { label: '품절', color: 'text-red-500' }
 */
export function getStockStatus(stock: number): { label: string; color: string } {
  if (stock === 0) return { label: '품절', color: 'text-red-500' }
  if (stock <= 5) return { label: '품절 임박', color: 'text-orange-500' }
  return { label: '구매 가능', color: 'text-green-600' }
}
