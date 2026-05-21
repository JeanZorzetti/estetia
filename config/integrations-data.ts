import {
  MessageCircle,
  Calendar,
  FileText,
  CreditCard,
  Workflow,
  Code2,
} from 'lucide-react'

export type IntegrationCategory = 'comunicacao' | 'agenda' | 'financeiro_fiscal' | 'automacao_dev'

export type IntegrationItem = {
  slug: string
  category: IntegrationCategory
  i18nKey: string
  icon: typeof MessageCircle
  helpArticleSlug?: string
}

export const INTEGRATIONS: IntegrationItem[] = [
  {
    slug: 'whatsapp-business',
    category: 'comunicacao',
    i18nKey: 'whatsapp',
    icon: MessageCircle,
    helpArticleSlug: 'integracao-whatsapp',
  },
  {
    slug: 'google-calendar',
    category: 'agenda',
    i18nKey: 'googleCalendar',
    icon: Calendar,
    helpArticleSlug: 'google-calendar',
  },
  {
    slug: 'tiss-tuss-nfse',
    category: 'financeiro_fiscal',
    i18nKey: 'tiss',
    icon: FileText,
  },
  {
    slug: 'mercado-pago',
    category: 'financeiro_fiscal',
    i18nKey: 'mercadoPago',
    icon: CreditCard,
  },
  {
    slug: 'n8n',
    category: 'automacao_dev',
    i18nKey: 'n8n',
    icon: Workflow,
  },
  {
    slug: 'api-webhooks',
    category: 'automacao_dev',
    i18nKey: 'apiWebhooks',
    icon: Code2,
  },
]

export const INTEGRATION_CATEGORY_ORDER: IntegrationCategory[] = [
  'comunicacao',
  'agenda',
  'financeiro_fiscal',
  'automacao_dev',
]

export function getIntegrationBySlug(slug: string): IntegrationItem | undefined {
  return INTEGRATIONS.find((i) => i.slug === slug)
}
