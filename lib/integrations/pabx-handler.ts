import { prisma } from '@/lib/prisma'

export type PabxProvider = 'intelbras' | 'yealink' | 'asterisk' | 'generic'

export interface NormalizedCallEvent {
  caller: string // E.164 or local number
  callee: string
  direction: 'inbound' | 'outbound'
  status: 'ringing' | 'answered' | 'completed' | 'missed' | 'failed'
  duration?: number // seconds
  timestamp: Date
  recordingUrl?: string
}

/**
 * Normalize various PABX vendor payloads into a unified schema.
 * Extend per-vendor as needed.
 */
export function normalizePabxPayload(provider: PabxProvider, raw: unknown): NormalizedCallEvent | null {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Record<string, unknown>

  switch (provider) {
    case 'intelbras': {
      const caller = String(data.from ?? data.caller_number ?? '')
      const callee = String(data.to ?? data.callee_number ?? '')
      const statusRaw = String(data.status ?? data.event ?? 'completed').toLowerCase()
      return {
        caller,
        callee,
        direction: (data.direction === 'outbound' ? 'outbound' : 'inbound') as 'inbound' | 'outbound',
        status: mapStatus(statusRaw),
        duration: typeof data.duration === 'number' ? data.duration : undefined,
        timestamp: data.timestamp ? new Date(String(data.timestamp)) : new Date(),
        recordingUrl: data.recording_url ? String(data.recording_url) : undefined,
      }
    }

    case 'yealink':
    case 'asterisk':
    case 'generic':
    default: {
      // Generic shape — expects normalized fields directly
      const caller = String(data.caller ?? data.from ?? '')
      const callee = String(data.callee ?? data.to ?? '')
      if (!caller && !callee) return null
      return {
        caller,
        callee,
        direction: data.direction === 'outbound' ? 'outbound' : 'inbound',
        status: mapStatus(String(data.status ?? 'completed')),
        duration: typeof data.duration === 'number' ? data.duration : undefined,
        timestamp: data.timestamp ? new Date(String(data.timestamp)) : new Date(),
        recordingUrl: data.recordingUrl ? String(data.recordingUrl) : undefined,
      }
    }
  }
}

function mapStatus(s: string): NormalizedCallEvent['status'] {
  const v = s.toLowerCase()
  if (v.includes('ring')) return 'ringing'
  if (v.includes('answer')) return 'answered'
  if (v.includes('miss') || v.includes('no-answer')) return 'missed'
  if (v.includes('fail') || v.includes('error')) return 'failed'
  return 'completed'
}

/**
 * Normalize a phone number for matching: keep only digits, take last 9-11.
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '').slice(-11)
}

/**
 * Match an incoming call to a patient by phone, then log as Activity.
 */
export async function matchAndLogCall(orgId: string, event: NormalizedCallEvent): Promise<void> {
  const phoneToMatch = event.direction === 'inbound' ? event.caller : event.callee
  const normalized = normalizePhone(phoneToMatch)

  if (!normalized) return

  const patient = await prisma.patient.findFirst({
    where: {
      organizationId: orgId,
      telefone: { contains: normalized.slice(-9) },
    },
    select: { id: true, nome: true },
  })

  await prisma.integrationLog.create({
    data: {
      organizationId: orgId,
      type: 'PABX',
      action: `call.${event.status}`,
      status: 'SUCCESS',
      request: {
        caller: event.caller,
        callee: event.callee,
        direction: event.direction,
        duration: event.duration,
        matchedPatientId: patient?.id,
        matchedPatientName: patient?.nome,
        recordingUrl: event.recordingUrl,
      } as never,
    },
  }).catch(() => {})
}
