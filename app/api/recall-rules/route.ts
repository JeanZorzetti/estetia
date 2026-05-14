import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CreateRecallRuleSchema } from '@/lib/recall/schema'

export async function GET() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rules = await prisma.recallRule.findMany({
    where: { organizationId: user.organizationId },
    include: { _count: { select: { logs: true } } },
    orderBy: { createdAt: 'desc' },
  })

  // Fetch procedure names in parallel
  const procedureIds = [...new Set(rules.map(r => r.procedimentoId).filter(Boolean) as string[])]
  const procedures = procedureIds.length
    ? await prisma.procedure.findMany({
        where: { id: { in: procedureIds } },
        select: { id: true, nome: true },
      })
    : []
  const procMap = Object.fromEntries(procedures.map(p => [p.id, p.nome]))

  const result = rules.map(r => ({
    ...r,
    procedimentoNome: r.procedimentoId ? (procMap[r.procedimentoId] ?? null) : null,
    totalLogs: r._count.logs,
  }))

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = CreateRecallRuleSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const data = parsed.data
  const rule = await prisma.recallRule.create({
    data: {
      organizationId: user.organizationId,
      nome: data.nome,
      procedimentoId: data.procedimentoId || null,
      intervaloDias: data.intervaloDias,
      canal: data.canal as 'WHATSAPP' | 'EMAIL' | 'SMS',
      template: data.template,
      ativo: data.ativo,
    },
  })

  return NextResponse.json(rule, { status: 201 })
}
