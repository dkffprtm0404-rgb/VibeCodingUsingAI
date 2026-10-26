'use client'

import { Suspense, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { STORE_CHANNELS } from '@/constants/catalog'
import { getStoreId } from '@/lib/catalog'
import { cn } from '@/lib/utils'

function StoreNavigationContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeStore = pathname === '/' || pathname === '/products'
    ? getStoreId(searchParams.get('store'))
    : null
  const scrollerRef = useRef<HTMLDivElement>(null)
  const activeLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    const activeLink = activeLinkRef.current
    if (!scroller || !activeLink) return
    const revealActiveStore = () => {
      const container = scroller.getBoundingClientRect()
      const link = activeLink.getBoundingClientRect()
      const offset = link.left < container.left ? link.left - container.left - 12
        : link.right > container.right ? link.right - container.right + 12 : 0
      if (offset) scroller.scrollBy({ left: offset, behavior: 'auto' })
    }
    revealActiveStore()
    const observer = new ResizeObserver(revealActiveStore)
    observer.observe(scroller)
    return () => observer.disconnect()
  }, [activeStore])

  return (
    <div className="border-t border-gray-100 dark:border-gray-800">
      <div className="mx-auto min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={scrollerRef} className="min-w-0 overflow-x-auto overscroll-x-contain">
          <nav aria-label="스토어 탐색" className="flex h-[50px] w-max min-w-full items-center gap-5 sm:gap-7">
            {STORE_CHANNELS.map((store) => (
              <Link
                key={store.id}
                ref={activeStore === store.id ? activeLinkRef : undefined}
                href={store.id === 'all' ? '/products' : `/products?store=${store.id}`}
                aria-current={activeStore === store.id ? 'page' : undefined}
                className={cn(
                  'relative inline-flex min-h-11 shrink-0 items-center whitespace-nowrap px-1 text-[13px] transition-colors focus-visible:outline-offset-[-3px]',
                  activeStore === store.id
                    ? 'font-bold text-gray-900 after:absolute after:right-1 after:bottom-0 after:left-1 after:h-0.5 after:bg-sage-600 dark:text-white dark:after:bg-sage-300'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                )}
              >
                {store.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

export function StoreNavigation() {
  return (
    <Suspense fallback={<div aria-hidden="true" className="h-[51px] border-t border-gray-100 dark:border-gray-800" />}>
      <StoreNavigationContent />
    </Suspense>
  )
}
