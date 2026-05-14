import Link from 'next/link'
import { Metadata } from 'next'
import { CheckCircle, X, ArrowRight, Zap, Building2, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Preços | Estetia CRM para Clínicas de Estética',
  description:
    'Planos Starter (R$149), Pro (R$349) e Business (R$799) para clínicas de estética e dermatologia. 14 dias grátis sem cartão.',
}

interface Plan {
  name: string
  price: number
  priceLabel: string
  description: string
  badge?: string
  cta: string
  ctaHref: string
  featured: boolean
  features: Array<{ label: string; included: boolean }>
}

const PLANS: Plan[] = [
  {
    name: 'Starter',
    price: 149,
    priceLabel: 'R$ 149',
    description: 'Para clínicas com 1 profissional começando a digitalizar a gestão.',
    cta: 'Começar grátis',
    ctaHref: '/auth/register?plan=starter',
    featured: false,
    features: [
      { label: '1 profissional', included: true },
      { label: 'Até 300 pacientes ativos', included: true },
      { label: 'Agenda inteligente', included: true },
      { label: 'WhatsApp automático (confirmação + lembretes)', included: true },
      { label: 'Prontuário & anamnese digital', included: true },
      { label: 'Recall automático de recompra', included: true },
      { label: 'Agendamento público online', included: true },
      { label: 'App mobile (PWA)', included: true },
      { label: 'No-show predictor', included: false },
      { label: 'Múltiplas salas', included: false },
      { label: 'NFS-e automática', included: false },
      { label: 'Convênios & TISS', included: false },
      { label: 'Multi-unidade', included: false },
      { label: 'White-label app paciente', included: false },
    ],
  },
  {
    name: 'Pro',
    price: 349,
    priceLabel: 'R$ 349',
    description: 'Para clínicas em crescimento com equipe de até 3 profissionais.',
    badge: 'Mais popular',
    cta: 'Começar grátis',
    ctaHref: '/auth/register?plan=pro',
    featured: true,
    features: [
      { label: 'Até 3 profissionais', included: true },
      { label: 'Até 1.500 pacientes ativos', included: true },
      { label: 'Agenda inteligente', included: true },
      { label: 'WhatsApp automático (confirmação + lembretes)', included: true },
      { label: 'Prontuário & anamnese digital', included: true },
      { label: 'Recall automático de recompra', included: true },
      { label: 'Agendamento público online', included: true },
      { label: 'App mobile (PWA)', included: true },
      { label: 'No-show predictor com IA', included: true },
      { label: 'Múltiplas salas', included: true },
      { label: 'NFS-e automática', included: true },
      { label: 'Convênios & TISS', included: false },
      { label: 'Multi-unidade', included: false },
      { label: 'White-label app paciente', included: false },
    ],
  },
  {
    name: 'Business',
    price: 799,
    priceLabel: 'R$ 799',
    description: 'Para clínicas consolidadas, multi-unidade e que trabalham com convênios.',
    cta: 'Falar com vendas',
    ctaHref: '/auth/register?plan=business',
    featured: false,
    features: [
      { label: 'Profissionais ilimitados', included: true },
      { label: 'Pacientes ilimitados', included: true },
      { label: 'Agenda inteligente', included: true },
      { label: 'WhatsApp automático (confirmação + lembretes)', included: true },
      { label: 'Prontuário & anamnese digital', included: true },
      { label: 'Recall automático de recompra', included: true },
      { label: 'Agendamento público online', included: true },
      { label: 'App mobile (PWA)', included: true },
      { label: 'No-show predictor com IA', included: true },
      { label: 'Múltiplas salas', included: true },
      { label: 'NFS-e automática', included: true },
      { label: 'Convênios & TISS', included: true },
      { label: 'Multi-unidade', included: true },
      { label: 'White-label app paciente', included: true },
    ],
  },
]

const COMPARISON_ROWS = [
  { label: 'Profissionais', starter: '1', pro: 'Até 3', business: 'Ilimitados' },
  { label: 'Pacientes ativos', starter: '300', pro: '1.500', business: 'Ilimitados' },
  { label: 'Agenda inteligente', starter: true, pro: true, business: true },
  { label: 'WhatsApp automático', starter: true, pro: true, business: true },
  { label: 'Prontuário digital', starter: true, pro: true, business: true },
  { label: 'Recall automático', starter: true, pro: true, business: true },
  { label: 'No-show predictor IA', starter: false, pro: true, business: true },
  { label: 'NFS-e automática', starter: false, pro: true, business: true },
  { label: 'Convênios & TISS', starter: false, pro: false, business: true },
  { label: 'Multi-unidade', starter: false, pro: false, business: true },
  { label: 'White-label app paciente', starter: false, pro: false, business: true },
  { label: 'Suporte', starter: 'Email', pro: 'Prioritário', business: 'VIP dedicado' },
]

const FAQ_PRICING = [
  {
    q: 'Posso mudar de plano depois?',
    a: 'Sim. Upgrade ou downgrade a qualquer momento. O valor é ajustado proporcionalmente ao ciclo.',
  },
  {
    q: 'O que acontece após os 14 dias de teste?',
    a: 'Você escolhe um plano. Se não escolher, a conta vai para o modo somente-leitura. Seus dados ficam seguros por 30 dias.',
  },
  {
    q: 'Os planos incluem o WhatsApp Business API?',
    a: 'O plano inclui a integração. A conta do WhatsApp Business API é do Meta e pode ter custos de mensagem após o tier gratuito do Meta.',
  },
  {
    q: 'Tem desconto para pagamento anual?',
    a: 'Sim — 20% de desconto pagando 12 meses à vista. Entre em contato pelo chat.',
  },
]

function CheckOrX({ included }: { included: boolean }) {
  return included
    ? <CheckCircle className="h-4 w-4 text-green-500" />
    : <X className="h-4 w-4 text-zinc-300" />
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a1f3d]">
              <span className="text-sm font-bold text-white">E</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">Estetia</span>
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg bg-[#0a1f3d] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0d2547]"
          >
            Teste grátis 14 dias
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pb-16 pt-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Planos para cada fase da sua clínica
          </h1>
          <p className="mt-4 text-lg text-zinc-500">
            14 dias grátis em qualquer plano. Sem cartão de crédito. Cancele quando quiser.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="px-4 pb-24">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.featured
                  ? 'border-[#0a1f3d] shadow-xl shadow-[#0a1f3d]/10'
                  : 'border-zinc-200 shadow-sm'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#0a1f3d] px-3 py-1 text-xs font-semibold text-white">
                    <Star className="h-3 w-3 fill-white" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">{plan.name}</p>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-bold tracking-tight">{plan.priceLabel}</span>
                  <span className="mb-1 text-sm text-zinc-400">/mês</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">{plan.description}</p>
              </div>

              <Link
                href={plan.ctaHref}
                className={`mb-8 flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  plan.featured
                    ? 'bg-[#0a1f3d] text-white shadow-md shadow-[#c5a059]/20 hover:bg-[#0d2547]'
                    : 'border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <ul className="flex-1 space-y-3">
                {plan.features.map(({ label, included }) => (
                  <li key={label} className={`flex items-start gap-2.5 text-sm ${included ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    <CheckOrX included={included} />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-zinc-50 px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold">Comparação detalhada</h2>
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="px-6 py-4 text-left font-semibold text-zinc-700 w-1/2">Funcionalidade</th>
                  <th className="px-6 py-4 text-center font-semibold text-zinc-700">Starter</th>
                  <th className="px-6 py-4 text-center font-semibold text-[#0a1f3d]">Pro</th>
                  <th className="px-6 py-4 text-center font-semibold text-zinc-700">Business</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map(({ label, starter, pro, business }, i) => (
                  <tr key={label} className={i % 2 === 0 ? 'bg-zinc-50/50' : 'bg-white'}>
                    <td className="px-6 py-3.5 text-zinc-600">{label}</td>
                    <td className="px-6 py-3.5 text-center">
                      {typeof starter === 'boolean'
                        ? <div className="flex justify-center"><CheckOrX included={starter} /></div>
                        : <span className="text-zinc-600">{starter}</span>}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {typeof pro === 'boolean'
                        ? <div className="flex justify-center"><CheckOrX included={pro} /></div>
                        : <span className="font-medium text-[#0a1f3d]">{pro}</span>}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {typeof business === 'boolean'
                        ? <div className="flex justify-center"><CheckOrX included={business} /></div>
                        : <span className="text-zinc-600">{business}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Enterprise / custom */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-zinc-950 p-8 text-center text-white sm:p-12">
          <Building2 className="mx-auto mb-4 h-8 w-8 text-zinc-400" />
          <h2 className="text-2xl font-bold">Rede de clínicas ou franquia?</h2>
          <p className="mx-auto mt-3 max-w-lg text-zinc-400">
            Para redes com mais de 10 unidades, volumes customizados de WhatsApp e
            integrações específicas de ERP/financeiro, temos planos Enterprise sob medida.
          </p>
          <Link
            href="mailto:contato@estetiacrm.com.br"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-all"
          >
            <Zap className="h-4 w-4" />
            Falar com o time comercial
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-zinc-50 px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-bold">Dúvidas sobre os planos</h2>
          <div className="space-y-4">
            {FAQ_PRICING.map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-zinc-200 bg-white p-6">
                <p className="font-semibold text-zinc-900">{q}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#0a1f3d] px-4 py-16 text-center text-white">
        <h2 className="text-2xl font-bold">Comece grátis hoje. Sem cartão.</h2>
        <p className="mt-2 text-[#d6dff0]">14 dias para testar tudo. Escolha o plano depois.</p>
        <Link
          href="/auth/register"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-[#0a1f3d] shadow-lg hover:bg-[#eef2f9] transition-all"
        >
          Criar conta grátis
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

    </div>
  )
}
