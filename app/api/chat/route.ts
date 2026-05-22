/**
 * app/api/chat/route.ts — AI 쇼핑 도우미 챗봇 API
 *
 * Claude API를 사용해서 상품 데이터 기반으로 추천/답변합니다.
 * 스트리밍 응답으로 실시간 타이핑 효과를 제공합니다.
 */

import { NextResponse } from 'next/server'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API 키가 설정되지 않았어요.' }, { status: 500 })
    }

    // 상품 데이터를 시스템 프롬프트에 주입
    const productContext = MOCK_PRODUCTS.map((p) =>
      `- ${p.name} (카테고리: ${p.category}, 가격: ${p.price.toLocaleString()}원, 재고: ${p.stock > 0 ? `${p.stock}개` : '품절'}, ID: ${p.id})`
    ).join('\n')

    const systemPrompt = `당신은 MyShop의 친절한 쇼핑 도우미 AI입니다.
고객의 질문에 답하고 상품을 추천해주세요.

현재 판매 중인 상품 목록:
${productContext}

답변 규칙:
- 친절하고 자연스러운 한국어로 답변하세요
- 상품 추천 시 상품명과 가격을 언급하세요
- 품절 상품은 추천하지 마세요
- 답변은 3-4문장으로 간결하게 해주세요
- 이모지를 적절히 사용해서 친근하게 답변하세요`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // 빠르고 저렴한 모델
        max_tokens: 500,
        system: systemPrompt,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: '챗봇 응답 오류가 발생했어요.' }, { status: 500 })
    }

    return NextResponse.json({ content: data.content[0].text })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했어요.' }, { status: 500 })
  }
}
