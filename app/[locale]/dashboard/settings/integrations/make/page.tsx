import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Workflow } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { SimpleWebhookForm } from '@/components/integrations/forms/simple-webhook-form'

export const metadata = { title: 'Make | Estetia CRM' }

export default async function MakePage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: { select: { makeEnabled: true, makeWebhookUrl: true } },
    },
  })
  if (!user?.organization) return <div>Organização não encontrada</div>
  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Make"
        description="Automações visuais avançadas via Make (antigo Integromat) com cenários recebendo nossos eventos"
        icon={Workflow}
        iconBg="bg-violet-500/10"
        iconColor="text-violet-500"
        docsUrl="https://www.make.com/en/help/tools/webhooks"
      />

      <SimpleWebhookForm
        integrationId="make"
        fieldName="makeWebhookUrl"
        description="Cole a URL do módulo Webhook do cenário criado no Make"
        helperText="No Make: New scenario → Webhooks → Custom webhook → Add → copie a URL"
        initial={{
          enabled: org.makeEnabled,
          hasWebhookUrl: !!org.makeWebhookUrl,
        }}
      />
    </div>
  )
}
