import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { FileText } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { JotformForm } from '@/components/integrations/forms/jotform-form'

export const metadata = { title: 'JotForm | Estetia CRM' }

export default async function JotformPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          id: true,
          jotformEnabled: true,
          jotformApiKey: true,
          jotformFormId: true,
        },
      },
    },
  })
  if (!user?.organization) return <div>Organização não encontrada</div>
  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="JotForm"
        description="Formulários online e captação de leads via JotForm"
        icon={FileText}
        iconBg="bg-orange-500/10"
        iconColor="text-orange-500"
        docsUrl="https://api.jotform.com/docs/"
      />

      <JotformForm
        orgId={org.id}
        initial={{
          enabled: org.jotformEnabled,
          hasApiKey: !!org.jotformApiKey,
          formId: org.jotformFormId ?? '',
        }}
      />
    </div>
  )
}
