import { ANTHROPIC_MESSAGES_URL, CLAUDE_MODEL, CLAUDE_TIMEOUT_MS, CODEX_MODEL } from '@/constants/ai'
import { requestCodex } from '@/lib/ai/codex-app-server'
import { isRecord } from '@/lib/utils'
import type { AiProvider, AiRequest } from '@/types/ai'

async function requestClaude(input: AiRequest, signal: AbortSignal): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('CLAUDE_KEY_MISSING')
  const response = await fetch(ANTHROPIC_MESSAGES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: input.maxTokens, system: input.systemPrompt, messages: input.messages }),
    signal: AbortSignal.any([signal, AbortSignal.timeout(CLAUDE_TIMEOUT_MS)]),
  })
  if (!response.ok) throw new Error('CLAUDE_HTTP_ERROR')
  const data: unknown = await response.json()
  if (!isRecord(data) || !Array.isArray(data.content)) throw new Error('CLAUDE_INVALID_RESPONSE')
  const text = data.content.filter((block) => isRecord(block) && typeof block.text === 'string')
    .map((block) => block.text).join('\n').trim()
  if (!text) throw new Error('CLAUDE_EMPTY_RESPONSE')
  return text
}

export async function requestAi<T>(input: AiRequest, parse: (raw: string, provider: AiProvider) => T, signal: AbortSignal) {
  if (signal.aborted) throw new Error('AI_REQUEST_ABORTED')
  try {
    const value = parse(await requestClaude(input, signal), 'claude')
    return { value, provider: 'claude', model: CLAUDE_MODEL }
  } catch {
    if (signal.aborted) throw new Error('AI_REQUEST_ABORTED')
  }
  const value = parse(await requestCodex(input, { signal }), 'codex')
  return { value, provider: 'codex', model: CODEX_MODEL }
}
