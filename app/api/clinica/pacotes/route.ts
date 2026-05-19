import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { requireModule } from '@/lib/guards/require-module'
import { z } from 'zod'

const CreatePacoteSchema = z.object({
  patientId: z.string().uuid(),
  procedimentoId: z.string().uuid().optional(),
  sessoesTotais: z.number().int().min(1).max(100),
  intervaloMinimoDias: z.number().int().min(0).default(7),
  expiraEm: z.string().datetime().optional(),
})

/**
 * GET /api/clinica/pacotes?patientId= OR sem filtro (lista da org)
 * POST /api/clinica/pacotes
 */

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const gate = await requireModule('pacotes')
  if (!gate.allowed) return NextResponse.json({ error: 'Módulo não ativo' }, { status: 403 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const patientId = req.nextUrl.searchParams.get('patientId')
  const status = req.nextUrl.searchParams.get('status')

  const pacotes = await prisma.sessionPackage.findMany({
    where: {
      organizationId: user.organizationId,
      ...(patientId ? { patientId } : {}),
      ...(status ? { status: status as never } : {}),
    },
    include: {
      patient: { select: { id: true, nome: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(pacotes)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const gate = await requireModule('pacotes')
  if (!gate.allowed) return NextResponse.json({ error: 'Módulo não ativo' }, { status: 403 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const body = await req.json()
  const parsed = CreatePacoteSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { patientId, procedimentoId, sessoesTotais, intervaloMinimoDias, expiraEm } = parsed.data

  const patient = await prisma.patient.findFirst({
    where: { id: patientId, organizationId: user.organizationId },
  })
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  const pacote = await prisma.sessionPackage.create({
    data: {
      organizationId: user.organizationId,
      patientId,
      procedimentoId: procedimentoId ?? null,
      sessoesTotais,
      intervaloMinimoDias,
      expiraEm: expiraEm ? new Date(expiraEm) : null,
    },
    include: {
      patient: { select: { id: true, nome: true } },
    },
  })

  return NextResponse.json(pacote, { status: 201 })
}
