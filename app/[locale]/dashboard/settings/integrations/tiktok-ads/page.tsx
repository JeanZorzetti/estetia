import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Music2 } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { TikTokAdsForm } from '@/components/integrations/forms/tiktok-ads-form'

export const metadata = { title: 'TikTok Ads | Estetia CRM' }

export default async function TikTokAdsPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Nao autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          tiktokAdsEnabled: true,
          tiktokAdsAccessToken: true,
          tiktokAdsAdvertiserId: true,
          tiktokAdsPixelId: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organizacao nao encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="TikTok Ads"
        description="Rastreamento de conversoes server-side via TikTok Business API — pixel sem bloqueio de ad blockers"
        icon={Music2}
        iconBg="bg-black/10 dark:bg-white/10"
        iconColor="text-foreground"
        docsUrl="https://business-api.tiktok.com/portal/docs"
      />

      <TikTokAdsForm
        initial={{
          enabled: org.tiktokAdsEnabled,
          hasAccessToken: !!org.tiktokAdsAccessToken,
          advertiserId: org.tiktokAdsAdvertiserId ?? '',
          pixelId: org.tiktokAdsPixelId ?? '',
        }}
      />
    </div>
  )
}
