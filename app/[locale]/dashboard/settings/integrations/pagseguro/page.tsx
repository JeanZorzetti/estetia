import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { CreditCard } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { PagSeguroForm } from '@/components/integrations/forms/pagseguro-form'

export const metadata = { title: 'PagSeguro | Estetia CRM' }

export default async function PagSeguroPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          pagseguroEnabled: true,
          pagseguroToken: true,
          pagseguroEnvironment: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="PagSeguro / PagBank"
        description="Checkout e cobrança via PIX, boleto e cartão — provedor brasileiro"
        icon={CreditCard}
        iconBg="bg-yellow-500/10"
        iconColor="text-yellow-600"
        docsUrl="https://dev.pagbank.uol.com.br/reference"
      />

      <PagSeguroForm
        initial={{
          enabled: org.pagseguroEnabled,
          environment: (org.pagseguroEnvironment ?? 'sandbox') as 'sandbox' | 'production',
          hasToken: !!org.pagseguroToken,
        }}
      />
    </div>
  )
}
