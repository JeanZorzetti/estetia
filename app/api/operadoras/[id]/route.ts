import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OperadoraUpdateSchema } from '@/lib/financeiro/schema'

async function getOrgId() {
  const session = await getSession()
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  return user?.organizationId ?? null
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const operadora = await prisma.operadora.findFirst({
    where: { id, organizationId: orgId },
    include: { convenios: true, _count: { select: { guias: true } } },
  })
  if (!operadora) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    operadora: {
      ...operadora,
      convenios: operadora.convenios.map(c => ({
        ...c,
        valorNegociado: c.valorNegociado != null ? Number(c.valorNegociado) : null,
      })),
    },
  })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const existing = await prisma.operadora.findFirst({ where: { id, organizationId: orgId }, select: { id: true } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = OperadoraUpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const data: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(parsed.data)) {
    if (v !== undefined) data[k] = v === '' ? null : v
  }

  const operadora = await prisma.operadora.update({ where: { id }, data })
  return NextResponse.json({ operadora })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const existing = await prisma.operadora.findFirst({ where: { id, organizationId: orgId }, select: { id: true } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Soft delete
  await prisma.operadora.update({ where: { id }, data: { ativo: false } })
  return NextResponse.json({ ok: true })
}
