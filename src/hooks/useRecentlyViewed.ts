/**
 * useRecentlyViewed.ts — 최근 본 상품 훅
 *
 * localStorage 기반으로 최근 본 상품 ID 최대 6개 저장.
 * SSR 안전하게 처리 (isMounted 패턴).
 */

'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'myshop-recently-viewed'
const MAX_ITEMS = 6

export function useRecentlyViewed() {
  const [ids, setIds] = useState<number[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setIds(JSON.parse(stored))
    } catch {
      // localStorage 접근 실패 시 무시
    }
  }, [])

  const addProduct = (productId: number) => {
    if (!isMounted) return
    setIds((prev) => {
      // 이미 있으면 맨 앞으로 이동
      const filtered = prev.filter((id) => id !== productId)
      const next = [productId, ...filtered].slice(0, MAX_ITEMS)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // 무시
      }
      return next
    })
  }

  return { ids: isMounted ? ids : [], addProduct }
}
