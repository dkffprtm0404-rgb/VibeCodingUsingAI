/**
 * useShipping.ts — 배송비 계산 훅
 *
 * 재사용성: CartView, CheckoutForm에서 중복되는 배송비 계산 로직 추상화
 */

import { SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/constants'

export function useShipping(totalPrice: number) {
  const isFreeShipping = totalPrice >= SHIPPING_THRESHOLD
  const shippingFee = isFreeShipping ? 0 : SHIPPING_FEE
  const finalPrice = totalPrice + shippingFee
  const remainForFree = Math.max(SHIPPING_THRESHOLD - totalPrice, 0)
  const progressPercent = Math.min((totalPrice / SHIPPING_THRESHOLD) * 100, 100)

  return {
    shippingFee,
    finalPrice,
    isFreeShipping,
    remainForFree,
    progressPercent,
  }
}
