export type AiProvider = 'claude' | 'codex'

export interface AiMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AiRequest {
  systemPrompt: string
  messages: AiMessage[]
  outputSchema: Record<string, unknown>
  maxTokens: number
}

export interface CodexRequestOptions {
  signal?: AbortSignal
  timeoutMs?: number
}

export interface ChatAnswer {
  content: string
  productIds: number[]
}
