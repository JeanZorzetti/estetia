import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FluxoCaixaKpis } from '@/components/financeiro/fluxo-caixa/kpi-cards'
import { FluxoMensalChart } from '@/components/financeiro/fluxo-caixa/fluxo-mensal-chart'
import { OperadorasChart } from '@/components/financeiro/fluxo-caixa/operadoras-chart'
import { TransacoesTable } from '@/components/financeiro/fluxo-caixa/transacoes-table'

export const dynamic = 'force-dynamic'

const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

export default async function FluxoCaixaPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { organizationId } = user
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1)

  const [recebidoMes, aReceber, vencidos, glosado, guiasMensal, grouped, guias] = await Promise.all([
    prisma.guiaTiss.aggregate({ where: { organizationId, status: 'PAGA', updatedAt: { gte: startOfMonth } }, _sum: { valorTotal: true } }),
    prisma.guiaTiss.aggregate({ where: { organizationId, status: { in: ['ENVIADA', 'AUTORIZADA'] } }, _sum: { valorTotal: true } }),
    prisma.guiaTiss.aggregate({
      where: {
        organizationId,
        status: { in: ['ENVIADA', 'AUTORIZADA'] },
        dataExecucao: { lt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000) },
      },
      _sum: { valorTotal: true },
    }),
    prisma.guiaTiss.aggregate({ where: { organizationId, status: 'GLOSADA', updatedAt: { gte: startOfMonth } }, _sum: { valorTotal: true } }),
    prisma.guiaTiss.findMany({
      where: { organizationId, createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true, valorTotal: true, status: true },
    }),
    prisma.guiaTiss.groupBy({
      by: ['operadoraId'],
      where: { organizationId },
      _sum: { valorTotal: true },
      _count: { id: true },
      orderBy: { _sum: { valorTotal: 'desc' } },
      take: 10,
    }),
    prisma.guiaTiss.findMany({
      where: { organizationId },
      include: {
        operadora: { select: { id: true, nome: true } },
        paciente: { select: { id: true, nome: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ])

  // Build monthly buckets
  const buckets: Record<string, { recebido: number; aReceber: number; glosado: number }> = {}
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    buckets[key] = { recebido: 0, aReceber: 0, glosado: 0 }
  }
  for (const g of guiasMensal) {
    const key = `${g.createdAt.getFullYear()}-${String(g.createdAt.getMonth() + 1).padStart(2, '0')}`
    if (!buckets[key]) continue
    const valor = g.valorTotal != null ? Number(g.valorTotal) : 0
    if (g.status === 'PAGA') buckets[key].recebido += valor
    else if (g.status === 'GLOSADA' || g.status === 'NEGADA') buckets[key].glosado += valor
    else if (g.status === 'ENVIADA' || g.status === 'AUTORIZADA') buckets[key].aReceber += valor
  }
  const dataMensal = Object.entries(buckets).map(([key, v]) => {
    const [year, month] = key.split('-')
    return {
      mes: new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('pt-BR', { month: 'short' }),
      ...v,
    }
  })

  const operadoraIds = grouped.map(g => g.operadoraId)
  const operadoras = await prisma.operadora.findMany({
    where: { id: { in: operadoraIds } },
    select: { id: true, nome: true, tipo: true },
  })
  const om = Object.fromEntries(operadoras.map(o => [o.id, o]))
  const dataOperadoras = grouped.map(g => {
    const total = Number(g._sum.valorTotal ?? 0)
    const count = g._count.id || 1
    return {
      operadora: om[g.operadoraId]?.nome ?? 'Desconhecida',
      tipo: om[g.operadoraId]?.tipo ?? 'CONVENIO',
      total,
      guias: g._count.id,
      ticketMedio: total / count,
    }
  })

  const transacoes = guias.map(g => ({
    ...g,
    valorTotal: g.valorTotal != null ? Number(g.valorTotal) : null,
  }))

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/financeiro"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Financeiro & TISS
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Fluxo de Caixa</h1>
          <p className="text-muted-foreground text-sm mt-1">Dashboard analítico de recebíveis, ticket médio e comparativo entre operadoras</p>
        </div>
        <Link href="/api/financeiro/export" target="_blank">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </Link>
      </div>

      <FluxoCaixaKpis
        recebidoMes={Number(recebidoMes._sum.valorTotal ?? 0)}
        aReceber={Number(aReceber._sum.valorTotal ?? 0)}
        vencidos={Number(vencidos._sum.valorTotal ?? 0)}
        glosado={Number(glosado._sum.valorTotal ?? 0)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FluxoMensalChart data={dataMensal} />
        <OperadorasChart data={dataOperadoras} />
      </div>

      <div>
        <h2 className="text-base font-semibold tracking-tight mb-3">Transações Recentes</h2>
        <TransacoesTable guias={serialize(transacoes) as any} />
      </div>
    </div>
  )
}
