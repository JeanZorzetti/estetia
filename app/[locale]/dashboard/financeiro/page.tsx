import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Wallet, Building2, FileCheck2, RefreshCw } from 'lucide-react'
import { HubCard } from '@/components/financeiro/hub-card'
import { requireModule } from '@/lib/guards/require-module'
import { ModuleLocked } from '@/components/upgrade/module-locked'

export const dynamic = 'force-dynamic'

const formatBRLShort = (v: number) => {
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(1)}k`
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
}

export default async function FinanceiroPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const gate = await requireModule('financeiro')
  if (!gate.allowed) return <ModuleLocked slug={gate.slug} />

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { organizationId } = user
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const safe = async <T,>(fn: () => Promise<T>, fb: T): Promise<T> => {
    try { return await fn() } catch { return fb }
  }

  const [
    recebidoMes, aReceber, vencidos,
    operadorasAtivas, conveniosCount, particulares,
    rascunhos, enviadasMes, glosadas,
    org, omieRecebiveis,
  ] = await Promise.all([
    safe(() => prisma.guiaTiss.aggregate({ where: { organizationId, status: 'PAGA', updatedAt: { gte: startOfMonth } }, _sum: { valorTotal: true } }), { _sum: { valorTotal: null as any } }),
    safe(() => prisma.guiaTiss.aggregate({ where: { organizationId, status: { in: ['ENVIADA', 'AUTORIZADA'] } }, _sum: { valorTotal: true } }), { _sum: { valorTotal: null as any } }),
    safe(() => prisma.guiaTiss.aggregate({ where: { organizationId, status: { in: ['ENVIADA', 'AUTORIZADA'] }, dataExecucao: { lt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000) } }, _sum: { valorTotal: true } }), { _sum: { valorTotal: null as any } }),
    safe(() => prisma.operadora.count({ where: { organizationId, ativo: true } }), 0),
    safe(() => prisma.convenio.count({ where: { organizationId, ativo: true } }), 0),
    safe(() => prisma.operadora.count({ where: { organizationId, ativo: true, tipo: 'PARTICULAR' } }), 0),
    safe(() => prisma.guiaTiss.count({ where: { organizationId, status: 'RASCUNHO' } }), 0),
    safe(() => prisma.guiaTiss.count({ where: { organizationId, status: 'ENVIADA', createdAt: { gte: startOfMonth } } }), 0),
    safe(() => prisma.guiaTiss.count({ where: { organizationId, status: 'GLOSADA' } }), 0),
    prisma.organization.findUnique({ where: { id: organizationId }, select: { omieEnabled: true } }),
    safe(() => prisma.omieFinanceiro.count({ where: { organizationId } }), 0),
  ])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/95 to-slate-100/90 p-8 overflow-hidden flex flex-col gap-8">
      {/* Halos estelares de fundo de alta costura */}
      <div className="pointer-events-none absolute -left-10 top-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-cyan-500/5 to-blue-600/5 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-500/5 to-orange-600/5 blur-[150px]" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-[#C5A059]/5 to-yellow-600/5 blur-[130px]" />

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#C5A059]/30 bg-gradient-to-r from-[#C5A059]/10 to-[#E5C07B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9A7D42] shadow-sm">
          👑 Central Financeira & TISS VIP
        </div>
        <h1 className="font-serif text-4xl font-extrabold tracking-tight text-slate-800">
          Financeiro & TISS
        </h1>
        <p className="text-sm font-medium text-slate-500/90 flex items-center gap-1.5">
          <span>Fluxo de caixa, operadoras, guias TISS e integração com Omie ERP</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider">Módulos VIP</span>
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <HubCard
          icon={Wallet}
          title="Fluxo de Caixa"
          description="Recebíveis, gráficos e exportação CSV"
          href="/dashboard/financeiro/fluxo-caixa"
          colorClass="FLUXO_CAIXA"
          kpis={[
            { label: 'Recebido', value: formatBRLShort(Number(recebidoMes._sum.valorTotal ?? 0)) },
            { label: 'A receber', value: formatBRLShort(Number(aReceber._sum.valorTotal ?? 0)) },
            { label: 'Vencidos', value: formatBRLShort(Number(vencidos._sum.valorTotal ?? 0)) },
          ]}
        />
        <HubCard
          icon={Building2}
          title="Operadoras & Convênios"
          description="Cadastro de operadoras e tabela de preços"
          href="/dashboard/financeiro/operadoras"
          colorClass="OPERADORAS"
          kpis={[
            { label: 'Ativas', value: operadorasAtivas },
            { label: 'Convênios', value: conveniosCount },
            { label: 'Particulares', value: particulares },
          ]}
        />
        <HubCard
          icon={FileCheck2}
          title="Guias TISS"
          description="Criar e gerenciar guias com geração de XML ANS 4.x"
          href="/dashboard/financeiro/guias-tiss"
          colorClass="GUIAS_TISS"
          kpis={[
            { label: 'Rascunhos', value: rascunhos },
            { label: 'Enviadas', value: enviadasMes },
            { label: 'Glosadas', value: glosadas },
          ]}
        />
        <HubCard
          icon={RefreshCw}
          title="Omie Sync"
          description="Sincronização de recebíveis com Omie ERP"
          href="/dashboard/financeiro/omie"
          colorClass="OMIE"
          kpis={[
            { label: 'Status', value: org?.omieEnabled ? 'Ativo' : 'Off' },
            { label: 'Recebíveis', value: omieRecebiveis },
            { label: 'Provedor', value: 'Omie' },
          ]}
        />
      </div>
    </div>
  )
}
