import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { ShieldCheck } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { AmilForm } from '@/components/integrations/forms/amil-form'

export const metadata = { title: 'Amil | Estetia CRM' }

export default async function AmilPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          amilEnabled: true,
          amilCredentialsJson: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Amil"
        description="Autorização e faturamento Amil — consulta de elegibilidade e envio de guias TISS"
        icon={ShieldCheck}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-600"
        docsUrl="https://www.amil.com.br/prestadores"
      />

      <AmilForm
        initial={{
          enabled: org.amilEnabled,
          hasCredentials: !!org.amilCredentialsJson,
        }}
      />
    </div>
  )
}
