import Link from 'next/link'
import { APP_NAME } from '@/constants'
import { STORE_CHANNELS } from '@/constants/catalog'
import { Icon } from '@/components/ui/Icon'

export function ShopFooter() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1.5fr_1fr] lg:px-8">
        <div><Link href="/" className="inline-flex min-h-11 items-center gap-2 text-xl font-bold tracking-tight"><Icon name="leaf" className="size-5 text-sage-600 dark:text-sage-300" />{APP_NAME}<span className="text-sage-600 dark:text-sage-300">.</span></Link><p className="shop-muted mt-2 text-xs leading-6">좋아하는 것들로 채우는 일상.<br />당신의 다음 취향을 함께 발견해요.</p></div>
        <nav aria-label="푸터 쇼핑">
          <p className="shop-kicker mb-2">Explore stores</p>
          <div className="grid grid-cols-2 gap-x-5">
            {STORE_CHANNELS.map((store) => (
              <Link key={store.id} href={store.id === 'all' ? '/products' : `/products?store=${store.id}`} className="shop-muted flex min-h-11 items-center text-xs transition-colors hover:text-foreground">
                {store.id === 'all' ? '전체 상품' : store.label}
              </Link>
            ))}
          </div>
          <Link href="/style-quiz" className="shop-muted flex min-h-11 items-center text-xs">AI 스타일 진단 →</Link>
        </nav>
        <div><p className="shop-kicker mb-4">Shopping guide</p><p className="shop-muted text-xs leading-7">5만원 이상 무료배송<br />기본 배송비 3,000원</p><p className="shop-muted mt-3 text-[10px] leading-6">포트폴리오 프로젝트 · 데모 쇼핑몰<br />가격·옵션·재고는 예시이며 실제 판매 정보와 달라요.<br />상품 이미지 출처는 각 상세 화면에서 확인할 수 있어요.</p></div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-4 pb-8 text-[10px] text-gray-500 sm:px-6 lg:px-8"><span>© 2026 {APP_NAME}. All rights reserved.</span><span>Thoughtfully curated. Personally yours.</span></div>
    </footer>
  )
}
