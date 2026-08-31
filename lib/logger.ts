/**
 * Structured JSON logger — zero dependencies.
 *
 * Deliberately NOT pino: this app builds with `output: 'standalone'` and the
 * Docker runner copies only `.next/standalone`, so pino's worker-thread
 * transports (pino-pretty) resolve paths that do not exist in the image and
 * only blow up in production. It also rode into the browser bundle through the
 * ~50 client components that import this module.
 *
 * API is pino-compatible on purpose so the ~1000 existing call sites keep
 * working untouched: logger.info({ orgId }, 'msg') and logger.info('msg').
 */

type Level = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

const LEVELS: Record<Level, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
}

const threshold =
  LEVELS[(process.env.LOG_LEVEL as Level)] ?? LEVELS.info
const isDev = process.env.NODE_ENV === 'development'

/**
 * LGPD: this is a clinic CRM — contact e-mails, patient names and phone numbers
 * reach ~65 log call sites. Identify records by id (contactId, dealId, orgId),
 * never by the person. Credentials are redacted for the obvious reason.
 */
const REDACT = new Set([
  'email',
  'name',
  'nome',
  'phone',
  'telefone',
  'whatsapp',
  'cpf',
  'cep',
  'address',
  'endereco',
  'birthDate',
  'dataNascimento',
  'password',
  'senha',
  'token',
  'apiKey',
  'secret',
  'authorization',
])

function isError(v: unknown): v is Error {
  // instanceof fails across realms (worker/vm), so sniff the shape too
  return (
    v instanceof Error ||
    (typeof v === 'object' &&
      v !== null &&
      typeof (v as Error).message === 'string' &&
      typeof (v as Error).stack === 'string')
  )
}

/**
 * JSON.stringify that survives what real call sites pass in: Error values
 * (which stringify to `{}` and would silently erase every stack trace),
 * circular objects (which throw), and BigInt (which throws).
 */
function safeStringify(record: unknown): string {
  const seen = new WeakSet<object>()
  try {
    return JSON.stringify(record, (key, value) => {
      if (REDACT.has(key) && value !== undefined && value !== null) {
        return '[redacted]'
      }
      if (isError(value)) {
        return {
          type: value.name,
          message: value.message,
          stack: value.stack,
          ...(value.cause !== undefined ? { cause: String(value.cause) } : {}),
        }
      }
      if (typeof value === 'bigint') return value.toString()
      if (typeof value === 'function') return undefined
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]'
        seen.add(value)
      }
      return value
    })
  } catch (err) {
    // a logger must never take a request down with it
    return JSON.stringify({
      level: 'error',
      msg: 'logger: failed to serialize record',
      err: String(err),
    })
  }
}

type Fields = Record<string, unknown>

function emit(level: Level, bindings: Fields, args: any[]) {
  if (LEVELS[level] < threshold) return

  let fields: Fields = {}
  let msg: string | undefined
  let extras: unknown[]

  if (typeof args[0] === 'string') {
    msg = args[0]
    extras = args.slice(1)
  } else {
    // spreading an Error yields {} — message and stack are non-enumerable
    fields = isError(args[0]) ? { err: args[0] } : ((args[0] as Fields) ?? {})
    if (typeof args[1] === 'string') {
      msg = args[1]
      extras = args.slice(2)
    } else {
      extras = args.slice(1)
    }
  }

  const record = {
    level,
    time: new Date().toISOString(),
    env: process.env.NODE_ENV,
    ...bindings,
    ...fields,
    ...(msg !== undefined ? { msg } : {}),
    ...(extras.length > 0 ? { args: extras } : {}),
  }

  const sink =
    level === 'error' || level === 'fatal'
      ? console.error
      : level === 'warn'
        ? console.warn
        : console.log

  // ponytail: console IS the sink — Next standalone and the browser both
  // forward it to stdout/devtools. No transport, no worker, nothing to break.
  const line = safeStringify(record)
  if (isDev) {
    // same serialization (so redaction and Error stacks behave identically in dev),
    // just handed to devtools as an object instead of a raw line
    sink(`[${level}] ${msg ?? ''}`, JSON.parse(line))
  } else {
    sink(line)
  }
}

export interface Logger {
  trace(...args: any[]): void
  debug(...args: any[]): void
  info(...args: any[]): void
  warn(...args: any[]): void
  error(...args: any[]): void
  fatal(...args: any[]): void
  child(context: Fields): Logger
}

function build(bindings: Fields): Logger {
  return {
    trace: (...args) => emit('trace', bindings, args),
    debug: (...args) => emit('debug', bindings, args),
    info: (...args) => emit('info', bindings, args),
    warn: (...args) => emit('warn', bindings, args),
    error: (...args) => emit('error', bindings, args),
    fatal: (...args) => emit('fatal', bindings, args),
    child: (context: Fields) => build({ ...bindings, ...context }),
  }
}

const logger = build({})

/**
 * Create a child logger with additional context
 * @param context - Additional fields to include in all logs
 */
export function createLogger(context: Fields): Logger {
  return logger.child(context)
}

/**
 * Generate a correlation ID for request tracking
 * @returns UUID v4 string
 */
export function generateCorrelationId(): string {
  return crypto.randomUUID()
}

/**
 * Log levels: trace(10) debug(20) info(30) warn(40) error(50) fatal(60).
 * Set LOG_LEVEL to raise or lower the floor (default: info).
 */

export default logger
