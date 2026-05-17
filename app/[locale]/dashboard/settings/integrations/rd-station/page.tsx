import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { BarChart2 } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { RDStationForm } from '@/components/integrations/forms/rd-station-form'

export const metadata = { title: 'RD Station | Estetia CRM' }

export default async function RDStationPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          rdStationEnabled: true,
          rdStationClientId: true,
          rdStationClientSecret: true,
          rdStationRefreshToken: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="RD Station"
        description="Plataforma brasileira de automação de marketing — integração nativa com leads do Estetia"
        icon={BarChart2}
        iconBg="bg-sky-500/10"
        iconColor="text-sky-500"
        docsUrl="https://developers.rdstation.com/reference"
      />

      <RDStationForm
        initial={{
          enabled: org.rdStationEnabled,
          clientId: org.rdStationClientId ?? '',
          hasClientSecret: !!org.rdStationClientSecret,
          hasRefreshToken: !!org.rdStationRefreshToken,
        }}
      />
    </div>
  )
}
