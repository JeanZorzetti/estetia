import { INTEGRATIONS } from '@/components/integrations/marketplace/integration-registry'
import { ComingSoonPage } from '@/components/integrations/coming-soon-page'
import { notFound } from 'next/navigation'

export const metadata = { title: 'Twilio Voice | Estetia CRM' }

export default function Page() {
  const integration = INTEGRATIONS.find((i) => i.id === 'twilio-voice')
  if (!integration) notFound()
  return <ComingSoonPage integration={integration} />
}
