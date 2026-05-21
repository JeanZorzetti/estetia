import Link from 'next/link'
import { Metadata } from 'next'
import {
  Calendar, MessageCircle, FileText, RefreshCw, BarChart3, Building2,
  CheckCircle, ArrowRight, Star, Shield, Zap, Users, TrendingUp, ChevronDown,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'CRM para Clínicas de Estética | Agenda, WhatsApp e Prontuário Digital',
  description:
    'Software completo para clínicas de estética: agenda inteligente, prontuário LGPD, WhatsApp automático e recall de recompra. Reduza no-show em 40%. Teste grátis 14 dias.',
  keywords: [
    'crm clinica estetica',
    'software gestao clinica estetica',
    'prontuario digital estetica',
    'agenda clinica estetica',
    'whatsapp automatico clinica',
  ],
}

const FEATURES = [
  {
    icon: Calendar,
    title: 'Agenda inteligente',
    description: 'Visão semanal por profissional e sala. Detecta horários de alto risco de no-show antes de acontecerem.',
    color: 'rose',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp automático',
    description: 'Confirmação 48h antes, pré-cuidados 24h antes, pós-cuidados no dia. Sem você digitar uma palavra.',
    color: 'green',
  },
  {
    icon: FileText,
    title: 'Prontuário & anamnese',
    description: 'Formulários por procedimento. Assinatura digital. Criptografado por lei (LGPD Art. 11).',
    color: 'blue',
  },
  {
    icon: RefreshCw,
    title: 'Recall de recompra',
    description: 'O sistema lembra sua paciente quando é hora de manter o resultado. Botox, preenchimento, laser, peeling.',
    color: 'purple',
  },
  {
    icon: Building2,
    title: 'Convênios & NFS-e',
    description: 'Guias TISS para operadoras de saúde. Emissão automática de NFS-e ao concluir o atendimento.',
    color: 'amber',
  },
  {
    icon: BarChart3,
    title: 'Dashboard em tempo real',
    description: 'Faturamento, taxa de recompra, NPS das pacientes e ranking de profissionais — sempre à vista.',
    color: 'teal',
  },
]

const PAIN_POINTS = [
  'Clientes que somem após o primeiro procedimento',
  'No-shows de última hora que deixam a agenda vazia',
  'Anamnese em papel que ninguém encontra depois',
  'WhatsApp pessoal misturado com o da clínica',
  'Sem controle de quais procedimentos dão mais lucro',
]

const STATS = [
  { value: '40%', label: 'redução de no-show' },
  { value: '68%', label: 'taxa de recompra média' },
  { value: '2 dias', label: 'para estar operacional' },
  { value: '100%', label: 'conformidade LGPD' },
]

const TESTIMONIALS = [
  {
    quote: 'Antes eu perdia pelo menos 8 pacientes por mês por não-retorno. Agora o recall automático funciona sozinho. Meu faturamento cresceu 32% em 3 meses.',
    author: 'Dra. Fernanda Costa',
    role: 'Proprietária · Clínica Bella',
    city: 'São Paulo, SP',
    rating: 5,
    avatar: 'FC',
  },
  {
    quote: 'Minha taxa de recompra era 35%. Com os recalls automáticos subiu para 68% em 4 meses. O sistema se pagou no primeiro mês.',
    author: 'Dra. Camila Torres',
    role: 'Especialista em Harmonização Facial',
    city: 'Florianópolis, SC',
    rating: 5,
    avatar: 'CT',
  },
  {
    quote: 'A gestão de convênios era meu maior problema. As guias TISS saem em 2 cliques e recuperei mais de R$ 8.000 em glosas no primeiro mês.',
    author: 'Dr. Ricardo Almeida',
    role: 'Dermatologista · Clínica Derma Plus',
    city: 'Campinas, SP',
    rating: 5,
    avatar: 'RA',
  },
]

const FAQ = [
  {
    q: 'Preciso instalar algum software?',
    a: 'Não. 100% online, funciona em qualquer dispositivo — celular, tablet ou computador.',
  },
  {
    q: 'Como funciona o envio automático de WhatsApp?',
    a: 'Você conecta seu número uma única vez. Confirmações, lembretes e recalls saem automaticamente com o nome da paciente e detalhes do procedimento.',
  },
  {
    q: 'O prontuário é adequado para médicos e biomédicos?',
    a: 'Sim. Suporta CRM, CRO, CRBM, CRF e COREN. Validação automática de inscrição ativa.',
  },
  {
    q: 'Atende clínicas com convênio?',
    a: 'Sim. O plano Business inclui gestão de guias TISS, cadastro de operadoras e emissão de NFS-e médica.',
  },
  {
    q: 'Meus dados ficam seguros?',
    a: 'Sim. Criptografia AES-256 em todos os dados sensíveis. 100% LGPD Art. 11 (dados de saúde).',
  },
  {
    q: 'Posso migrar minha agenda atual?',
    a: 'Sim. Importação via CSV e suporte de onboarding guiado. Maioria das clínicas operacional em menos de 2 dias.',
  },
]

const ICON_COLORS: Record<string, string> = {
  rose: 'bg-[#d6dff0] text-[#0a1f3d]',
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  amber: 'bg-amber-100 text-amber-600',
  teal: 'bg-teal-100 text-teal-600',
}

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a1f3d]">
              <span className="text-sm font-bold text-white">E</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">Estetia</span>
          </div>
          <nav className="hidden gap-6 text-sm text-zinc-500 md:flex">
            <Link href="#funcionalidades" className="hover:text-zinc-900 transition-colors">Funcionalidades</Link>
            <Link href="#depoimentos" className="hover:text-zinc-900 transition-colors">Depoimentos</Link>
            <Link href="/precos" className="hover:text-zinc-900 transition-colors">Preços</Link>
            <Link href="#faq" className="hover:text-zinc-900 transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden text-sm text-zinc-500 hover:text-zinc-900 transition-colors md:block">
              Entrar
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-[#0a1f3d] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0d2547]"
            >
              Teste grátis 14 dias
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:pt-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-50 via-white to-white" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-[#eef2f9] px-4 py-1.5 text-sm text-rose-700">
            <Zap className="h-3.5 w-3.5" />
            Novo: recall automático por WhatsApp com IA
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl">
            Reduza no-show em{' '}
            <span className="text-[#0a1f3d]">40%</span> e aumente a
            <br className="hidden sm:block" />
            {' '}recompra sem lembrar de nada
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500">
            CRM completo para clínicas de estética e dermatologia. Agenda inteligente,
            prontuário LGPD, WhatsApp automático e recall de recompra — tudo integrado.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register"
              className="flex items-center gap-2 rounded-xl bg-[#0a1f3d] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#c5a059]/20 transition-all hover:bg-[#0d2547] hover:shadow-rose-300"
            >
              Começar grátis por 14 dias
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#funcionalidades"
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-8 py-3.5 text-base font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50"
            >
              Ver como funciona
              <ChevronDown className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            Sem cartão de crédito · Configuração em 2 dias · Cancele quando quiser
          </p>
        </div>

        {/* Stats bar */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:grid-cols-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-zinc-900">{value}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pain points ─────────────────────────────────────────── */}
      <section className="bg-zinc-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-zinc-400">
            Reconhece algum desses problemas?
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PAIN_POINTS.map((p, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-zinc-900 p-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0a1f3d]/20 text-rose-400 text-xs font-bold">
                  ✗
                </span>
                <p className="text-sm text-zinc-300">{p}</p>
              </div>
            ))}
            <div className="flex items-start gap-3 rounded-xl border border-[#0a1f3d]/30 bg-rose-950/40 p-4">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0a1f3d] text-white text-xs font-bold">
                ✓
              </span>
              <p className="text-sm text-rose-200 font-medium">
                O Estetia resolve tudo isso — automaticamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section id="funcionalidades" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Tudo que sua clínica precisa, integrado
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-500">
              Cada funcionalidade foi desenhada para o dia a dia de clínicas de estética — não um CRM genérico adaptado.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="group rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all hover:border-zinc-200 hover:shadow-md"
              >
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${ICON_COLORS[color]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold text-zinc-900">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="bg-zinc-50 px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Como funciona na prática
            </h2>
            <p className="mt-4 text-zinc-500">Do agendamento ao recall — tudo automático</p>
          </div>
          <div className="relative space-y-0">
            {[
              {
                step: '01',
                title: 'Paciente agenda online',
                desc: 'Link público no seu Instagram. Ela escolhe profissional, procedimento e horário — sem ligar para a clínica.',
                icon: Calendar,
              },
              {
                step: '02',
                title: 'WhatsApp automático dispara',
                desc: 'Confirmação 48h antes. Pré-cuidados 24h antes. Tudo personalizado com nome e procedimento.',
                icon: MessageCircle,
              },
              {
                step: '03',
                title: 'Anamnese digital no dia',
                desc: 'Link enviado pelo WhatsApp. Ela preenche no celular. Você vê os dados antes de entrar na sala.',
                icon: FileText,
              },
              {
                step: '04',
                title: 'Sessão registrada e NFS-e emitida',
                desc: 'Marque como realizada. NFS-e é emitida automaticamente. Foto antes/depois anexada ao prontuário.',
                icon: CheckCircle,
              },
              {
                step: '05',
                title: 'Recall automático na hora certa',
                desc: 'Botox em 4 meses, preenchimento em 12 meses. O WhatsApp sai sem você lembrar.',
                icon: RefreshCw,
              },
            ].map(({ step, title, desc, icon: Icon }, i) => (
              <div key={step} className="flex gap-6 pb-10 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0a1f3d] text-sm font-bold text-white">
                    {step}
                  </div>
                  {i < 4 && <div className="mt-2 flex-1 w-px bg-[#d6dff0]" />}
                </div>
                <div className="pb-2 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-[#0a1f3d]" />
                    <h3 className="font-semibold text-zinc-900">{title}</h3>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section id="depoimentos" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Clínicas que já transformaram seus resultados
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map(({ quote, author, role, city, rating, avatar }) => (
              <div key={author} className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-zinc-700">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d6dff0] text-xs font-bold text-rose-700">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{author}</p>
                    <p className="text-xs text-zinc-400">{role} · {city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing CTA ─────────────────────────────────────────── */}
      <section className="bg-zinc-50 px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d6dff0]">
              <TrendingUp className="h-6 w-6 text-[#0a1f3d]" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A partir de R$ 149/mês
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-500">
              Planos para clínicas de todos os tamanhos. Starter, Pro e Business.
              14 dias grátis sem cartão de crédito.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/auth/register"
                className="flex items-center gap-2 rounded-xl bg-[#0a1f3d] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#c5a059]/20 hover:bg-[#0d2547] transition-all"
              >
                Começar grátis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/precos"
                className="rounded-xl border border-zinc-200 px-8 py-3.5 text-base font-semibold text-zinc-700 hover:bg-zinc-50 transition-all"
              >
                Ver todos os planos
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
              {['Sem cartão de crédito', 'Cancele quando quiser', 'Suporte em português', 'Setup em 2 dias'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Compliance trust strip ──────────────────────────────── */}
      <section className="border-t border-zinc-100 bg-white px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-zinc-400">
            Compliance & Segurança
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Shield, label: 'LGPD Art. 11', sub: 'Dados de saúde' },
              { icon: CheckCircle, label: 'TISS 4.01', sub: 'Padrão ANS' },
              { icon: Users, label: 'CFM / CRO', sub: 'Validação automática' },
              { icon: Zap, label: 'AES-256-GCM', sub: 'Criptografia militar' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-2 rounded-xl border border-zinc-100 p-4 text-center">
                <Icon className="h-5 w-5 text-zinc-400" />
                <p className="text-sm font-semibold text-zinc-700">{label}</p>
                <p className="text-xs text-zinc-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section id="faq" className="bg-zinc-50 px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Perguntas frequentes
          </h2>
          <div className="space-y-4">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-zinc-200 bg-white p-6">
                <p className="font-semibold text-zinc-900">{q}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ──────────────────────────────────────────── */}
      <section className="bg-zinc-950 px-4 py-24 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pronta para transformar sua clínica?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-zinc-400">
            Junte-se a centenas de clínicas que usam o Estetia para crescer com mais previsibilidade e menos trabalho manual.
          </p>
          <Link
            href="/auth/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0a1f3d] px-10 py-4 text-base font-semibold text-white shadow-lg shadow-rose-900/40 hover:bg-[#0d2547] transition-all"
          >
            Começar grátis por 14 dias
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 bg-zinc-950 px-4 py-12 text-zinc-500">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0a1f3d]">
                <span className="text-xs font-bold text-white">E</span>
              </div>
              <span className="text-sm font-semibold text-white">Estetia</span>
              <span className="text-zinc-600">· CRM para estética e dermatologia</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/precos" className="hover:text-white transition-colors">Preços</Link>
              <Link href="/calculadora-clinica" className="hover:text-white transition-colors">Calculadora</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Termos</Link>
            </nav>
          </div>
          <p className="mt-8 text-center text-xs text-zinc-600">
            © {new Date().getFullYear()} Estetia · ROI Labs LTDA · CNPJ XX.XXX.XXX/0001-XX
          </p>
        </div>
      </footer>

    </div>
  )
}
