import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Megaphone, Star, Share2 } from 'lucide-react'
import { HubCard } from '@/components/marketing-clinico/hub-card'

export const dynamic = 'force-dynamic'

export default async function MarketingClinicoPage() {
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

  const [
    campaignsCount,
    campaignsEnviadasMes,
    loyaltyConfig,
    loyaltyPointsTotal,
    topPatientPoints,
    referralsPendentes,
    referralsConvertidas,
    referralsTotal,
  ] = await Promise.all([
    safe(() => prisma.marketingCampaign.count({ where: { organizationId } }), 0),
    safe(() => prisma.marketingCampaign.count({ where: { organizationId, status: 'ENVIADA', enviadoEm: { gte: startOfMonth } } }), 0),
    prisma.loyaltyConfig.findUnique({ where: { organizationId }, select: { ativo: true } }),
    prisma.loyaltyTransaction.aggregate({ where: { organizationId, pontos: { gt: 0 } }, _sum: { pontos: true } }),
    prisma.loyaltyTransaction.groupBy({
      by: ['patientId'],
      where: { organizationId },
      _sum: { pontos: true },
      orderBy: { _sum: { pontos: 'desc' } },
      take: 1,
    }),
    safe(() => prisma.patientReferral.count({ where: { organizationId, status: 'PENDENTE' } }), 0),
    safe(() => prisma.patientReferral.count({ where: { organizationId, status: 'CONVERTIDO', updatedAt: { gte: startOfMonth } } }), 0),
    safe(() => prisma.patientReferral.count({ where: { organizationId } }), 0),
  ])

  const taxaConversao = referralsTotal > 0
    ? Math.round(((referralsTotal - referralsPendentes) / referralsTotal) * 100)
    : 0

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Marketing Clínico</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Campanhas, fidelidade e indicações dos seus pacientes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <HubCard
          icon={Megaphone}
          title="Campanhas"
          description="Mensagens em massa por WhatsApp e E-mail para seus pacientes"
          href="/dashboard/marketing-clinico/campanhas"
          colorClass="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300"
          kpis={[
            { label: 'Total', value: campaignsCount },
            { label: 'Enviadas mês', value: campaignsEnviadasMes },
            { label: 'Ads', value: '→' },
          ]}
        />
        <HubCard
          icon={Star}
          title="Fidelidade"
          description="Configure pontos por real gasto, ranking e transações manuais"
          href="/dashboard/marketing-clinico/fidelidade"
          colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
          kpis={[
            { label: 'Pts circulando', value: (loyaltyPointsTotal._sum.pontos ?? 0).toLocaleString('pt-BR') },
            { label: 'Top pontos', value: topPatientPoints[0]?._sum?.pontos?.toLocaleString('pt-BR') ?? '0' },
            { label: 'Ativo', value: loyaltyConfig?.ativo ? 'Sim' : 'Não' },
          ]}
        />
        <HubCard
          icon={Share2}
          title="Indicações"
          description="Programa de indicação paciente para paciente com recompensas"
          href="/dashboard/marketing-clinico/indicacoes"
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
          kpis={[
            { label: 'Pendentes', value: referralsPendentes },
            { label: 'Conv. mês', value: referralsConvertidas },
            { label: 'Conversão', value: `${taxaConversao}%` },
          ]}
        />
      </div>
    </div>
  )
}
