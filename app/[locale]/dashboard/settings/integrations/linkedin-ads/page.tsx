import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Briefcase } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { LinkedInAdsForm } from '@/components/integrations/forms/linkedin-ads-form'

export const metadata = { title: 'LinkedIn Ads | Estetia CRM' }

export default async function LinkedInAdsPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Nao autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          linkedinAdsEnabled: true,
          linkedinAdsAccessToken: true,
          linkedinAdsAccountId: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organizacao nao encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="LinkedIn Ads"
        description="Marketing API para rastreamento B2B — Lead Gen Forms e Conversions API para clinicas e dermatos"
        icon={Briefcase}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
        docsUrl="https://learn.microsoft.com/en-us/linkedin/marketing/"
      />

      <LinkedInAdsForm
        initial={{
          enabled: org.linkedinAdsEnabled,
          hasAccessToken: !!org.linkedinAdsAccessToken,
          accountId: org.linkedinAdsAccountId ?? '',
        }}
      />
    </div>
  )
}
