/**
 * constants/index.ts — 앱 전역 상수
 *
 * 하네스 원칙: 불변조건은 중앙화한다.
 * 하드코딩된 값이 여러 파일에 흩어지면 수정 시 누락이 생긴다.
 */

// 앱 기본 정보
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'MyShop'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

// 장바구니
export const SHIPPING_THRESHOLD = 50000  // 무료배송 기준 금액
export const SHIPPING_FEE = 3000         // 기본 배송비
export const MAX_CART_QUANTITY = 99      // 최대 장바구니 수량

// 페이지네이션
export const MAX_ITEMS_PER_PAGE = 12

// 인증
export const MIN_PASSWORD_LENGTH = 6    // Supabase 최소 비밀번호 길이

// API 경로
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    SIGNUP: '/api/auth/signup',
  },
  ORDERS: '/api/orders',
  WISHLIST: '/api/wishlist',
  CHAT: '/api/chat',
  STYLE_QUIZ: '/api/style-quiz',
} as const

// 재고 임박 기준
export const LOW_STOCK_THRESHOLD = 5
export const CRITICAL_STOCK_THRESHOLD = 3
