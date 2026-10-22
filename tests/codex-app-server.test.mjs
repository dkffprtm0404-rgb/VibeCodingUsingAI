import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { PassThrough, Writable } from 'node:stream'
import { test } from 'node:test'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

const request = { systemPrompt: '상품 데이터로 답변한다.', messages: [{ role: 'user', content: '추천해줘' }], outputSchema: { type: 'object' }, maxTokens: 500 }

function setup(context, { auth = 'chatgpt', completion = 'completed', tool = false, silent = false, customProvider = false } = {}) {
  const oldValues = new Map(['MYSHOP_CODEX_EXECUTABLE', 'OPENAI_API_KEY', 'CODEX_API_KEY', 'OPENAI_BASE_URL'].map((key) => [key, process.env[key]]))
  process.env.MYSHOP_CODEX_EXECUTABLE = 'test-codex.exe'
  process.env.OPENAI_API_KEY = 'must-not-reach-child'
  process.env.CODEX_API_KEY = 'must-not-reach-child'
  process.env.OPENAI_BASE_URL = 'https://must-not-use.invalid'
  context.after(() => oldValues.forEach((value, key) => {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }))
  const writes = []
  const child = new EventEmitter()
  child.stdout = new PassThrough()
  child.killed = false
  child.kill = () => { child.killed = true; child.emit('exit', 0, null); return true }
  const emit = (message) => child.stdout.write(JSON.stringify(message) + '\n')
  child.stdin = new Writable({ write(buffer, _encoding, done) {
    const message = JSON.parse(buffer.toString())
    writes.push(message)
    done()
    if (!message.method || !message.id || silent) return
    queueMicrotask(() => {
      let result = {}
      if (message.method === 'account/read') result = { account: auth ? { type: auth } : null }
      if (message.method === 'config/read') result = { config: { mcp_servers: { unsafe: {} }, model_providers: customProvider ? { openai: { base_url: 'https://custom.invalid' } } : {} } }
      if (message.method === 'thread/start') result = { thread: { id: 'thread-1' }, model: 'gpt-6-sol' }
      if (message.method === 'turn/start') {
        result = { turn: { id: 'turn-1' } }
        // Events can arrive before the turn/start response. The client must not lose them.
        if (tool) emit({ method: 'item/started', params: { threadId: 'thread-1', turnId: 'turn-1', item: { type: 'commandExecution' } } })
        else {
          emit({ method: 'item/completed', params: { threadId: 'thread-1', turnId: 'turn-1', item: { type: 'agentMessage', text: '{"message":"완료","productIds":[1]}' } } })
          emit({ method: 'turn/completed', params: { threadId: 'thread-1', turn: { id: 'turn-1', status: completion } } })
        }
      }
      emit({ id: message.id, result })
    })
  } })
  let spawnCall
  const load = createTypeScriptLoader({ 'node:child_process': { spawn: (command, args, options) => {
    spawnCall = { command, args, options }
    return child
  } } })
  return { client: load('src/lib/ai/codex-app-server.ts'), child, writes, get spawnCall() { return spawnCall } }
}

test('uses ChatGPT auth, exact gpt-6-sol, structured output and a tool-free ephemeral thread', async (context) => {
  const api = setup(context)
  const answer = await api.client.requestCodex(request)
  assert.deepEqual(JSON.parse(answer), { message: '완료', productIds: [1] })
  const thread = api.writes.find((message) => message.method === 'thread/start').params
  const turn = api.writes.find((message) => message.method === 'turn/start').params
  assert.equal(thread.model, 'gpt-6-sol')
  assert.equal(thread.modelProvider, 'openai')
  assert.equal(thread.ephemeral, true)
  assert.equal(thread.approvalPolicy, 'never')
  assert.equal(thread.sandbox, 'read-only')
  assert.equal(thread.config['mcp_servers.unsafe.enabled'], false)
  assert.deepEqual(thread.environments, [])
  assert.deepEqual(turn.outputSchema, { type: 'object' })
  assert.equal(turn.sandboxPolicy.type, 'readOnly')
  assert.equal(turn.sandboxPolicy.networkAccess, false)
  assert.notEqual(api.spawnCall.options.cwd, process.cwd())
  assert.equal(api.spawnCall.options.shell, false)
  assert.equal(api.spawnCall.options.windowsHide, true)
  for (const key of ['OPENAI_API_KEY', 'CODEX_API_KEY', 'OPENAI_BASE_URL']) assert.equal(api.spawnCall.options.env[key], undefined)
  assert.ok(api.spawnCall.args.includes('forced_login_method="chatgpt"'))
  assert.equal(api.child.killed, true)
})

for (const auth of [null, 'apiKey', 'amazonBedrock']) {
  test(`rejects ${auth ?? 'missing'} authentication before starting inference`, async (context) => {
    const api = setup(context, { auth })
    await assert.rejects(api.client.requestCodex(request))
    assert.ok(!api.writes.some((message) => message.method === 'turn/start'))
    assert.equal(api.child.killed, true)
  })
}

test('rejects a custom OpenAI provider before inference', async (context) => {
  const api = setup(context, { customProvider: true })
  await assert.rejects(api.client.requestCodex(request))
  assert.ok(!api.writes.some((message) => message.method === 'turn/start'))
})

for (const completion of ['failed', 'interrupted']) {
  test(`does not return partial agent text when the turn is ${completion}`, async (context) => {
    const api = setup(context, { completion })
    await assert.rejects(api.client.requestCodex(request))
    assert.equal(api.child.killed, true)
  })
}

test('aborts an unexpected tool item instead of allowing a shopping request to execute commands', async (context) => {
  const api = setup(context, { tool: true })
  await assert.rejects(api.client.requestCodex(request))
  assert.equal(api.child.killed, true)
})

test('times out a silent child and releases the process slot', async (context) => {
  const api = setup(context, { silent: true })
  await assert.rejects(api.client.requestCodex(request, { timeoutMs: 100 }))
  assert.equal(api.child.killed, true)
})

test('rejects concurrent Codex requests and terminates a cancelled request', async (context) => {
  const api = setup(context, { silent: true })
  const controller = new AbortController()
  const first = api.client.requestCodex(request, { signal: controller.signal })
  await assert.rejects(api.client.requestCodex(request))
  controller.abort()
  await assert.rejects(first)
  assert.equal(api.child.killed, true)
})
