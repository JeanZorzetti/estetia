import { Badge } from "@/components/ui/badge"
import { BarChart3, MessageCircle, Kanban, ArrowUpRight, Search, Zap, Mail, Smartphone } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

export function BentoGrid() {
    const t = useTranslations("marketing.home.features")

    return (
        <section className="py-28 px-6 lg:px-8 bg-white">
            <div className="mx-auto max-w-7xl">
                {/* Section header with gold accent line */}
                <div className="mb-16 text-center">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="h-px w-10 bg-[#C5A059]" />
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">Plataforma</span>
                        <div className="h-px w-10 bg-[#C5A059]" />
                    </div>
                    <h2 className="font-serif text-[#0A1F3D] tracking-tight leading-tight"
                        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                        {t('title')}
                    </h2>
                    <p className="mt-4 text-[#64748B] max-w-xl mx-auto leading-relaxed">{t('subtitle')}</p>
                </div>

                {/* Main bento grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-[620px]">

                    {/* Hero card — Kanban (2x2) */}
                    <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-3xl bg-[#EEF0F8] border border-[#0A1F3D]/8 p-8 flex flex-col hover:shadow-xl hover:shadow-[#0A1F3D]/8 transition-all duration-500">
                        {/* Subtle top accent */}
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#0A1F3D]/20 to-transparent" />

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-[#0A1F3D]/8 text-[#0A1F3D]">
                                    <Kanban className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#0A1F3D]">{t('kanban.title')}</h3>
                                    <p className="text-sm text-[#64748B]">{t('kanban.description')}</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="border-[#489FB5]/40 text-[#2A7A94] bg-[#489FB5]/8 text-xs">
                                {t('badges.core')}
                            </Badge>
                        </div>

                        {/* Kanban mockup — light */}
                        <div className="flex-1 rounded-2xl bg-[#EEF0F8] border border-[#0A1F3D]/6 p-5 overflow-hidden">
                            <div className="flex gap-3 h-full">
                                {[
                                    { label: 'Consulta', color: '#489FB5', cards: [{ h: 'h-16' }, { h: 'h-20' }] },
                                    { label: 'Avaliação', color: '#C5A059', cards: [{ h: 'h-24' }], offset: 'mt-6' },
                                    { label: 'Agendado', color: '#22c55e', cards: [{ h: 'h-16' }, { h: 'h-14' }], offset: 'mt-3' },
                                ].map((col) => (
                                    <div key={col.label} className="flex-1 flex flex-col gap-2.5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: col.color }} />
                                            <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">{col.label}</span>
                                        </div>
                                        <div className={col.offset || ''}>
                                            {col.cards.map((card, i) => (
                                                <div key={i} className={`${card.h} w-full bg-white rounded-xl border border-[#0A1F3D]/8 p-3 mb-2.5 shadow-sm hover:-translate-y-1 transition-transform duration-300 cursor-default`}>
                                                    <div className="h-1.5 w-2/3 rounded-full mb-2" style={{ backgroundColor: `${col.color}60` }} />
                                                    <div className="h-1 w-1/2 rounded-full bg-[#0A1F3D]/10" />
                                                    {card.h === 'h-20' && <div className="h-1 w-3/4 rounded-full bg-[#0A1F3D]/8 mt-1.5" />}
                                                    {card.h === 'h-24' && (
                                                        <>
                                                            <div className="h-1 w-3/4 rounded-full bg-[#0A1F3D]/8 mt-1.5" />
                                                            <div className="mt-2.5 h-5 w-full rounded-lg" style={{ backgroundColor: `${col.color}20` }} />
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp card */}
                    <div className="group relative overflow-hidden rounded-3xl bg-white border border-[#0A1F3D]/8 p-6 flex flex-col justify-between hover:shadow-lg hover:shadow-[#0A1F3D]/8 hover:-translate-y-0.5 transition-all duration-300">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2.5 rounded-xl bg-green-50 text-green-600">
                                    <MessageCircle className="h-5 w-5" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-[#0A1F3D]/20 group-hover:text-[#0A1F3D]/60 transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-[#0A1F3D] mb-1">{t('whatsapp.title')}</h3>
                            <p className="text-sm text-[#64748B] leading-relaxed">{t('whatsapp.description')}</p>
                        </div>
                        {/* Live indicator */}
                        <div className="mt-5 flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                            </span>
                            <span className="text-xs font-semibold text-green-700">{t('whatsapp.metric')}</span>
                        </div>
                    </div>

                    {/* Analytics PRO card */}
                    <div className="group relative overflow-hidden rounded-3xl bg-white border border-[#0A1F3D]/8 p-6 hover:shadow-lg hover:shadow-[#0A1F3D]/8 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 rounded-xl bg-[#489FB5]/10 text-[#2A7A94]">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-[#0A1F3D]/20 group-hover:text-[#0A1F3D]/60 transition-colors" />
                        </div>
                        <h3 className="text-lg font-bold text-[#0A1F3D] mb-1">{t('analytics.title')}</h3>
                        <p className="text-sm text-[#64748B] leading-relaxed">{t('analytics.description')}</p>
                        {/* Mini chart bars */}
                        <div className="mt-4 flex items-end gap-1 h-8">
                            {[40, 65, 45, 80, 60, 90, 70, 95].map((h, i) => (
                                <div key={i} className="flex-1 rounded-t-sm transition-all duration-500 group-hover:opacity-100 opacity-60"
                                    style={{
                                        height: `${h}%`,
                                        backgroundColor: i === 7 ? '#C5A059' : '#489FB5',
                                        opacity: i === 7 ? 1 : undefined
                                    }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom row — 4 smaller cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    {[
                        {
                            icon: <Search className="h-5 w-5" />,
                            color: '#489FB5', bg: 'bg-[#489FB5]/10', text: 'text-[#2A7A94]',
                            title: t('maps.title'), desc: t('maps.description'), badge: t('badges.starter'),
                            badgeStyle: 'border-[#489FB5]/30 text-[#2A7A94] bg-[#489FB5]/8'
                        },
                        {
                            icon: <Zap className="h-5 w-5" />,
                            color: '#C5A059', bg: 'bg-[#C5A059]/10', text: 'text-[#8B6E32]',
                            title: t('automations.title'), desc: t('automations.description'), badge: t('badges.starter'),
                            badgeStyle: 'border-[#C5A059]/30 text-[#8B6E32] bg-[#C5A059]/8'
                        },
                        {
                            icon: <Mail className="h-5 w-5" />,
                            color: '#0A1F3D', bg: 'bg-[#0A1F3D]/8', text: 'text-[#0A1F3D]',
                            title: t('email.title'), desc: t('email.description'), badge: t('badges.starter'),
                            badgeStyle: 'border-[#0A1F3D]/20 text-[#0A1F3D]'
                        },
                        {
                            icon: <Smartphone className="h-5 w-5" />,
                            color: '#489FB5', bg: 'bg-[#489FB5]/10', text: 'text-[#2A7A94]',
                            title: t('mobile.title'), desc: t('mobile.description'), badge: t('badges.all'),
                            badgeStyle: 'border-[#489FB5]/30 text-[#2A7A94] bg-[#489FB5]/8'
                        },
                    ].map((item, i) => (
                        <div key={i} className="group relative overflow-hidden rounded-3xl bg-white border border-[#0A1F3D]/8 p-6 hover:shadow-md hover:shadow-[#0A1F3D]/8 hover:-translate-y-0.5 transition-all duration-300">
                            {/* Hover accent line top */}
                            <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                                style={{ backgroundColor: item.color }} />
                            <div className={`p-2.5 rounded-xl ${item.bg} ${item.text} w-fit mb-4`}>
                                {item.icon}
                            </div>
                            <h3 className="text-base font-bold text-[#0A1F3D] mb-1">{item.title}</h3>
                            <p className="text-sm text-[#64748B] leading-relaxed mb-4">{item.desc}</p>
                            <Badge variant="outline" className={`text-xs ${item.badgeStyle}`}>{item.badge}</Badge>
                        </div>
                    ))}
                </div>

                {/* Trial Banner — integrated at bottom of features section */}
                <div className="mt-8 rounded-2xl border border-[#C5A059]/30 bg-[#EEF0F8] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20">
                            <Zap className="w-5 h-5 text-[#C5A059]" />
                        </div>
                        <div>
                            <p className="font-bold text-[#0A1F3D] text-base">7 dias grátis com acesso PRO completo</p>
                            <p className="text-sm text-[#64748B]">Sem cartão de crédito · Indique amigos · 100% de desconto recorrente</p>
                        </div>
                    </div>
                    <Link
                        href="/register"
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0A1F3D] hover:bg-[#162D54] px-6 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 shadow-sm shrink-0"
                    >
                        Começar grátis
                    </Link>
                </div>
            </div>
        </section>
    )
}
