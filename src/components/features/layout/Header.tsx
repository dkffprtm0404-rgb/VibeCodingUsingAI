import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { APP_NAME } from '@/constants'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Icon } from '@/components/ui/Icon'
import { PersonalizationIdentity } from '@/components/features/style/PersonalizationIdentity'
import { HeaderProductSearch } from '@/components/features/product/SearchBar'
import { CartIcon } from './CartIcon'
import { LogoutButton } from './LogoutButton'
import { MobileMenu } from './MobileMenu'
import { HeaderNavigation } from './HeaderNavigation'
import { StoreNavigation } from './StoreNavigation'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const rawName: unknown = user?.user_metadata?.name
  const displayName = typeof rawName === 'string' ? rawName : user?.email?.split('@')[0] ?? '회원'

  return (
    <>
      <PersonalizationIdentity userId={user?.id ?? null} />
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-background/95 backdrop-blur-xl dark:border-gray-800">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 md:h-20 lg:px-8">
          <Link href="/" aria-label={`${APP_NAME} 홈`} className="inline-flex min-h-11 shrink-0 items-center gap-2 text-[23px] font-bold tracking-[-.06em]">
            <span className="flex size-8 items-center justify-center rounded-xl bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-200"><Icon name="leaf" className="size-5" /></span>
            {APP_NAME}<span className="-ml-1 text-sage-600 dark:text-sage-300">.</span>
          </Link>
          <HeaderNavigation isLoggedIn={!!user} />
          <HeaderProductSearch />
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <ThemeToggle />
            <CartIcon />
            <div className="hidden items-center gap-1 md:flex">
              {user ? <><Link href="/orders" className="shop-icon-button" aria-label={`${displayName}님 주문내역`}><Icon name="user" /></Link><LogoutButton /></> : <Link href="/login" className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-full bg-gray-900 px-4 text-xs font-medium text-white dark:bg-sage-200 dark:text-gray-900"><Icon name="user" className="size-4" />로그인</Link>}
            </div>
            <MobileMenu isLoggedIn={!!user} userName={displayName} />
          </div>
        </div>
        <StoreNavigation />
      </header>
    </>
  )
}
