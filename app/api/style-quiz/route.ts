import { NextResponse } from 'next/server'
import { requestAi } from '@/lib/ai/provider'
import { STYLE_SCHEMA, stylePrompt, parseStyleResult, readStyleAnswers, recommendedProducts } from '@/lib/ai/shopping'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: '스타일 설문 답변을 확인해주세요.' }, { status: 400 })
  }
  const answers = readStyleAnswers(body)
  if (!answers) return NextResponse.json({ error: '스타일 설문 답변을 모두 입력해주세요.' }, { status: 400 })
  try {
    const answer = await requestAi({
      systemPrompt: stylePrompt(), outputSchema: STYLE_SCHEMA, maxTokens: 800,
      messages: [{ role: 'user', content: `착용 상황: ${answers.situation}\n선호 핏: ${answers.fit}\n선호 분위기: ${answers.vibe}\n선호 색감: ${answers.color}` }],
    }, parseStyleResult, request.signal)
    return NextResponse.json({ result: answer.value, recommendedProducts: recommendedProducts(answer.value.productIds) }, {
      headers: { 'X-AI-Provider': answer.provider, 'X-AI-Model': answer.model },
    })
  } catch {
    return NextResponse.json({ error: '지금은 스타일을 분석하기 어려워요. 잠시 후 다시 시도해주세요.' }, { status: 503 })
  }
}
