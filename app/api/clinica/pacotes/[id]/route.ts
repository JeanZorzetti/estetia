import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { requireModule } from '@/lib/guards/require-module'
import { z } from 'zod'

const UpdatePacoteSchema = z.object({
  status: z.enum(['ATIVO', 'CONCLUIDO', 'EXPIRADO', 'CANCELADO']).optional(),
  expiraEm: z.string().datetime().optional().nullable(),
  intervaloMinimoDias: z.number().int().min(0).optional(),
})

/**
 * GET /api/clinica/pacotes/[id]
 * PATCH /api/clinica/pacotes/[id]
 * DELETE /api/clinica/pacotes/[id]
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const gate = await requireModule('pacotes')
  if (!gate.allowed) return NextResponse.json({ error: 'Módulo não ativo' }, { status: 403 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const { id } = await params
  const pacote = await prisma.sessionPackage.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      patient: { select: { id: true, nome: true } },
    },
  })
  if (!pacote) return NextResponse.json({ error: 'Pacote não encontrado' }, { status: 404 })

  return NextResponse.json(pacote)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const gate = await requireModule('pacotes')
  if (!gate.allowed) return NextResponse.json({ error: 'Módulo não ativo' }, { status: 403 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const { id } = await params
  const pacote = await prisma.sessionPackage.findFirst({
    where: { id, organizationId: user.organizationId },
  })
  if (!pacote) return NextResponse.json({ error: 'Pacote não encontrado' }, { status: 404 })

  const body = await req.json()
  const parsed = UpdatePacoteSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const updated = await prisma.sessionPackage.update({
    where: { id },
    data: {
      ...(parsed.data.status ? { status: parsed.data.status } : {}),
      ...(parsed.data.expiraEm !== undefined
        ? { expiraEm: parsed.data.expiraEm ? new Date(parsed.data.expiraEm) : null }
        : {}),
      ...(parsed.data.intervaloMinimoDias !== undefined
        ? { intervaloMinimoDias: parsed.data.intervaloMinimoDias }
        : {}),
    },
    include: {
      patient: { select: { id: true, nome: true } },
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const gate = await requireModule('pacotes')
  if (!gate.allowed) return NextResponse.json({ error: 'Módulo não ativo' }, { status: 403 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const { id } = await params
  const pacote = await prisma.sessionPackage.findFirst({
    where: { id, organizationId: user.organizationId },
  })
  if (!pacote) return NextResponse.json({ error: 'Pacote não encontrado' }, { status: 404 })

  await prisma.sessionPackage.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
