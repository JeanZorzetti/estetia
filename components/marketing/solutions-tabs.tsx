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
        desc: 'Agenda inteligente, anamnese digital, recall automático e prontuário LGPD-compliant. Tudo integrado ao WhatsApp para reduzir faltas e aumentar retorno.',
        features: ['Agendamento online 24h', 'Ficha de anamnese digital', 'Recall automático via WhatsApp', 'Controle de comissões'],
        color: '#489FB5',
        badge: 'Mais popular',
    },
    {
        id: 'dermato',
        slug: 'dermatologia',
        label: 'Dermatologia',
        emoji: '🩺',
        headline: 'Dermatologia digital do atendimento ao laudo',
        desc: 'Mapeamento corporal com fotos evolutivas, prescrições digitais, agenda médica e integração com operadoras de saúde.',
        features: ['Fotos evolutivas', 'Prescrições digitais', 'Mapeamento corporal', 'Convênios e operadoras'],
        color: '#0A1F3D',
        badge: null,
    },
    {
        id: 'corporal',
        slug: 'estetica-corporal',
        label: 'Estética Corporal',
        emoji: '💪',
        headline: 'Controle de evolução e protocolos corporais',
        desc: 'Fichas de avaliação corporal com medidas, fotos comparativas, protocolos personalizados e evolução visual do paciente.',
        features: ['Avaliação postural', 'Fotos comparativas', 'Protocolos personalizados', 'Evolução com medidas'],
        color: '#C5A059',
        badge: null,
    },
]

const FEATURE_ICONS = [Calendar, FileText, MessageCircle, BarChart3]

export function SolutionsTabs() {
    const [active, setActive] = useState('estetica')
    const current = CLINIC_TYPES.find(c => c.id === active)!

    return (
        <section id="solutions" className="py-24 px-6 bg-[#EEF0F8]">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-3 mb-5">
                        <div className="h-px w-8 bg-[#C5A059]" />
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">Soluções</span>
                        <div className="h-px w-8 bg-[#C5A059]" />
                    </div>
                    <h2 className="font-serif text-[#0A1F3D] tracking-tight leading-tight"
                        style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}>
                        Feito para cada tipo de clínica
                    </h2>
                    <p className="mt-3 text-[#64748B] max-w-xl mx-auto leading-relaxed">
                        Não é um CRM genérico adaptado. É uma plataforma construída para o nicho de saúde e beleza.
                    </p>
                </div>

                {/* Tab pills */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {CLINIC_TYPES.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setActive(type.id)}
                            className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                                active === type.id
                                    ? 'bg-[#0A1F3D] text-white shadow-lg shadow-[#0A1F3D]/15'
                                    : 'bg-[#EEF0F8] text-[#64748B] hover:bg-[#E2E4EE] hover:text-[#0A1F3D]'
                            }`}
                        >
                            <span>{type.emoji}</span>
                            <span>{type.label}</span>
                            {type.badge && (
                                <span className="ml-0.5 rounded-full bg-[#C5A059] px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                                    {type.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content panel */}
                <div key={active} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    {/* Left: text */}
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-5 border"
                            style={{
                                backgroundColor: `${current.color}12`,
                                borderColor: `${current.color}30`,
                                color: current.color
                            }}>
                            <span className="text-base">{current.emoji}</span>
                            {current.label}
                        </div>
                        <h3 className="font-serif text-[#0A1F3D] leading-tight mb-4"
                            style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                            {current.headline}
                        </h3>
                        <p className="text-[#64748B] leading-relaxed mb-8 text-lg">
                            {current.desc}
                        </p>
                        <ul className="space-y-3 mb-8">
                            {current.features.map((feat, i) => {
                                const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length]
                                return (
                                    <li key={feat} className="flex items-center gap-3">
                                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                                            style={{ backgroundColor: `${current.color}15` }}>
                                            <Icon className="h-4 w-4" style={{ color: current.color }} />
                                        </span>
                                        <span className="text-sm font-medium text-[#0A1F3D]">{feat}</span>
                                    </li>
                                )
                            })}
                        </ul>
                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href={`/solucoes/${current.slug}` as any}
                                className="inline-flex items-center gap-2 text-sm font-bold transition-colors"
                                style={{ color: current.color }}
                            >
                                Ver landing completa
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href={"/solucoes" as any}
                                className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#0A1F3D] transition-colors"
                            >
                                Ver todas as soluções
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Right: visual mockup */}
                    <div className="relative">
                        <div className="relative rounded-3xl overflow-hidden border border-[#0A1F3D]/8 shadow-2xl shadow-[#0A1F3D]/8 bg-[#EEF0F8] aspect-[4/3] flex items-center justify-center p-8">
                            {/* Decorative corner accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-3xl"
                                style={{ background: `radial-gradient(circle at top right, ${current.color}20 0%, transparent 70%)` }} />

                            {/* Mock UI */}
                            <div className="w-full space-y-3">
                                {/* Header bar */}
                                <div className="flex items-center justify-between rounded-xl bg-white border border-[#0A1F3D]/6 px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full" style={{ backgroundColor: `${current.color}30` }} />
                                        <div className="h-2.5 w-32 rounded-full bg-[#0A1F3D]/10" />
                                    </div>
                                    <div className="h-7 w-20 rounded-lg" style={{ backgroundColor: `${current.color}20` }} />
                                </div>

                                {/* Content cards */}
                                {[0.9, 0.6, 0.75].map((opacity, i) => (
                                    <div key={i} className="flex items-center gap-3 rounded-xl bg-white border border-[#0A1F3D]/6 px-4 py-3.5"
                                        style={{ opacity }}>
                                        <div className="h-9 w-9 rounded-xl shrink-0" style={{ backgroundColor: `${current.color}20` }} />
                                        <div className="flex-1 space-y-1.5">
                                            <div className="h-2 rounded-full bg-[#0A1F3D]/12" style={{ width: `${60 + i * 15}%` }} />
                                            <div className="h-1.5 rounded-full bg-[#0A1F3D]/7" style={{ width: `${40 + i * 10}%` }} />
                                        </div>
                                        <div className="h-5 w-14 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                                            style={{ backgroundColor: current.color }}>
                                            {['Hoje', 'Amanhã', 'Seg'][i]}
                                        </div>
                                    </div>
                                ))}

                                {/* Bottom stat bar */}
                                <div className="grid grid-cols-3 gap-2">
                                    {['+23%', '97%', '4.9★'].map((val, i) => (
                                        <div key={i} className="rounded-xl bg-white border border-[#0A1F3D]/6 px-3 py-2.5 text-center">
                                            <div className="font-bold text-sm" style={{ color: current.color }}>{val}</div>
                                            <div className="h-1.5 w-10 rounded-full bg-[#0A1F3D]/8 mx-auto mt-1" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Floating badge */}
                        <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl border border-[#0A1F3D]/8 shadow-xl px-4 py-3 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: `${current.color}15` }}>
                                <Shield className="h-5 w-5" style={{ color: current.color }} />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-[#0A1F3D]">100% LGPD</div>
                                <div className="text-[10px] text-[#64748B]">Dados protegidos</div>
                            </div>
                        </div>

                        <div className="absolute -top-4 -right-4 bg-white rounded-2xl border border-[#0A1F3D]/8 shadow-xl px-4 py-3 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: `${current.color}15` }}>
                                <Smartphone className="h-5 w-5" style={{ color: current.color }} />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-[#0A1F3D]">App iOS & Android</div>
                                <div className="text-[10px] text-[#64748B]">Gestão em movimento</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
