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
    <div className="flex flex-col gap-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financeiro & TISS</h1>
        <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
          Fluxo de caixa, operadoras, guias TISS e integração com Omie ERP
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <HubCard
          icon={Wallet}
          title="Fluxo de Caixa"
          description="Recebíveis, gráficos e exportação CSV"
          href="/dashboard/financeiro/fluxo-caixa"
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
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
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
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
          colorClass="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300"
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
          colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
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
