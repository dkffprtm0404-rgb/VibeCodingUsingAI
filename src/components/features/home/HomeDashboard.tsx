'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HeroShaderBackground } from '@/components/features/layout/HeroShaderBackground'
import { ProductCard } from '@/components/features/product/ProductCard'
import { Icon } from '@/components/ui/Icon'
import { StoreDiscovery } from '@/components/features/home/StoreDiscovery'
import { usePersonalization } from '@/hooks/usePersonalization'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { cn, formatPrice } from '@/lib/utils'
import { getEditorSelection } from '@/lib/catalog'
import type { Product } from '@/types/product'

interface HomeDashboardProps {
  products: Product[]
  userName?: string
}

export function HomeDashboard({ products, userName }: HomeDashboardProps) {
  const { profile, clearProfile } = usePersonalization()
  const { ids } = useRecentlyViewed()
  const available = products.filter((product) => product.stock > 0)
  const recommended = [...new Set(profile?.result.productIds ?? [])].flatMap((id) => {
    const product = available.find((item) => item.id === id)
    return product ? [product] : []
  })
  const selection = recommended.length ? recommended : getEditorSelection(products)
  const featured = selection[0]
  const recent = ids.flatMap((id) => {
    const product = products.find((item) => item.id === id)
    return product ? [product] : []
  }).slice(0, 2)

  return (
    <div className="shop-page space-y-10 lg:space-y-14">
      <section aria-labelledby="home-title" className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="shop-kicker mb-3 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-sage-600 dark:bg-sage-300" /> A little more you
          </p>
          <h1 id="home-title" className="shop-heading">{userName ? `${userName}님, 오늘도 나답게.` : '좋아하는 것들로, 나답게.'}</h1>
          <p className="shop-muted mt-3 text-sm leading-relaxed">취향을 발견하고, 당신의 일상에 어울리는 한 벌을 만나보세요.</p>
        </div>
        <Link href="/style-quiz" className="hidden min-h-11 shrink-0 items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-4 text-xs font-medium sm:inline-flex sm:self-auto dark:border-gray-700 dark:bg-gray-900">
          <Icon name="sparkles" className="size-4 text-sage-700 dark:text-sage-300" />
          {profile ? '나의 스타일 다시 찾기' : '아직 진단하지 않았어요'}<Icon name="diagonal" className="ml-1 size-3.5" />
        </Link>
      </section>

      <section aria-label="나를 위한 쇼핑 보드" className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12 lg:gap-5">
        <article className="relative isolate flex min-h-[380px] flex-col overflow-hidden rounded-[28px] bg-gray-900 p-7 text-white sm:min-h-[410px] sm:p-9 md:col-span-6 lg:col-span-7 lg:row-span-2 lg:min-h-[490px]">
          <HeroShaderBackground />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#13251c]/90 via-[#13251c]/70 to-[#13251c]/15" />
          <div className="relative z-10 flex h-full flex-1 flex-col items-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-medium tracking-[.15em] uppercase">
              <Icon name="leaf" className="size-3" /> {recommended.length ? 'Your AI selection' : "Editor's selection"}
            </span>
            <h2 className="mt-8 max-w-[310px] text-[2.25rem] leading-[1.18] font-medium tracking-[-.055em] sm:text-5xl lg:mt-12">
              {recommended.length ? <>당신의 취향을<br />닮은 발견.</> : <>일상에 스며드는<br />새로운 취향.</>}
            </h2>
            <p className="mt-4 max-w-[220px] text-sm leading-7 text-white/85 sm:max-w-[270px]">
              {recommended.length ? '스타일 진단으로 찾은 나다운 아이템을 지금 만나보세요.' : '오래 입고 싶은 실루엣, 자연스러운 색감. 오늘의 셀렉션을 둘러보세요.'}
            </p>
            <Link href={featured ? `/products/${featured.id}` : '/products'} className="mt-7 inline-flex min-h-12 items-center gap-4 rounded-full bg-white px-6 text-xs font-semibold text-gray-900 hover:bg-sage-100 focus-visible:outline-white">
              {recommended.length ? '나의 추천 상품 보기' : '셀렉션 둘러보기'}<Icon name="arrow" className="size-4" />
            </Link>
            <span className="mt-auto pt-8 text-[10px] tracking-wider text-white/70">CURATED FOR YOUR EVERYDAY</span>
          </div>
          {featured && <div className="absolute right-8 bottom-16 hidden h-[245px] w-[175px] rotate-12 overflow-hidden rounded-[24px] border-[6px] border-white/15 opacity-75 sm:block lg:right-7 lg:bottom-14 lg:h-[260px] lg:w-[190px]">
            <Image src={featured.imageUrl} alt="" fill priority sizes="190px" className="object-cover" />
          </div>}
        </article>

        <article className="flex flex-col rounded-[28px] bg-sage-100 p-6 text-gray-900 md:col-span-3 lg:col-span-5 dark:bg-sage-900 dark:text-sage-50">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold tracking-[.16em] text-sage-800 uppercase dark:text-sage-200">Your personal stylist</p>
            <Icon name="sparkles" className="size-5" />
          </div>
          <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="min-w-0">
              <h2 className="text-xl leading-snug font-semibold tracking-tight break-words">{profile ? profile.result.type : '당신의 취향이 궁금해요.'}</h2>
              <p className="mt-2 text-xs leading-6 text-sage-800 dark:text-sage-200">
                {profile ? profile.result.keywords.join(' · ') : '4가지 질문으로 시작하는 AI 스타일 큐레이션'}
              </p>
            </div>
            <Link href="/style-quiz" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-gray-900 px-4 text-xs font-medium text-white sm:self-auto dark:bg-sage-100 dark:text-sage-950">
              {profile ? '다시 진단' : '취향 찾기'}<Icon name="arrow" className="size-3.5" />
            </Link>
          </div>
          {profile && <div className="mt-3 border-t border-sage-300/50 pt-2 text-[11px] text-sage-800 dark:text-sage-200">
            이 탭의 진단 결과 <button onClick={clearProfile} className="ml-2 min-h-11 underline underline-offset-4">개인화 초기화</button>
          </div>}
        </article>

        <RecentHistoryCard recent={recent} className="hidden md:col-span-3 md:flex lg:col-span-5" />
      </section>

      <StoreDiscovery products={products} />

      <section aria-labelledby="selection-title">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div><p className="shop-kicker mb-2">{recommended.length ? 'Made for your taste' : 'Considered essentials'}</p><h2 id="selection-title" className="text-2xl font-semibold tracking-tight">{recommended.length ? '지금, 당신을 위한 아이템' : '오늘 눈여겨볼 아이템'}</h2></div>
          <Link href="/products" className="shop-muted inline-flex min-h-11 items-center gap-2 text-xs hover:text-foreground">전체 상품 보기<Icon name="arrow" className="size-4" /></Link>
        </div>
        {profile && <div className="mb-5 flex items-start gap-3 rounded-2xl bg-sage-100/70 p-4 dark:bg-sage-900/60"><Icon name="sparkles" className="mt-0.5 size-4 shrink-0 text-sage-700 dark:text-sage-200" /><p className="text-xs leading-6 text-sage-800 dark:text-sage-100">{recommended.length ? `${profile.result.type} 진단에 따른 추천이에요. ${profile.result.coordi}` : '진단 결과의 상품을 지금 구매하기 어려워요. 다른 셀렉션을 둘러보세요.'}</p></div>}
        <div className="grid grid-cols-1 gap-x-3 gap-y-6 min-[375px]:grid-cols-2 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {selection.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <RecentHistoryCard recent={recent} className="flex md:hidden" />

      <section aria-label="쇼핑 안내" className="grid gap-4 md:grid-cols-3">
        <Link href="/products" className="shop-surface group flex items-center gap-4 p-6 md:col-span-2"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-100"><Icon name="truck" /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">좋은 취향에, 배송비 걱정은 가볍게.</p><p className="shop-muted mt-1.5 text-xs">5만원 이상 무료배송 · 기본 배송비 3,000원</p></div><Icon name="diagonal" className="shop-muted shrink-0" /></Link>
        <Link href="/cart" className="group flex min-h-28 items-center justify-between rounded-[24px] bg-gray-900 p-6 text-white dark:bg-sage-200 dark:text-gray-900"><div><p className="text-[10px] tracking-[.15em] opacity-70 uppercase">Your next favorite</p><p className="mt-2 text-sm font-medium">담아둔 취향 만나러 가기</p></div><Icon name="bag" className="size-6" /></Link>
      </section>
    </div>
  )
}

// 각 화면 폭에서 하나만 표시해 시각적 배치와 실제 키보드 탐색 순서를 일치시킨다.
function RecentHistoryCard({ recent, className }: { recent: Product[]; className: string }) {
  return (
    <article className={cn('shop-surface min-h-[220px] flex-col p-6', className)}>
      <div className="flex items-center justify-between"><p className="shop-kicker">{recent.length ? 'Pick up where you left off' : 'Find your essentials'}</p><Icon name={recent.length ? 'clock' : 'grid'} className="shop-muted size-4" /></div>
      <h2 className="mt-3 text-lg font-semibold tracking-tight">{recent.length ? '이 기기에서 최근 본 상품' : '어떤 아이템을 찾으세요?'}</h2>
      {recent.length ? <div className="mt-4 flex flex-col gap-3">
        {recent.map((product) => <Link key={product.id} href={`/products/${product.id}`} className="group flex min-h-12 items-center gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"><Image src={product.imageUrl} alt="" fill sizes="48px" className="object-cover" /></div>
          <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{product.name}</p><p className="shop-muted mt-1 text-[11px]">{formatPrice(product.price)}</p></div><Icon name="chevron" className="shop-muted size-4" />
        </Link>)}
      </div> : <div className="mt-auto grid grid-cols-3 gap-2 pt-5">
        {['상의', '하의', '아우터'].map((category, index) => <Link key={category} href={`/products?cat=${encodeURIComponent(category)}`} className="group flex min-h-14 items-center justify-between rounded-2xl bg-gray-50 px-3 text-xs font-medium transition-colors hover:bg-sage-100 dark:bg-gray-800 dark:hover:bg-gray-700"><span><span className="shop-muted mr-2 text-[9px]">0{index + 1}</span>{category}</span><Icon name="diagonal" className="size-3" /></Link>)}
      </div>}
    </article>
  )
}
