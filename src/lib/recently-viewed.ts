const STORAGE_KEY = 'myshop-recently-viewed'
const MAX_ITEMS = 6
const EMPTY_IDS: number[] = []
const listeners = new Set<() => void>()
let cachedRaw: string | null | undefined
let cachedIds = EMPTY_IDS

export function getServerRecentlyViewedSnapshot(): number[] {
  return EMPTY_IDS
}

export function getRecentlyViewedSnapshot(): number[] {
  if (typeof window === 'undefined') return EMPTY_IDS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw !== cachedRaw) {
      cachedRaw = raw
      cachedIds = EMPTY_IDS
      const parsed: unknown = raw === null ? [] : JSON.parse(raw)
      cachedIds = Array.isArray(parsed)
        ? [...new Set(parsed.filter((id): id is number => typeof id === 'number' && Number.isSafeInteger(id) && id > 0))].slice(0, MAX_ITEMS)
        : EMPTY_IDS
    }
  } catch {
    // 저장소 접근 실패 시에도 이미 기록한 메모리 상태는 유지한다.
  }
  return cachedIds
}

export function subscribeToRecentlyViewed(onChange: () => void): () => void {
  listeners.add(onChange)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) onChange()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onStorage)
  }
}

export function addRecentlyViewedProduct(productId: number): void {
  if (typeof window === 'undefined' || !Number.isSafeInteger(productId) || productId <= 0) return
  const previous = getRecentlyViewedSnapshot()
  if (previous[0] === productId) return
  cachedIds = [productId, ...previous.filter((id) => id !== productId)].slice(0, MAX_ITEMS)
  try {
    const raw = JSON.stringify(cachedIds)
    window.localStorage.setItem(STORAGE_KEY, raw)
    cachedRaw = raw
  } catch {
    // 저장이 차단돼도 현재 페이지에서는 최근 본 상품을 사용할 수 있다.
  }
  listeners.forEach((listener) => listener())
}
