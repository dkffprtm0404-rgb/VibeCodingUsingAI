import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'

export default function NotFoundPage() {
  return (
    <div className="shop-page flex min-h-[65vh] items-center justify-center">
      <div className="shop-surface w-full max-w-lg p-8 text-center sm:p-12">
        <span className="mx-auto mb-7 flex size-20 items-center justify-center rounded-3xl bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-100"><Icon name="bag" className="size-8" /></span>
        <p className="shop-kicker">A little detour · 404</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">이 페이지는 찾을 수 없어요.</h1>
        <p className="shop-muted mt-4 text-sm leading-7">주소를 다시 확인하거나,<br />새로운 취향을 만나러 가볼까요?</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-full border border-gray-200 px-6 text-sm dark:border-gray-700">홈으로 가기</Link><Link href="/products" className="shop-primary-link">상품 둘러보기<Icon name="arrow" className="size-4" /></Link></div>
      </div>
    </div>
  )
}
