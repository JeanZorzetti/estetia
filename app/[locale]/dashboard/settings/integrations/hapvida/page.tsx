import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { ShieldCheck } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { HapvidaForm } from '@/components/integrations/forms/hapvida-form'

export const metadata = { title: 'Hapvida | Estetia CRM' }

export default async function HapvidaPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          hapvidaEnabled: true,
          hapvidaCredentialsJson: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Hapvida NotreDame"
        description="Integração TISS Hapvida NotreDame Intermédica — elegibilidade e faturamento por regional"
        icon={ShieldCheck}
        iconBg="bg-orange-500/10"
        iconColor="text-orange-600"
        docsUrl="https://www.hapvida.com.br/site/prestadores"
      />

      <HapvidaForm
        initial={{
          enabled: org.hapvidaEnabled,
          hasCredentials: !!org.hapvidaCredentialsJson,
        }}
      />
    </div>
  )
}
