'use client'

import { useState } from "react"
import { Link } from "@/i18n/routing"
import { ArrowRight, Calendar, FileText, MessageCircle, BarChart3, Shield, Smartphone } from "lucide-react"

const CLINIC_TYPES = [
    {
        id: 'estetica',
        slug: 'estetica',
        label: 'Estética',
        emoji: '✨',
        headline: 'Gestão completa para clínicas de estética',
        desc: 'Agenda inteligente, anamnese digital, recall automático e prontuário LGPD-compliant. Tudo integrado ao WhatsApp para reduzir faltas e aumentar retorno de pacientes com facilidade.',
        features: ['Agendamento online 24h', 'Ficha de anamnese digital', 'Recall automático via WhatsApp', 'Controle de comissões por profissional'],
        color: '#489FB5',
        badge: 'Mais popular',
    },
    {
        id: 'dermato',
        slug: 'dermatologia',
        label: 'Dermatologia',
        emoji: '🩺',
        headline: 'Dermatologia digital do atendimento ao laudo',
        desc: 'Mapeamento corporal avançado com fotos evolutivas antes/depois, prescrições digitais integradas, controle de convênios e operadoras de saúde sem planilhas complexas.',
        features: ['Fotos evolutivas de alta definição', 'Prescrições digitais assinadas', 'Mapeamento corporal', 'Convênios e faturamento TISS/TUSS'],
        color: '#0A1F3D',
        badge: null,
    },
    {
        id: 'corporal',
        slug: 'estetica-corporal',
        label: 'Estética Corporal',
        emoji: '💪',
        headline: 'Controle de evolução e protocolos corporais',
        desc: 'Fichas completas de avaliação corporal com medições de adipometria, fotos posturais comparativas, protocolos personalizados de alta performance e histórico visual.',
        features: ['Avaliação postural e de medidas', 'Fotos comparativas integradas', 'Protocolos personalizados por série', 'Evolução gráfica de medidas'],
        color: '#C5A059',
        badge: null,
    },
]

const FEATURE_ICONS = [Calendar, FileText, MessageCircle, BarChart3]

export function SolutionsTabs() {
    const [active, setActive] = useState('estetica')
    const current = CLINIC_TYPES.find(c => c.id === active)!

    return (
        <section id="solutions" className="py-32 px-6 relative overflow-hidden border-t border-[#0A1F3D]/5 bg-[#EEF0F8]/30">
            {/* Background design accents */}
            <div className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none -z-10 opacity-30 blur-[100px]"
                style={{ background: `radial-gradient(circle, ${current.color}15 0%, transparent 65%)` }} />

            <div className="mx-auto max-w-7xl relative z-10">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 mb-5 bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full border border-[#C5A059]/20 shadow-sm shadow-[#C5A059]/5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" />
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C5A059]">Especialidades</span>
                    </div>
                    <h2 className="font-serif text-[#0A1F3D] tracking-tight leading-tight"
                        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                        Feito para cada tipo de clínica
                    </h2>
                    <p className="mt-4 text-[#64748B] max-w-2xl mx-auto leading-relaxed text-base">
                        Não é um sistema genérico adaptado. É uma plataforma de alta tecnologia construída especificamente para o nicho de saúde e beleza.
                    </p>
                </div>

                {/* Tab pills with Sliding indicator */}
                <div className="flex flex-wrap justify-center items-center gap-3 mb-16 max-w-lg mx-auto">
                    {CLINIC_TYPES.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setActive(type.id)}
                            className={`relative inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-xs sm:text-sm font-bold transition-colors duration-300 z-10 cursor-pointer ${
                                active === type.id
                                    ? 'text-white'
                                    : 'text-[#64748B] hover:text-[#0A1F3D] bg-white/40 hover:bg-white/80 border border-slate-200/50'
                            }`}
                        >
                            {/* Active background pill */}
                            {active === type.id && (
                                <span
                                    className="absolute inset-0 rounded-full -z-10 shadow-lg shadow-[#0A1F3D]/10"
                                    style={{ backgroundColor: '#0A1F3D' }}
                                />
                            )}
                            <span>{type.emoji}</span>
                            <span>{type.label}</span>
                            {type.badge && (
                                <span className="ml-1 rounded-full bg-[#C5A059] px-2 py-0.5 text-[8px] font-extrabold text-white uppercase tracking-widest shadow-sm">
                                    {type.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content panel — remounts on tab change to replay the fade-in */}
                <div
                    key={active}
                    className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center bg-white/40 backdrop-blur-md rounded-[32px] p-8 sm:p-12 border border-white/40 shadow-2xl shadow-[#0A1F3D]/5"
                >
                        {/* Left: text */}
                        <div className="flex flex-col items-start text-left">
                            <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-bold mb-6 border shadow-sm"
                                style={{
                                    backgroundColor: `${current.color}10`,
                                    borderColor: `${current.color}35`,
                                    color: current.color
                                }}>
                                <span className="text-base leading-none">{current.emoji}</span>
                                <span className="uppercase tracking-widest text-[10px]">{current.label}</span>
                            </div>
                            
                            <h3 className="font-serif text-[#0A1F3D] leading-tight mb-5"
                                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
                                {current.headline}
                            </h3>
                            
                            <p className="text-[#64748B] leading-relaxed mb-8 text-base sm:text-lg font-medium">
                                {current.desc}
                            </p>
                            
                            <ul className="space-y-4.5 mb-8 w-full">
                                {current.features.map((feat, i) => {
                                    const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length]
                                    return (
                                        <li key={feat} className="flex items-center gap-3.5 bg-white/60 rounded-xl px-4 py-3 border border-slate-100/40 shadow-sm hover:border-[#C5A059]/25 transition-colors duration-300">
                                            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                                                style={{ backgroundColor: `${current.color}15` }}>
                                                <Icon className="h-4.5 w-4.5" style={{ color: current.color }} />
                                            </span>
                                            <span className="text-sm font-bold text-[#0A1F3D]">{feat}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                            
                            <div className="flex flex-wrap items-center gap-6 mt-2">
                                <Link
                                    href={`/solucoes/${current.slug}` as any}
                                    className="group inline-flex items-center gap-2 text-sm font-extrabold transition-all duration-300 px-5 py-2.5 rounded-xl text-white shadow-md cursor-pointer hover:-translate-y-0.5"
                                    style={{ backgroundColor: current.color }}
                                >
                                    Ver solução completa
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                                <Link
                                    href={"/solucoes" as any}
                                    className="group inline-flex items-center gap-2 text-sm font-bold text-[#64748B] hover:text-[#0A1F3D] transition-colors"
                                >
                                    Ver todas as especialidades
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                                </Link>
                            </div>
                        </div>

                        {/* Right: visual mockup */}
                        <div className="relative">
                            <div className="relative rounded-[28px] overflow-hidden border border-white/30 shadow-2xl bg-gradient-to-br from-slate-50/80 via-white/40 to-slate-100/50 backdrop-blur-xl aspect-[4/3] flex items-center justify-center p-8">
                                {/* Decorative corner accent with selected active color */}
                                <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-3xl opacity-60 pointer-events-none"
                                    style={{ background: `radial-gradient(circle at top right, ${current.color}35 0%, transparent 70%)` }} />

                                {/* Mock UI */}
                                <div className="w-full space-y-4 relative z-10">
                                    {/* Header bar */}
                                    <div className="flex items-center justify-between rounded-xl bg-white border border-slate-100/80 px-4 py-3 shadow-sm">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: current.color }}>
                                                {current.emoji}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="h-2.5 w-24 rounded-full bg-[#0A1F3D]/10" />
                                                <div className="h-1.5 w-16 rounded-full bg-[#0A1F3D]/5" />
                                            </div>
                                        </div>
                                        <div className="h-7 px-3 rounded-lg flex items-center justify-center text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm" style={{ backgroundColor: current.color }}>
                                            {current.label}
                                        </div>
                                    </div>

                                    {/* Content cards */}
                                    {[0.95, 0.75, 0.6].map((opacity, i) => (
                                        <div key={i} className="flex items-center gap-3.5 rounded-xl bg-white border border-slate-100/80 px-4 py-4 shadow-sm"
                                            style={{ opacity }}>
                                            <div className="h-10 w-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm shadow-inner" style={{ backgroundColor: `${current.color}15`, color: current.color }}>
                                                {['09h', '11h', '14h'][i]}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-2.5 rounded-full bg-[#0A1F3D]/12" style={{ width: `${60 + i * 12}%` }} />
                                                <div className="h-1.5 rounded-full bg-[#0A1F3D]/6" style={{ width: `${40 + i * 8}%` }} />
                                            </div>
                                            <div className="h-6 px-3 rounded-full text-[9px] font-extrabold flex items-center justify-center text-white shadow-sm"
                                                style={{ backgroundColor: current.color }}>
                                                {['Botox', 'Fios', 'Lipo'][i]}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Bottom stat bar */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {['+28% Retorno', '99.2% Fiel', '4.95★ Médio'].map((val, i) => (
                                            <div key={i} className="rounded-xl bg-white border border-slate-100/80 px-3 py-3 text-center shadow-sm hover:border-[#C5A059]/40 transition-colors duration-300">
                                                <div className="font-extrabold text-[11px]" style={{ color: current.color }}>{val.split(' ')[0]}</div>
                                                <div className="text-[8px] font-bold text-[#64748B] mt-0.5 uppercase tracking-wider">{val.split(' ').slice(1).join(' ')}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating 3D badge 1 */}
                            <div
                                className="absolute -bottom-5 -left-5 bg-white rounded-2xl border border-slate-100 shadow-xl px-5 py-3.5 flex items-center gap-3 z-20 motion-safe:animate-[floatY_4s_ease-in-out_infinite]"
                            >
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-inner"
                                    style={{ backgroundColor: `${current.color}15` }}>
                                    <Shield className="h-5 w-5" style={{ color: current.color }} />
                                </div>
                                <div>
                                    <div className="text-[11px] font-black text-[#0A1F3D] tracking-tight">100% Protegido</div>
                                    <div className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">Certificado LGPD</div>
                                </div>
                            </div>

                            {/* Floating 3D badge 2 */}
                            <div
                                className="absolute -top-5 -right-5 bg-white rounded-2xl border border-slate-100 shadow-xl px-5 py-3.5 flex items-center gap-3 z-20 motion-safe:animate-[floatYReverse_4.5s_ease-in-out_infinite]"
                            >
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-inner"
                                    style={{ backgroundColor: `${current.color}15` }}>
                                    <Smartphone className="h-5 w-5" style={{ color: current.color }} />
                                </div>
                                <div>
                                    <div className="text-[11px] font-black text-[#0A1F3D] tracking-tight">iOS & Android</div>
                                    <div className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">App Gestão Integrado</div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </section>
    )
}
