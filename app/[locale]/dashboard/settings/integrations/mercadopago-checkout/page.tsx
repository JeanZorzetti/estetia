import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Wallet } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { MercadoPagoCheckoutForm } from '@/components/integrations/forms/mercadopago-checkout-form'

export const metadata = { title: 'MercadoPago Checkout | Estetia CRM' }

export default async function MpCheckoutPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          mpPaymentEnabled: true,
          mpPaymentAccessToken: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="MercadoPago Checkout"
        description="Receba pagamentos dos seus pacientes — PIX, cartão e boleto"
        icon={Wallet}
        iconBg="bg-cyan-500/10"
        iconColor="text-cyan-500"
        docsUrl="https://www.mercadopago.com.br/developers/pt"
      />

      <MercadoPagoCheckoutForm
        initial={{
          enabled: user.organization.mpPaymentEnabled,
          hasAccessToken: !!user.organization.mpPaymentAccessToken,
        }}
      />
    </div>
  )
}
