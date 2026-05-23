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
import { cn } from "@/lib/utils"
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
      <div className="flex-1 p-4 md:p-8 pt-6 max-w-3xl mx-auto relative space-y-6">
        <BillingPageTracker />
        <PurchaseTracker />

        {/* Premium decorative gradient glow at the top right */}
        <div className="absolute top-0 right-0 w-[550px] h-[350px] bg-gradient-to-bl from-violet-500/[0.04] via-transparent to-transparent rounded-full blur-3xl pointer-events-none z-0" />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-clip-text">
              Assinatura & Faturamento
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Gerencie seus módulos ativos e consulte seu histórico financeiro</p>
          </div>
          <Button asChild size="sm" className="rounded-xl shadow-sm px-4">
            <Link href="/dashboard/billing/plans">
              Gerenciar módulos
              <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>

        {/* Card: Plano modular ativo */}
        <Card className={cn(
          "border border-violet-500/20 dark:border-violet-500/30 relative overflow-hidden rounded-2xl z-10 shadow-[0_4px_20px_rgba(139,92,246,0.03)] hover:shadow-[0_8px_30px_rgba(139,92,246,0.08)] hover:border-violet-500/35 transition-all duration-300",
          "bg-gradient-to-br from-violet-500/[0.06] via-primary/[0.01] to-background"
        )}>
          {/* Subtle background abstract shape */}
          <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-violet-500/5 blur-2xl pointer-events-none" />

          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-primary/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 border border-violet-500/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">
                  <Sparkles className="w-5.5 h-5.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg font-bold text-foreground">Plano Personalizado</CardTitle>
                    <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600 border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <span className="relative flex h-1.5 w-1.5 mr-1 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      Ativo
                    </Badge>
                  </div>
                  <CardDescription className="mt-1.5 flex items-center gap-3 flex-wrap text-muted-foreground/90 font-medium">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {billingNextDueDate
                        ? `Próxima fatura: ${new Date(billingNextDueDate).toLocaleDateString('pt-BR')}`
                        : 'Aguardando processamento de pagamento'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 border-l border-border/60 pl-3 text-xs">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      {billingCycle === 'YEARLY' ? 'Anual' : 'Mensal'}
                    </span>
                  </CardDescription>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl font-extrabold tracking-tight text-foreground">
                  {effectiveTotal != null ? formatBRL(effectiveTotal) : '—'}
                </div>
                <div className="text-xs text-muted-foreground font-semibold">/mês</div>
                {referralDiscount > 0 && billingMonthlyTotal && (
                  <div className="text-xs text-primary font-bold mt-1 bg-primary/10 border border-primary/25 rounded-md px-1.5 py-0.5 inline-block">
                    −{referralDiscount}% via indicações
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          {/* Módulos agrupados por categoria */}
          {Object.keys(grouped).length > 0 ? (
            <CardContent className="pt-0 space-y-3 relative z-10">
              <div className="border-t border-border/40 pt-4">
                {Object.entries(grouped).map(([cat, mods]) => (
                  <div key={cat} className="mb-3 last:mb-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2">
                      {CATEGORY_LABEL[cat] ?? cat}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {mods.map(mod => (
                        <div
                          key={mod.slug}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border border-transparent shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-transform duration-200 hover:scale-[1.02]",
                            CATEGORY_COLOR[mod.category] ?? ''
                          )}
                        >
                          {getLucideIcon(mod.iconLucide)}
                          {mod.nome}
                          <span className="opacity-70 font-normal ml-1 border-l border-current/20 pl-1.5">{formatBRL(mod.priceCents / 100)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/40 pt-4 flex justify-end">
                <CancelSubscriptionButton planName="Plano Personalizado" />
              </div>
            </CardContent>
          ) : (
            <CardContent className="pt-0 relative z-10">
              <div className="border-t border-border/40 pt-4 text-sm text-muted-foreground">
                Módulos sendo sincronizados — recarregue em alguns segundos.
              </div>
            </CardContent>
          )}
        </Card>

        {/* Card: Indique e Ganhe */}
        {referralUrl && (
          <Card className="rounded-2xl border-border/50 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-4 border-b border-border/20">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/5">
                    <Gift className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Indique e Ganhe</CardTitle>
                    <CardDescription className="mt-1 text-xs font-medium">
                      Cada amigo que assinar = <strong className="text-foreground font-semibold">+15% de desconto</strong> recorrente na sua fatura
                    </CardDescription>
                  </div>
                </div>
                {referralDiscount > 0 && referralSavings != null && (
                  <div className="text-right shrink-0">
                    <div className="text-3xl font-extrabold tracking-tight text-primary">{referralDiscount}%</div>
                    <div className="text-xs text-muted-foreground font-semibold">= {formatBRL(referralSavings)}/mês economizados</div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-5">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider">
                    <Users className="w-4 h-4 text-primary" />
                    {rewardedReferrals} de {MAX_REFERRALS} indicações ativas
                  </span>
                  {rewardedReferrals < MAX_REFERRALS ? (
                    <span className="text-muted-foreground text-xs font-semibold">
                      próxima → <span className="text-emerald-500 font-bold">{discountAtNext.toFixed(0)}% off</span>
                    </span>
                  ) : (
                    <Badge className="text-xs bg-emerald-500 text-white font-bold px-2.5 py-0.5 rounded-full shadow-sm">Mensalidade 100% grátis!</Badge>
                  )}
                </div>
                
                {/* Advanced Gradient Progress Bar */}
                <div className="relative w-full h-3 bg-muted/80 dark:bg-zinc-800 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] border border-border/30">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 via-primary to-emerald-500 rounded-full transition-all duration-700 ease-out shadow-[0_1px_3px_rgba(16,185,129,0.3)]" 
                    style={{ width: `${referralProgress}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-muted-foreground font-semibold px-0.5">
                  <span>0%</span><span>15%</span><span>30%</span><span>45%</span>
                  <span>60%</span><span>75%</span><span>90%</span>
                  <span className="font-bold text-emerald-500">100% grátis</span>
                </div>
              </div>
              <div className="rounded-xl bg-primary/[0.02] dark:bg-primary/[0.04] border border-primary/10 px-4 py-3.5 flex items-start gap-3">
                <TrendingDown className="w-4.5 h-4.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Quem se cadastrar pelo seu link recebe automaticamente <strong className="text-foreground font-semibold">20% de desconto por 3 meses</strong> em qualquer plano contratado.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Seu link exclusivo de indicação</p>
                <div className="flex gap-2 flex-wrap">
                  <code className="bg-muted border border-dashed border-primary/20 hover:border-primary/45 rounded-xl px-4 py-3 text-sm flex-1 min-w-0 truncate font-mono text-foreground font-semibold flex items-center justify-between transition-colors shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                    {referralUrl}
                  </code>
                  <CopyReferralButton url={referralUrl} />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-semibold gap-1.5 rounded-xl hover:bg-muted">
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
        <Card className="rounded-2xl border-border/50 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-4 border-b border-border/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                <Receipt className="w-5.5 h-5.5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Histórico de cobranças</CardTitle>
                <CardDescription className="mt-1 text-xs font-medium">Histórico de faturas da sua assinatura modular</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {visiblePayments.length === 0 ? (
              <div className="text-sm text-center text-muted-foreground py-10 font-medium">
                Sua primeira cobrança aparecerá aqui após o pagamento ser processado.
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {visiblePayments.map(payment => {
                  const st = PAYMENT_STATUS[payment.status] ?? { label: payment.status, className: 'bg-zinc-100 text-zinc-600 border-zinc-200' }
                  return (
                    <div key={payment.id} className="group/payment flex items-center justify-between gap-4 py-3.5 text-sm transition-colors hover:bg-muted/10 rounded-lg px-2 -mx-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground truncate">{payment.description ?? 'Estetia CRM — Plano modular'}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                          {payment.dueDate ? formatDate(payment.dueDate) : '—'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-bold text-foreground">{formatBRL(payment.value)}</span>
                        <Badge variant="outline" className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border shadow-[0_1px_2px_rgba(0,0,0,0.01)]", st.className)}>
                          {st.label}
                        </Badge>
                        {payment.invoiceUrl && (
                          <a
                            href={payment.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:text-primary-foreground hover:bg-primary font-bold border border-primary/10 rounded-xl px-2.5 py-1.5 transition-all inline-flex items-center gap-1 bg-primary/5 hover:border-primary/20"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          <Link
            href="/dashboard/billing/plans"
            className="group rounded-2xl border border-border/50 bg-card p-5 hover:border-primary/30 hover:bg-primary/[0.02] hover:shadow-sm transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-foreground">Gerenciar módulos</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Adicione ou remova módulos do seu plano a qualquer momento</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </Link>
          <Link
            href="/indique"
            className="group rounded-2xl border border-border/50 bg-card p-5 hover:border-primary/30 hover:bg-primary/[0.02] hover:shadow-sm transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-foreground">Programa de indicação</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Consulte regras detalhadas, exemplos e simule economias</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
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
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-3xl mx-auto relative space-y-6">
      <BillingPageTracker />
      <PurchaseTracker />

      {/* Premium decorative gradient glow at the top right */}
      <div className="absolute top-0 right-0 w-[550px] h-[350px] bg-gradient-to-bl from-violet-500/[0.04] via-transparent to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-clip-text">
            Assinatura & Faturamento
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Gerencie seu plano e programa de indicação de parceiros</p>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-xl bg-background/50 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:bg-muted">
          <Link href="/dashboard/billing/plans">
            Ver planos
            <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </Button>
      </div>

      {/* CTA modular builder */}
      <Link
        href="/dashboard/billing/plans"
        className="group block rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 hover:border-primary/45 transition-all duration-300 hover:shadow-md relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-bold text-base text-foreground tracking-tight">Personalize seu plano</h3>
              <Badge className="text-xs bg-primary/15 text-primary border-0 rounded-full font-bold px-2 py-0.5">Novo</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Adicione ou remova módulos individualmente a qualquer momento. Pague apenas pelo que a sua clínica realmente utiliza no dia a dia.
            </p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
        </div>
      </Link>

      {/* Trial status banner */}
      {tier === SubscriptionTier.FREE && trialActive && (
        <div className={cn(
          "rounded-2xl border p-4 flex items-center gap-3 relative overflow-hidden transition-all shadow-sm",
          daysLeft <= 2
            ? 'bg-orange-50/70 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900/40 text-orange-800 dark:text-orange-300'
            : 'bg-primary/5 border-primary/20 text-foreground'
        )}>
          <Clock className={cn("w-5 h-5 shrink-0 animate-pulse", daysLeft <= 2 ? 'text-orange-600 dark:text-orange-400' : 'text-primary')} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">
              {daysLeft === 0
                ? 'Último dia do período de testes gratuito'
                : `Trial ativo — restam ${daysLeft} dia${daysLeft !== 1 ? 's' : ''}`}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">Você tem acesso completo a todos os módulos inteligentes durante o trial.</p>
          </div>
          <Button asChild size="sm" className="shrink-0 rounded-xl px-4 font-semibold shadow-sm">
            <Link href="/dashboard/billing/plans">Fazer upgrade</Link>
          </Button>
        </div>
      )}

      {tier === SubscriptionTier.FREE && readOnly && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 flex items-center gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 text-destructive animate-bounce" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-destructive">Período de testes expirado — conta em modo leitura</p>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">Você ainda pode visualizar os seus dados cadastrados, mas não criar ou editar novos registros.</p>
          </div>
          <Button asChild size="sm" variant="destructive" className="shrink-0 rounded-xl px-4 font-semibold shadow-sm">
            <Link href="/dashboard/billing/plans">Fazer upgrade</Link>
          </Button>
        </div>
      )}

      {/* Plano atual (tier fixo) */}
      <Card className={cn(
        "border relative overflow-hidden rounded-2xl z-10 transition-all duration-300",
        isFounder 
          ? 'from-amber-500/10 to-amber-500/5 border-amber-300 dark:border-amber-800 shadow-[0_4px_20px_rgba(245,158,11,0.04)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.09)]' 
          : `${TIER_COLOR[tierKey] ?? ''} shadow-sm hover:shadow-md`
      )}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]",
                isFounder 
                  ? 'bg-amber-500/20 text-amber-600 border-amber-500/10' 
                  : `${TIER_ACCENT[tierKey] ?? 'bg-primary/10 text-primary'} border-primary/10`
              )}>
                {isFounder ? <Star className="w-5.5 h-5.5 fill-amber-400 text-amber-500" /> : TIER_ICON[tierKey]}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-lg font-bold text-foreground">
                    {isFounder ? 'Plano Fundador' : isPaid ? 'Assinatura ativa' : 'Plano atual'}
                  </CardTitle>
                  {isFounder && (
                    <Badge className="bg-amber-500 text-white text-xs font-bold rounded-full px-2.5 py-0.5 shadow-sm">Fundador #{founderNumber}</Badge>
                  )}
                  {trialActive && (
                    <Badge variant="outline" className="text-xs border-primary/40 text-primary font-bold rounded-full px-2 py-0.5">Trial ativo</Badge>
                  )}
                  {isPaid && !isFounder && (
                    <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600 border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <span className="relative flex h-1.5 w-1.5 mr-1 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      Ativo
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-1.5 text-xs font-medium text-muted-foreground/90 leading-relaxed">
                  {isFounder
                    ? 'Preço mensal fixo e vitalício garantido — nunca sofrerá reajustes'
                    : isPaid
                      ? 'Sua assinatura mensal está devidamente configurada e ativa.'
                      : 'Monte seu plano personalizado combinando os módulos que sua clínica mais precisa.'}
                </CardDescription>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-extrabold tracking-tight text-foreground">
                {displayPrice === 0 ? 'Grátis' : `R$${displayPrice}`}
              </div>
              {displayPrice !== 0 && <div className="text-xs text-muted-foreground font-semibold">/mês</div>}
              {isFounder && (
                <div className="text-xs text-amber-600 font-bold mt-1 bg-amber-500/10 border border-amber-500/20 rounded-md px-1.5 py-0.5 inline-block">~41% OFF vitalício</div>
              )}
              {referralDiscount > 0 && !isFounder && (
                <div className="text-xs text-primary font-bold mt-1 bg-primary/10 border border-primary/20 rounded-md px-1.5 py-0.5 inline-block">−{referralDiscount}% via indicações</div>
              )}
            </div>
          </div>
        </CardHeader>

        {!isPaid && !trialActive && !isFounder && (
          <CardContent className="pt-0">
            <div className="border-t border-border/40 pt-4 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs text-muted-foreground font-medium">
                Combine os módulos inteligentes para otimizar os processos do seu negócio.
              </p>
              <Button asChild size="sm" className="rounded-xl shadow-sm px-4">
                <Link href="/dashboard/billing/plans">
                  Ver planos <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        )}

        {isPaid && !isFounder && (
          <CardContent className="pt-0">
            <div className="border-t border-border/40 pt-4 flex justify-end">
              <CancelSubscriptionButton />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Programa de Indicação */}
      {referralUrl && (
        <Card className="rounded-2xl border-border/50 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-4 border-b border-border/20">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/5">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Indique e Ganhe</CardTitle>
                  <CardDescription className="mt-1 text-xs font-medium">
                    Cada indicação ativa = <strong className="text-foreground font-semibold">+15% de desconto</strong> recorrente na sua fatura
                  </CardDescription>
                </div>
              </div>
              {referralDiscount > 0 && (
                <div className="text-right shrink-0">
                  <div className="text-3xl font-extrabold tracking-tight text-primary">{referralDiscount}%</div>
                  <div className="text-xs text-muted-foreground font-semibold">desconto ativo</div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-5">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider">
                  <Users className="w-4 h-4 text-primary" />
                  {rewardedReferrals} de {MAX_REFERRALS} indicações ativas
                </span>
                {rewardedReferrals < MAX_REFERRALS ? (
                  <span className="text-muted-foreground text-xs font-semibold">
                    próxima → <span className="text-emerald-500 font-bold">{discountAtNext.toFixed(0)}% off</span>
                  </span>
                ) : (
                  <Badge className="text-xs bg-emerald-500 text-white font-bold px-2.5 py-0.5 rounded-full shadow-sm">Mensalidade 100% grátis!</Badge>
                )}
              </div>
              
              {/* Advanced Gradient Progress Bar */}
              <div className="relative w-full h-3 bg-muted/80 dark:bg-zinc-800 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] border border-border/30">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 via-primary to-emerald-500 rounded-full transition-all duration-700 ease-out shadow-[0_1px_3px_rgba(16,185,129,0.3)]" 
                  style={{ width: `${referralProgress}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-muted-foreground font-semibold px-0.5">
                <span>0%</span><span>15%</span><span>30%</span><span>45%</span>
                <span>60%</span><span>75%</span><span>90%</span>
                <span className="font-bold text-emerald-500">100% grátis</span>
              </div>
            </div>
            <div className="rounded-xl bg-primary/[0.02] dark:bg-primary/[0.04] border border-primary/10 px-4 py-3.5 flex items-start gap-3">
              <TrendingDown className="w-4.5 h-4.5 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Quem se cadastrar pelo seu link recebe automaticamente <strong className="text-foreground font-semibold">20% de desconto por 3 meses</strong> no primeiro plano pago.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Seu link exclusivo de indicação</p>
              <div className="flex gap-2 flex-wrap">
                <code className="bg-muted border border-dashed border-primary/20 hover:border-primary/45 rounded-xl px-4 py-3 text-sm flex-1 min-w-0 truncate font-mono text-foreground font-semibold flex items-center justify-between transition-colors shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
                  {referralUrl}
                </code>
                <CopyReferralButton url={referralUrl} />
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-semibold gap-1.5 rounded-xl hover:bg-muted">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        <Link
          href="/dashboard/billing/plans"
          className="group rounded-2xl border border-border/50 bg-card p-5 hover:border-primary/30 hover:bg-primary/[0.02] hover:shadow-sm transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm text-foreground">Comparar planos</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Tabela completa de todas as funcionalidades de cada plano</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </Link>
        <Link
          href="/indique"
          className="group rounded-2xl border border-border/50 bg-card p-5 hover:border-primary/30 hover:bg-primary/[0.02] hover:shadow-sm transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm text-foreground">Programa de indicação</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Consulte regras detalhadas, exemplos e simule economias</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
