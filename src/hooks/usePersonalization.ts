'use client'

import { useSyncExternalStore } from 'react'
import {
  clearPersonalizationProfile,
  getPersonalizationSnapshot,
  getServerPersonalizationSnapshot,
  subscribeToPersonalization,
} from '@/lib/personalization'

export function usePersonalization() {
  const profile = useSyncExternalStore(
    subscribeToPersonalization,
    getPersonalizationSnapshot,
    getServerPersonalizationSnapshot,
  )
  return { profile, clearProfile: clearPersonalizationProfile }
}
