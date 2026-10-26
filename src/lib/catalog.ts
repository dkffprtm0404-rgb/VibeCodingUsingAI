import { CATEGORIES, STORE_CHANNELS } from '@/constants/catalog'
import type { Category, StoreId } from '@/constants/catalog'
import type { Product } from '@/types/product'

interface CatalogFilters {
  store: StoreId
  category?: string | null
  query?: string | null
}

export function getStoreId(value: string | null | undefined): StoreId {
  return STORE_CHANNELS.find((channel) => channel.id === value)?.id ?? 'all'
}

export function matchesStore(product: Product, store: StoreId): boolean {
  return store === 'all' || (product.channels ? product.channels.includes(store) : store === 'fashion')
}

export function getEditorSelection(products: Product[], limit = 8): Product[] {
  const available = products.filter((product) => product.stock > 0)
  const selected: Product[] = []
  const seen = new Set<number>()
  const append = (product: Product | undefined) => {
    if (product && selected.length < limit && !seen.has(product.id)) {
      selected.push(product)
      seen.add(product.id)
    }
  }
  for (const store of STORE_CHANNELS.filter((item) => item.id !== 'all')) {
    append(available.find((product) => matchesStore(product, store.id) && !seen.has(product.id)))
  }
  available.forEach(append)
  return selected
}

export function getStoreCategories(products: Product[], store: StoreId): Category[] {
  const presentCategories = new Set(products.filter((product) => matchesStore(product, store)).map((product) => product.category))
  return CATEGORIES.filter((category) => category === '전체' || presentCategories.has(category))
}

export function filterCatalog(products: Product[], { store, category, query }: CatalogFilters): Product[] {
  const selectedCategory = getStoreCategories(products, store).find((item) => item === category) ?? '전체'
  const search = query?.trim().toLowerCase() ?? ''

  return products.filter((product) => (
    matchesStore(product, store)
    && (selectedCategory === '전체' || product.category === selectedCategory)
    && (product.name.toLowerCase().includes(search) || (product.brand?.toLowerCase().includes(search) ?? false))
  ))
}
