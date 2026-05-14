import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const AddWaitlistSchema = z.object({
  pacienteId: z.string().uuid(),
  procedimento: z.string().optional(),
  profissionalId: z.string().uuid().optional(),
  preferencias: z.array(z.object({
    diaSemana: z.number().int().min(0).max(6),
    inicio: z.string().regex(/^\d{2}:\d{2}$/),
    fim: z.string().regex(/^\d{2}:\d{2}$/),
  })).optional(),
})

// GET /api/clinica/waitlist
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const entries = await prisma.waitlistEntry.findMany({
    where: { organizationId: user.organizationId, status: 'ativa' },
    include: {
      paciente: { select: { id: true, nome: true, telefone: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({ entries })
}

// POST /api/clinica/waitlist
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const body = await req.json()
  const parsed = AddWaitlistSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  // Verify patient belongs to org
  const patient = await prisma.patient.findFirst({
    where: { id: parsed.data.pacienteId, organizationId: user.organizationId },
  })
  if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 })

  const entry = await prisma.waitlistEntry.create({
    data: {
      organizationId: user.organizationId,
      pacienteId: parsed.data.pacienteId,
      procedimento: parsed.data.procedimento,
      profissionalId: parsed.data.profissionalId,
      preferencias: parsed.data.preferencias ?? [],
    },
  })

  return NextResponse.json({ entry }, { status: 201 })
}
