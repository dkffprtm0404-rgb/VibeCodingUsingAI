import { isRecord } from '@/lib/utils'

/** 자동 이메일 확인이 켜져 있거나 설정을 확인할 수 없으면 가입을 시작하지 않는다. */
export async function requiresEmailConfirmation(signal: AbortSignal): Promise<boolean> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return false
    const response = await fetch(new URL('/auth/v1/settings', url), {
      headers: { apikey: key }, cache: 'no-store',
      signal: AbortSignal.any([signal, AbortSignal.timeout(8000)]),
    })
    if (!response.ok) return false
    const settings: unknown = await response.json()
    return isRecord(settings) && settings.mailer_autoconfirm === false && settings.disable_signup === false
  } catch {
    return false
  }
}
