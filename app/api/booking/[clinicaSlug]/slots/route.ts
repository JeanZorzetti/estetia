import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/booking/[clinicaSlug]/slots?date=YYYY-MM-DD&profissionalId=&duracaoMinutos=
// Public — no auth required
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clinicaSlug: string }> }
) {
  const { clinicaSlug } = await params
  const { searchParams } = new URL(req.url)

  const dateStr = searchParams.get('date')
  const profissionalId = searchParams.get('profissionalId')
  const duracaoMinutos = parseInt(searchParams.get('duracaoMinutos') ?? '60', 10)

  if (!dateStr || !profissionalId) {
    return NextResponse.json({ error: 'date and profissionalId are required' }, { status: 400 })
  }

  const org = await prisma.organization.findUnique({
    where: { slug: clinicaSlug },
    select: { id: true },
  })

  if (!org) {
    return NextResponse.json({ error: 'Clínica não encontrada' }, { status: 404 })
  }

  // Build day boundaries in São Paulo time
  const dayStart = new Date(`${dateStr}T08:00:00-03:00`)
  const dayEnd = new Date(`${dateStr}T19:00:00-03:00`)

  // Fetch existing bookings for this professional on this day
  const existingSessions = await prisma.treatmentSession.findMany({
    where: {
      organizationId: org.id,
      profissionalId,
      status: { in: ['AGENDADA', 'CONFIRMADA'] },
      dataAgendada: { gte: dayStart, lt: dayEnd },
    },
    select: { dataAgendada: true, duracaoMinutos: true },
  })

  // Also check treatment sessions where profissionalId comes from treatment
  const existingTreatmentSessions = await prisma.treatmentSession.findMany({
    where: {
      organizationId: org.id,
      profissionalId: null,
      status: { in: ['AGENDADA', 'CONFIRMADA'] },
      dataAgendada: { gte: dayStart, lt: dayEnd },
      treatment: { profissionalResponsavelId: profissionalId },
    },
    include: {
      treatment: { select: { profissionalResponsavelId: true } },
    },
  })

  const bookedSlots = [
    ...existingSessions.map((s: { dataAgendada: Date; duracaoMinutos: number | null }) => ({
      start: s.dataAgendada.getTime(),
      end: s.dataAgendada.getTime() + (s.duracaoMinutos ?? 60) * 60 * 1000,
    })),
    ...existingTreatmentSessions.map((s: { dataAgendada: Date; duracaoMinutos: number | null }) => ({
      start: s.dataAgendada.getTime(),
      end: s.dataAgendada.getTime() + (s.duracaoMinutos ?? 60) * 60 * 1000,
    })),
  ]

  // Generate 30-min slots from 08:00 to 18:30
  const slots: { time: string; available: boolean }[] = []
  const slotDuration = duracaoMinutos * 60 * 1000
  const stepMs = 30 * 60 * 1000

  let cursor = dayStart.getTime()
  const hardEnd = dayEnd.getTime()

  while (cursor + slotDuration <= hardEnd) {
    const slotEnd = cursor + slotDuration
    const overlaps = bookedSlots.some(b => cursor < b.end && slotEnd > b.start)

    slots.push({
      time: new Date(cursor).toISOString(),
      available: !overlaps,
    })

    cursor += stepMs
  }

  return NextResponse.json({ slots })
}
