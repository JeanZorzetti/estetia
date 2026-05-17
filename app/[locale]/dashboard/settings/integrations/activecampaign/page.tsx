import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Zap } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { ActiveCampaignForm } from '@/components/integrations/forms/activecampaign-form'

export const metadata = { title: 'ActiveCampaign | Estetia CRM' }

export default async function ActiveCampaignPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          activecampaignEnabled: true,
          activecampaignApiKey: true,
          activecampaignUrl: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="ActiveCampaign"
        description="Automação avançada de marketing e CRM de leads para clínicas de estética"
        icon={Zap}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
        docsUrl="https://developers.activecampaign.com/reference/overview"
      />

      <ActiveCampaignForm
        initial={{
          enabled: org.activecampaignEnabled,
          hasApiKey: !!org.activecampaignApiKey,
          accountUrl: org.activecampaignUrl ?? '',
        }}
      />
    </div>
  )
}
