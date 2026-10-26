'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

const destinations: { href: string; label: string; icon: IconName }[] = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/products', label: '상품', icon: 'grid' },
  { href: '/style-quiz', label: '나의 스타일', icon: 'sparkles' },
  { href: '/cart', label: '장바구니', icon: 'bag' },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="모바일 주요 탐색" className="shop-bottom-nav fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-xl md:hidden dark:border-gray-700 dark:bg-gray-950/95">
      <div className="mx-auto grid h-[68px] max-w-md grid-cols-4">
        {destinations.map(({ href, label, icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={cn('flex flex-col items-center justify-center gap-1.5 text-[10px] transition-colors', active ? 'font-semibold text-sage-800 dark:text-sage-200' : 'text-gray-500 dark:text-gray-400')}>
            <span className={cn('flex h-7 w-11 items-center justify-center rounded-full', active && 'bg-sage-100 dark:bg-sage-900')}><Icon name={icon} className="size-[19px]" /></span>{label}
          </Link>
        })}
      </div>
    </nav>
  )
}
