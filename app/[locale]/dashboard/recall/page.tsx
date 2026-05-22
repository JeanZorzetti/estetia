import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { RecallRulesList } from '@/components/recall/recall-rules-list'
import { RecallKpis } from '@/components/recall/recall-kpis'
import { requireModule } from '@/lib/guards/require-module'
import { ModuleLocked } from '@/components/upgrade/module-locked'
import { MessageSquare } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function RecallPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const gate = await requireModule('recall')
  if (!gate.allowed) return <ModuleLocked slug={gate.slug} />

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const safe = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
    try { return await fn() } catch { return fallback }
  }

  const [rules, logs30d] = await Promise.all([
    safe(() => prisma.recallRule.findMany({
      where: { organizationId: user.organizationId },
      include: { _count: { select: { logs: true } } },
      orderBy: { createdAt: 'desc' },
    }), []),
    safe(async () => {
      const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return await prisma.recallLog.findMany({
        where: {
          recallRule: { organizationId: user.organizationId },
          enviadoEm: { gte: since30d },
        },
        select: { respondeu: true, agendou: true },
      })
    }, []),
  ])

  const procedureIds = [...new Set(rules.map(r => r.procedimentoId).filter(Boolean) as string[])]
  
  const procedures = procedureIds.length
    ? await safe(() => prisma.procedure.findMany({
        where: { id: { in: procedureIds } },
        select: { id: true, nome: true },
      }), [])
    : []
  const procMap = Object.fromEntries(procedures.map(p => [p.id, p.nome]))

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
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/95 to-slate-100/90 p-8 overflow-hidden flex flex-col gap-8">
      {/* Halos estelares de fundo de alta costura */}
      <div className="pointer-events-none absolute -left-10 top-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-cyan-500/5 to-blue-600/5 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-500/5 to-orange-600/5 blur-[150px]" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-[#C5A059]/5 to-yellow-600/5 blur-[130px]" />

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#C5A059]/30 bg-gradient-to-r from-[#C5A059]/10 to-[#E5C07B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9A7D42] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-pulse" />
            👑 Central de Engajamento VIP • Recall Automático
          </div>
          <h1 className="font-serif text-4xl font-extrabold tracking-tight text-slate-800">
            Recall Automático
          </h1>
          <p className="text-sm font-medium text-slate-500/90 flex items-center gap-1.5">
            <span>Regras de retorno automático por WhatsApp, SMS e E-mail</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider">Acesso Seguro</span>
          </p>
        </div>

        <Link
          href="/dashboard/recall/nova"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E5C07B] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <MessageSquare className="h-4 w-4" />
          <span>Nova Regra</span>
        </Link>
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        <RecallKpis
          totalAtivas={totalAtivas}
          envios30d={envios30d}
          taxaResposta={taxaResposta}
          agendamentos30d={agendamentos30d}
        />

        <RecallRulesList rules={serialize(rulesForClient)} />
      </div>
    </div>
  )
}
