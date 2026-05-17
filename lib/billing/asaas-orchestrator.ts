/**
 * Asaas Billing Orchestrator
 *
 * Manages SaaS subscription lifecycle via Asaas:
 * - Single subscription per org (1 value = total of active modules)
 * - Proration calculated locally on mid-cycle changes
 * - State of truth: PostgreSQL (billingActiveModules, billingMonthlyTotal, etc.)
 */

import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { calculatePrice } from '@/lib/pricing/calculator'
import {
  createCustomer,
  updateCustomer,
  getCustomer,
  createSubscription,
  deleteSubscription,
  getSubscriptionPayments,
  createPayment,
  type AsaasConfig,
} from '@/lib/integrations/asaas-client'

function getAsaasConfig(): AsaasConfig {
  const apiKey = process.env.ASAAS_API_KEY
  if (!apiKey) throw new Error('ASAAS_API_KEY não configurada')
  const environment = (process.env.ASAAS_ENVIRONMENT ?? 'sandbox') as 'sandbox' | 'production'
  return { apiKey, environment }
}

const BILLING_SUCCESS_URL =
  process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    : 'https://doc-crm-estetia.7c17iw.easypanel.host/dashboard'

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function nextMonthStr(): string {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().slice(0, 10)
}

function nextYearStr(): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

async function loadCatalog() {
  const rows = await prisma.pricingModule.findMany({ where: { ativo: true } })
  return rows.map(m => ({
    slug: m.slug,
    category: m.category as 'BASE' | 'CLINICO' | 'COMUNICACAO' | 'GESTAO' | 'IA' | 'ADDON',
    nome: m.nome,
    descricao: m.descricao,
    features: m.features as string[],
    priceCents: m.priceCents,
    iconLucide: m.iconLucide,
    exclusiveGroup: m.exclusiveGroup,
    required: m.required,
    ordem: m.ordem,
  }))
}

/** Ensures an Asaas customer exists for the org with a valid cpfCnpj. Creates or patches as needed. */
export async function ensureCustomer(orgId: string, cpfCnpj?: string): Promise<string> {
  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: orgId },
    select: { asaasCustomerId: true, name: true, cnpj: true },
  })

  const resolvedCpfCnpj = cpfCnpj ?? org.cnpj ?? undefined
  if (!resolvedCpfCnpj) throw new Error('CPF ou CNPJ é obrigatório para criar a assinatura Asaas')

  // Persist cpfCnpj if not already saved in org
  if (resolvedCpfCnpj && !org.cnpj) {
    await prisma.organization.update({ where: { id: orgId }, data: { cnpj: resolvedCpfCnpj } })
  }

  const config = getAsaasConfig()

  if (org.asaasCustomerId) {
    // Customer already exists — check if it has cpfCnpj, patch if missing
    const existing = await getCustomer(config, org.asaasCustomerId).catch(() => null)
    if (!existing?.cpfCnpj) {
      await updateCustomer(config, org.asaasCustomerId, { cpfCnpj: resolvedCpfCnpj })
    }
    return org.asaasCustomerId
  }

  const customer = await createCustomer(config, {
    name: org.name,
    cpfCnpj: resolvedCpfCnpj,
    externalReference: orgId,
  })

  await prisma.organization.update({
    where: { id: orgId },
    data: { asaasCustomerId: customer.id },
  })

  return customer.id
}

export interface SubscribeResult {
  asaasSubscriptionId: string
  invoiceUrl?: string
  monthlyTotal: number
}

/** Creates first subscription for the org. */
export async function createOrgSubscription(
  orgId: string,
  modules: string[],
  cycle: 'MONTHLY' | 'YEARLY',
  cpfCnpj?: string,
): Promise<SubscribeResult> {
  const [customerId, catalog] = await Promise.all([
    ensureCustomer(orgId, cpfCnpj),
    loadCatalog(),
  ])

  const result = calculatePrice(
    { selectedSlugs: modules, billingPeriod: cycle === 'YEARLY' ? 'ANNUAL' : 'MONTHLY' },
    catalog,
  )
  const monthlyR$ = result.totalCents / 100

  const config = getAsaasConfig()
  const nextDue = cycle === 'YEARLY' ? nextYearStr() : nextMonthStr()

  const subscription = await createSubscription(config, {
    customer: customerId,
    billingType: 'CREDIT_CARD',
    value: monthlyR$,
    nextDueDate: nextDue,
    cycle: cycle === 'YEARLY' ? 'YEARLY' : 'MONTHLY',
    description: `Estetia CRM — plano modular`,
    externalReference: orgId,
    successUrl: BILLING_SUCCESS_URL,
  })

  await prisma.organization.update({
    where: { id: orgId },
    data: {
      asaasSubscriptionId: subscription.id,
      billingCycle: cycle,
      billingNextDueDate: new Date(nextDue),
      billingActiveModules: modules,
      billingMonthlyTotal: monthlyR$,
      billingYearlyTotal: cycle === 'YEARLY' ? monthlyR$ * 12 : null,
    },
  })

  // Fetch the first pending payment to get the credit card checkout URL
  const payments = await getSubscriptionPayments(config, subscription.id).catch(() => [])
  const invoiceUrl = payments[0]?.invoiceUrl ?? undefined

  return {
    asaasSubscriptionId: subscription.id,
    invoiceUrl,
    monthlyTotal: monthlyR$,
  }
}

export interface UpdateResult {
  newSubscriptionId: string
  prorationR$: number
  prorationPaymentId?: string
  invoiceUrl?: string
  monthlyTotal: number
}

/** Updates subscription: cancels current, creates new, charges proration if needed. */
export async function updateOrgSubscription(
  orgId: string,
  newModules: string[],
  extras?: { users: number; rooms: number; profs: number },
): Promise<UpdateResult> {
  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: orgId },
    select: {
      asaasCustomerId: true,
      asaasSubscriptionId: true,
      billingCycle: true,
      billingNextDueDate: true,
      billingMonthlyTotal: true,
    },
  })

  if (!org.asaasCustomerId) throw new Error('Organização sem customer Asaas')

  const catalog = await loadCatalog()
  const cycle = (org.billingCycle ?? 'MONTHLY') as 'MONTHLY' | 'YEARLY'

  const result = calculatePrice(
    {
      selectedSlugs: newModules,
      extras,
      billingPeriod: cycle === 'YEARLY' ? 'ANNUAL' : 'MONTHLY',
    },
    catalog,
  )
  const newMonthlyR$ = result.totalCents / 100
  const oldMonthlyR$ = Number(org.billingMonthlyTotal ?? 0)

  // Proration: (newTotal - oldTotal) × remainingDays / cycleDays
  let prorationR$ = 0
  if (org.billingNextDueDate && newMonthlyR$ > oldMonthlyR$) {
    const now = Date.now()
    const dueTs = org.billingNextDueDate.getTime()
    const cycleDays = cycle === 'YEARLY' ? 365 : 30
    const remainingDays = Math.max(0, Math.ceil((dueTs - now) / 86400000))
    prorationR$ = parseFloat(
      ((newMonthlyR$ - oldMonthlyR$) * (remainingDays / cycleDays)).toFixed(2),
    )
  }

  const config = getAsaasConfig()

  // Cancel old subscription
  if (org.asaasSubscriptionId) {
    await deleteSubscription(config, org.asaasSubscriptionId).catch(() => {})
  }

  // Create new subscription starting today
  const nextDue = cycle === 'YEARLY' ? nextYearStr() : nextMonthStr()
  const newSubscription = await createSubscription(config, {
    customer: org.asaasCustomerId,
    billingType: 'CREDIT_CARD',
    value: newMonthlyR$,
    nextDueDate: nextDue,
    cycle: cycle === 'YEARLY' ? 'YEARLY' : 'MONTHLY',
    description: 'Estetia CRM — plano modular (atualizado)',
    externalReference: orgId,
    successUrl: BILLING_SUCCESS_URL,
  })

  // Charge proration immediately if upgrading
  let prorationPaymentId: string | undefined
  if (prorationR$ > 0) {
    const proPayment = await createPayment(config, {
      customer: org.asaasCustomerId,
      billingType: 'CREDIT_CARD',
      value: prorationR$,
      dueDate: todayStr(),
      description: `Estetia — cobrança proporcional (${remainingDaysText(org.billingNextDueDate)})`,
      externalReference: `proration_${orgId}`,
    }).catch(() => undefined)
    prorationPaymentId = proPayment?.id
  }

  await prisma.organization.update({
    where: { id: orgId },
    data: {
      asaasSubscriptionId: newSubscription.id,
      billingNextDueDate: new Date(nextDue),
      billingActiveModules: newModules,
      billingMonthlyTotal: newMonthlyR$,
      billingYearlyTotal: cycle === 'YEARLY' ? newMonthlyR$ * 12 : null,
      ...(extras != null ? {
        extraUsers: extras.users,
        extraRooms: extras.rooms,
        extraProfs: extras.profs,
      } : {}),
    },
  })

  const payments = await getSubscriptionPayments(config, newSubscription.id).catch(() => [])
  const invoiceUrl = payments[0]?.invoiceUrl ?? undefined

  return {
    newSubscriptionId: newSubscription.id,
    prorationR$,
    prorationPaymentId,
    invoiceUrl,
    monthlyTotal: newMonthlyR$,
  }
}

export async function cancelOrgSubscription(orgId: string): Promise<void> {
  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: orgId },
    select: { asaasSubscriptionId: true },
  })

  if (org.asaasSubscriptionId) {
    const config = getAsaasConfig()
    await deleteSubscription(config, org.asaasSubscriptionId).catch(() => {})
  }

  await prisma.organization.update({
    where: { id: orgId },
    data: {
      asaasSubscriptionId: null,
      billingActiveModules: Prisma.JsonNull,
      billingMonthlyTotal: null,
      billingYearlyTotal: null,
      billingNextDueDate: null,
    },
  })
}

function remainingDaysText(nextDue: Date | null): string {
  if (!nextDue) return 'proporcional'
  const days = Math.max(0, Math.ceil((nextDue.getTime() - Date.now()) / 86400000))
  return `${days} dias restantes`
}
