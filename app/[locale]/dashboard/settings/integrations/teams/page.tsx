import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Users } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { TeamsForm } from '@/components/integrations/forms/teams-form'

export const metadata = { title: 'Microsoft Teams | Estetia CRM' }

export default async function TeamsPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: { select: { teamsEnabled: true, teamsWebhookUrl: true } },
    },
  })
  if (!user?.organization) return <div>Organização não encontrada</div>
  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Microsoft Teams"
        description="Reuniões e notificações da clínica direto no Teams via incoming webhook"
        icon={Users}
        iconBg="bg-violet-500/10"
        iconColor="text-violet-500"
        docsUrl="https://learn.microsoft.com/microsoftteams/platform/webhooks-and-connectors/how-to/connectors-using"
      />

      <TeamsForm
        initial={{ enabled: org.teamsEnabled, hasWebhookUrl: !!org.teamsWebhookUrl }}
      />
    </div>
  )
}
