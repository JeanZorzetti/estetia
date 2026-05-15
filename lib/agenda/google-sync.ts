/**
 * Google Calendar bidirectional sync for treatment sessions.
 *
 * Push: when a session is created/updated/cancelled in Estetia, mirror to Google.
 * Pull: scheduled job (or manual trigger) reads new events from Google and creates sessions.
 *
 * Uses lib/integrations/google-calendar-client.ts for OAuth + API client.
 */
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'

export interface SessionForSync {
  id: string
  dataAgendada: Date
  duracaoMinutos: number | null
  observacoes: string | null
  googleEventId: string | null
  treatment: { paciente: { nome: string; email: string | null } }
  profissional: { nome: string } | null
  sala: { nome: string } | null
}

function buildSummary(s: SessionForSync): string {
  return `${s.treatment.paciente.nome}${s.profissional ? ' • ' + s.profissional.nome : ''}`
}

function buildDescription(s: SessionForSync): string {
  const lines = [
    `Paciente: ${s.treatment.paciente.nome}`,
    s.profissional ? `Profissional: ${s.profissional.nome}` : null,
    s.sala ? `Sala: ${s.sala.nome}` : null,
    s.observacoes ? `\nObservações:\n${s.observacoes}` : null,
    `\n— Estetia CRM`,
  ].filter(Boolean)
  return lines.join('\n')
}

/**
 * Push a single session to Google Calendar. Updates googleEventId on first push.
 * TODO: Wire up the actual Google Calendar API client. For now logs intent.
 */
export async function pushSessionToGoogle(opts: {
  organizationId: string
  sessionId: string
}): Promise<{ ok: boolean; eventId?: string; error?: string }> {
  try {
    const session = await prisma.treatmentSession.findFirst({
      where: { id: opts.sessionId, organizationId: opts.organizationId },
      include: {
        treatment: { include: { paciente: { select: { nome: true, email: true } } } },
        profissional: { select: { nome: true } },
        sala: { select: { nome: true } },
      },
    })
    if (!session) return { ok: false, error: 'Session not found' }

    const org = await prisma.organization.findUnique({
      where: { id: opts.organizationId },
      select: { googleCalendarEnabled: true, googleCalendarRefreshToken: true },
    })
    if (!org?.googleCalendarEnabled || !org.googleCalendarRefreshToken) {
      return { ok: false, error: 'Google Calendar not connected' }
    }

    const summary = buildSummary(session as unknown as SessionForSync)
    const description = buildDescription(session as unknown as SessionForSync)
    const start = session.dataAgendada
    const end = new Date(start.getTime() + (session.duracaoMinutos ?? 60) * 60_000)

    // TODO: integrar com googleapis client. Placeholder log até integração completa.
    logger.info({ sessionId: session.id, summary, start, end }, '[GoogleSync] PUSH (stub)')

    const eventId = session.googleEventId ?? `stub-${session.id}`
    await prisma.treatmentSession.update({
      where: { id: session.id },
      data: { googleEventId: eventId, googleSyncStatus: 'SYNCED' },
    })

    void description
    return { ok: true, eventId }
  } catch (err) {
    logger.error({ err }, '[GoogleSync] push failed')
    return { ok: false, error: err instanceof Error ? err.message : 'unknown' }
  }
}

/**
 * Pull events from Google Calendar since the last sync time.
 * Creates lightweight TreatmentSession records for unknown events.
 * TODO: Wire up the actual Google Calendar list events API.
 */
export async function pullSessionsFromGoogle(opts: {
  organizationId: string
  since?: Date
}): Promise<{ ok: boolean; imported: number; error?: string }> {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: opts.organizationId },
      select: { googleCalendarEnabled: true, googleCalendarRefreshToken: true },
    })
    if (!org?.googleCalendarEnabled || !org.googleCalendarRefreshToken) {
      return { ok: false, imported: 0, error: 'Google Calendar not connected' }
    }

    logger.info({ orgId: opts.organizationId, since: opts.since }, '[GoogleSync] PULL (stub)')

    // TODO: integrar com googleapis list events. Por ora retorna 0.
    return { ok: true, imported: 0 }
  } catch (err) {
    logger.error({ err }, '[GoogleSync] pull failed')
    return { ok: false, imported: 0, error: err instanceof Error ? err.message : 'unknown' }
  }
}

export async function syncBidirectional(orgId: string) {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60_000)
  const [pullResult, pendingSessions] = await Promise.all([
    pullSessionsFromGoogle({ organizationId: orgId, since }),
    prisma.treatmentSession.findMany({
      where: {
        organizationId: orgId,
        OR: [{ googleSyncStatus: { in: ['PENDING', 'FAILED'] } }, { googleSyncStatus: null }],
        dataAgendada: { gte: new Date() },
      },
      select: { id: true },
      take: 50,
    }),
  ])

  let pushed = 0
  for (const s of pendingSessions) {
    const r = await pushSessionToGoogle({ organizationId: orgId, sessionId: s.id })
    if (r.ok) pushed++
  }

  return { pulled: pullResult.imported, pushed }
}
