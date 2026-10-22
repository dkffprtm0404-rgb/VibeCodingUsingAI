import { NextResponse } from 'next/server'

export function getAppOrigin(request: Request): string {
  const url = new URL(process.env.NEXT_PUBLIC_APP_URL || request.url)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('INVALID_APP_ORIGIN')
  return url.origin
}

/** 쿠키를 사용하는 쓰기 API는 같은 출처의 JSON 요청만 받는다. */
export function validateJsonMutation(request: Request): NextResponse | null {
  let expectedOrigin: string
  try {
    expectedOrigin = getAppOrigin(request)
  } catch {
    return NextResponse.json({ error: '요청 출처를 확인할 수 없어요.' }, { status: 403 })
  }
  const fetchSite = request.headers.get('sec-fetch-site')
  if (request.headers.get('origin') !== expectedOrigin
    || (fetchSite !== null && fetchSite !== 'same-origin' && fetchSite !== 'none')) {
    return NextResponse.json({ error: '허용되지 않은 출처의 요청이에요.' }, { status: 403 })
  }
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return NextResponse.json({ error: 'JSON 형식으로 요청해주세요.' }, { status: 415 })
  }
  return null
}
