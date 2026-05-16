import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Zap } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { SimpleWebhookForm } from '@/components/integrations/forms/simple-webhook-form'

export const metadata = { title: 'Zapier | Estetia CRM' }

export default async function ZapierPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: { select: { zapierEnabled: true, zapierWebhookUrl: true } },
    },
  })
  if (!user?.organization) return <div>Organização não encontrada</div>
  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Zapier"
        description="Conecte o Estetia CRM com 5000+ apps via Zaps que recebem nossos eventos"
        icon={Zap}
        iconBg="bg-orange-500/10"
        iconColor="text-orange-500"
        docsUrl="https://zapier.com/help/create/code-webhooks/trigger-zaps-from-webhooks"
      />

      <SimpleWebhookForm
        integrationId="zapier"
        fieldName="zapierWebhookUrl"
        description="Cole a URL Catch Hook do Zap criado no Zapier"
        helperText="No Zapier: New Zap → Trigger: Webhooks by Zapier → Catch Hook → copie a URL"
        initial={{
          enabled: org.zapierEnabled,
          hasWebhookUrl: !!org.zapierWebhookUrl,
        }}
      />
    </div>
  )
}
