import { prisma } from '@/lib/prisma'

export interface ConflictInfo {
  sessionId: string
  pacienteNome: string
  profissionalId: string | null
  salaId: string | null
  dataAgendada: Date
  duracaoMinutos: number | null
  severity: 'BLOCK' | 'WARN'
  reason: 'PROFISSIONAL_OCUPADO' | 'SALA_OCUPADA' | 'FORA_HORARIO'
}

export interface CheckConflictsInput {
  organizationId: string
  dataAgendada: Date
  duracaoMinutos: number
  profissionalId?: string | null
  salaId?: string | null
  ignoreSessionId?: string | null
}

export async function detectConflicts(input: CheckConflictsInput): Promise<ConflictInfo[]> {
  const start = input.dataAgendada
  const end = new Date(start.getTime() + input.duracaoMinutos * 60_000)

  // Find sessions that overlap and share profissional or sala
  const candidates = await prisma.treatmentSession.findMany({
    where: {
      organizationId: input.organizationId,
      status: { notIn: ['CANCELADA', 'NO_SHOW', 'REALIZADA'] },
      dataAgendada: {
        gte: new Date(start.getTime() - 12 * 60 * 60_000), // look-back 12h
        lte: new Date(end.getTime() + 12 * 60 * 60_000),   // look-ahead 12h
      },
      ...(input.ignoreSessionId ? { id: { not: input.ignoreSessionId } } : {}),
      OR: [
        ...(input.profissionalId ? [{ profissionalId: input.profissionalId }] : []),
        ...(input.salaId ? [{ salaId: input.salaId }] : []),
      ],
    },
    include: {
      treatment: { include: { paciente: { select: { nome: true } } } },
    },
  })

  const conflicts: ConflictInfo[] = []
  for (const s of candidates) {
    const sStart = s.dataAgendada
    const sEnd = new Date(sStart.getTime() + (s.duracaoMinutos ?? 60) * 60_000)
    const overlap = sStart < end && sEnd > start
    if (!overlap) continue

    let reason: ConflictInfo['reason']
    if (input.profissionalId && s.profissionalId === input.profissionalId) {
      reason = 'PROFISSIONAL_OCUPADO'
    } else if (input.salaId && s.salaId === input.salaId) {
      reason = 'SALA_OCUPADA'
    } else {
      continue
    }

    conflicts.push({
      sessionId: s.id,
      pacienteNome: s.treatment.paciente.nome,
      profissionalId: s.profissionalId,
      salaId: s.salaId,
      dataAgendada: s.dataAgendada,
      duracaoMinutos: s.duracaoMinutos,
      severity: 'BLOCK',
      reason,
    })
  }

  return conflicts
}

export interface FreeSlot {
  start: Date
  end: Date
}

/**
 * Find free slots for given day, duration, optional professional/room.
 * Returns slots inside business hours (08-20) avoiding conflicts.
 */
export async function findFreeSlots(opts: {
  organizationId: string
  date: Date
  duracaoMinutos: number
  profissionalId?: string
  salaId?: string
}): Promise<FreeSlot[]> {
  const dayStart = new Date(opts.date)
  dayStart.setHours(8, 0, 0, 0)
  const dayEnd = new Date(opts.date)
  dayEnd.setHours(20, 0, 0, 0)

  const existing = await prisma.treatmentSession.findMany({
    where: {
      organizationId: opts.organizationId,
      status: { notIn: ['CANCELADA', 'NO_SHOW', 'REALIZADA'] },
      dataAgendada: { gte: dayStart, lte: dayEnd },
      ...(opts.profissionalId && { profissionalId: opts.profissionalId }),
      ...(opts.salaId && { salaId: opts.salaId }),
    },
    select: { dataAgendada: true, duracaoMinutos: true },
    orderBy: { dataAgendada: 'asc' },
  })

  const slots: FreeSlot[] = []
  let cursor = new Date(dayStart)
  const stepMs = 30 * 60_000 // 30min granularity

  while (cursor.getTime() + opts.duracaoMinutos * 60_000 <= dayEnd.getTime()) {
    const slotEnd = new Date(cursor.getTime() + opts.duracaoMinutos * 60_000)
    const blocked = existing.some(e => {
      const eEnd = new Date(e.dataAgendada.getTime() + (e.duracaoMinutos ?? 60) * 60_000)
      return e.dataAgendada < slotEnd && eEnd > cursor
    })
    if (!blocked) slots.push({ start: new Date(cursor), end: slotEnd })
    cursor = new Date(cursor.getTime() + stepMs)
  }

  return slots.slice(0, 10)
}
