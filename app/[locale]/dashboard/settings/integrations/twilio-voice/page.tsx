import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Phone } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { GenericCredentialsForm } from '@/components/integrations/forms/generic-credentials-form'

export const metadata = { title: 'Twilio Voice | Estetia CRM' }

export default async function Page() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          twilioVoiceEnabled: true,
          twilioAccountSid: true,
          twilioAuthToken: true,
          twilioFromNumber: true,
        },
      },
    },
  })
  if (!user?.organization) return <div>Organização não encontrada</div>
  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Twilio Voice"
        description="Chamadas de voz programáveis — registre ligações no histórico do paciente"
        icon={Phone}
        iconBg="bg-red-500/10"
        iconColor="text-red-500"
        docsUrl="https://www.twilio.com/docs/voice/api"
      />
      <GenericCredentialsForm
        integrationId="twilio-voice"
        description="Crie uma conta em twilio.com, obtenha Account SID e Auth Token no console."
        initial={{
          enabled: org.twilioVoiceEnabled,
          accountSid: org.twilioAccountSid,
          authToken: org.twilioAuthToken,
          fromNumber: org.twilioFromNumber,
        }}
        fields={[
          { name: 'accountSid', label: 'Account SID', placeholder: 'ACxxxxxxxx', required: true },
          { name: 'authToken', label: 'Auth Token', sensitive: true, required: true },
          { name: 'fromNumber', label: 'Número de origem', placeholder: '+15551234567' },
        ]}
      />
    </div>
  )
}
