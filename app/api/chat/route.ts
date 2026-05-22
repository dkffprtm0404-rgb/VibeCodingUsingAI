/**
 * app/api/chat/route.ts — AI 쇼핑 도우미 챗봇 API
 *
 * Claude API에 상품 데이터를 주입해서 MyShop 전용 AI로 동작합니다.
 * 응답에 추천 상품 ID 목록을 포함시켜 클라이언트에서 카드로 렌더링합니다.
 *
 * 응답 형식 (JSON):
 * {
 *   content: "답변 텍스트",
 *   recommendedProductIds: [1, 3, 6]  // 추천 상품 ID (없으면 빈 배열)
 * }
 */

import { NextResponse } from 'next/server'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API 키가 설정되지 않았어요.' }, { status: 500 })
    }

    const productContext = MOCK_PRODUCTS.map((p) =>
      `ID:${p.id} | ${p.name} | ${p.category} | ${p.price.toLocaleString()}원 | ${p.stock > 0 ? `재고 ${p.stock}개` : '품절'}`
    ).join('\n')

    const systemPrompt = `당신은 MyShop의 친절한 쇼핑 도우미 AI입니다.

현재 판매 중인 상품:
${productContext}

응답 규칙:
1. 반드시 아래 JSON 형식으로만 응답하세요 (다른 텍스트 금지):
{
  "message": "친절한 답변 텍스트 (2-3문장, 이모지 포함)",
  "productIds": [추천 상품 ID 배열, 없으면 빈 배열]
}

2. 상품 추천 시:
   - 재고 있는 상품만 추천 (품절 제외)
   - 최대 3개까지만 추천
   - productIds에 해당 상품 ID 숫자로 포함

3. 일반 대화나 상품 무관 질문은 productIds를 빈 배열로

예시:
{"message": "겨울에 딱 맞는 캐시미어 니트를 추천드려요! 🧶 부드럽고 따뜻해서 인기 상품이에요.", "productIds": [6]}
`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
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

    // Claude 응답에서 JSON 파싱
    try {
      const raw = data.content[0].text.trim()
      // 혹시 마크다운 코드블록으로 감싸진 경우 제거
      const cleaned = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
      const parsed = JSON.parse(cleaned)

      // 추천된 상품 데이터 조회
      const recommendedProducts = MOCK_PRODUCTS.filter((p) =>
        (parsed.productIds ?? []).includes(p.id) && p.stock > 0
      )

      return NextResponse.json({
        content: parsed.message,
        recommendedProducts,
      })
    } catch {
      // JSON 파싱 실패 시 텍스트만 반환
      return NextResponse.json({
        content: data.content[0].text,
        recommendedProducts: [],
      })
    }
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했어요.' }, { status: 500 })
  }
}
