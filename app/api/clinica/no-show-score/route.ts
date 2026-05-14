import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/clinica/no-show-score
// Body: { sessionId } — computes and saves no-show risk score 0-100
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const { sessionId } = await req.json()

  const treatmentSession = await prisma.treatmentSession.findFirst({
    where: { id: sessionId, organizationId: user.organizationId },
    include: {
      treatment: {
        include: {
          paciente: {
            include: {
              treatments: {
                include: { sessions: { select: { status: true } } },
              },
            },
          },
        },
      },
    },
  })
  if (!treatmentSession) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

  const score = computeNoShowScore(treatmentSession)

  await prisma.treatmentSession.update({
    where: { id: sessionId },
    data: { noShowScore: score },
  })

  return NextResponse.json({ score, sessionId })
}

// GET /api/clinica/no-show-score?from=ISO&to=ISO
// Bulk compute scores for upcoming sessions
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from') ? new Date(searchParams.get('from')!) : new Date()
  const to = new Date(from.getTime() + 7 * 24 * 60 * 60 * 1000)

  const sessions = await prisma.treatmentSession.findMany({
    where: {
      organizationId: user.organizationId,
      dataAgendada: { gte: from, lte: to },
      status: { in: ['AGENDADA', 'CONFIRMADA'] },
      noShowScore: null,
    },
    include: {
      treatment: {
        include: {
          paciente: {
            include: {
              treatments: {
                include: { sessions: { select: { status: true } } },
              },
            },
          },
        },
      },
    },
    take: 50,
  })

  const updates = sessions.map((s: typeof sessions[number]) => ({
    id: s.id,
    score: computeNoShowScore(s),
  }))

  // Batch update
  await Promise.all(
    updates.map((u: { id: string; score: number }) =>
      prisma.treatmentSession.update({
        where: { id: u.id },
        data: { noShowScore: u.score },
      })
    )
  )

  return NextResponse.json({ updated: updates.length, scores: updates })
}

function computeNoShowScore(
  s: {
    dataAgendada: Date
    treatment: {
      paciente: {
        treatments: Array<{
          sessions: Array<{ status: string }>
        }>
        dataNascimento?: Date | null
      }
    }
  }
): number {
  let score = 20 // base risk

  const now = new Date()
  const hoursUntil = (s.dataAgendada.getTime() - now.getTime()) / (1000 * 60 * 60)

  // Booked very last minute (+15 risk)
  if (hoursUntil < 24) score += 15
  else if (hoursUntil < 48) score += 8

  // Day of week risk: Monday (+5), Friday (+8)
  const dow = s.dataAgendada.getDay()
  if (dow === 1) score += 5
  if (dow === 5) score += 8

  // Hour of day: very early (<9h) or late (>17h) (+10)
  const hour = s.dataAgendada.getHours()
  if (hour < 9 || hour > 17) score += 10

  // Historical no-show rate of this patient
  const allSessions = s.treatment.paciente.treatments.flatMap(t => t.sessions)
  if (allSessions.length > 0) {
    const noShows = allSessions.filter(ss => ss.status === 'NO_SHOW').length
    const rate = noShows / allSessions.length
    score += Math.round(rate * 40) // up to +40 for 100% no-show history
  }

  return Math.min(100, Math.max(0, score))
}
