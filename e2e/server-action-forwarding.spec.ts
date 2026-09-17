import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'

// Regression for the 2026-09-16 sirius outage, same code base: Next 16.1.1 forwards
// a Server Action to the route *pattern* of the page that owns it ("/[locale]/dashboard"),
// that URL 404s and the 404 forwards again — forever, with no login needed. Next 16.3.x
// stops re-forwarding requests that carry `x-action-forwarded`.
const MANIFEST = '.next/server/server-reference-manifest.json'

test('a Server Action posted to a page that does not own it answers fast', async ({ request }) => {
  test.skip(!existsSync(MANIFEST), 'needs a production build (next build)')

  const actions: Record<string, { workers: Record<string, unknown> }> =
    JSON.parse(readFileSync(MANIFEST, 'utf8')).node
  // dashboard-only, so the public home page cannot own it whatever its worker is called
  const actionId = Object.keys(actions).find((id) => {
    const workers = Object.keys(actions[id].workers)
    return workers.length > 0 && workers.every((w) => w.includes('/dashboard'))
  })
  expect(actionId, 'an action that only the dashboard owns').toBeTruthy()

  // Throws "Timeout 15000ms exceeded" while the forwarding loop is alive.
  const res = await request.post('/', {
    headers: { 'Next-Action': actionId!, 'Content-Type': 'text/plain;charset=UTF-8' },
    data: '[]',
    timeout: 15_000,
  })
  expect(res.status()).toBeLessThan(500)
})
