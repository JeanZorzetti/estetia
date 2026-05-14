/**
 * Mercado Pago Products Configuration - v2.0
 *
 * Configuração de produtos (planos e add-ons) do Mercado Pago.
 */

import { SubscriptionTier, AddonType } from '@prisma/client'

/**
 * IDs dos planos de assinatura no Mercado Pago
 * IMPORTANTE: Criar estes planos no painel do Mercado Pago e substituir os IDs reais aqui
 *
 * Estetia pricing (clínicas de estética/dermatologia):
 *   STARTER  → R$ 149/mês  (1 profissional, 300 pacientes)
 *   PRO      → R$ 297/mês  (3 profissionais, 1.500 pacientes, NFS-e, no-show IA)
 *   BUSINESS → R$ 597/mês  (ilimitado, TISS/convênios, multi-unidade, white-label)
 */
export const MERCADO_PAGO_PLAN_IDS: Record<SubscriptionTier, string | null> = {
  FREE: null,
  STARTER: process.env.MERCADOPAGO_PLAN_ESTETICA_STARTER_ID || process.env.MERCADOPAGO_PLAN_STARTER_ID || 'ESTETICA_STARTER_PLAN_ID', // R$ 149/mês
  PRO: process.env.MERCADOPAGO_PLAN_ESTETICA_PRO_ID || process.env.MERCADOPAGO_PLAN_PRO_ID || 'ESTETICA_PRO_PLAN_ID', // R$ 349/mês
  BUSINESS: process.env.MERCADOPAGO_PLAN_ESTETICA_BUSINESS_ID || process.env.MERCADOPAGO_PLAN_BUSINESS_ID || 'ESTETICA_BUSINESS_PLAN_ID', // R$ 799/mês
}

/**
 * Configuração completa dos planos
 */
export interface PlanConfig {
  id: string | null
  name: string
  description: string
  price: number // Em reais (BRL)
  currency: 'BRL'
  frequency: 'monthly'
  features: string[]
}

export const PLANS: Record<SubscriptionTier, PlanConfig> = {
  FREE: {
    id: null,
    name: 'Grátis',
    description: 'Para explorar o sistema',
    price: 0,
    currency: 'BRL',
    frequency: 'monthly',
    features: [
      '1 profissional',
      'Até 50 pacientes',
      'Agenda básica',
      'Prontuário digital',
    ],
  },

  STARTER: {
    id: MERCADO_PAGO_PLAN_IDS.STARTER,
    name: 'Starter',
    description: 'Para clínicas individuais começando a digitalizar',
    price: 149,
    currency: 'BRL',
    frequency: 'monthly',
    features: [
      '1 profissional',
      'Até 300 pacientes ativos',
      'Agenda inteligente + agendamento online',
      'WhatsApp automático (confirmação + lembretes)',
      'Prontuário & anamnese digital',
      'Fotos evolutivas (before/after)',
      'Recall automático de retorno',
      'App mobile (PWA)',
      'Suporte por e-mail',
    ],
  },

  PRO: {
    id: MERCADO_PAGO_PLAN_IDS.PRO,
    name: 'Pro',
    description: 'Para clínicas em crescimento com até 3 profissionais',
    price: 297,
    currency: 'BRL',
    frequency: 'monthly',
    features: [
      'Tudo do Starter +',
      'Até 3 profissionais',
      'Até 1.500 pacientes ativos',
      'No-show predictor com IA',
      'Múltiplas salas',
      'NFS-e automática',
      'Prescrições digitais com assinatura',
      'Campanhas de marketing (WhatsApp/Email)',
      'Analytics avançado (LTV, retenção, no-show)',
      'Suporte prioritário',
    ],
  },

  BUSINESS: {
    id: MERCADO_PAGO_PLAN_IDS.BUSINESS,
    name: 'Business',
    description: 'Para clínicas consolidadas, multi-unidade e com convênios',
    price: 597,
    currency: 'BRL',
    frequency: 'monthly',
    features: [
      'Tudo do Pro +',
      'Profissionais ilimitados',
      'Pacientes ilimitados',
      'Convênios & TISS (guias + glosas)',
      'Multi-unidade com consolidação',
      'White-label do app paciente',
      'SSO & Audit Log (LGPD)',
      'Gerente de conta dedicado',
    ],
  },
}

/**
 * Configuração dos add-ons (compra única ou recorrente)
 */
export interface AddonConfig {
  type: AddonType
  name: string
  description: string
  price: number
  quantity: number
  recurring: boolean // true = assinatura mensal, false = compra única
  mercadoPagoProductId?: string // ID do produto no Mercado Pago
}

export const ADDONS: Record<AddonType, AddonConfig> = {
  SCRAPING_100: {
    type: 'SCRAPING_100',
    name: 'Pacote 100 Leads',
    description: '100 créditos de prospecção para buscar leads no Google Maps',
    price: 29.9,
    quantity: 100,
    recurring: false, // Compra única
    mercadoPagoProductId: process.env.MERCADOPAGO_ADDON_SCRAPING_100_ID,
  },

  SCRAPING_500: {
    type: 'SCRAPING_500',
    name: 'Pacote 500 Leads',
    description: '500 créditos de prospecção para buscar leads no Google Maps',
    price: 99.9,
    quantity: 500,
    recurring: false, // Compra única
    mercadoPagoProductId: process.env.MERCADOPAGO_ADDON_SCRAPING_500_ID,
  },

  WHATSAPP_EXTRA_INSTANCE: {
    type: 'WHATSAPP_EXTRA_INSTANCE',
    name: 'Instância WhatsApp Extra',
    description: 'Conecte um número de WhatsApp adicional',
    price: 29.9,
    quantity: 1,
    recurring: true, // Assinatura mensal
    mercadoPagoProductId: process.env.MERCADOPAGO_ADDON_WHATSAPP_EXTRA_ID,
  },
}

/**
 * Obtém a configuração de um plano
 */
export function getPlanConfig(tier: SubscriptionTier): PlanConfig {
  return PLANS[tier]
}

/**
 * Obtém a configuração de um add-on
 */
export function getAddonConfig(type: AddonType): AddonConfig {
  return ADDONS[type]
}

/**
 * Verifica se um plano é válido
 */
export function isValidPlan(tier: string): tier is SubscriptionTier {
  return tier in PLANS
}

/**
 * Verifica se um add-on é válido
 */
export function isValidAddon(type: string): type is AddonType {
  return type in ADDONS
}

/**
 * Obtém o ID do plano no Mercado Pago
 */
export function getMercadoPagoPlanId(tier: SubscriptionTier): string | null {
  return MERCADO_PAGO_PLAN_IDS[tier]
}

/**
 * Calcula o preço total de um upgrade (diferença proporcional)
 */
export function calculateProrationAmount(
  fromTier: SubscriptionTier,
  toTier: SubscriptionTier,
  daysRemainingInCycle: number
): number {
  const fromPrice = PLANS[fromTier].price
  const toPrice = PLANS[toTier].price

  const priceDifference = toPrice - fromPrice

  if (priceDifference <= 0) {
    return 0 // Downgrade ou mesmo plano
  }

  // Cálculo proporcional (30 dias por mês)
  const dailyRate = priceDifference / 30
  const prorationAmount = dailyRate * daysRemainingInCycle

  return Math.round(prorationAmount * 100) / 100 // Arredonda para 2 casas decimais
}

/**
 * Formata preço para exibição
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}
