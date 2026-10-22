import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

beforeEach((context) => {
  const names = ['NEXT_PUBLIC_APP_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
  const old = new Map(names.map((name) => [name, process.env[name]]))
  delete process.env.NEXT_PUBLIC_APP_URL
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://auth.example.test'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-public-key'
  context.after(() => old.forEach((value, name) => {
    if (value === undefined) delete process.env[name]
    else process.env[name] = value
  }))
})

const body = { email: 'alice@example.test', password: 'test-password', name: 'Alice' }
function request(payload = body, path = 'signup') {
  return new Request(`http://localhost/api/auth/${path}`, {
    method: 'POST', headers: { Origin: 'http://localhost', 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  })
}

function setup(context, { autoConfirm = false, settingsError = false, signupError = null, signInError = null, callbackError = null, signOutError = null } = {}) {
  const calls = { admin: 0, signup: [], signIn: [], exchange: [], settings: [], signOut: 0 }
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.settings.push({ url, options })
    if (settingsError) throw new TypeError('private settings detail')
    return Response.json({ mailer_autoconfirm: autoConfirm, disable_signup: false })
  })
  const load = createTypeScriptLoader({
    '@supabase/supabase-js': { createClient: () => { calls.admin++; throw new Error('ADMIN_MUST_NOT_RUN') } },
    '@/lib/supabase/server': { createClient: async () => ({ auth: {
      signUp: async (input) => { calls.signup.push(input); return { data: { user: { id: 'alice' }, session: null }, error: signupError } },
      signInWithPassword: async (input) => { calls.signIn.push(input); return { data: { user: { id: 'alice' } }, error: signInError } },
      exchangeCodeForSession: async (code) => { calls.exchange.push(code); return { data: { session: {} }, error: callbackError } },
      signOut: async () => { calls.signOut++; return { error: signOutError } },
    } }) },
  })
  return { load, calls }
}

test('signup uses public signUp and requests confirmation without admin creation or password login', async (context) => {
  const api = setup(context)
  const response = await api.load('app/api/auth/signup/route.ts').POST(request())
  assert.equal(response.status, 201)
  assert.deepEqual(await response.json(), { requireEmailConfirmation: true })
  assert.equal(api.calls.admin, 0)
  assert.equal(api.calls.signIn.length, 0)
  assert.deepEqual(api.calls.signup, [{ email: 'alice@example.test', password: 'test-password', options: { data: { name: 'Alice' }, emailRedirectTo: 'http://localhost/auth/callback' } }])
})

test('signup confirmation link uses the same trusted public origin and preserves only name metadata', async (context) => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://shop.example.test'
  const api = setup(context)
  const response = await api.load('app/api/auth/signup/route.ts').POST(new Request('http://internal:3000/api/auth/signup', {
    method: 'POST', headers: { Origin: 'https://shop.example.test', 'Content-Type': 'application/json', 'X-Forwarded-Host': 'attacker.invalid' }, body: JSON.stringify(body),
  }))
  assert.equal(response.status, 201)
  assert.deepEqual(api.calls.signup, [{ email: 'alice@example.test', password: 'test-password', options: { data: { name: 'Alice' }, emailRedirectTo: 'https://shop.example.test/auth/callback' } }])
})

for (const options of [{ autoConfirm: true }, { settingsError: true }]) {
  test(`signup fails closed before creating users when confirmation settings are ${options.autoConfirm ? 'disabled' : 'unavailable'}`, async (context) => {
    const api = setup(context, options)
    const response = await api.load('app/api/auth/signup/route.ts').POST(request())
    assert.equal(response.status, 503)
    assert.equal(api.calls.signup.length, 0)
    assert.equal(api.calls.admin, 0)
  })
}

for (const [name, payload] of [['null body', null], ['object email', { ...body, email: {} }], ['blank name', { ...body, name: ' ' }], ['malformed email', { ...body, email: 'not-email' }], ['short password', { ...body, password: '123' }], ['oversized name', { ...body, name: 'x'.repeat(101) }]]) {
  test(`signup rejects ${name} before any external request`, async (context) => {
    const api = setup(context)
    assert.equal((await api.load('app/api/auth/signup/route.ts').POST(request(payload))).status, 400)
    assert.equal(api.calls.signup.length, 0)
    assert.equal(api.calls.settings.length, 0)
    assert.equal(api.calls.admin, 0)
  })
}

test('signup does not expose provider error details', async (context) => {
  const api = setup(context, { signupError: { message: 'private provider detail' } })
  const response = await api.load('app/api/auth/signup/route.ts').POST(request())
  assert.equal(response.status, 400)
  assert.ok(!JSON.stringify(await response.json()).includes('private provider detail'))
})

test('same-origin login still authenticates with the password and hides credential errors', async (context) => {
  const api = setup(context, { signInError: { message: 'private auth detail' } })
  const response = await api.load('app/api/auth/login/route.ts').POST(request(body, 'login'))
  assert.equal(response.status, 401)
  assert.deepEqual(api.calls.signIn, [{ email: 'alice@example.test', password: 'test-password' }])
  assert.ok(!JSON.stringify(await response.json()).includes('private auth detail'))
})

test('login rejects malformed credentials before authentication', async (context) => {
  const api = setup(context)
  assert.equal((await api.load('app/api/auth/login/route.ts').POST(request({ email: {}, password: [] }, 'login'))).status, 400)
  assert.equal(api.calls.signIn.length, 0)
})

test('logout does not report success when the authentication provider fails', async (context) => {
  const api = setup(context, { signOutError: { message: 'private logout detail' } })
  const response = await api.load('app/api/auth/logout/route.ts').POST(request({}, 'logout'))
  assert.equal(response.status, 503)
  assert.ok(!JSON.stringify(await response.json()).includes('private logout detail'))
})

test('PKCE callback exchanges the verifier-bound code and ignores attacker redirect parameters', async (context) => {
  const api = setup(context)
  const response = await api.load('app/auth/callback/route.ts').GET(new Request('http://localhost/auth/callback?code=one-time-code&next=https://attacker.invalid'))
  assert.equal(response.headers.get('location'), 'http://localhost/')
  assert.deepEqual(api.calls.exchange, ['one-time-code'])
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer')
})

test('PKCE callback missing or expired code redirects to a safe explanation without secrets', async (context) => {
  const api = setup(context, { callbackError: { message: 'private token detail' } })
  const callback = api.load('app/auth/callback/route.ts').GET
  for (const query of ['', '?code=expired']) {
    const response = await callback(new Request(`http://localhost/auth/callback${query}`))
    assert.equal(response.headers.get('location'), 'http://localhost/login?confirmation=error')
    assert.ok(!response.headers.get('location').includes('expired'))
  }
})
