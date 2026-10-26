import { isRecord } from '@/lib/utils'
import type { PersonalizationProfile, StyleResult } from '@/types/style'

const STORAGE_KEY = 'myshop-personalization'
const STORAGE_VERSION = 1
const listeners = new Set<() => void>()
let ownerId: string | null | undefined
let generation = 0
let identityRevision = 0
let profile: PersonalizationProfile | null = null
let cachedRaw: string | null | undefined
let memoryOnly = false

interface PersonalizationRequest {
  ownerId: string
  generation: number
}

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isStyleResult(value: unknown): value is StyleResult {
  return isRecord(value)
    && isText(value.type) && isText(value.emoji) && isText(value.description)
    && isText(value.coordi) && isText(value.tip)
    && Array.isArray(value.keywords) && value.keywords.length > 0
    && value.keywords.every(isText)
    && Array.isArray(value.productIds)
    && value.productIds.every((id: unknown) => typeof id === 'number' && Number.isSafeInteger(id) && id > 0)
}

function readProfile(raw: string | null): PersonalizationProfile | null {
  if (raw === null) return null
  try {
    const saved: unknown = JSON.parse(raw)
    if (!isRecord(saved) || saved.version !== STORAGE_VERSION || saved.ownerId !== ownerId
      || !isText(saved.ownerId) || typeof saved.createdAt !== 'number'
      || !Number.isSafeInteger(saved.createdAt) || saved.createdAt <= 0 || !isStyleResult(saved.result)) return null
    return { ownerId: saved.ownerId, createdAt: saved.createdAt, result: saved.result }
  } catch {
    return null
  }
}

function notify(): void {
  listeners.forEach((listener) => listener())
}

function removeSavedProfile(): void {
  cachedRaw = null
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // 차단된 저장소의 이전 결과가 메모리 상태를 덮어쓰지 않도록 한다.
    memoryOnly = true
  }
}

export function getServerPersonalizationSnapshot(): null {
  return null
}

export function getPersonalizationSnapshot(): PersonalizationProfile | null {
  if (typeof window === 'undefined' || !ownerId) return null
  if (!memoryOnly) {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY)
      if (raw !== cachedRaw) {
        cachedRaw = raw
        profile = readProfile(raw)
      }
    } catch {
      // 저장소를 사용할 수 없어도 현재 탭의 마지막 성공 결과는 유지한다.
    }
  }
  return profile
}

export function subscribeToPersonalization(listener: () => void): () => void {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function setPersonalizationIdentity(nextOwnerId: string | null): void {
  if (typeof window === 'undefined' || ownerId === nextOwnerId) return
  const initialIdentity = ownerId === undefined
  ownerId = nextOwnerId
  generation += 1
  identityRevision += 1
  profile = null
  cachedRaw = undefined
  memoryOnly = false
  if (initialIdentity && ownerId) {
    getPersonalizationSnapshot()
    if (!profile) removeSavedProfile()
  } else removeSavedProfile()
  notify()
}

export function getPersonalizationIdentityRevision(): number {
  return identityRevision
}

export function clearPersonalizationProfile(): void {
  if (typeof window === 'undefined') return
  generation += 1
  profile = null
  removeSavedProfile()
  notify()
}

export function beginPersonalizationRequest(): PersonalizationRequest | null {
  if (typeof window === 'undefined' || !ownerId) return null
  generation += 1
  return { ownerId, generation }
}

export function isPersonalizationRequestCurrent(request: PersonalizationRequest | null): request is PersonalizationRequest {
  return request !== null && request.ownerId === ownerId && request.generation === generation
}

export function savePersonalizationResult(request: PersonalizationRequest | null, result: unknown): boolean {
  if (!isPersonalizationRequestCurrent(request) || !isStyleResult(result)) return false
  profile = {
    ownerId: request.ownerId, createdAt: Date.now(),
    result: { ...result, keywords: [...result.keywords], productIds: [...result.productIds] },
  }
  const raw = JSON.stringify({ version: STORAGE_VERSION, ...profile })
  try {
    window.sessionStorage.setItem(STORAGE_KEY, raw)
    cachedRaw = raw
    memoryOnly = false
  } catch {
    memoryOnly = true
  }
  notify()
  return true
}
