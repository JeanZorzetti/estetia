import { redis } from '@/lib/redis'

const SLIDING_WINDOW_SCRIPT = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local windowStart = now - window
redis.call('ZREMRANGEBYSCORE', key, '-inf', windowStart)
local count = redis.call('ZCARD', key)
if count < limit then
  redis.call('ZADD', key, now, now .. math.random())
  redis.call('PEXPIRE', key, window)
  return {1, limit, limit - count - 1, now + window}
else
  return {0, limit, 0, now + window}
end
`

const LIMITS = {
  n8n:            { max: 100, windowMs: 60 * 60 * 1000, prefix: 'ratelimit:n8n' },
  whatsapp:       { max: 50,  windowMs: 60 * 60 * 1000, prefix: 'ratelimit:whatsapp' },
  'whatsapp-official': { max: 80, windowMs: 60 * 60 * 1000, prefix: 'ratelimit:waba' },
  'google-calendar':   { max: 200, windowMs: 60 * 60 * 1000, prefix: 'ratelimit:calendar' },
} as const

type Integration = keyof typeof LIMITS

async function limit(integration: Integration, organizationId: string) {
  if (!redis) return { success: true, limit: 999999, remaining: 999999, reset: Date.now() }

  const cfg = LIMITS[integration]
  const key = `${cfg.prefix}:${organizationId}`

  const result = await redis.eval(
    SLIDING_WINDOW_SCRIPT,
    1,
    key,
    Date.now(),
    cfg.windowMs,
    cfg.max
  ) as [number, number, number, number]

  return { success: result[0] === 1, limit: result[1], remaining: result[2], reset: result[3] }
}

export const n8nRateLimit            = { limit: (id: string) => limit('n8n', id) }
export const whatsappRateLimit       = { limit: (id: string) => limit('whatsapp', id) }
export const whatsappOfficialRateLimit = { limit: (id: string) => limit('whatsapp-official', id) }
export const googleCalendarRateLimit = { limit: (id: string) => limit('google-calendar', id) }

export async function checkRateLimit(
  integration: 'n8n' | 'whatsapp' | 'google-calendar',
  organizationId: string
) {
  return limit(integration === 'google-calendar' ? 'google-calendar' : integration, organizationId)
}

export async function resetRateLimit(
  integration: 'n8n' | 'whatsapp' | 'google-calendar',
  organizationId: string
) {
  if (!redis) return
  const prefix = LIMITS[integration === 'google-calendar' ? 'google-calendar' : integration].prefix
  await redis.del(`${prefix}:${organizationId}`)
}
