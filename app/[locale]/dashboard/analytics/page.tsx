import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parsePeriodFromSearchParams } from '@/lib/analytics-clinico/period'
import { getOverviewKpis, getSessionsStats, getTopPatients, getRevenueMonthly } from '@/lib/analytics-clinico/queries'
import { AnalyticsShell } from '@/components/analytics-clinico/analytics-shell'
import { Suspense } from 'react'

export const metadata = { title: 'Analytics Clínico | Estetia CRM' }

export default async function AnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string>>
}) {
  const { locale } = await params
  const sp = await searchParams

  const session = await getSession()
  if (!session?.user?.email) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Não autorizado
      </div>
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })

  if (!user?.organizationId) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Organização não encontrada
      </div>
    )
  }

  const period = parsePeriodFromSearchParams({
    preset: sp.preset,
    from: sp.from,
    to: sp.to,
  })

  const currentPreset = sp.preset ?? '30d'
  const currentTab = sp.tab ?? 'overview'

  // Parallel fetch of overview data (default tab)
  const [kpis, sessions, topPatients, revenue] = await Promise.all([
    getOverviewKpis(user.organizationId, period),
    getSessionsStats(user.organizationId),
    getTopPatients(user.organizationId, period),
    getRevenueMonthly(user.organizationId),
  ])

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics Clínico</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Dashboard completo — pacientes, tratamentos, profissionais e marketing
        </p>
      </div>

      <Suspense>
        <AnalyticsShell
          initialData={{ kpis, sessions, topPatients, revenue }}
          initialTab={currentTab}
          currentPreset={currentPreset}
        />
      </Suspense>
    </div>
  )
}
