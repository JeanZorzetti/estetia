import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { MessageSquare } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { SlackForm } from '@/components/integrations/forms/slack-form'

export const metadata = { title: 'Slack | Estetia CRM' }

export default async function SlackPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: { slackEnabled: true, slackWebhookUrl: true },
      },
    },
  })
  if (!user?.organization) return <div>Organização não encontrada</div>
  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Slack"
        description="Notificações da clínica em tempo real no Slack via incoming webhooks"
        icon={MessageSquare}
        iconBg="bg-fuchsia-500/10"
        iconColor="text-fuchsia-500"
        docsUrl="https://api.slack.com/messaging/webhooks"
      />

      <SlackForm
        initial={{
          enabled: org.slackEnabled,
          hasWebhookUrl: !!org.slackWebhookUrl,
        }}
      />
    </div>
  )
}
