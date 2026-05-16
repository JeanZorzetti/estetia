import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Apple } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { AppleCalendarForm } from '@/components/integrations/forms/apple-calendar-form'

export const metadata = { title: 'Apple Calendar | Estetia CRM' }

export default async function AppleCalendarPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organizationId: true,
      organization: {
        select: {
          id: true,
          appleCalendarEnabled: true,
          appleCalendarFeedSecret: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Apple Calendar"
        description="Assine seus agendamentos como feed .ics — compatível com iCal, Google Calendar e Outlook"
        icon={Apple}
        iconBg="bg-zinc-500/10"
        iconColor="text-zinc-500"
        docsUrl="https://support.apple.com/pt-br/guide/calendar/icl1025/mac"
      />

      <AppleCalendarForm
        initial={{
          enabled: org.appleCalendarEnabled,
          feedSecret: org.appleCalendarFeedSecret ?? null,
          orgId: org.id,
          appUrl,
        }}
      />
    </div>
  )
}
