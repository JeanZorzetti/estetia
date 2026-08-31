import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import logger, { createLogger } from './logger'

// NODE_ENV is 'test' under vitest, so the logger takes the JSON path (not dev pretty-print)
function captured(spy: ReturnType<typeof vi.spyOn>) {
  return JSON.parse(spy.mock.calls[0][0] as string)
}

describe('logger', () => {
  let log: ReturnType<typeof vi.spyOn>
  let err: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    log = vi.spyOn(console, 'log').mockImplementation(() => {})
    err = vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => vi.restoreAllMocks())

  it('logs pino-style object-first with message', () => {
    logger.info({ orgId: 'abc' }, 'org synced')
    const rec = captured(log)
    expect(rec).toMatchObject({ level: 'info', orgId: 'abc', msg: 'org synced' })
    expect(rec.time).toBeTruthy()
  })

  it('logs string-first', () => {
    logger.info('starting cron')
    expect(captured(log).msg).toBe('starting cron')
  })

  it('keeps Error message and stack instead of stringifying to {}', () => {
    // JSON.stringify(new Error()) === '{}' — this is the whole point of the serializer
    logger.error({ err: new Error('boom') }, 'failed')
    const rec = captured(err)
    expect(rec.err.message).toBe('boom')
    expect(rec.err.stack).toContain('boom')
    expect(rec.msg).toBe('failed')
  })

  it('serializes Errors under any key, not just `err`', () => {
    logger.error({ error: new Error('kaput') }, 'failed')
    expect(captured(err).error.message).toBe('kaput')
  })

  it('survives circular objects without throwing', () => {
    const a: any = { name: 'loop' }
    a.self = a
    expect(() => logger.error({ a }, 'circular')).not.toThrow()
    expect(captured(err).a.self).toBe('[Circular]')
  })

  it('routes errors to console.error and info to console.log', () => {
    logger.error('bad')
    expect(err).toHaveBeenCalledOnce()
    expect(log).not.toHaveBeenCalled()
  })

  it('drops levels below the threshold (default info)', () => {
    logger.debug({ x: 1 }, 'noisy')
    expect(log).not.toHaveBeenCalled()
  })

  it('child logger merges bindings into every record', () => {
    createLogger({ requestId: 'r-1' }).info({ step: 2 }, 'progress')
    expect(captured(log)).toMatchObject({ requestId: 'r-1', step: 2, msg: 'progress' })
  })

  it('accepts a bare Error as the only argument', () => {
    logger.error(new Error('naked'))
    expect(captured(err).err.message).toBe('naked')
  })

  it('redacts PII and credentials by key (LGPD — clinic CRM)', () => {
    logger.info(
      { email: 'paciente@x.com', name: 'Fulana', contactId: 'c-1', token: 'abc' },
      'contact synced'
    )
    const rec = captured(log)
    expect(rec.email).toBe('[redacted]')
    expect(rec.name).toBe('[redacted]')
    expect(rec.token).toBe('[redacted]')
    expect(rec.contactId).toBe('c-1')
  })

  it('redacts PII nested inside an object', () => {
    logger.info({ contact: { id: 'c-1', email: 'p@x.com' } }, 'nested')
    const rec = captured(log)
    expect(rec.contact.email).toBe('[redacted]')
    expect(rec.contact.id).toBe('c-1')
  })

  it('keeps trailing extra args (logger.error("msg:", value))', () => {
    logger.error('tool error:', { code: 42 })
    expect(captured(err).args).toEqual([{ code: 42 }])
  })
})

/**
 * Guard: runtime code logs through the logger, not console. Without this the
 * ~222 console.* calls that commit 3de3464 migrated just grow back one PR at a
 * time. scripts/ is deliberately out of scope — readable stdout is correct for
 * a CLI.
 */
describe('no console.* in runtime code', () => {
  const ALLOWED = new Set([
    // the logger IS the console sink
    'lib/logger.ts',
    // intentionally monkey-patches console.error to mute Clarity noise, plus a
    // console.debug inside the injected browser <script> string
    'components/microsoft-clarity.tsx',
    // console.log lives in a JSDoc usage example, not in the code
    'app/api/notifications/stream/route.ts',
  ])

  it('only the allowlisted files call console directly', async () => {
    const fs = await import('node:fs')
    const path = await import('node:path')
    const offenders: string[] = []

    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '__tests__') continue
          walk(full)
        } else if (/\.tsx?$/.test(entry.name) && !/\.(test|spec)\./.test(entry.name)) {
          const rel = full.split(path.sep).join('/')
          if (ALLOWED.has(rel)) continue
          if (/(^|[^.\w])console\.(log|error|warn|info|debug)\s*\(/m.test(fs.readFileSync(full, 'utf8'))) {
            offenders.push(rel)
          }
        }
      }
    }

    for (const dir of ['app', 'components', 'lib', 'hooks']) walk(dir)
    expect(offenders).toEqual([])
  })
})
