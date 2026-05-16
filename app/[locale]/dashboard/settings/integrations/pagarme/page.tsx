import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { CreditCard } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { PagarmeForm } from '@/components/integrations/forms/pagarme-form'

export const metadata = { title: 'Pagar.me | Estetia CRM' }

export default async function PagarmePage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          pagarmeEnabled: true,
          pagarmeApiKey: true,
          pagarmeRecipientId: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Pagar.me"
        description="Gateway de pagamento da Stone — PIX, cartão e boleto"
        icon={CreditCard}
        iconBg="bg-green-500/10"
        iconColor="text-green-600"
        docsUrl="https://docs.pagar.me/reference"
      />

      <PagarmeForm
        initial={{
          enabled: org.pagarmeEnabled,
          hasApiKey: !!org.pagarmeApiKey,
          recipientId: org.pagarmeRecipientId ?? '',
        }}
      />
    </div>
  )
}
