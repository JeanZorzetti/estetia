import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SalaUpdateSchema } from '@/lib/salas/schema'

async function getUser() {
  const session = await getSession()
  if (!session?.user?.email) return null
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, orgRole: true },
  })
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const sala = await prisma.clinicRoom.findFirst({
    where: { id, organizationId: user.organizationId },
  })
  if (!sala) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ sala })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.orgRole === 'MEMBER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const existing = await prisma.clinicRoom.findFirst({
    where: { id, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = SalaUpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const d = parsed.data
  const data: Record<string, unknown> = {}
  if (d.nome !== undefined) data.nome = d.nome
  if (d.tipo !== undefined) data.tipo = d.tipo
  if (d.equipamentos !== undefined) data.equipamentos = d.equipamentos
  if (d.cor !== undefined) data.cor = d.cor || null
  if (d.capacidade !== undefined) data.capacidade = d.capacidade ?? null
  if (d.disponibilidade !== undefined) data.disponibilidade = d.disponibilidade ?? null
  if (d.ativo !== undefined) data.ativo = d.ativo

  const sala = await prisma.clinicRoom.update({ where: { id }, data })
  return NextResponse.json({ sala })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.orgRole === 'MEMBER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const existing = await prisma.clinicRoom.findFirst({
    where: { id, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.clinicRoom.update({ where: { id }, data: { ativo: false } })
  return NextResponse.json({ ok: true })
}
