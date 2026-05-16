import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Receipt } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { AsaasForm } from '@/components/integrations/forms/asaas-form'

export const metadata = { title: 'Asaas | Estetia CRM' }

export default async function AsaasPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          asaasEnabled: true,
          asaasApiKey: true,
          asaasEnvironment: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Asaas"
        description="Cobrança automática via PIX, boleto e cartão — provedor brasileiro"
        icon={Receipt}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
        docsUrl="https://docs.asaas.com/"
      />

      <AsaasForm
        initial={{
          enabled: org.asaasEnabled,
          environment: (org.asaasEnvironment ?? 'sandbox') as 'sandbox' | 'production',
          hasApiKey: !!org.asaasApiKey,
        }}
      />
    </div>
  )
}
