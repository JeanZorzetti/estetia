import { INTEGRATIONS, CATEGORIES, type IntegrationMeta, type IntegrationCategory } from '@/components/integrations/marketplace/integration-registry'

export type { IntegrationMeta, IntegrationCategory }
export { CATEGORIES }

export interface DetailedIntegration {
  landingSlug: string
  dashboardId: string
  i18nKey: string
  helpArticleSlug?: string
}

export const DETAILED_INTEGRATIONS: DetailedIntegration[] = [
  { landingSlug: 'whatsapp-business',  dashboardId: 'whatsapp-oficial',       i18nKey: 'whatsapp',          helpArticleSlug: 'integracao-whatsapp' },
  { landingSlug: 'google-calendar',    dashboardId: 'google-calendar',        i18nKey: 'googleCalendar',    helpArticleSlug: 'google-calendar' },
  { landingSlug: 'tiss-tuss-nfse',     dashboardId: '__aggregate_tiss',       i18nKey: 'tiss' },
  { landingSlug: 'mercado-pago',       dashboardId: 'mercadopago-checkout',   i18nKey: 'mercadoPago' },
  { landingSlug: 'n8n',                dashboardId: 'n8n',                    i18nKey: 'n8n' },
  { landingSlug: 'api-webhooks',       dashboardId: '__aggregate_api',        i18nKey: 'apiWebhooks' },
  { landingSlug: 'whatsapp-evolution', dashboardId: 'whatsapp-evolution',     i18nKey: 'whatsappEvolution' },
  { landingSlug: 'whatsapp-zapi',      dashboardId: 'whatsapp-zapi',          i18nKey: 'whatsappZapi' },
  { landingSlug: 'instagram-direct',   dashboardId: 'instagram-dm',           i18nKey: 'instagramDirect' },
  { landingSlug: 'asaas',              dashboardId: 'asaas',                  i18nKey: 'asaas' },
  { landingSlug: 'stripe',             dashboardId: 'stripe',                 i18nKey: 'stripe' },
  { landingSlug: 'pagseguro',          dashboardId: 'pagseguro',              i18nKey: 'pagseguro' },
  { landingSlug: 'google-ads',         dashboardId: 'google-ads',             i18nKey: 'googleAds' },
  { landingSlug: 'meta-ads',           dashboardId: 'facebook-ads',           i18nKey: 'metaAds' },
  { landingSlug: 'zapier',             dashboardId: 'zapier',                 i18nKey: 'zapier' },
  { landingSlug: 'make',               dashboardId: 'make',                   i18nKey: 'make' },
]

const DETAILED_DASHBOARD_IDS = new Set(DETAILED_INTEGRATIONS.map((d) => d.dashboardId))
const DETAILED_BY_LANDING_SLUG = new Map(DETAILED_INTEGRATIONS.map((d) => [d.landingSlug, d]))

export const ALL_INTEGRATIONS: IntegrationMeta[] = INTEGRATIONS

export function hasDetailedPage(dashboardId: string): boolean {
  return DETAILED_DASHBOARD_IDS.has(dashboardId)
}

export function getDetailedBySlug(landingSlug: string): DetailedIntegration | undefined {
  return DETAILED_BY_LANDING_SLUG.get(landingSlug)
}

export function getDashboardIntegrationById(id: string): IntegrationMeta | undefined {
  return INTEGRATIONS.find((i) => i.id === id)
}

export function getLandingSlugForDashboardId(dashboardId: string): string | null {
  const found = DETAILED_INTEGRATIONS.find((d) => d.dashboardId === dashboardId)
  return found ? found.landingSlug : null
}

export const MARKETING_CATEGORY_LABELS: Record<IntegrationCategory, string> = {
  mensageria:       'Mensageria',
  telefonia:        'Telefonia',
  calendarios:      'Agenda & Calendários',
  'email-marketing':'E-mail & Marketing',
  anuncios:         'Anúncios',
  pagamentos:       'Pagamentos',
  nfse:             'Notas Fiscais (NFS-e)',
  convenios:        'Convênios & TISS',
  telemedicina:     'Telemedicina',
  erp:              'ERP & Operações',
  produtividade:    'Produtividade',
  webhooks:         'Automação & Webhooks',
  validacoes:       'Validações',
}

export const CATEGORY_ORDER: IntegrationCategory[] = [
  'mensageria',
  'telefonia',
  'calendarios',
  'email-marketing',
  'anuncios',
  'pagamentos',
  'nfse',
  'convenios',
  'telemedicina',
  'erp',
  'produtividade',
  'webhooks',
  'validacoes',
]
