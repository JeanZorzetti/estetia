import { redis } from './redis'
import logger from './logger'

export const RATE_LIMITS = {
  FREE: { requestsPerMinute: 60, requestsPerHour: 1000, requestsPerDay: 10000 },
  PRO:  { requestsPerMinute: 300, requestsPerHour: 10000, requestsPerDay: 100000 },
} as const

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

// Atomic sliding window via Lua — removes expired entries, counts current, increments
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

export async function checkRateLimit(
  organizationId: string,
  plan: 'FREE' | 'PRO'
): Promise<RateLimitResult> {
  if (!redis) {
    return { success: true, limit: 999999, remaining: 999999, reset: Date.now() + 60000 }
  }

  const limit = RATE_LIMITS[plan].requestsPerMinute
  const windowMs = 60 * 1000
  const key = `ratelimit:api:${plan.toLowerCase()}:org:${organizationId}`

  try {
    const result = await redis.eval(
      SLIDING_WINDOW_SCRIPT,
      1,
      key,
      Date.now(),
      windowMs,
      limit
    ) as [number, number, number, number]

    return {
      success: result[0] === 1,
      limit: result[1],
      remaining: result[2],
      reset: result[3],
    }
  } catch (error) {
    logger.error({ organizationId, plan, error }, 'Rate limit check failed')
    return { success: true, limit: 0, remaining: 0, reset: Date.now() + 60000 }
  }
}

export function getRateLimitInfo(plan: 'FREE' | 'PRO') {
  return RATE_LIMITS[plan]
}

export async function resetRateLimit(organizationId: string, plan: 'FREE' | 'PRO') {
  if (!redis) throw new Error('Redis not configured')
  const key = `ratelimit:api:${plan.toLowerCase()}:org:${organizationId}`
  await redis.del(key)
  logger.info({ organizationId, plan }, 'Rate limit reset')
  return { success: true }
}
