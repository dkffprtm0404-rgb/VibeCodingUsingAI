/**
 * order.ts — 주문 관련 타입 정의
 */

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: '주문 확인 중',
  confirmed: '주문 확정',
  shipped: '배송 중',
  delivered: '배송 완료',
  cancelled: '주문 취소',
}

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  pending: 'text-yellow-600 bg-yellow-50',
  confirmed: 'text-blue-600 bg-blue-50',
  shipped: 'text-purple-600 bg-purple-50',
  delivered: 'text-green-600 bg-green-50',
  cancelled: 'text-red-600 bg-red-50',
}

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  total_price: number
  shipping_fee: number
  receiver_name: string
  receiver_phone: string
  receiver_address: string
  receiver_address_detail: string | null
  memo: string | null
  created_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: number
  product_name: string
  product_price: number
  product_image: string
  quantity: number
}
