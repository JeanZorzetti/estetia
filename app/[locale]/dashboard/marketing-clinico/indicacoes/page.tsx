import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, ChevronLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ReferralsTable } from '@/components/marketing-clinico/referrals/referrals-table'

export const dynamic = 'force-dynamic'

const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

export default async function IndicacoesPage() {
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

  const safe = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
    try { return await fn() } catch { return fallback }
  }

  const [referrals, pendentes, convertidas, recompensadas] = await Promise.all([
    safe(() => prisma.patientReferral.findMany({
      where: { organizationId },
      include: {
        indicador: { select: { id: true, nome: true } },
        indicado: { select: { id: true, nome: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }), []),
    safe(() => prisma.patientReferral.count({ where: { organizationId, status: 'PENDENTE' } }), 0),
    safe(() => prisma.patientReferral.count({ where: { organizationId, status: 'CONVERTIDO', updatedAt: { gte: startOfMonth } } }), 0),
    safe(() => prisma.patientReferral.count({ where: { organizationId, status: 'RECOMPENSADO', updatedAt: { gte: startOfMonth } } }), 0),
  ])

  const kpis = [
    { label: 'Pendentes', value: pendentes, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
    { label: 'Convertidas (30d)', value: convertidas, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    { label: 'Recompensadas (30d)', value: recompensadas, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  ]

  const serializedReferrals = referrals.map(r => ({
    ...r,
    recompensaValor: r.recompensaValor != null ? Number(r.recompensaValor) : null,
  }))

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
          <h1 className="text-2xl font-semibold tracking-tight">Indicações</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Programa de indicação paciente para paciente
          </p>
        </div>
        <Link
          href="/dashboard/marketing-clinico/indicacoes/nova"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nova Indicação
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {kpis.map(kpi => (
          <Card key={kpi.label} className="border-border/60">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <ReferralsTable initialReferrals={serialize(serializedReferrals) as any} />
    </div>
  )
}
