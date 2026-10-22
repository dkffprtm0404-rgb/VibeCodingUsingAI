import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { getAvailableStock, isRecord } from '@/lib/utils'
import type { OrderValidationResult, ValidatedOrderItem } from '@/types/order'

export function validateOrderRequest(input: unknown): OrderValidationResult {
  if (!isRecord(input) || !Array.isArray(input.items) || input.items.length === 0) {
    return { success: false, error: '주문 상품을 확인해주세요.' }
  }

  const shipping = input.shippingInfo
  if (!isRecord(shipping)
    || typeof shipping.name !== 'string' || !shipping.name.trim()
    || typeof shipping.phone !== 'string' || !shipping.phone.trim()
    || typeof shipping.address !== 'string' || !shipping.address.trim()
    || (shipping.addressDetail !== undefined && typeof shipping.addressDetail !== 'string')
    || (shipping.memo !== undefined && typeof shipping.memo !== 'string')) {
    return { success: false, error: '배송지 정보를 올바르게 입력해주세요.' }
  }

  const couponCode = input.couponCode
  if (couponCode !== undefined && couponCode !== null && typeof couponCode !== 'string') {
    return { success: false, error: '쿠폰 코드를 확인해주세요.' }
  }

  const items: ValidatedOrderItem[] = []
  const sizeQuantities = new Map<string, number>()
  const productQuantities = new Map<number, number>()

  for (const item of input.items) {
    if (!isRecord(item) || !isRecord(item.product)
      || typeof item.product.id !== 'number'
      || typeof item.quantity !== 'number' || !Number.isSafeInteger(item.quantity) || item.quantity <= 0
      || (item.selectedSize !== undefined && typeof item.selectedSize !== 'string')) {
      return { success: false, error: '주문 상품과 수량을 확인해주세요.' }
    }

    const productId = item.product.id
    const product = MOCK_PRODUCTS.find((candidate) => candidate.id === productId)
    if (!product) return { success: false, error: '존재하지 않는 상품이 포함돼 있어요.' }

    const selectedSize = item.selectedSize
    const key = `${product.id}:${selectedSize ?? ''}`
    const sizeQuantity = (sizeQuantities.get(key) ?? 0) + item.quantity
    const productQuantity = (productQuantities.get(product.id) ?? 0) + item.quantity
    if (sizeQuantity > getAvailableStock(product, selectedSize) || productQuantity > product.stock) {
      return { success: false, error: '상품의 사이즈와 재고를 확인해주세요.' }
    }
    sizeQuantities.set(key, sizeQuantity)
    productQuantities.set(product.id, productQuantity)
    items.push({ product, quantity: item.quantity, selectedSize })
  }

  return {
    success: true,
    data: {
      items,
      shippingInfo: {
        name: shipping.name.trim(),
        phone: shipping.phone.trim(),
        address: shipping.address.trim(),
        addressDetail: shipping.addressDetail?.trim() ?? '',
        memo: shipping.memo?.trim() ?? '',
      },
      couponCode,
    },
  }
}
