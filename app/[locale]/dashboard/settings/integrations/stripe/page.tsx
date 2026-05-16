import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { CreditCard } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { StripeForm } from '@/components/integrations/forms/stripe-form'

export const metadata = { title: 'Stripe | Estetia CRM' }

export default async function StripePage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          stripeEnabled: true,
          stripeSecretKey: true,
          stripeWebhookSecret: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Stripe"
        description="Pagamentos internacionais via cartão, PIX e checkout session"
        icon={CreditCard}
        iconBg="bg-indigo-500/10"
        iconColor="text-indigo-500"
        docsUrl="https://stripe.com/docs/api"
      />

      <StripeForm
        initial={{
          enabled: org.stripeEnabled,
          hasSecretKey: !!org.stripeSecretKey,
          hasWebhookSecret: !!org.stripeWebhookSecret,
        }}
      />
    </div>
  )
}
