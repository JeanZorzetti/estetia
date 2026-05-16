import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { MessageSquare } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { WebchatForm } from '@/components/integrations/forms/webchat-form'

export const metadata = { title: 'Chat no Site | Estetia CRM' }

export default async function WebchatPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          webchatEnabled: true,
          webchatWidgetSecret: true,
          webchatAllowedOrigins: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Chat no Site"
        description="Widget de chat para sua landing page — leads chegam direto no Chat Center"
        icon={MessageSquare}
        iconBg="bg-violet-500/10"
        iconColor="text-violet-500"
      />

      <WebchatForm
        initial={{
          enabled: org.webchatEnabled,
          widgetSecret: org.webchatWidgetSecret,
          allowedOrigins: org.webchatAllowedOrigins ?? '',
        }}
      />
    </div>
  )
}
