import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Video } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { ZoomForm } from '@/components/integrations/forms/zoom-form'

export const metadata = { title: 'Zoom | Estetia CRM' }

export default async function ZoomPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          zoomEnabled: true,
          zoomAccountId: true,
          zoomClientId: true,
          zoomClientSecret: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Zoom"
        description="Reuniões e tele-consulta — link automático nos agendamentos"
        icon={Video}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
        docsUrl="https://developers.zoom.us/"
      />

      <ZoomForm
        initial={{
          enabled: org.zoomEnabled,
          accountId: org.zoomAccountId ?? '',
          clientId: org.zoomClientId ?? '',
          hasClientSecret: !!org.zoomClientSecret,
        }}
      />
    </div>
  )
}
