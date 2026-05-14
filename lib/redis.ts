import Redis from 'ioredis'
import logger from './logger'

declare global {
  // eslint-disable-next-line no-var
  var __redis: Redis | undefined
}

function createRedisClient(): Redis | null {
  const url = process.env.REDIS_URL
  if (!url) return null

  try {
    const client = new Redis(url, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: true,
    })

    client.on('error', (err) => {
      logger.warn({ err: err.message }, 'Redis connection error')
    })

    client.on('connect', () => {
      logger.info('Redis connected')
    })

    return client
  } catch (err) {
    logger.warn({ err }, 'Failed to create Redis client')
    return null
  }
}

// Singleton — reuse across hot reloads in dev
export const redis: Redis | null =
  globalThis.__redis ?? (globalThis.__redis = createRedisClient() ?? undefined) ?? null
