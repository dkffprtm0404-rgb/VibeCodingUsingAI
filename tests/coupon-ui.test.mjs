import assert from 'node:assert/strict'
import test from 'node:test'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

function findElement(element, predicate) {
  if (!React.isValidElement(element)) return undefined
  if (predicate(element)) return element
  for (const child of React.Children.toArray(element.props.children)) {
    const found = findElement(child, predicate)
    if (found) return found
  }
  return undefined
}

test('cancelling an applied coupon remains a non-submit control in checkout', () => {
  let removalCount = 0
  const load = createTypeScriptLoader({
    react: { ...React, useEffect() {} },
    '@/hooks/useCoupon': {
      useCoupon() {
        return {
          code: '', setCode() {}, isLoading: false, error: '', apply() {},
          appliedCoupon: { code: 'WELCOME', label: 'Welcome coupon', discountAmount: 3000 },
          remove() { removalCount += 1 },
        }
      },
    },
  })
  const { CouponInput } = load('src/components/features/order/CouponInput.tsx')
  const coupon = CouponInput({ totalPrice: 100000, onApply() {} })
  const cancel = findElement(coupon, (element) => element.type === 'button' && element.props.children.trim() === '취소')
  assert.ok(cancel, 'the applied coupon exposes its cancellation control')
  assert.equal(cancel.props.type, 'button', 'coupon cancellation must not submit the containing checkout form')
  cancel.props.onClick()
  assert.equal(removalCount, 1, 'cancellation still invokes the existing coupon removal action')

  const markup = renderToStaticMarkup(React.createElement('form', null, coupon))
  assert.match(markup, /<button\b[^>]*type="button"[^>]*>취소<\/button>/)
})
