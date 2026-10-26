'use client'

import { useEffect } from 'react'
import { getPersonalizationIdentityRevision, setPersonalizationIdentity } from '@/lib/personalization'
import { createClient } from '@/lib/supabase/client'

export function PersonalizationIdentity({ userId }: { userId: string | null }) {
  useEffect(() => {
    setPersonalizationIdentity(userId)
    const supabase = createClient()
    let active = true
    let revision = 0
    const verifyIdentity = () => {
      const startedAt = revision
      const identityAtStart = getPersonalizationIdentityRevision()
      void supabase.auth.getUser().then(({ data, error }) => {
        if (active && revision === startedAt && identityAtStart === getPersonalizationIdentityRevision() && !error) {
          setPersonalizationIdentity(data.user?.id ?? null)
        }
      }).catch(() => {
        // 네트워크 실패로 서버가 확인한 로그인 상태를 임의로 해제하지 않는다.
      })
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active || event === 'INITIAL_SESSION') return
      revision += 1
      setPersonalizationIdentity(session?.user.id ?? null)
    })
    verifyIdentity()
    window.addEventListener('focus', verifyIdentity)
    return () => {
      active = false
      subscription.unsubscribe()
      window.removeEventListener('focus', verifyIdentity)
    }
  }, [userId])
  return null
}
