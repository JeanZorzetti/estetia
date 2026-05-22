import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Megaphone, Star, Share2 } from 'lucide-react'
import { HubCard } from '@/components/marketing-clinico/hub-card'
import { requireModule } from '@/lib/guards/require-module'
import { ModuleLocked } from '@/components/upgrade/module-locked'

export const dynamic = 'force-dynamic'

export default async function MarketingClinicoPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const gate = await requireModule('marketing_clinico')
  if (!gate.allowed) return <ModuleLocked slug={gate.slug} />

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
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/95 to-slate-100/90 p-8 overflow-hidden flex flex-col gap-8">
      {/* Halos estelares de fundo de alta costura */}
      <div className="pointer-events-none absolute -left-10 top-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-cyan-500/5 to-blue-600/5 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-500/5 to-orange-600/5 blur-[150px]" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-[#C5A059]/5 to-yellow-600/5 blur-[130px]" />

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#C5A059]/30 bg-gradient-to-r from-[#C5A059]/10 to-[#E5C07B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9A7D42] shadow-sm">
          👑 Central de Engajamento & Marketing VIP
        </div>
        <h1 className="font-serif text-4xl font-extrabold tracking-tight text-slate-800">
          Marketing Clínico
        </h1>
        <p className="text-sm font-medium text-slate-500/90 flex items-center gap-1.5">
          <span>Campanhas, fidelidade e indicações dos seus pacientes</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider">Módulos VIP</span>
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HubCard
          icon={Megaphone}
          title="Campanhas"
          description="Mensagens em massa por WhatsApp e E-mail para seus pacientes"
          href="/dashboard/marketing-clinico/campanhas"
          colorClass="CAMPANHAS"
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
          colorClass="FIDELIDADE"
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
          colorClass="INDICACOES"
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

