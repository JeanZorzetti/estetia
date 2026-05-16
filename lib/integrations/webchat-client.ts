/**
 * Webchat widget client
 *
 * Lightweight chat widget embedded on clinic's website. Public widget identifies
 * the clinic by `webchatWidgetSecret` (org-scoped UUID-like token). Inbound messages
 * land on POST /api/integrations/webchat/inbound and create a Contact + ChatConversation.
 */

import crypto from 'crypto'

export function generateWidgetSecret(): string {
  return crypto.randomBytes(24).toString('hex')
}

export function buildEmbedSnippet(widgetSecret: string, origin: string): string {
  return `<script async src="${origin}/widget/webchat.js" data-clinic="${widgetSecret}"></script>`
}

export function isOriginAllowed(allowedCsv: string | null, origin: string): boolean {
  if (!allowedCsv) return true
  const list = allowedCsv
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  if (list.length === 0) return true
  return list.includes(origin.toLowerCase())
}
