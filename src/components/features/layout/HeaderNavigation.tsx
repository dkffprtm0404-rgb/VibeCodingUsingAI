'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

export function HeaderNavigation({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname()
  const links = [
    { href: '/products', label: '둘러보기' },
    { href: '/style-quiz', label: 'AI 스타일' },
    ...(isLoggedIn ? [{ href: '/mypage/wishlist', label: '찜한 취향' }, { href: '/orders', label: '주문내역' }] : []),
  ]
  return <nav aria-label="주요 탐색" className="hidden shrink-0 items-center gap-6 md:flex lg:gap-8">
    {links.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname.startsWith(href) ? 'page' : undefined} className={cn('relative inline-flex min-h-11 items-center gap-1.5 text-xs transition-colors hover:text-foreground', pathname.startsWith(href) ? 'font-semibold text-foreground after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:bg-sage-600' : 'shop-muted')}>
      {href === '/style-quiz' && <Icon name="sparkles" className="size-3.5 text-sage-600 dark:text-sage-300" />}{label}
    </Link>)}
  </nav>
}
