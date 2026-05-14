import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { RecallRulesList } from '@/components/recall/recall-rules-list'
import { RecallKpis } from '@/components/recall/recall-kpis'

export const dynamic = 'force-dynamic'

export default async function RecallPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const rules = await prisma.recallRule.findMany({
    where: { organizationId: user.organizationId },
    include: { _count: { select: { logs: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const procedureIds = [...new Set(rules.map(r => r.procedimentoId).filter(Boolean) as string[])]
  const procedures = procedureIds.length
    ? await prisma.procedure.findMany({
        where: { id: { in: procedureIds } },
        select: { id: true, nome: true },
      })
    : []
  const procMap = Object.fromEntries(procedures.map(p => [p.id, p.nome]))

  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const logs30d = await prisma.recallLog.findMany({
    where: {
      recallRule: { organizationId: user.organizationId },
      enviadoEm: { gte: since30d },
    },
    select: { respondeu: true, agendou: true },
  })

  const totalAtivas = rules.filter(r => r.ativo).length
  const envios30d = logs30d.length
  const respondidos30d = logs30d.filter(l => l.respondeu).length
  const agendamentos30d = logs30d.filter(l => l.agendou).length
  const taxaResposta = envios30d > 0 ? (respondidos30d / envios30d) * 100 : 0

  const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

  const rulesForClient = rules.map(r => ({
    id: r.id,
    nome: r.nome,
    procedimentoId: r.procedimentoId,
    procedimentoNome: r.procedimentoId ? (procMap[r.procedimentoId] ?? null) : null,
    intervaloDias: r.intervaloDias,
    canal: r.canal as 'WHATSAPP' | 'EMAIL' | 'SMS',
    ativo: r.ativo,
    totalLogs: r._count.logs,
    createdAt: r.createdAt.toISOString(),
  }))

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Recall Automático</h1>
          <p className="text-muted-foreground text-sm mt-1">Regras de retorno automático por WhatsApp e e-mail</p>
        </div>
        <Link
          href="/dashboard/recall/nova"
          className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F3D] px-4 py-2 text-sm font-medium text-white hover:bg-[#0A1F3D]/90 transition-colors"
        >
          + Nova Regra
        </Link>
      </div>

      <RecallKpis
        totalAtivas={totalAtivas}
        envios30d={envios30d}
        taxaResposta={taxaResposta}
        agendamentos30d={agendamentos30d}
      />

      <RecallRulesList rules={serialize(rulesForClient)} />
    </div>
  )
}
