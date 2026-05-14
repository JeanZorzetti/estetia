import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, ChevronLeft } from 'lucide-react'
import { CampaignsTable } from '@/components/marketing-clinico/campaigns/campaigns-table'
import { AdsSnapshot } from '@/components/marketing-clinico/campaigns/ads-snapshot'

export const dynamic = 'force-dynamic'

export default async function CampanhasPage() {
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
  const mesLabel = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const [campaigns, adsGasto] = await Promise.all([
    prisma.marketingCampaign.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.adsMetric.aggregate({
      where: { organizationId, date: { gte: startOfMonth } },
      _sum: { spend: true },
    }),
  ])

  const totalGastoAds = adsGasto._sum.spend != null ? Number(adsGasto._sum.spend) : 0

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
          <h1 className="text-2xl font-semibold tracking-tight">Campanhas</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Mensagens em massa para pacientes · {campaigns.length} campanha{campaigns.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/marketing-clinico/campanhas/nova"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nova Campanha
        </Link>
      </div>

      {/* Ads snapshot */}
      <AdsSnapshot totalGasto={totalGastoAds} mes={mesLabel} />

      {/* Table */}
      <CampaignsTable initialCampaigns={campaigns.map(c => ({
        ...c,
        agendadoPara: c.agendadoPara?.toISOString() ?? null,
        enviadoEm: c.enviadoEm?.toISOString() ?? null,
        createdAt: c.createdAt.toISOString(),
      }))} />
    </div>
  )
}
