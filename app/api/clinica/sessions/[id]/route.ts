import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const UpdateSessionSchema = z.object({
  status: z.enum(['AGENDADA', 'CONFIRMADA', 'REALIZADA', 'NO_SHOW', 'REMARCADA', 'CANCELADA']).optional(),
  dataAgendada: z.string().datetime().optional(),
  profissionalId: z.string().uuid().nullable().optional(),
  salaId: z.string().uuid().nullable().optional(),
  observacoes: z.string().max(2000).optional(),
  produtosAplicados: z.array(z.object({
    produto: z.string(),
    qtd: z.number(),
    lote: z.string().optional(),
    validade: z.string().optional(),
  })).optional(),
  noShowScore: z.number().int().min(0).max(100).optional(),
})

// PATCH /api/clinica/sessions/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const parsed = UpdateSessionSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const existing = await prisma.treatmentSession.findFirst({
    where: { id, organizationId: user.organizationId },
  })
  if (!existing) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

  const updateData: Record<string, unknown> = { ...parsed.data }
  if (parsed.data.dataAgendada) updateData.dataAgendada = new Date(parsed.data.dataAgendada)
  if (parsed.data.status === 'REALIZADA') updateData.dataRealizada = new Date()

  const updated = await prisma.treatmentSession.update({
    where: { id },
    data: updateData,
    include: {
      treatment: {
        include: { paciente: { select: { id: true, nome: true, telefone: true } } },
      },
      profissional: { select: { id: true, nome: true } },
      sala: { select: { id: true, nome: true } },
    },
  })

  // If REALIZADA, increment sessoesRealizadas on parent treatment
  if (parsed.data.status === 'REALIZADA') {
    await prisma.$executeRaw`
      UPDATE "Treatment"
      SET "sessoesRealizadas" = "sessoesRealizadas" + 1
      WHERE "id" = ${existing.treatmentId}
        AND "organizationId" = ${user.organizationId}
    `
  }

  return NextResponse.json({ session: updated })
}

// DELETE /api/clinica/sessions/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const { id } = await params

  const existing = await prisma.treatmentSession.findFirst({
    where: { id, organizationId: user.organizationId },
  })
  if (!existing) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

  // Soft-cancel instead of delete (preserve history)
  await prisma.treatmentSession.update({
    where: { id },
    data: { status: 'CANCELADA' },
  })

  return NextResponse.json({ ok: true })
}
