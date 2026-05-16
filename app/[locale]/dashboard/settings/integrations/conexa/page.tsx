import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Video } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { ConexaForm } from '@/components/integrations/forms/conexa-form'

export const metadata = { title: 'Conexa Saúde | Estetia CRM' }

export default async function ConexaPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          conexaEnabled: true,
          conexaApiKey: true,
          conexaClinicId: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Conexa Saúde"
        description="Plataforma de telemedicina — gere links de teleconsulta direto do prontuário"
        icon={Video}
        iconBg="bg-violet-500/10"
        iconColor="text-violet-500"
        docsUrl="https://developers.conexasaude.com.br/"
      />

      <ConexaForm
        initial={{
          enabled: org.conexaEnabled,
          clinicId: org.conexaClinicId ?? '',
          hasApiKey: !!org.conexaApiKey,
        }}
      />
    </div>
  )
}
