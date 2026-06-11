import { NextRequest, NextResponse } from 'next/server'
import { redis } from './redis'

type RateLimitConfig = {
  limit: number
  windowSeconds: number
}

// --------------- In-memory fallback (when Redis unavailable) ---------------
const memoryStore = new Map<string, { count: number; resetAt: number }>()

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, val] of memoryStore) {
      if (val.resetAt < now) memoryStore.delete(key)
    }
  }, 5 * 60 * 1000)
}

function memoryRateLimit(
  key: string,
  config: RateLimitConfig
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const entry = memoryStore.get(key)

  if (!entry || entry.resetAt < now) {
    const resetAt = now + config.windowSeconds * 1000
    memoryStore.set(key, { count: 1, resetAt })
    return { success: true, remaining: config.limit - 1, reset: resetAt }
  }

  if (entry.count >= config.limit) {
    return { success: false, remaining: 0, reset: entry.resetAt }
  }

  entry.count++
  return { success: true, remaining: config.limit - entry.count, reset: entry.resetAt }
}

// --------------- Redis (ioredis) sliding window ---------------
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

async function redisRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<{ success: boolean; remaining: number; reset: number } | null> {
  if (!redis) return null

  try {
    const windowMs = config.windowSeconds * 1000
    const result = await redis.eval(
      SLIDING_WINDOW_SCRIPT,
      1,
      key,
      Date.now(),
      windowMs,
      config.limit
    ) as [number, number, number, number]

    return {
      success: result[0] === 1,
      remaining: result[2],
      reset: result[3],
    }
  } catch {
    return null
  }
}

// --------------- Public API ---------------

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}

export async function checkRateLimit(
  req: NextRequest,
  prefix: string,
  config: RateLimitConfig
): Promise<NextResponse | null> {
  const ip = getClientIP(req)
  const key = `ratelimit:${prefix}:${ip}`

  const result =
    (await redisRateLimit(key, config)) ??
    memoryRateLimit(key, config)

  if (!result.success) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000)
    return NextResponse.json(
      { error: 'Muitas requisições. Tente novamente mais tarde.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.max(retryAfter, 1)),
          'X-RateLimit-Limit': String(config.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(result.reset),
        },
      }
    )
  }

  return null
}

/**
 * For Server Actions (no NextRequest available) — rate limit by an arbitrary
 * key (usually the client IP from next/headers). Returns true when BLOCKED.
 */
export async function isRateLimitedByKey(
  key: string,
  prefix: string,
  config: RateLimitConfig
): Promise<boolean> {
  const fullKey = `ratelimit:${prefix}:${key}`
  const result = (await redisRateLimit(fullKey, config)) ?? memoryRateLimit(fullKey, config)
  return !result.success
}

export const authRateLimit        = (req: NextRequest) => checkRateLimit(req, 'auth',             { limit: 5,   windowSeconds: 15 * 60 })
export const agiRateLimit          = (req: NextRequest) => checkRateLimit(req, 'agi',              { limit: 200, windowSeconds: 60 * 60 })
export const contactRateLimit      = (req: NextRequest) => checkRateLimit(req, 'contact',          { limit: 3,   windowSeconds: 60 * 60 })
export const leadCaptureRateLimit  = (req: NextRequest) => checkRateLimit(req, 'lead',             { limit: 10,  windowSeconds: 60 * 60 })
export const webhookRateLimit      = (req: NextRequest) => checkRateLimit(req, 'webhook',          { limit: 200, windowSeconds: 60 })
export const analyticsIngestRateLimit = (req: NextRequest) => checkRateLimit(req, 'analytics-ingest', { limit: 60, windowSeconds: 60 })
export const publicRateLimit       = (req: NextRequest) => checkRateLimit(req, 'public',           { limit: 20,  windowSeconds: 60 })
export const billingRateLimit      = (req: NextRequest) => checkRateLimit(req, 'billing',          { limit: 10,  windowSeconds: 15 * 60 })
export const scrapingRateLimit     = (req: NextRequest) => checkRateLimit(req, 'scraping',         { limit: 5,   windowSeconds: 10 * 60 })
