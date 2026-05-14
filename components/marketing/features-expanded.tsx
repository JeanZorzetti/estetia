import { Link } from "@/i18n/routing"
import { ArrowRight, Calendar, MessageCircle, TrendingUp } from "lucide-react"

const FEATURES = [
    {
        icon: Calendar,
        accent: '#489FB5',
        eyebrow: 'Agendamento Inteligente™',
        title: 'Agenda que trabalha enquanto você dorme',
        desc: 'Ofereça aos seus pacientes uma experiência de agendamento moderna — online, 24 horas por dia — e otimize sua agenda com preenchimento automático de horários vagos, lista de espera e lembretes personalizados.',
        highlights: [
            'Agendamento online sem aplicativo',
            'Preenchimento automático de gaps',
            'Lista de espera inteligente',
            'Lembretes por WhatsApp e e-mail',
        ],
        href: '/features/agenda',
        mockup: 'calendar',
    },
    {
        icon: MessageCircle,
        accent: '#22c55e',
        eyebrow: 'WhatsApp + Marketing Integrado',
        title: 'Mantenha a chama acesa com seus pacientes',
        desc: 'Aumenta o retorno com recall automático, campanhas segmentadas, programa de fidelidade e memberships. Tudo integrado ao WhatsApp Business API oficial — sem risco de banimento.',
        highlights: [
            'Recall automático personalizado',
            'Campanhas segmentadas por procedimento',
            'Programa de fidelidade por pontos',
            'Memberships e pacotes recorrentes',
        ],
        href: '/features/marketing',
        mockup: 'chat',
    },
    {
        icon: TrendingUp,
        accent: '#C5A059',
        eyebrow: 'Analytics & Relatórios PRO',
        title: 'Tome decisões com dados reais da sua clínica',
        desc: 'Dashboard financeiro completo, taxa de retorno por procedimento, performance por profissional, previsão de receita e relatórios para convênios. Gestão de clínica de verdade.',
        highlights: [
            'Dashboard financeiro em tempo real',
            'Taxa de retorno por procedimento',
            'Performance por profissional',
            'Previsão de receita com IA',
        ],
        href: '/features/analytics',
        mockup: 'chart',
    },
]

function CalendarMockup() {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
    const slots = [
        { day: 0, h: '09:00', label: 'Dra. Ana — Botox', color: '#489FB5' },
        { day: 0, h: '10:30', label: 'Maria P. — Limpeza', color: '#22c55e' },
        { day: 1, h: '09:00', label: 'Carlos M. — Peeling', color: '#C5A059' },
        { day: 2, h: '09:00', label: 'Laura T. — Fio PDO', color: '#489FB5' },
        { day: 2, h: '11:00', label: 'Dra. Ana — Preench.', color: '#489FB5' },
        { day: 3, h: '10:00', label: 'Sofia L. — Dermapen', color: '#22c55e' },
        { day: 4, h: '09:30', label: 'Pedro H. — Skinboo.', color: '#C5A059' },
    ]
    return (
        <div className="rounded-2xl bg-white border border-[#0A1F3D]/8 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#0A1F3D]">Maio 2026</span>
                <span className="rounded-full bg-[#489FB5]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#2A7A94]">Semana atual</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
                {days.map((d, i) => (
                    <div key={d} className="text-center">
                        <div className="text-[9px] font-semibold text-[#64748B] mb-1.5">{d}</div>
                        <div className="space-y-1">
                            {slots.filter(s => s.day === i).map((s, j) => (
                                <div key={j} className="rounded-lg px-1.5 py-1.5 text-[8px] font-medium text-white leading-tight"
                                    style={{ backgroundColor: s.color }}>
                                    {s.label}
                                </div>
                            ))}
                            {slots.filter(s => s.day === i).length === 0 && (
                                <div className="rounded-lg border border-dashed border-[#0A1F3D]/10 px-1.5 py-3 text-[8px] text-[#0A1F3D]/25 text-center">livre</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ChatMockup() {
    const messages = [
        { from: 'system', text: 'Olá Laura! Faz 30 dias desde sua última visita 😊', time: '09:01' },
        { from: 'patient', text: 'Oi! Tudo bem! Já estava querendo agendar mesmo', time: '09:03' },
        { from: 'system', text: 'Perfeito! Tenho horário na quinta às 14h com a Dra. Ana. Confirma? ✨', time: '09:03' },
        { from: 'patient', text: 'Sim, pode confirmar!', time: '09:05' },
        { from: 'system', text: '✅ Agendado! Você recebeu a confirmação por e-mail.', time: '09:05' },
    ]
    return (
        <div className="rounded-2xl bg-white border border-[#0A1F3D]/8 p-4 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-[#0A1F3D]/6">
                <div className="h-8 w-8 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-[#22c55e]" />
                </div>
                <div>
                    <div className="text-xs font-bold text-[#0A1F3D]">WhatsApp Business</div>
                    <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                        <span className="text-[9px] text-[#64748B]">Conectado — API Oficial Meta</span>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.from === 'patient' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-[10px] leading-relaxed ${
                            m.from === 'patient'
                                ? 'bg-[#0A1F3D] text-white rounded-tr-sm'
                                : 'bg-[#EEF0F8] text-[#0A1F3D] rounded-tl-sm'
                        }`}>
                            {m.text}
                            <span className="block text-[8px] opacity-50 mt-0.5 text-right">{m.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ChartMockup() {
    const bars = [42, 68, 55, 82, 61, 90, 74, 95, 79, 88, 92, 100]
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return (
        <div className="rounded-2xl bg-white border border-[#0A1F3D]/8 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-xs font-bold text-[#0A1F3D]">Receita mensal</div>
                    <div className="text-lg font-bold font-serif text-[#0A1F3D]">R$ 48.720</div>
                    <div className="text-[10px] text-[#22c55e] font-semibold">↑ 23% vs mês anterior</div>
                </div>
                <div className="rounded-xl bg-[#C5A059]/10 px-3 py-2 text-center">
                    <div className="text-xs font-bold text-[#8B6E32]">Meta</div>
                    <div className="text-sm font-bold text-[#C5A059]">92%</div>
                </div>
            </div>
            <div className="flex items-end gap-1 h-16">
                {bars.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <div
                            className="w-full rounded-t-sm transition-all"
                            style={{
                                height: `${h}%`,
                                backgroundColor: i === 11 ? '#C5A059' : i >= 9 ? '#489FB5' : '#489FB530',
                            }}
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-1">
                {months.filter((_, i) => i % 3 === 0).map(m => (
                    <span key={m} className="text-[8px] text-[#64748B]">{m}</span>
                ))}
            </div>
        </div>
    )
}

const MOCKUPS = {
    calendar: CalendarMockup,
    chat: ChatMockup,
    chart: ChartMockup,
}

export function FeaturesExpanded() {
    return (
        <section className="py-24 px-6 bg-white">
            <div className="mx-auto max-w-7xl space-y-24">
                {FEATURES.map((feat, idx) => {
                    const Icon = feat.icon
                    const Mockup = MOCKUPS[feat.mockup as keyof typeof MOCKUPS]
                    const isEven = idx % 2 === 0

                    return (
                        <div
                            key={feat.eyebrow}
                            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                                isEven ? '' : 'lg:[&>*:first-child]:order-2'
                            }`}
                        >
                            {/* Text */}
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold mb-5 uppercase tracking-wider"
                                    style={{
                                        backgroundColor: `${feat.accent}12`,
                                        borderColor: `${feat.accent}30`,
                                        color: feat.accent
                                    }}>
                                    <Icon className="h-3.5 w-3.5" />
                                    {feat.eyebrow}
                                </div>

                                <h2 className="font-serif text-[#0A1F3D] leading-tight mb-5"
                                    style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)' }}>
                                    {feat.title}
                                </h2>

                                <p className="text-[#64748B] leading-relaxed mb-7 text-lg">
                                    {feat.desc}
                                </p>

                                <ul className="space-y-3 mb-8">
                                    {feat.highlights.map((h) => (
                                        <li key={h} className="flex items-center gap-3 text-sm">
                                            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                                                style={{ backgroundColor: `${feat.accent}20` }}>
                                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"
                                                    style={{ color: feat.accent }}>
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                            <span className="font-medium text-[#0A1F3D]">{h}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={feat.href}
                                    className="inline-flex items-center gap-2 text-sm font-bold transition-colors"
                                    style={{ color: feat.accent }}
                                >
                                    Ver como funciona
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {/* Mockup */}
                            <div className="relative">
                                <div className="rounded-3xl bg-white border border-[#0A1F3D]/8 p-6 shadow-xl shadow-[#0A1F3D]/6">
                                    <Mockup />
                                </div>
                                {/* Glow behind card */}
                                <div className="absolute inset-0 -z-10 rounded-3xl blur-3xl opacity-30"
                                    style={{ backgroundColor: feat.accent }} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
