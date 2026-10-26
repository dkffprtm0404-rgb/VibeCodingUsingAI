'use client'
/**
 * SearchBar.tsx — 상품 검색 바
 *
 * 실무 패턴: useRouter + searchParams로 URL 기반 검색
 * URL에 검색어가 남아서 공유/북마크 가능
 */

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CATEGORIES, type Category, type StoreId } from '@/constants/catalog'
import { getStoreId } from '@/lib/catalog'
import { Icon } from '@/components/ui/Icon'

interface SearchBarProps {
  store: StoreId
  category: Category
  storeLabel: string
}

function SearchForm({ initialQuery, store, category, storeLabel }: SearchBarProps & { initialQuery: string }) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)

  const navigateToQuery = (value: string) => {
    const params = new URLSearchParams()
    if (store !== 'all') params.set('store', store)
    if (category !== '전체') params.set('cat', category)
    if (value.trim()) params.set('q', value.trim())
    const search = params.toString()
    router.push(search ? `/products?${search}` : '/products')
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    navigateToQuery(query)
  }

  const handleClear = () => {
    setQuery('')
    navigateToQuery('')
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="flex w-full max-w-2xl gap-2 sm:gap-3">
      <label htmlFor="product-search" className="sr-only">{storeLabel} 상품·브랜드 검색</label>
      <div className="relative min-w-0 flex-1">
        {/* 검색 아이콘 */}
        <div aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>

        <input
          id="product-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="상품·브랜드를 검색해보세요"
          className="shop-input min-h-12 pl-11 pr-12"
        />

        {/* 검색어 지우기 버튼 */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="검색어 지우기"
            className="absolute right-0.5 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-xl text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <button type="submit" className="min-h-12 shrink-0 rounded-2xl bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-700 sm:px-7 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">검색</button>
    </form>
  )
}

export function SearchBar(props: SearchBarProps) {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''
  // URL 검색어가 바뀔 때만 입력 상태를 새로 만든다. 카테고리 변경 중인 초안은 유지한다.
  return <SearchForm key={`${props.store}:${query}`} initialQuery={query} {...props} />
}

function HeaderSearchContent() {
  const searchParams = useSearchParams()
  const store = getStoreId(searchParams.get('store'))
  const category = CATEGORIES.find((item) => item === searchParams.get('cat')) ?? '전체'
  const query = searchParams.get('q') ?? ''

  return (
    <form key={`${store}:${category}:${query}`} action="/products" method="get" role="search" className="hidden min-w-0 flex-1 items-center xl:flex xl:max-w-[240px]">
      {store !== 'all' && <input type="hidden" name="store" value={store} />}
      {category !== '전체' && <input type="hidden" name="cat" value={category} />}
      <label htmlFor="header-search" className="sr-only">상품·브랜드 검색</label>
      <div className="relative w-full">
        <input id="header-search" name="q" type="search" defaultValue={query} placeholder="어떤 취향을 찾으세요?" className="min-h-11 w-full rounded-full border border-gray-200 bg-white py-2 pr-11 pl-4 text-xs placeholder:text-gray-500 dark:border-gray-700 dark:bg-gray-900" />
        <button type="submit" aria-label="상품 검색하기" className="absolute top-0 right-0 flex size-11 items-center justify-center rounded-full"><Icon name="search" className="size-4" /></button>
      </div>
    </form>
  )
}

export function HeaderProductSearch() {
  return <Suspense fallback={<div aria-hidden="true" className="hidden h-11 min-w-0 flex-1 xl:block xl:max-w-[240px]" />}><HeaderSearchContent /></Suspense>
}
