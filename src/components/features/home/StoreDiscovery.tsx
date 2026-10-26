import Image from 'next/image'
import Link from 'next/link'
import { STORE_CHANNELS } from '@/constants/catalog'
import { matchesStore } from '@/lib/catalog'
import { Icon } from '@/components/ui/Icon'
import type { Product } from '@/types/product'

export function StoreDiscovery({ products }: { products: Product[] }) {
  const pictured = new Set<number>()
  return (
    <section aria-labelledby="stores-title" className="min-w-0">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div><p className="shop-kicker mb-2">A world of your taste</p><h2 id="stores-title" className="text-2xl font-semibold tracking-tight">취향이 머무는 스토어</h2></div>
        <Link href="/products" className="shop-muted inline-flex min-h-11 shrink-0 items-center gap-2 text-xs">모두 보기<Icon name="arrow" className="size-4" /></Link>
      </div>
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 lg:grid lg:grid-cols-7 lg:gap-4">
        {STORE_CHANNELS.filter((store) => store.id !== 'all').map((store) => {
          const candidates = products.filter((item) => item.stock > 0 && matchesStore(item, store.id))
          const product = (store.id === 'sports' ? candidates.find((item) => item.category === '스포츠웨어') : undefined)
            ?? candidates.find((item) => !pictured.has(item.id)) ?? candidates[0]
          if (!product) return null
          pictured.add(product.id)
          return (
            <Link key={store.id} href={`/products?store=${store.id}`} className="shop-surface group w-36 shrink-0 snap-start overflow-hidden lg:w-auto">
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image src={product.imageUrl} alt="" fill sizes="(min-width: 1024px) 160px, 144px" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />
              </div>
              <div className="px-3 py-4"><p className="text-[9px] font-medium tracking-widest text-gray-500 dark:text-gray-400">{store.eyebrow}</p><p className="mt-1 flex items-center justify-between text-sm font-semibold">{store.label}<Icon name="diagonal" className="size-3.5" /></p></div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
