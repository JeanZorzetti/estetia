import { Metadata } from 'next'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Star, Users, ArrowUpRight, Zap, Crown, Building2, Sparkles,
  Gift, Clock, AlertTriangle, CheckCircle2, TrendingDown, ExternalLink,
  Receipt, Calendar, CreditCard, Package,
} from "lucide-react"
import * as LucideIcons from "lucide-react"
import { BillingPageTracker } from "@/components/analytics/billing-page-tracker"
import { PurchaseTracker } from "@/components/analytics/purchase-tracker"
import { CopyReferralButton } from "./copy-referral-button"
import { CancelSubscriptionButton } from "./cancel-subscription-button"
import { PLAN_NAMES, PLAN_PRICING, PLAN_DESCRIPTIONS } from "@/lib/entitlements"
import { SubscriptionTier } from "@prisma/client"
import { isTrialActive, isReadOnly } from "@/lib/entitlements"
import { getSubscriptionPayments, type AsaasConfig } from "@/lib/integrations/asaas-client"

export const metadata: Metadata = {
  title: 'Assinatura & Faturamento | Estetia CRM'
}

export const dynamic = 'force-dynamic'

// ─── Legacy tier UI helpers ───────────────────────────────────────────────────

const TIER_ICON: Record<string, React.ReactNode> = {
  FREE:     <Sparkles className="w-5 h-5" />,
  STARTER:  <Zap className="w-5 h-5" />,
  PRO:      <Crown className="w-5 h-5" />,
  BUSINESS: <Building2 className="w-5 h-5" />,
}

const TIER_COLOR: Record<string, string> = {
  FREE:     'from-zinc-500/10 to-zinc-500/5 border-zinc-200 dark:border-zinc-800',
  STARTER:  'from-blue-500/10 to-blue-500/5 border-blue-200 dark:border-blue-900',
  PRO:      'from-violet-500/10 to-violet-500/5 border-violet-200 dark:border-violet-900',
  BUSINESS: 'from-amber-500/10 to-amber-500/5 border-amber-200 dark:border-amber-900',
}

const TIER_ACCENT: Record<string, string> = {
  FREE:     'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
  STARTER:  'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  PRO:      'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  BUSINESS: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
}

function getDaysRemaining(endsAt: Date): number {
  return Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
}

// ─── Modular UI helpers ───────────────────────────────────────────────────────

const CATEGORY_LABEL: Record<string, string> = {
  BASE: 'Base',
  CLINICO: 'Clínico',
  COMUNICACAO: 'Comunicação',
  GESTAO: 'Gestão',
  IA: 'IA',
  ADDON: 'Addon',
}

const CATEGORY_COLOR: Record<string, string> = {
  BASE:        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  CLINICO:     'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
  COMUNICACAO: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300',
  GESTAO:      'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  IA:          'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  ADDON:       'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
}

const PAYMENT_STATUS: Record<string, { label: string; className: string }> = {
  PENDING:   { label: 'Aguardando', className: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400' },
  RECEIVED:  { label: 'Pago',       className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400' },
  CONFIRMED: { label: 'Pago',       className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400' },
  OVERDUE:   { label: 'Vencido',    className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400' },
  REFUNDED:  { label: 'Estornado',  className: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400' },
}

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function getLucideIcon(name: string) {
  const icons = LucideIcons as unknown as Record<string, React.ElementType>
  const Icon = icons[name]
  return Icon ? <Icon className="w-4 h-4" /> : <Package className="w-4 h-4" />
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BillingPage() {
  const session = await getSession()

  // Shared fields (used in both modular and legacy paths)
  let referralCode: string | null = null
  let referralDiscount = 0
  let rewardedReferrals = 0
  let organizationId: string | null = null

  // Legacy-only fields
  let tier: SubscriptionTier = SubscriptionTier.FREE
  let isFounder = false
  let founderNumber: number | null = null
  let customPricing: number | null = null
  let trialEndsAt: Date | null = null
  let trialStatus: string | null = null

  // Modular-only fields
  let asaasSubscriptionId: string | null = null
  let billingActiveModules: string[] = []
  let billingMonthlyTotal: number | null = null
  let billingNextDueDate: Date | null = null
  let billingCycle: string = 'MONTHLY'

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        referralCode: true,
        organizationId: true,
        organization: {
          select: {
            tier: true,
            isFounder: true,
            founderNumber: true,
            customPricing: true,
            referralDiscount: true,
            trialEndsAt: true,
            trialStatus: true,
            referrals: { where: { status: 'REWARDED' }, select: { id: true } },
            asaasSubscriptionId: true,
            billingActiveModules: true,
            billingMonthlyTotal: true,
            billingNextDueDate: true,
            billingCycle: true,
          }
        }
      }
    })

    if (user) {
      organizationId = user.organizationId ?? null
      tier = (user.organization?.tier ?? SubscriptionTier.FREE) as SubscriptionTier
      isFounder = user.organization?.isFounder ?? false
      founderNumber = user.organization?.founderNumber ?? null
      customPricing = user.organization?.customPricing ? Number(user.organization.customPricing) : null
      referralDiscount = user.organization?.referralDiscount ?? 0
      rewardedReferrals = user.organization?.referrals?.length ?? 0
      trialEndsAt = user.organization?.trialEndsAt ?? null
      trialStatus = user.organization?.trialStatus ?? null
      asaasSubscriptionId = user.organization?.asaasSubscriptionId ?? null
      billingActiveModules = (user.organization?.billingActiveModules as string[] | null) ?? []
      billingMonthlyTotal = user.organization?.billingMonthlyTotal ? Number(user.organization.billingMonthlyTotal) : null
      billingNextDueDate = user.organization?.billingNextDueDate ?? null
      billingCycle = user.organization?.billingCycle ?? 'MONTHLY'

      if (user.referralCode) {
        referralCode = user.referralCode
      } else {
        let code = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6)
        const conflict = await prisma.user.findUnique({ where: { referralCode: code } })
        if (conflict) code = code + Math.floor(Math.random() * 99)
        await prisma.user.update({ where: { email: session.user.email }, data: { referralCode: code } })
        referralCode = code
      }
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://estetiacrm.com.br'
  const referralUrl = referralCode ? `${appUrl}/r/${referralCode}` : null

  // Referral progress (max 7 = 100%)
  const MAX_REFERRALS = 7
  const referralProgress = Math.min((rewardedReferrals / MAX_REFERRALS) * 100, 100)
  const nextMilestone = Math.min(rewardedReferrals + 1, MAX_REFERRALS)
  const discountAtNext = Math.min((nextMilestone / MAX_REFERRALS) * 100, 100)
  const referralSavings = billingMonthlyTotal && referralDiscount > 0
    ? billingMonthlyTotal * (referralDiscount / 100)
    : null

  // ─── MODULAR PATH ─────────────────────────────────────────────────────────

  if (asaasSubscriptionId) {
    // Load module metadata for active modules
    const modulesMeta = billingActiveModules.length > 0
      ? await prisma.pricingModule.findMany({
          where: { slug: { in: billingActiveModules }, ativo: true },
          select: { slug: true, nome: true, category: true, iconLucide: true, priceCents: true },
          orderBy: [{ category: 'asc' }, { ordem: 'asc' }],
        })
      : []

    // Fetch Asaas payment history (non-blocking)
    const asaasConfig: AsaasConfig = {
      apiKey: process.env.ASAAS_API_KEY ?? '',
      environment: (process.env.ASAAS_ENVIRONMENT ?? 'sandbox') as 'sandbox' | 'production',
    }
    const payments = process.env.ASAAS_API_KEY
      ? await getSubscriptionPayments(asaasConfig, asaasSubscriptionId).catch(() => [])
      : []
    const visiblePayments = payments.filter(p => p.status !== 'DELETED').slice(0, 12)

    // Group modules by category
    const grouped = billingActiveModules.reduce<Record<string, typeof modulesMeta>>((acc, slug) => {
      const mod = modulesMeta.find(m => m.slug === slug)
      if (!mod) return acc
      if (!acc[mod.category]) acc[mod.category] = []
      acc[mod.category].push(mod)
      return acc
    }, {})

    const effectiveTotal = billingMonthlyTotal
      ? billingMonthlyTotal * (1 - referralDiscount / 100)
      : null

    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-3xl mx-auto">
        <BillingPageTracker />
        <PurchaseTracker />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Assinatura & Faturamento</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Gerencie seus módulos e histórico de cobranças</p>
          </div>
          <Button asChild size="sm">
            <Link href="/dashboard/billing/plans">
              Gerenciar módulos
              <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>

        {/* Card: Plano modular ativo */}
        <Card className="bg-gradient-to-br from-primary/8 to-primary/3 border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg">Plano Personalizado</CardTitle>
                    <Badge variant="outline" className="text-xs border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3 mr-1" />Ativo
                    </Badge>
                  </div>
                  <CardDescription className="mt-0.5 flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {billingNextDueDate
                        ? `Próxima cobrança: ${new Date(billingNextDueDate).toLocaleDateString('pt-BR')}`
                        : 'Aguardando confirmação de pagamento'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" />
                      {billingCycle === 'YEARLY' ? 'Anual' : 'Mensal'}
                    </span>
                  </CardDescription>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl font-bold tracking-tight">
                  {effectiveTotal != null ? formatBRL(effectiveTotal) : '—'}
                </div>
                <div className="text-xs text-muted-foreground">/mês</div>
                {referralDiscount > 0 && billingMonthlyTotal && (
                  <div className="text-xs text-primary font-medium mt-0.5">
                    −{referralDiscount}% via indicações
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          {/* Módulos agrupados por categoria */}
          {Object.keys(grouped).length > 0 ? (
            <CardContent className="pt-0 space-y-3">
              <div className="border-t border-border/40 pt-4">
                {Object.entries(grouped).map(([cat, mods]) => (
                  <div key={cat} className="mb-3 last:mb-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      {CATEGORY_LABEL[cat] ?? cat}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {mods.map(mod => (
                        <div
                          key={mod.slug}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-transparent ${CATEGORY_COLOR[mod.category] ?? ''}`}
                        >
                          {getLucideIcon(mod.iconLucide)}
                          {mod.nome}
                          <span className="opacity-60 font-normal ml-0.5">{formatBRL(mod.priceCents / 100)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/40 pt-3 flex justify-end">
                <CancelSubscriptionButton planName="Plano Personalizado" />
              </div>
            </CardContent>
          ) : (
            <CardContent className="pt-0">
              <div className="border-t border-border/40 pt-4 text-sm text-muted-foreground">
                Módulos sendo sincronizados — recarregue em alguns segundos.
              </div>
            </CardContent>
          )}
        </Card>

        {/* Card: Indique e Ganhe */}
        {referralUrl && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Indique e Ganhe</CardTitle>
                    <CardDescription className="mt-0.5">
                      Cada indicação ativa = <strong className="text-foreground">+15% off</strong> recorrente na sua mensalidade
                    </CardDescription>
                  </div>
                </div>
                {referralDiscount > 0 && referralSavings != null && (
                  <div className="text-right shrink-0">
                    <div className="text-3xl font-bold tracking-tight text-primary">{referralDiscount}%</div>
                    <div className="text-xs text-muted-foreground">= {formatBRL(referralSavings)}/mês economizados</div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {rewardedReferrals} de {MAX_REFERRALS} indicações ativas
                  </span>
                  {rewardedReferrals < MAX_REFERRALS ? (
                    <span className="text-muted-foreground text-xs">
                      próxima → <span className="text-primary font-medium">{discountAtNext.toFixed(0)}% off</span>
                    </span>
                  ) : (
                    <Badge className="text-xs bg-primary text-primary-foreground">Mensalidade zerada!</Badge>
                  )}
                </div>
                <Progress value={referralProgress} className="h-2" />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>0%</span><span>15%</span><span>30%</span><span>45%</span>
                  <span>60%</span><span>75%</span><span>90%</span>
                  <span className="font-semibold text-primary">100% grátis</span>
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 border border-border/50 px-4 py-3 flex items-start gap-3">
                <TrendingDown className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Quem você indicar recebe <strong className="text-foreground">20% off por 3 meses</strong> no primeiro plano pago — aplicado automaticamente pelo link.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Seu link exclusivo</p>
                <div className="flex gap-2 flex-wrap">
                  <code className="bg-muted border border-border/50 rounded-lg px-3 py-2.5 text-sm flex-1 min-w-0 truncate font-mono">
                    {referralUrl}
                  </code>
                  <CopyReferralButton url={referralUrl} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5">
                  <Link href="/indique">
                    Como funciona o programa
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card: Histórico de cobranças */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Receipt className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">Histórico de cobranças</CardTitle>
                <CardDescription className="mt-0.5">Faturas da sua assinatura modular</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {visiblePayments.length === 0 ? (
              <div className="border-t border-border/40 pt-4 text-sm text-center text-muted-foreground py-6">
                Sua primeira cobrança aparecerá aqui após o pagamento ser processado.
              </div>
            ) : (
              <div className="border-t border-border/40 pt-0 divide-y divide-border/40">
                {visiblePayments.map(payment => {
                  const st = PAYMENT_STATUS[payment.status] ?? { label: payment.status, className: 'bg-zinc-100 text-zinc-600 border-zinc-200' }
                  return (
                    <div key={payment.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{payment.description ?? 'Estetia CRM — Plano modular'}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {payment.dueDate ? formatDate(payment.dueDate) : '—'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-semibold">{formatBRL(payment.value)}</span>
                        <Badge variant="outline" className={`text-xs ${st.className}`}>
                          {st.label}
                        </Badge>
                        {payment.invoiceUrl && (
                          <a
                            href={payment.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                          >
                            Ver fatura
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/dashboard/billing/plans"
            className="group rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Gerenciar módulos</p>
                <p className="text-xs text-muted-foreground mt-0.5">Adicione ou remova módulos do seu plano</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
          <Link
            href="/indique"
            className="group rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Programa de indicação</p>
                <p className="text-xs text-muted-foreground mt-0.5">Regras, exemplos e calculadora</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    )
  }

  // ─── LEGACY PATH (tier fixo: FREE / STARTER / PRO / BUSINESS) ────────────────

  const isPaid = tier !== SubscriptionTier.FREE
  const orgInfo = { tier, trialEndsAt, trialStatus }
  const trialActive = isTrialActive(orgInfo)
  const readOnly = isReadOnly(orgInfo)
  const daysLeft = trialEndsAt ? getDaysRemaining(new Date(trialEndsAt)) : 0

  const displayPrice = isFounder && customPricing ? customPricing : PLAN_PRICING[tier]
  const tierLabel = PLAN_NAMES[tier] ?? tier
  const tierKey = tier as string

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-3xl mx-auto">
      <BillingPageTracker />
      <PurchaseTracker />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assinatura & Faturamento</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie seu plano e programa de indicação</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/billing/plans">
            Ver planos
            <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </Button>
      </div>

      {/* CTA modular builder */}
      <Link
        href="/dashboard/billing/plans"
        className="group block rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base tracking-tight">Personalize seu plano</h3>
              <Badge variant="secondary" className="text-xs bg-primary/15 text-primary border-0">Novo</Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Adicione ou remova módulos individualmente. Pague exatamente pelo que sua clínica usa.
            </p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
        </div>
      </Link>

      {/* Trial status banner */}
      {tier === SubscriptionTier.FREE && trialActive && (
        <div className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${
          daysLeft <= 2
            ? 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800'
            : 'bg-primary/5 border-primary/20'
        }`}>
          <Clock className={`w-4 h-4 shrink-0 ${daysLeft <= 2 ? 'text-orange-600' : 'text-primary'}`} />
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${daysLeft <= 2 ? 'text-orange-700 dark:text-orange-400' : 'text-foreground'}`}>
              {daysLeft === 0
                ? 'Último dia do trial'
                : `Trial ativo — ${daysLeft} dia${daysLeft !== 1 ? 's' : ''} restante${daysLeft !== 1 ? 's' : ''}`}
            </p>
            <p className="text-xs text-muted-foreground">Você tem acesso completo a todos os módulos durante o trial.</p>
          </div>
          <Button asChild size="sm" className="shrink-0">
            <Link href="/dashboard/billing/plans">Fazer upgrade</Link>
          </Button>
        </div>
      )}

      {tier === SubscriptionTier.FREE && readOnly && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 text-destructive" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-destructive">Trial expirado — conta em modo somente leitura</p>
            <p className="text-xs text-muted-foreground">Você pode visualizar seus dados, mas não criar ou editar registros.</p>
          </div>
          <Button asChild size="sm" variant="destructive" className="shrink-0">
            <Link href="/dashboard/billing/plans">Fazer upgrade</Link>
          </Button>
        </div>
      )}

      {/* Plano atual (tier fixo) */}
      <Card className={`bg-gradient-to-br border ${isFounder ? 'from-amber-500/10 to-amber-500/5 border-amber-300 dark:border-amber-800' : TIER_COLOR[tierKey] ?? ''}`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isFounder ? 'bg-amber-500/20 text-amber-600' : (TIER_ACCENT[tierKey] ?? 'bg-primary/10 text-primary')
              }`}>
                {isFounder ? <Star className="w-5 h-5 fill-amber-400" /> : TIER_ICON[tierKey]}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-lg">
                    {isFounder ? 'Plano Fundador' : isPaid ? 'Assinatura ativa' : 'Plano atual'}
                  </CardTitle>
                  {isFounder && (
                    <Badge className="bg-amber-500 text-white text-xs">Fundador #{founderNumber}</Badge>
                  )}
                  {trialActive && (
                    <Badge variant="outline" className="text-xs border-primary/40 text-primary">Trial ativo</Badge>
                  )}
                  {isPaid && !isFounder && (
                    <Badge variant="outline" className="text-xs border-green-500/40 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-3 h-3 mr-1" />Ativo
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-0.5">
                  {isFounder
                    ? 'Preço vitalício garantido — nunca sobe'
                    : isPaid
                      ? 'Sua assinatura está ativa.'
                      : 'Monte seu plano combinando os módulos que sua clínica usa.'}
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold tracking-tight">
                {displayPrice === 0 ? 'Grátis' : `R$${displayPrice}`}
              </div>
              {displayPrice !== 0 && <div className="text-xs text-muted-foreground">/mês</div>}
              {isFounder && (
                <div className="text-xs text-amber-600 font-medium mt-0.5">~41% OFF vitalício</div>
              )}
              {referralDiscount > 0 && !isFounder && (
                <div className="text-xs text-primary font-medium mt-0.5">−{referralDiscount}% via indicações</div>
              )}
            </div>
          </div>
        </CardHeader>

        {!isPaid && !trialActive && !isFounder && (
          <CardContent className="pt-0">
            <div className="border-t border-border/50 pt-4 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm text-muted-foreground">
                Monte seu plano combinando os módulos que sua clínica usa.
              </p>
              <Button asChild size="sm">
                <Link href="/dashboard/billing/plans">
                  Ver planos <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        )}

        {isPaid && !isFounder && (
          <CardContent className="pt-0">
            <div className="border-t border-border/50 pt-4 flex justify-end">
              <CancelSubscriptionButton />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Programa de Indicação */}
      {referralUrl && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Indique e Ganhe</CardTitle>
                  <CardDescription className="mt-0.5">
                    Cada indicação ativa = <strong className="text-foreground">+15% off</strong> recorrente na sua mensalidade
                  </CardDescription>
                </div>
              </div>
              {referralDiscount > 0 && (
                <div className="text-right shrink-0">
                  <div className="text-3xl font-bold tracking-tight text-primary">{referralDiscount}%</div>
                  <div className="text-xs text-muted-foreground">desconto ativo</div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {rewardedReferrals} de {MAX_REFERRALS} indicações ativas
                </span>
                {rewardedReferrals < MAX_REFERRALS ? (
                  <span className="text-muted-foreground text-xs">
                    próxima → <span className="text-primary font-medium">{discountAtNext.toFixed(0)}% off</span>
                  </span>
                ) : (
                  <Badge className="text-xs bg-primary text-primary-foreground">Mensalidade zerada!</Badge>
                )}
              </div>
              <Progress value={referralProgress} className="h-2" />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0%</span><span>15%</span><span>30%</span><span>45%</span>
                <span>60%</span><span>75%</span><span>90%</span>
                <span className="font-semibold text-primary">100% grátis</span>
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 border border-border/50 px-4 py-3 flex items-start gap-3">
              <TrendingDown className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                Quem você indicar recebe <strong className="text-foreground">20% off por 3 meses</strong> no primeiro plano pago — o desconto é aplicado automaticamente pelo link.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Seu link exclusivo</p>
              <div className="flex gap-2 flex-wrap">
                <code className="bg-muted border border-border/50 rounded-lg px-3 py-2.5 text-sm flex-1 min-w-0 truncate font-mono">
                  {referralUrl}
                </code>
                <CopyReferralButton url={referralUrl} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5">
                <Link href="/indique">
                  Como funciona o programa
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/dashboard/billing/plans"
          className="group rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Comparar planos</p>
              <p className="text-xs text-muted-foreground mt-0.5">Tabela completa de funcionalidades</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Link>
        <Link
          href="/indique"
          className="group rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Programa de indicação</p>
              <p className="text-xs text-muted-foreground mt-0.5">Regras, exemplos e calculadora</p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Link>
      </div>
    </div>
  )
}
