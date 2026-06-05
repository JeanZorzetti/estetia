import { Link } from "@/i18n/routing"
import { ArrowRight, Calendar, MessageCircle, TrendingUp, Check } from "lucide-react"
import { Reveal } from "@/components/marketing/reveal"

const FEATURES = [
    {
        icon: Calendar,
        accent: '#489FB5',
        glowColor: 'rgba(72,159,181,0.15)',
        eyebrow: 'Agendamento Inteligente™',
        title: 'Agenda que trabalha enquanto você dorme',
        desc: 'Ofereça aos seus pacientes uma experiência de agendamento moderna — online, 24 horas por dia — e otimize sua agenda com preenchimento automático de horários vagos, lista de espera inteligente e lembretes personalizados para reduzir no-show.',
        highlights: [
            'Agendamento online sem necessidade de aplicativo',
            'Preenchimento automático de lacunas da agenda',
            'Lista de espera inteligente de alta conversão',
            'Lembretes multi-canal por WhatsApp e e-mail',
        ],
        href: '/features/agenda-inteligente',
        mockup: 'calendar',
    },
    {
        icon: MessageCircle,
        accent: '#10B981',
        glowColor: 'rgba(16,185,129,0.15)',
        eyebrow: 'WhatsApp + Marketing Integrado',
        title: 'Mantenha a chama acesa com seus pacientes',
        desc: 'Aumente as taxas de retorno com recall inteligente automatizado, campanhas segmentadas por procedimentos, clubes de fidelidade por pontos e assinaturas recorrentes. Tudo integrado à API Oficial da Meta para segurança absoluta contra banimentos.',
        highlights: [
            'Recall pós-procedimento automático e personalizado',
            'Campanhas segmentadas baseadas no perfil estético',
            'Programa de fidelidade inteligente por pontos',
            'Memberships VIP e pacotes de tratamento recorrentes',
        ],
        href: '/features/marketing-clinico',
        mockup: 'chat',
    },
    {
        icon: TrendingUp,
        accent: '#C5A059',
        glowColor: 'rgba(197,160,89,0.15)',
        eyebrow: 'Analytics & Relatórios PRO',
        title: 'Tome decisões com dados reais da sua clínica',
        desc: 'Dashboard financeiro sofisticado em tempo real, cálculo de taxa de retorno por procedimento, performance detalhada por profissional de saúde, previsão de receitas futuras e geração fácil de guias para operadoras.',
        highlights: [
            'Painel de fluxo de caixa e faturamento em tempo real',
            'Mapeamento da taxa de conversão e fidelidade',
            'Performance financeira por profissional e sala',
            'Previsão de receitas baseada em comportamento e IA',
        ],
        href: '/features/analytics-pro',
        mockup: 'chart',
    },
]

function CalendarMockup() {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
    const slots = [
        { day: 0, h: '09:00', label: 'Dra. Ana — Botox', color: '#489FB5', glow: 'shadow-[#489FB5]/20 bg-[#489FB5]' },
        { day: 0, h: '10:30', label: 'Maria P. — Limpeza', color: '#10B981', glow: 'shadow-[#10B981]/20 bg-[#10B981]' },
        { day: 1, h: '09:00', label: 'Carlos M. — Peeling', color: '#C5A059', glow: 'shadow-[#C5A059]/20 bg-[#C5A059]' },
        { day: 2, h: '09:00', label: 'Laura T. — Fio PDO', color: '#489FB5', glow: 'shadow-[#489FB5]/20 bg-[#489FB5]' },
        { day: 2, h: '11:00', label: 'Dra. Ana — Preench.', color: '#489FB5', glow: 'shadow-[#489FB5]/20 bg-[#489FB5]' },
        { day: 3, h: '10:00', label: 'Sofia L. — Dermapen', color: '#10B981', glow: 'shadow-[#10B981]/20 bg-[#10B981]' },
        { day: 4, h: '09:30', label: 'Pedro H. — Skinboo.', color: '#C5A059', glow: 'shadow-[#C5A059]/20 bg-[#C5A059]' },
    ]
    return (
        <div
            className="rounded-2xl bg-gradient-to-br from-slate-50/90 to-white/50 backdrop-blur-xl border border-white/50 p-5 shadow-2xl relative z-10 w-full motion-safe:animate-[floatY_6s_ease-in-out_infinite]"
        >
            {/* Inside subtle border */}
            <div className="absolute inset-1.5 rounded-[12px] border border-white/20 pointer-events-none" />

            <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-[10px] font-extrabold text-[#0A1F3D] uppercase tracking-wider">Maio 2026</span>
                <span className="rounded-full bg-[#489FB5]/10 border border-[#489FB5]/20 px-3 py-0.5 text-[9px] font-extrabold uppercase text-[#2A7A94] tracking-wider">Semana atual</span>
            </div>
            
            <div className="grid grid-cols-5 gap-2 relative z-10">
                {days.map((d, i) => (
                    <div key={d} className="text-center">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">{d}</div>
                        <div className="space-y-1.5">
                            {slots.filter(s => s.day === i).map((s, j) => (
                                <div key={j} className={`rounded-lg px-1.5 py-2 text-[8px] font-bold text-white leading-tight shadow-md hover:scale-103 transition-transform duration-300 ${s.glow}`}>
                                    {s.label}
                                </div>
                            ))}
                            {slots.filter(s => s.day === i).length === 0 && (
                                <div className="rounded-lg border border-dashed border-slate-200 bg-white/40 px-1.5 py-4 text-[8px] font-bold text-slate-300 text-center uppercase tracking-wider">livre</div>
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
        { from: 'system', text: 'Olá Laura! Faz 30 dias desde a sua aplicação de Botox. Que tal agendar o seu retorno de acompanhamento? 😊', time: '09:01' },
        { from: 'patient', text: 'Oi! Tudo ótimo por aqui. Estava mesmo querendo marcar!', time: '09:03' },
        { from: 'system', text: 'Perfeito! Tenho horário livre nesta quinta às 14h com a Dra. Ana. Posso confirmar para você? ✨', time: '09:03' },
        { from: 'patient', text: 'Sim, por favor! Esse horário fica ótimo.', time: '09:05' },
        { from: 'system', text: '✅ Agendado com sucesso! Acabo de enviar a confirmação para seu e-mail e SMS.', time: '09:05' },
    ]
    return (
        <div
            className="rounded-2xl bg-gradient-to-br from-slate-50/90 to-white/50 backdrop-blur-xl border border-white/50 p-5 shadow-2xl relative z-10 w-full motion-safe:animate-[floatYReverse_6.5s_ease-in-out_infinite]"
        >
            <div className="absolute inset-1.5 rounded-[12px] border border-white/20 pointer-events-none" />

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100 relative z-10">
                <div className="h-9 w-9 rounded-full bg-[#10B981]/15 flex items-center justify-center border border-[#10B981]/25 relative">
                    <MessageCircle className="h-5 w-5 text-[#10B981]" />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#10B981] border border-white animate-pulse" />
                </div>
                <div>
                    <div className="text-[10px] font-black text-[#0A1F3D] uppercase tracking-wider">WhatsApp Business</div>
                    <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[8px] font-bold text-slate-400">Meta API Oficial Integrada</span>
                    </div>
                </div>
            </div>
            
            <div className="space-y-3 relative z-10">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.from === 'patient' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[10px] font-medium leading-relaxed shadow-sm ${
                            m.from === 'patient'
                                ? 'bg-[#0A1F3D] text-white rounded-tr-none'
                                : 'bg-white/80 border border-slate-100 text-[#0A1F3D] rounded-tl-none'
                        }`}>
                            {m.text}
                            <div className="flex items-center justify-end gap-1 mt-1 opacity-60 text-[7px] text-right">
                                <span>{m.time}</span>
                                {m.from === 'system' && <span className="text-[#489FB5]">✓✓</span>}
                            </div>
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
        <div
            className="rounded-2xl bg-gradient-to-br from-slate-50/90 to-white/50 backdrop-blur-xl border border-white/50 p-5 shadow-2xl relative z-10 w-full motion-safe:animate-[floatY_7s_ease-in-out_infinite]"
        >
            <div className="absolute inset-1.5 rounded-[12px] border border-white/20 pointer-events-none" />

            <div className="flex items-center justify-between mb-5 relative z-10">
                <div>
                    <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Receita Mensal</div>
                    <div className="text-xl font-black font-serif text-[#0A1F3D]">R$ 48.720</div>
                    <div className="text-[9px] text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                        <span>↑ 23% vs anterior</span>
                    </div>
                </div>
                <div className="rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/25 px-3 py-2 text-center shadow-sm">
                    <div className="text-[8px] font-extrabold text-[#8B6E32] uppercase tracking-wider">Meta Anual</div>
                    <div className="text-sm font-black text-[#C5A059]">92%</div>
                </div>
            </div>
            
            <div className="flex items-end gap-1.5 h-20 relative z-10">
                {bars.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group/bar relative">
                        {/* Interactive tooltip simulated */}
                        <div className="absolute bottom-full mb-1 bg-[#0A1F3D] text-white font-bold text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-20">
                            {months[i]}
                        </div>
                        <div
                            className="w-full rounded-t-md transition-all duration-500 relative"
                            style={{
                                height: `${h}%`,
                                backgroundColor: i === 11 ? '#C5A059' : i >= 9 ? '#489FB5' : '#489FB535',
                            }}
                        >
                            {/* Gold Glow behind active current month bar */}
                            {i === 11 && (
                                <div className="absolute inset-0 bg-[#C5A059] rounded-t-md blur-sm opacity-60 animate-pulse" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2.5 px-1 relative z-10 border-t border-slate-100 pt-1.5">
                {months.filter((_, i) => i % 3 === 0).map(m => (
                    <span key={m} className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{m}</span>
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
        <section className="py-32 px-6 relative overflow-hidden bg-white/20">
            <div className="mx-auto max-w-7xl space-y-36 relative z-10">
                {FEATURES.map((feat, idx) => {
                    const Icon = feat.icon
                    const Mockup = MOCKUPS[feat.mockup as keyof typeof MOCKUPS]
                    const isEven = idx % 2 === 0

                    return (
                        <Reveal
                            key={feat.eyebrow}
                            className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center ${
                                isEven ? '' : 'lg:[&>*:first-child]:order-2'
                            }`}
                        >
                            {/* Text (7 cols) */}
                            <div className="lg:col-span-6 flex flex-col items-start text-left">
                                <div className="inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-[9px] font-extrabold mb-6 uppercase tracking-[0.2em] shadow-sm bg-white"
                                    style={{
                                        borderColor: `${feat.accent}35`,
                                        color: feat.accent
                                    }}>
                                    <Icon className="h-3.5 w-3.5" />
                                    {feat.eyebrow}
                                </div>

                                <h2 className="font-serif text-[#0A1F3D] leading-tight mb-5 tracking-tight"
                                    style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
                                    {feat.title}
                                </h2>

                                <p className="text-[#64748B] leading-relaxed mb-8 text-base sm:text-lg font-medium">
                                    {feat.desc}
                                </p>

                                <ul className="space-y-4 mb-8 w-full">
                                    {feat.highlights.map((h) => (
                                        <li key={h} className="flex items-center gap-3.5 bg-white/50 rounded-xl px-4 py-3 border border-slate-100/50 shadow-sm hover:border-[#C5A059]/25 transition-all duration-300">
                                            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                                                style={{ backgroundColor: `${feat.accent}15` }}>
                                                <Check className="h-3.5 w-3.5" style={{ color: feat.accent }} />
                                            </span>
                                            <span className="text-sm font-bold text-[#0A1F3D]">{h}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={feat.href}
                                    className="group inline-flex items-center gap-2.5 text-sm font-extrabold transition-all duration-300 px-5 py-2.5 rounded-xl border bg-white hover:shadow-md cursor-pointer"
                                    style={{ color: feat.accent, borderColor: `${feat.accent}20` }}
                                >
                                    Ver como funciona na prática
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>

                            {/* Mockup (5 cols) */}
                            <div className="lg:col-span-6 relative flex items-center justify-center">
                                <div className="w-full relative z-10 flex items-center justify-center">
                                    <Mockup />
                                </div>
                                
                                {/* Large atmospheric color-coordinated glow behind card */}
                                <div className="absolute inset-0 -z-0 rounded-3xl blur-[100px] opacity-25 pointer-events-none scale-90"
                                    style={{ backgroundColor: feat.accent }} />
                            </div>
                        </Reveal>
                    )
                })}
            </div>
        </section>
    )
}
