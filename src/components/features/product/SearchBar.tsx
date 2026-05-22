'use client'
/**
 * SearchBar.tsx — 상품 검색 바
 *
 * 실무 패턴: useRouter + searchParams로 URL 기반 검색
 * URL에 검색어가 남아서 공유/북마크 가능
 */

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  // URL의 q 파라미터가 바뀌면 입력창도 동기화
  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set('q', query.trim())
    } else {
      params.delete('q')
    }
    router.push(`/products?${params.toString()}`)
  }

  const handleClear = () => {
    setQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    router.push(`/products?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      {/* 검색 아이콘 */}
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="상품명으로 검색해보세요"
        className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl
                   bg-gray-50 outline-none transition-all
                   focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-900/8
                   placeholder:text-gray-400"
      />

      {/* 검색어 지우기 버튼 */}
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </form>
  )
}
