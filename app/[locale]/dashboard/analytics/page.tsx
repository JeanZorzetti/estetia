import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parsePeriodFromSearchParams } from '@/lib/analytics-clinico/period'
import { getOverviewKpis, getSessionsStats, getTopPatients, getRevenueMonthly } from '@/lib/analytics-clinico/queries'
import { AnalyticsShell } from '@/components/analytics-clinico/analytics-shell'
import { requireModule } from '@/lib/guards/require-module'
import { ModuleLocked } from '@/components/upgrade/module-locked'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'
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

  const gate = await requireModule('analytics_avancado')
  if (!gate.allowed) return <ModuleLocked slug={gate.slug} />

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
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/95 to-slate-100/90 p-8 overflow-hidden flex flex-col gap-8">
      {/* Halos estelares de fundo de alta costura */}
      <div className="pointer-events-none absolute -left-10 top-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-900/5 to-slate-900/5 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-violet-500/5 to-purple-600/5 blur-[150px]" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-cyan-500/5 to-teal-600/5 blur-[130px]" />

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#C5A059]/30 bg-gradient-to-r from-[#C5A059]/10 to-[#E5C07B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9A7D42] shadow-sm">
          👑 Hub de Inteligência Clínica & Analytics VIP
        </div>
        <h1 className="font-serif text-4xl font-extrabold tracking-tight text-slate-800">
          Analytics Clínico
        </h1>
        <p className="text-sm font-medium text-slate-500/90 flex items-center gap-1.5">
          <span>Dashboard completo — pacientes, tratamentos, profissionais e marketing</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider">Módulos VIP</span>
        </p>
      </div>

      <div className="relative z-10 flex-1">
        <Suspense>
          <AnalyticsShell
            initialData={{ kpis, sessions, topPatients, revenue }}
            initialTab={currentTab}
            currentPreset={currentPreset}
          />
        </Suspense>
      </div>
    </div>
  )
}
