import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { BookOpen } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { WhitebookForm } from '@/components/integrations/forms/whitebook-form'

export const metadata = { title: 'Whitebook | Estetia CRM' }

export default async function WhitebookPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          whitebookEnabled: true,
          whitebookApiKey: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Whitebook (PEBMED)"
        description="Decisão clínica e protocolos — deep-links contextuais para bulas e CIDs"
        icon={BookOpen}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
        docsUrl="https://pebmed.com.br/whitebook/"
      />

      <WhitebookForm
        initial={{
          enabled: org.whitebookEnabled,
          hasApiKey: !!org.whitebookApiKey,
        }}
      />
    </div>
  )
}
