import { NextResponse } from 'next/server'
import { requestAi } from '@/lib/ai/provider'
import { validateJsonMutation } from '@/lib/request-security'
import { requireAiUser } from '@/lib/ai/access'
import { consumeAiQuota } from '@/lib/ai/usage-limit'
import { CHAT_SCHEMA, chatPrompt, parseChatAnswer, readChatMessages, recommendedProducts } from '@/lib/ai/shopping'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const blocked = validateJsonMutation(request)
  if (blocked) return blocked
  const userId = await requireAiUser()
  if (typeof userId !== 'string') return userId
  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: '대화 내용을 확인해주세요.' }, { status: 400 })
  }
  const messages = readChatMessages(body)
  if (!messages) return NextResponse.json({ error: '대화 내용을 확인해주세요.' }, { status: 400 })
  const limited = consumeAiQuota(userId)
  if (limited) return limited
  try {
    const answer = await requestAi({ systemPrompt: chatPrompt(), messages, outputSchema: CHAT_SCHEMA, maxTokens: 500 }, parseChatAnswer, request.signal)
    return NextResponse.json({ content: answer.value.content, recommendedProducts: recommendedProducts(answer.value.productIds) }, {
      headers: { 'X-AI-Provider': answer.provider, 'X-AI-Model': answer.model },
    })
  } catch {
    return NextResponse.json({ error: '지금은 쇼핑 도우미가 응답하기 어려워요. 잠시 후 다시 시도해주세요.' }, { status: 503 })
  }
}
