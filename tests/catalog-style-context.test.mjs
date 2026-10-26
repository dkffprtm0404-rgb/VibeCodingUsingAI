import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

const load = createTypeScriptLoader()
const { chatPrompt, stylePrompt, parseStyleResult, parseChatAnswer } = load('src/lib/ai/shopping.ts')
const result = {
  type: '캐주얼', emoji: '🌿', description: '데일리 룩', keywords: ['캐주얼'],
  coordi: '여유롭게 입어보세요.', productIds: [19, 27, 23, 31, 9], tip: '톤을 맞춰보세요.',
}

test('the clothing diagnosis excludes beauty and kids, while shopping chat covers every store', () => {
  assert.ok(chatPrompt().includes('ID:19 |'))
  assert.ok(chatPrompt().includes('ID:27 |'))
  assert.ok(!stylePrompt().includes('ID:19 |'))
  assert.ok(!stylePrompt().includes('ID:27 |'))
  assert.ok(stylePrompt().includes('ID:23 |'))
  assert.ok(stylePrompt().includes('ID:31 |'))
})

test('style result validation enforces the same catalog boundary as its prompt', () => {
  assert.deepEqual(parseStyleResult(JSON.stringify(result)).productIds, [23, 31, 9])
  assert.deepEqual(parseChatAnswer(JSON.stringify({message:'추천',productIds:[19,27,23]}), 'codex').productIds, [19,27,23])
})
