/**
 * useRecentlyViewed.ts — 최근 본 상품 훅
 *
 * localStorage 기반으로 최근 본 상품 ID 최대 6개 저장.
 * 외부 저장소 구독으로 첫 방문 기록과 SSR 초기 상태를 함께 보장한다.
 */

'use client'

import { useSyncExternalStore } from 'react'
import {
  addRecentlyViewedProduct,
  getRecentlyViewedSnapshot,
  getServerRecentlyViewedSnapshot,
  subscribeToRecentlyViewed,
} from '@/lib/recently-viewed'

export function useRecentlyViewed() {
  const ids = useSyncExternalStore(
    subscribeToRecentlyViewed,
    getRecentlyViewedSnapshot,
    getServerRecentlyViewedSnapshot,
  )
  return { ids, addProduct: addRecentlyViewedProduct }
}
