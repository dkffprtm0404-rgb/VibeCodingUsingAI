/**
 * app/api/style-quiz/route.ts — AI 스타일 진단 API
 *
 * 유저의 답변을 받아 Claude API로 스타일 유형 분석 후
 * 맞춤 코디 + 추천 상품을 반환합니다.
 */

import { NextResponse } from 'next/server'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

export interface StyleQuizAnswer {
  situation: string  // 착용 상황
  fit: string        // 선호 핏
  vibe: string       // 선호 분위기
  color: string      // 선호 색감
}

export interface StyleResult {
  type: string           // 스타일 유형명
  emoji: string          // 유형 이모지
  description: string    // 유형 설명
  keywords: string[]     // 스타일 키워드
  coordi: string         // 추천 코디 설명
  productIds: number[]   // 추천 상품 ID
  tip: string            // 스타일링 팁
}

export async function POST(request: Request) {
  try {
    const answers: StyleQuizAnswer = await request.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API 키가 설정되지 않았어요.' }, { status: 500 })
    }

    const productContext = MOCK_PRODUCTS
      .filter((p) => p.stock > 0)
      .map((p) => `ID:${p.id} | ${p.name} | ${p.category} | ${p.price.toLocaleString()}원`)
      .join('\n')

    const systemPrompt = `당신은 전문 패션 스타일리스트 AI입니다.
고객의 스타일 설문 답변을 분석해서 맞춤 스타일 진단 결과를 제공합니다.

재고 있는 상품 목록:
${productContext}

반드시 아래 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "type": "스타일 유형명 (예: 모던 미니멀리스트, 캐주얼 스트리터, 클래식 엘레강스 등)",
  "emoji": "유형을 표현하는 이모지 1개",
  "description": "이 스타일 유형에 대한 설명 2문장",
  "keywords": ["키워드1", "키워드2", "키워드3"],
  "coordi": "추천 코디 조합 설명 (구체적인 상품명 포함, 2문장)",
  "productIds": [추천 상품 ID 3개, 재고 있는 상품만],
  "tip": "이 스타일 유형을 위한 실용적인 스타일링 팁 1문장"
}`

    const userMessage = `
착용 상황: ${answers.situation}
선호 핏: ${answers.fit}
선호 분위기: ${answers.vibe}
선호 색감: ${answers.color}
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
        max_tokens: 800,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return NextResponse.json({ error: '분석 중 오류가 발생했어요.' }, { status: 500 })
    }

    const raw = data.content[0].text.trim()
    const cleaned = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    const result: StyleResult = JSON.parse(cleaned)

    // 추천 상품 데이터 조회
    const recommendedProducts = MOCK_PRODUCTS.filter(
      (p) => result.productIds.includes(p.id) && p.stock > 0
    )

    return NextResponse.json({ result, recommendedProducts })
  } catch {
    return NextResponse.json({ error: '스타일 분석 중 오류가 발생했어요.' }, { status: 500 })
  }
}
