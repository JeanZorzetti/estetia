import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { LoyaltyConfigForm } from '@/components/marketing-clinico/loyalty/loyalty-config-form'
import { LoyaltyRanking } from '@/components/marketing-clinico/loyalty/loyalty-ranking'
import { LoyaltyTransactionsTable } from '@/components/marketing-clinico/loyalty/loyalty-transactions-table'
import { LoyaltyTransactionDialog } from '@/components/marketing-clinico/loyalty/loyalty-transaction-dialog'

export const dynamic = 'force-dynamic'

const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

export default async function FidelidadePage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { organizationId } = user

  const [loyaltyConfig, transactions, ranking] = await Promise.all([
    prisma.loyaltyConfig.findUnique({ where: { organizationId } }),
    prisma.loyaltyTransaction.findMany({
      where: { organizationId },
      include: { patient: { select: { id: true, nome: true, telefone: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    (async () => {
      const grouped = await prisma.loyaltyTransaction.groupBy({
        by: ['patientId'],
        where: { organizationId },
        _sum: { pontos: true },
        orderBy: { _sum: { pontos: 'desc' } },
        take: 10,
      })
      const patientIds = grouped.map(g => g.patientId)
      const patients = await prisma.patient.findMany({
        where: { id: { in: patientIds } },
        select: { id: true, nome: true, telefone: true, fotoPerfil: true },
      })
      const pm = Object.fromEntries(patients.map(p => [p.id, p]))
      return grouped.map((g, i) => ({
        rank: i + 1,
        patient: pm[g.patientId] ?? { id: g.patientId, nome: '—', telefone: null, fotoPerfil: null },
        totalPontos: g._sum.pontos ?? 0,
      }))
    })(),
  ])

  const configSerialized = loyaltyConfig
    ? {
        pontosPorReal: loyaltyConfig.pontosPorReal,
        ativo: loyaltyConfig.ativo,
        regrasResgate: loyaltyConfig.regrasResgate as Record<string, unknown>,
      }
    : null

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/marketing-clinico"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Marketing Clínico
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Programa de Fidelidade</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure pontos, acompanhe o ranking e lance transações
          </p>
        </div>
        <LoyaltyTransactionDialog />
      </div>

      {/* Config */}
      <LoyaltyConfigForm initialConfig={configSerialized} />

      {/* Ranking */}
      <div>
        <h2 className="text-base font-semibold tracking-tight mb-3">Ranking de Pontos</h2>
        <LoyaltyRanking ranking={serialize(ranking)} />
      </div>

      {/* Transactions */}
      <div>
        <h2 className="text-base font-semibold tracking-tight mb-3">Transações Recentes</h2>
        <LoyaltyTransactionsTable initialTransactions={serialize(transactions) as any} />
      </div>
    </div>
  )
}
