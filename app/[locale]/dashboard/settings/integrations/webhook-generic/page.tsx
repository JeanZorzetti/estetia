import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { headers } from 'next/headers'
import { Webhook } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { WebhookGenericConfig } from '@/components/integrations/forms/webhook-generic-config'

export const metadata = { title: 'Webhooks Genéricos | Estetia CRM' }

export default async function WebhookGenericPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          id: true,
          webhookEnabled: true,
          webhookSecret: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? 'https'
  const webhookUrl = `${proto}://${host}/api/webhooks/incoming/${user.organization.id}`

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Webhooks Genéricos"
        description="Integre com Zapier, Make, n8n ou qualquer ferramenta — você decide as automações"
        icon={Webhook}
        iconBg="bg-violet-500/10"
        iconColor="text-violet-500"
      />

      <WebhookGenericConfig
        initial={{
          enabled: user.organization.webhookEnabled,
          hasSecret: !!user.organization.webhookSecret,
          webhookUrl,
        }}
      />
    </div>
  )
}
