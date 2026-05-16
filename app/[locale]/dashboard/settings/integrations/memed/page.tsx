import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { FileText } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { MemedForm } from '@/components/integrations/forms/memed-form'

export const metadata = { title: 'Memed | Estetia CRM' }

export default async function MemedPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          memedEnabled: true,
          memedApiKey: true,
          memedPublicKey: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Memed"
        description="Prescrição digital válida — widget embedável no prontuário do paciente"
        icon={FileText}
        iconBg="bg-pink-500/10"
        iconColor="text-pink-500"
        docsUrl="https://memed.com.br/integracao/"
      />

      <MemedForm
        initial={{
          enabled: org.memedEnabled,
          publicKey: org.memedPublicKey ?? '',
          hasApiKey: !!org.memedApiKey,
        }}
      />
    </div>
  )
}
