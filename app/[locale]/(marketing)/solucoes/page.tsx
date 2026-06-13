import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, MessageCircle, Star, Sparkles } from 'lucide-react'
import { SOLUCOES } from '@/config/solucoes-data'
import { buildLocaleAlternates } from '@/lib/seo/canonical'
import { setRequestLocale } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const alternates = buildLocaleAlternates(locale, '/solucoes', '/solutions')
  return {
    title: 'Soluções por Especialidade | Estetia CRM',
    description:
      'CRM especializado para cada nicho da saúde estética: Estética, Dermatologia, Estética Corporal e redes Multi-unidade. Descubra como o Estetia se adapta ao seu tipo de clínica.',
    keywords: [
      'crm clinica estetica',
      'software dermatologia',
      'sistema estetica corporal',
      'crm multi-unidade clinica',
      'gestao clinica estetica',
      'software clinica dermato',
    ],
    alternates,
    openGraph: {
      title: 'Soluções por Especialidade | Estetia CRM',
      description:
        'Plataforma especializada para cada tipo de clínica de saúde estética. Encontre a solução certa para o seu negócio.',
      url: alternates.canonical,
      images: [{ url: 'https://estetiacrm.com.br/og-image.png', width: 1200, height: 630 }],
    },
  }
}

const TRUST_ITEMS = [
  { icon: Star, label: '4.9★ avaliação média', sub: 'App Store e Google Play' },
  { icon: Check, label: '+120 clínicas ativas', sub: 'em todo o Brasil' },
  { icon: Check, label: 'LGPD compliant', sub: 'Dados 100% no Brasil' },
  { icon: Check, label: 'Suporte humano', sub: 'WhatsApp em 2h úteis' },
]

export default async function SolucoesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://estetiacrm.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Soluções', item: 'https://estetiacrm.com.br/solucoes' },
    ],
  }

  return (
    <>
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>

      <div className="bg-background selection:bg-[#C5A059]/20 text-foreground overflow-hidden">
        
        {/* ─── Hero Section ─────────────────────────────────────────────────── */}
        <section className="relative pt-28 pb-24 px-6 overflow-hidden">
          {/* Halos de Brilho Estelares */}
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-5xl h-[550px] bg-gradient-to-b from-[#C5A059]/10 via-[#489FB5]/5 to-transparent blur-[140px] pointer-events-none rounded-full" />
          <div className="absolute top-40 right-[-10%] w-[450px] h-[450px] bg-[#489FB5]/5 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute top-60 left-[-10%] w-[450px] h-[450px] bg-[#C5A059]/5 blur-[120px] pointer-events-none rounded-full" />

          <div className="relative mx-auto max-w-4xl text-center z-10 space-y-8">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#C5A059] backdrop-blur-md shadow-[0_4px_20px_rgba(197,160,89,0.15)]">
                <Sparkles className="w-3.5 h-3.5" />
                Feito para cada tipo de clínica
              </span>
            </div>
            
            <h1 className="font-serif font-light text-4xl sm:text-6xl md:text-7xl text-[#0A1F3D] dark:text-white leading-[1.15] tracking-tight">
              A solução certa para<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E2C799] to-[#C5A059] font-normal italic">
                o seu nicho
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              O Estetia foi construído do zero para clínicas de saúde estética. Cada especialidade tem suas próprias exigências — escolha a solução que se encaixa no seu dia a dia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button asChild size="lg" className="h-14 px-8 rounded-full text-sm font-semibold tracking-wide uppercase bg-gradient-to-r from-[#C5A059] to-[#E2C799] hover:from-[#E2C799] hover:to-[#C5A059] text-[#0A1F3D] border border-[#C5A059]/30 shadow-[0_10px_30px_rgba(197,160,89,0.25)] transition-all duration-300 hover:-translate-y-1">
                <Link href="/register">Começar grátis</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full text-sm font-semibold tracking-wide uppercase border-white/20 dark:border-white/10 bg-white/10 dark:bg-slate-900/10 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1">
                <Link href="/contact">
                  <MessageCircle className="mr-2 h-4 w-4 text-[#C5A059]" />
                  Falar com especialista
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ─── Solution Cards Section ───────────────────────────────────────── */}
        <section className="py-24 px-6 bg-background relative">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-[#489FB5]/5 blur-[120px] pointer-events-none rounded-full" />
          
          <div className="mx-auto max-w-6xl relative z-10">
            <div className="grid md:grid-cols-2 gap-8">
              {SOLUCOES.map((solucao) => (
                <div
                  key={solucao.slug}
                  className="group relative rounded-3xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 sm:p-10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between"
                  style={{ borderTop: `3px solid ${solucao.color}` }}
                >
                  {/* Luz de Topo Brilhante em Acordo com a Cor da Solução */}
                  <div 
                    className="absolute top-0 left-0 w-full h-[1px] opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(to right, transparent, ${solucao.color}, transparent)`
                    }}
                  />

                  {/* Badge de Destaque VIP */}
                  {solucao.badge && (
                    <span
                      className="absolute top-4 right-4 text-[9px] font-bold px-3 py-1 rounded-full text-[#0A1F3D] bg-gradient-to-r from-[#C5A059] to-[#E2C799] uppercase tracking-wider shadow-[0_4px_12px_rgba(197,160,89,0.25)]"
                    >
                      {solucao.badge}
                    </span>
                  )}

                  {/* Conteúdo Superior */}
                  <div>
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/10"
                        style={{ backgroundColor: solucao.colorLight }}
                      >
                        {/* Anel de luz sutil interno */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                        <span className="relative z-10">{solucao.emoji}</span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground font-serif tracking-wide">{solucao.label}</h2>
                        <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">{solucao.hero.badge}</p>
                      </div>
                    </div>

                    {/* Subheadline */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {solucao.hero.subheadline}
                    </p>

                    {/* Top 4 benefits */}
                    <ul className="space-y-3 mb-8">
                      {solucao.benefits.slice(0, 4).map((b, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground/90 font-medium">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: solucao.colorLight }}>
                            <Check className="h-3 w-3" style={{ color: solucao.color }} />
                          </div>
                          <span>{b.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Link */}
                  <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    <Link
                      href={`/solucoes/${solucao.slug}` as any}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:opacity-80"
                      style={{ color: solucao.color }}
                    >
                      Ver solução completa
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Trust Strip Section ─────────────────────────────────────────── */}
        <section className="py-16 px-6 bg-background relative overflow-hidden">
          {/* Halo sutil de fundo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[150px] bg-[#C5A059]/5 blur-[80px] pointer-events-none rounded-full" />
          
          <div className="mx-auto max-w-5xl relative z-10 rounded-3xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 md:divide-x divide-slate-200/50 dark:divide-slate-800/50">
              {TRUST_ITEMS.map((item, i) => {
                const IconComponent = item.icon
                return (
                  <div key={i} className="text-center md:px-4 flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C5A059]/10 to-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shadow-inner">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-foreground font-bold text-base tracking-tight">{item.label}</p>
                      <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{item.sub}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── CTA Final Section ───────────────────────────────────────────── */}
        <section className="py-24 px-6 relative overflow-hidden bg-background">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-tr from-[#C5A059]/10 via-[#489FB5]/5 to-transparent blur-[140px] pointer-events-none rounded-full" />
          
          <div className="relative mx-auto max-w-3xl text-center z-10 space-y-8 rounded-3xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
            <h2 className="font-serif font-light text-3xl sm:text-4xl text-[#0A1F3D] dark:text-white leading-tight">
              Não tem certeza qual se encaixa na sua clínica?
            </h2>
            <p className="text-base text-muted-foreground max-w-lg mx-auto">
              Nossos especialistas em gestão clínica analisam o seu cenário e indicam a melhor configuração gratuitamente. Sem compromisso.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button asChild size="lg" className="h-14 px-8 rounded-full text-sm font-semibold tracking-wide uppercase bg-gradient-to-r from-[#C5A059] to-[#E2C799] hover:from-[#E2C799] hover:to-[#C5A059] text-[#0A1F3D] border border-[#C5A059]/30 shadow-[0_10px_30px_rgba(197,160,89,0.25)] transition-all duration-300 hover:-translate-y-1">
                <Link href="/contact">
                  <MessageCircle className="mr-2 h-4 w-4 text-[#C5A059]" />
                  Falar com especialista
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full text-sm font-semibold tracking-wide uppercase border-white/20 dark:border-white/10 bg-white/10 dark:bg-slate-900/10 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1">
                <Link href="/precos">Ver planos e preços</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
