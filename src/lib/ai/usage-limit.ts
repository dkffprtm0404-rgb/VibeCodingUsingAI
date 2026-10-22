import { NextResponse } from 'next/server'
import { AI_APP_DAY_LIMIT, AI_USER_DAY_LIMIT, AI_USER_MINUTE_LIMIT } from '@/constants/ai'

interface Usage { minute: number; minuteCount: number; dayCount: number }
interface QuotaState { day: number; total: number; users: Map<string, Usage> }
const runtime = globalThis as typeof globalThis & { __myshopAiQuota?: QuotaState }
const MINUTE = 60_000
const DAY = 86_400_000
const KST_OFFSET = 9 * 60 * MINUTE

function limited(message: string, until: number, now: number): NextResponse {
  return NextResponse.json({ error: message }, {
    status: 429, headers: { 'Retry-After': String(Math.max(1, Math.ceil((until - now) / 1000))) },
  })
}

/** 같은 서버 프로세스의 두 AI API가 공유한다. 예약은 동기적이며 실패 시에도 반환하지 않는다. */
export function consumeAiQuota(userId: string): NextResponse | null {
  const now = Date.now()
  const minute = Math.floor(now / MINUTE)
  const day = Math.floor((now + KST_OFFSET) / DAY)
  if (!runtime.__myshopAiQuota || runtime.__myshopAiQuota.day !== day) {
    runtime.__myshopAiQuota = { day, total: 0, users: new Map() }
  }
  const state = runtime.__myshopAiQuota
  const dayEnd = (day + 1) * DAY - KST_OFFSET
  if (state.total >= AI_APP_DAY_LIMIT) return limited('오늘 AI 서비스 이용 한도에 도달했어요. 내일 다시 이용해주세요.', dayEnd, now)
  const usage = state.users.get(userId) ?? { minute, minuteCount: 0, dayCount: 0 }
  if (usage.dayCount >= AI_USER_DAY_LIMIT) return limited('오늘의 AI 이용 횟수를 모두 사용했어요. 내일 다시 이용해주세요.', dayEnd, now)
  if (usage.minute !== minute) { usage.minute = minute; usage.minuteCount = 0 }
  if (usage.minuteCount >= AI_USER_MINUTE_LIMIT) return limited('AI 요청이 너무 빨라요. 잠시 후 다시 시도해주세요.', (minute + 1) * MINUTE, now)
  usage.minuteCount++
  usage.dayCount++
  state.total++
  state.users.set(userId, usage)
  return null
}
