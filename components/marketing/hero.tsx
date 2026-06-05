import { Link } from "@/i18n/routing"
import { ArrowRight, Sparkles } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"

function EliteDashboardMockup() {
  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none z-10 mt-12 lg:mt-0 animate-[fadeInUp_1.2s_ease-out_both]" style={{ animationDelay: '0.1s' }}>
      {/* Background radial glow specifically for this dashboard */}
      <div className="absolute -inset-8 bg-gradient-to-tr from-[#489FB5]/20 via-transparent to-[#C5A059]/20 rounded-[32px] blur-3xl opacity-70 pointer-events-none" />


      {/* Floating 3D elements behind the dashboard for layer depth */}
      <div
        className="absolute -top-6 -left-6 bg-white/80 backdrop-blur-md rounded-2xl border border-white/40 shadow-2xl p-4 flex items-center gap-3 z-30 max-w-[195px] motion-safe:animate-[floatY_6s_ease-in-out_infinite]"
      >
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#489FB5] to-[#2A7A94] flex items-center justify-center shadow-lg shadow-[#489FB5]/20">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Faturamento</div>
          <div className="text-sm font-black text-[#0A1F3D]">R$ 43.300<span className="text-[10px] text-emerald-500 font-semibold ml-1">↑</span></div>
        </div>
      </div>

      <div
        className="absolute -bottom-8 -right-4 bg-white/95 backdrop-blur-md rounded-2xl border border-white/50 shadow-2xl p-4 flex items-center gap-3 z-30 max-w-[210px] motion-safe:animate-[floatYReverse_7s_ease-in-out_infinite]"
      >
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#9E7D3B] flex items-center justify-center shadow-lg shadow-[#C5A059]/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Reativação IA</div>
          <div className="text-sm font-black text-emerald-500 flex items-center gap-1">
            <span>+24%</span>
            <span className="text-[9px] text-slate-400">retorno</span>
          </div>
        </div>
      </div>

      {/* Main Glassmorphism Frame */}
      <div className="relative rounded-[24px] border border-white/30 bg-white/30 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[4/3] w-full flex flex-col">
        {/* Fine gold lines border inside frame */}
        <div className="absolute inset-2.5 rounded-[18px] border border-white/10 pointer-events-none z-0" />
        
        {/* Mockup Header Bar */}
        <div className="h-14 border-b border-white/10 px-6 flex items-center justify-between relative z-10 bg-white/20">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#FC5753]" />
            <span className="h-3 w-3 rounded-full bg-[#FDBC40]" />
            <span className="h-3 w-3 rounded-full bg-[#35C74A]" />
            <div className="h-4 w-px bg-white/20 mx-2" />
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-md border border-white/10">
              <span className="h-2 w-2 rounded-full bg-[#489FB5] animate-pulse" />
              <span className="text-[9px] font-semibold text-[#0A1F3D]/80">estetiacrm.com.br/painel</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold text-[#0A1F3D]/70">Dra. Mariana Luz</span>
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#0A1F3D] to-[#489FB5] flex items-center justify-center text-[9px] font-bold text-white shadow-md">
              ML
            </div>
          </div>
        </div>

        {/* Dashboard Grid Content */}
        <div className="flex-1 p-5 grid grid-cols-12 gap-4 overflow-hidden relative z-10 bg-white/5">
          {/* Left panel: Clinics and Agenda */}
          <div className="col-span-7 flex flex-col gap-3 h-full">
            {/* Real Appointments agenda */}
            <div className="flex-1 rounded-xl bg-white/60 border border-white/40 p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-[#0A1F3D] uppercase tracking-wider">Agenda de Hoje</span>
                <span className="text-[9px] font-semibold text-[#489FB5] bg-[#489FB5]/10 px-2 py-0.5 rounded-md">21 de Maio</span>
              </div>

              <div className="space-y-2">
                {[
                  { time: '09:00', patient: 'Luciana Camargo', proc: 'Toxina Botulínica', status: 'Confirmado', statusBg: 'bg-emerald-500/90 text-white', color: '#489FB5' },
                  { time: '10:30', patient: 'Roberta G.', proc: 'Preenchimento Labial', status: 'Confirmado', statusBg: 'bg-emerald-500/90 text-white', color: '#C5A059' },
                  { time: '14:00', patient: 'Beatriz Costa', proc: 'Fios de PDO', status: 'Pendente', statusBg: 'bg-amber-500/90 text-white', color: '#22c55e' }
                ].map((apt, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg bg-white/90 border border-slate-100/60 p-2 hover:border-[#C5A059]/40 hover:shadow-sm transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-500 tabular-nums w-8">{apt.time}</span>
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: apt.color }} />
                      <div>
                        <div className="text-[10px] font-bold text-[#0A1F3D]">{apt.patient}</div>
                        <div className="text-[8px] text-slate-400 font-medium">{apt.proc}</div>
                      </div>
                    </div>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-md shadow-sm ${apt.statusBg}`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant Insight */}
            <div className="rounded-xl bg-gradient-to-r from-[#0A1F3D] to-[#122A4E] p-3 text-white border border-[#C5A059]/20 shadow-md">
              <div className="flex items-start gap-2.5">
                <span className="h-6 w-6 rounded-lg bg-[#C5A059]/15 flex items-center justify-center border border-[#C5A059]/30 text-xs shrink-0">✨</span>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#C5A059]">Inteligência Clínica Estetia</div>
                  <div className="text-[9px] text-slate-200 mt-0.5 leading-normal">
                    "Identifiquei 4 pacientes elegíveis para o recall de Botox. Enviar lembrete via WhatsApp?"
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Procedures Finance and Stats */}
          <div className="col-span-5 flex flex-col gap-3 h-full">
            {/* Financial Botox details */}
            <div className="flex-1 rounded-xl bg-white/60 border border-white/40 p-4 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-[10px] font-extrabold text-[#0A1F3D] uppercase tracking-wider block mb-1">Procedimentos</span>
                <div className="space-y-2 mt-1">
                  {[
                    { label: 'Botox', value: 'R$ 18.400', pct: 60, color: 'bg-[#489FB5]' },
                    { label: 'Preenchimento', value: 'R$ 14.900', pct: 45, color: 'bg-[#C5A059]' },
                    { label: 'Fios PDO', value: 'R$ 10.000', pct: 30, color: 'bg-emerald-500' }
                  ].map((p, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-semibold text-[#0A1F3D]">
                        <span>{p.label}</span>
                        <span className="font-bold">{p.value}</span>
                      </div>
                      <div className="h-1 w-full bg-slate-200/50 rounded-full overflow-hidden">
                        <div className={`h-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Before and After slider simulation */}
            <div className="rounded-xl bg-white/60 border border-white/40 p-3 flex flex-col justify-between shadow-sm overflow-hidden relative">
              <span className="text-[9px] font-extrabold text-[#0A1F3D] uppercase tracking-wider block mb-1">Evolução de Fotos</span>
              <div className="relative h-20 w-full rounded-lg overflow-hidden bg-slate-200 border border-slate-100 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 opacity-60" />
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest bg-white/80 px-2 py-1 rounded-md border border-slate-200 relative z-10 shadow-sm">
                  Caso #902 Botox
                </span>
                
                {/* Simulated slider line */}
                <div className="absolute inset-y-0 left-[55%] w-0.5 bg-white shadow-xl z-20 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-[#C5A059] border border-white flex items-center justify-center text-[7px] text-white">↔</div>
                </div>
                
                {/* Labels */}
                <span className="absolute bottom-1 left-1.5 text-[7px] font-bold text-white bg-black/35 px-1 rounded uppercase tracking-wider z-10">Antes</span>
                <span className="absolute bottom-1 right-1.5 text-[7px] font-bold text-white bg-emerald-600/85 px-1 rounded uppercase tracking-wider z-10">Depois</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
    const t = useTranslations("marketing.home.hero")
    const locale = useLocale()

    return (
        <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-40 border-b border-[#0A1F3D]/5">
            {/* Design System background elements */}
            {/* Linear background grid */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
                backgroundImage: `linear-gradient(to right, #0A1F3D 1px, transparent 1px), linear-gradient(to bottom, #0A1F3D 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            {/* Atmospheric glows specifically tailored to the Hero section */}
            <div className="absolute -top-40 right-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(72,159,181,0.15) 0%, transparent 65%)' }} />
            <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.12) 0%, transparent 65%)' }} />

            {/* Top gold rule */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />

            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* Column Left: Text & CTA */}
                    <div className="lg:col-span-7 text-left flex flex-col items-start">
                        
                        {/* Elite Badge */}
                        <div className="inline-flex items-center gap-2 mb-6 bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full border border-[#C5A059]/20 shadow-sm">
                            <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" />
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C5A059]">{t('badge' as any) || 'Tecnologia Estética de Elite'}</span>
                        </div>

                        {/* Title - Boulevard style aligned left */}
                        <h1 className="font-serif leading-[1.05] tracking-[-0.035em] text-[#0A1F3D]"
                            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.75rem)' }}>
                            {t('title_prefix')}
                            <br />
                            <span className="relative inline-block mt-2">
                                <span className="text-[#C5A059]">{t('title_highlight')}</span>
                                <span className="absolute -bottom-1.5 left-0 right-0 h-[3.5px] bg-gradient-to-r from-[#C5A059]/0 via-[#C5A059] to-[#C5A059]/0 rounded-full" />
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="mt-8 max-w-xl text-lg sm:text-xl leading-relaxed text-[#64748B] font-medium">
                            {t('subtitle')}
                        </p>

                        {/* VIP Call to Action buttons */}
                        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <Link
                                href="/register"
                                className="group relative inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#0A1F3D] to-[#162D54] px-10 py-4.5 text-base font-bold text-white shadow-2xl shadow-[#0A1F3D]/25 hover:shadow-[#0A1F3D]/35 hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto justify-center"
                            >
                                <div className="absolute inset-px rounded-[10px] bg-gradient-to-t from-black/10 via-transparent to-white/10 pointer-events-none" />
                                {t('cta1')}
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 rounded-xl border border-[#0A1F3D]/15 bg-white/70 backdrop-blur-sm px-8 py-4.5 text-base font-bold text-[#0A1F3D] hover:border-[#0A1F3D]/30 hover:bg-white hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all duration-300 w-full sm:w-auto justify-center"
                            >
                                {t('cta2')}
                            </Link>
                        </div>

                        {/* Trust signals */}
                        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-[#64748B]">
                            {[t('risk1'), t('risk2'), t('risk3')].map((item, i) => (
                                <span key={i} className="flex items-center gap-2">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#489FB5]/15 border border-[#489FB5]/20 shrink-0">
                                        <svg className="h-3 w-3 text-[#489FB5]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    {item}
                                </span>
                            ))}
                        </div>

                        {/* Social proof */}
                        {locale === 'pt-BR' && (
                            <div className="mt-10 inline-flex items-center gap-4.5 bg-white/80 backdrop-blur-sm border border-[#0A1F3D]/8 rounded-2xl p-4 shadow-xl shadow-[#0A1F3D]/5">
                                <div className="flex -space-x-2">
                                    {['#0A1F3D', '#489FB5', '#C5A059', '#162D54'].map((color, i) => (
                                        <div key={i} className="h-8 w-8 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
                                            style={{ backgroundColor: color }}>
                                            {i === 3 ? '+' : ''}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-left">
                                    <div className="text-xs font-bold text-[#0A1F3D] leading-tight">
                                        {t.rich('socialProof', {
                                            white: (chunks) => <span className="text-[#C5A059] font-black">{chunks}</span>
                                        })}
                                    </div>
                                    <div className="flex gap-0.5 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="h-3.5 w-3.5 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Column Right: Simulated Elite Dashboard */}
                    <div className="lg:col-span-5 flex items-center justify-center">
                        <EliteDashboardMockup />
                    </div>

                </div>
            </div>

            {/* Bottom rule */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/25 to-transparent" />
        </section>
    )
}
