import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Phone } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { GenericCredentialsForm } from '@/components/integrations/forms/generic-credentials-form'

export const metadata = { title: 'RingCentral | Estetia CRM' }

export default async function Page() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          ringcentralEnabled: true,
          ringcentralClientId: true,
          ringcentralClientSecret: true,
          ringcentralJwtToken: true,
        },
      },
    },
  })
  if (!user?.organization) return <div>Organização não encontrada</div>
  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="RingCentral"
        description="Telefonia corporativa em nuvem — log automático de chamadas"
        icon={Phone}
        iconBg="bg-orange-500/10"
        iconColor="text-orange-500"
        docsUrl="https://developers.ringcentral.com/"
      />
      <GenericCredentialsForm
        integrationId="ringcentral"
        description="Crie um app no Developer Portal RingCentral e gere o JWT auth token."
        initial={{
          enabled: org.ringcentralEnabled,
          ringcentralClientId: org.ringcentralClientId,
          ringcentralClientSecret: org.ringcentralClientSecret,
          ringcentralJwtToken: org.ringcentralJwtToken,
        }}
        fields={[
          { name: 'ringcentralClientId', label: 'Client ID', required: true },
          { name: 'ringcentralClientSecret', label: 'Client Secret', sensitive: true, required: true },
          { name: 'ringcentralJwtToken', label: 'JWT Token', sensitive: true, required: true },
        ]}
      />
    </div>
  )
}
