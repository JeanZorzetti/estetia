import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UpdateRecallRuleSchema } from '@/lib/recall/schema'

async function getOrgId(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { organizationId: true },
  })
  return user?.organizationId ?? null
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const orgId = await getOrgId(session.user.email)
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const rule = await prisma.recallRule.findFirst({
    where: { id, organizationId: orgId },
    include: {
      logs: {
        orderBy: { enviadoEm: 'desc' },
        take: 20,
      },
      _count: { select: { logs: true } },
    },
  })
  if (!rule) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const respondidos = rule.logs.filter(l => l.respondeu).length
  const agendados = rule.logs.filter(l => l.agendou).length

  return NextResponse.json({ ...rule, metrics: { respondidos, agendados } })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const orgId = await getOrgId(session.user.email)
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.recallRule.findFirst({ where: { id, organizationId: orgId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = UpdateRecallRuleSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const data = parsed.data
  const updated = await prisma.recallRule.update({
    where: { id },
    data: {
      ...(data.nome !== undefined && { nome: data.nome }),
      ...(data.procedimentoId !== undefined && { procedimentoId: data.procedimentoId || null }),
      ...(data.intervaloDias !== undefined && { intervaloDias: data.intervaloDias }),
      ...(data.canal !== undefined && { canal: data.canal as 'WHATSAPP' | 'EMAIL' | 'SMS' }),
      ...(data.template !== undefined && { template: data.template }),
      ...(data.ativo !== undefined && { ativo: data.ativo }),
    },
  })
  return NextResponse.json(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const orgId = await getOrgId(session.user.email)
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.recallRule.findFirst({ where: { id, organizationId: orgId } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.recallRule.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
