import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Phone } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { GenericCredentialsForm } from '@/components/integrations/forms/generic-credentials-form'

export const metadata = { title: 'CallGear | Estetia CRM' }

export default async function Page() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: { select: { callgearEnabled: true, callgearApiKey: true } },
    },
  })
  if (!user?.organization) return <div>Organização não encontrada</div>
  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="CallGear"
        description="Rastreamento de chamadas e analytics — atribuição de leads por origem"
        icon={Phone}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
      />
      <GenericCredentialsForm
        integrationId="callgear"
        description="Obtenha sua API key no painel CallGear."
        initial={{ enabled: org.callgearEnabled, callgearApiKey: org.callgearApiKey }}
        fields={[{ name: 'callgearApiKey', label: 'API Key', sensitive: true, required: true }]}
      />
    </div>
  )
}
