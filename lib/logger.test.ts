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

  it('keeps trailing extra args (logger.error("msg:", value))', () => {
    logger.error('tool error:', { code: 42 })
    expect(captured(err).args).toEqual([{ code: 42 }])
  })
})
