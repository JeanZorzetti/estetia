import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/clinica/availability?date=2026-05-12&profissionalId=&duracaoMinutos=60
// Returns available 30-min slots for a given day/professional
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const dateStr = searchParams.get('date')
  const profissionalId = searchParams.get('profissionalId') ?? undefined
  const duracao = parseInt(searchParams.get('duracaoMinutos') ?? '60', 10)

  if (!dateStr) return NextResponse.json({ error: 'date is required' }, { status: 400 })

  const date = new Date(dateStr)
  const startOfDay = new Date(date)
  startOfDay.setHours(8, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(19, 0, 0, 0)

  // Get booked sessions for that day
  const booked = await prisma.treatmentSession.findMany({
    where: {
      organizationId: user.organizationId,
      dataAgendada: { gte: startOfDay, lte: endOfDay },
      status: { notIn: ['CANCELADA', 'NO_SHOW'] },
      ...(profissionalId && { profissionalId }),
    },
    select: { dataAgendada: true, duracaoMinutos: true },
  })

  // Generate 30-min slots from 08:00 to 18:30
  const slots: Array<{ time: string; available: boolean }> = []
  const slotStep = 30 // minutes
  const current = new Date(startOfDay)

  while (current < endOfDay) {
    const slotEnd = new Date(current.getTime() + duracao * 60 * 1000)
    if (slotEnd > endOfDay) break

    // Check if this slot overlaps with any booked session
    const isBooked = booked.some((b: { dataAgendada: Date; duracaoMinutos: number | null }) => {
      const bStart = new Date(b.dataAgendada)
      const bEnd = new Date(bStart.getTime() + (b.duracaoMinutos ?? 60) * 60 * 1000)
      return current < bEnd && slotEnd > bStart
    })

    slots.push({
      time: current.toISOString(),
      available: !isBooked,
    })

    current.setMinutes(current.getMinutes() + slotStep)
  }

  return NextResponse.json({ slots, date: dateStr, profissionalId })
}
