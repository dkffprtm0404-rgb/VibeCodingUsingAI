import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

function findByLabel(node, label) {
  if (!node || typeof node !== 'object') return undefined
  if ((node.props?.children === label || node.props?.['aria-label'] === label) && node.props.onClick) return node
  const children = node.props?.children
  for (const child of Array.isArray(children) ? children.flat(Infinity) : [children]) {
    const result = findByLabel(child, label)
    if (result) return result
  }
}

function setup(context) {
  const notices = []
  const navigations = []
  const state = []
  let cursor = 0
  const windowBefore = globalThis.window
  const originBefore = process.env.NEXT_PUBLIC_APP_URL
  delete process.env.NEXT_PUBLIC_APP_URL
  globalThis.window = { location: { href: '/products' } }
  context.after(() => {
    if (windowBefore === undefined) delete globalThis.window
    else globalThis.window = windowBefore
    if (originBefore === undefined) delete process.env.NEXT_PUBLIC_APP_URL
    else process.env.NEXT_PUBLIC_APP_URL = originBefore
  })
  const load = createTypeScriptLoader({
    react: { useState: (initial) => {
      const index = cursor++
      if (!(index in state)) state[index] = initial
      return [state[index], (value) => { state[index] = typeof value === 'function' ? value(state[index]) : value }]
    }, useCallback: (callback) => callback, useRef: () => ({ current: null }), useEffect: () => {}, useId: () => 'test-menu' },
    'next/link': 'a',
    'next/navigation': { useRouter: () => ({ push: (url) => navigations.push(url), refresh: () => {} }) },
    '@/components/ui/Toast': { toast: { error: (message) => notices.push(message) } },
    '@/lib/supabase/server': { createClient: async () => ({ auth: { signOut: async () => ({ error: null }) } }) },
  })
  return { load, notices, navigations, renderMenu: () => {
    cursor = 0
    return load('src/components/features/layout/MobileMenu.tsx').MobileMenu({ isLoggedIn: true, userName: 'Alice' })
  } }
}

test('mobile logout sends JSON so the actual CSRF guard allows signing out', async (context) => {
  const api = setup(context)
  const post = api.load('app/api/auth/logout/route.ts').POST
  let receivedStatus
  context.mock.method(globalThis, 'fetch', async (path, options) => {
    const headers = new Headers(options.headers)
    headers.set('Origin', 'http://localhost') // Browser-owned Origin header.
    const response = await post(new Request(new URL(path, 'http://localhost'), { ...options, headers }))
    receivedStatus = response.status
    return response
  })
  await findByLabel(api.renderMenu(), '로그아웃').props.onClick()
  assert.equal(receivedStatus, 200)
  assert.equal(globalThis.window.location.href, '/')
})

test('mobile logout failure keeps the page and tells the user instead of pretending to sign out', async (context) => {
  const api = setup(context)
  context.mock.method(globalThis, 'fetch', async () => Response.json({ error: '로그아웃 실패' }, { status: 503 }))
  await findByLabel(api.renderMenu(), '로그아웃').props.onClick()
  assert.equal(globalThis.window.location.href, '/products')
  assert.equal(api.notices.length, 1)
})

test('desktop logout failure also keeps the page and reports failure', async (context) => {
  const api = setup(context)
  context.mock.method(globalThis, 'fetch', async () => Response.json({ error: '로그아웃 실패' }, { status: 503 }))
  await api.load('src/hooks/useAuth.ts').useLogout().logout()
  assert.deepEqual(api.navigations, [])
  assert.equal(api.notices.length, 1)
})

test('mobile logout closes the top-layer menu so the failure toast is visible', async (context) => {
  const api = setup(context)
  context.mock.method(globalThis, 'fetch', async () => Response.json({ error: '로그아웃 실패' }, { status: 503 }))
  findByLabel(api.renderMenu(), '메뉴').props.onClick()
  assert.equal(findByLabel(api.renderMenu(), '메뉴').props['aria-expanded'], true)
  await findByLabel(api.renderMenu(), '로그아웃').props.onClick()
  assert.equal(findByLabel(api.renderMenu(), '메뉴').props['aria-expanded'], false)
  assert.equal(api.notices.length, 1)
})
