'use client'

const TESTIMONIALS = [
    { q: '"Reduzi faltas em 60% no primeiro mês."', name: 'Dra. Ana Beatriz', role: 'Clínica AB Estética' },
    { q: '"Setup em 5 minutos, retorno em 3 dias."', name: 'Carla Pereira', role: 'Studio Bella' },
    { q: '"WhatsApp integrado mudou nossa operação."', name: 'Fernanda Matos', role: 'Espaço Revitalis' },
    { q: '"IA preenche a anamnese por mim. Incrível!"', name: 'Dra. Mariana Luz', role: 'Clínica Derma Luz' },
    { q: '"Dashboard financeiro melhor que planilha."', name: 'Roberto Santos', role: 'NovaSkin Clínica' },
    { q: '"Agenda online reduziu no-show em 45%."', name: 'Beatriz Oliveira', role: 'Studio Glow' },
    { q: '"Prontuário digital mudou nossa clínica."', name: 'Dra. Priya Mendes', role: 'Clínica DermaPriya' },
]

function TestimonialCard({ item }: { item: typeof TESTIMONIALS[0] }) {
    const initials = item.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
    return (
        <div className="shrink-0 rounded-2xl border border-[#0A1F3D]/8 bg-white px-6 py-4 w-64 shadow-sm mx-2">
            <p className="text-xs text-[#64748B] italic mb-3 leading-relaxed">{item.q}</p>
            <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#0A1F3D] to-[#489FB5] flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                    {initials}
                </div>
                <div>
                    <div className="text-[10px] font-bold text-[#0A1F3D]">{item.name}</div>
                    <div className="text-[9px] text-[#64748B]">{item.role}</div>
                </div>
            </div>
        </div>
    )
}

export function SocialProof() {
    const stats = [
        { value: '120+', label: 'Clínicas ativas' },
        { value: '40%', label: 'Mais retorno de pacientes' },
        { value: '3h', label: 'Economizadas por semana' },
        { value: '4.9★', label: 'Avaliação média' },
    ]

    return (
        <section className="py-24 bg-[#EEF0F8] overflow-hidden">
            <div className="mx-auto max-w-7xl px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059] mb-4">Prova social</p>
                    <h2 className="font-serif text-[#0A1F3D] leading-tight mb-4"
                        style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
                        Ajudando <span className="text-[#C5A059]">120+ clínicas</span> a crescerem<br className="hidden sm:block" /> com tecnologia de ponta
                    </h2>
                    <p className="text-[#64748B] max-w-xl mx-auto leading-relaxed">
                        De pequenos estúdios a redes multi-unidade — clínicas de todo o Brasil usam o Estetia para fidelizar pacientes, reduzir faltas e aumentar receita.
                    </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#0A1F3D]/6 rounded-2xl overflow-hidden mb-16">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white px-6 py-8 text-center">
                            <div className="font-serif font-bold text-[#0A1F3D] mb-1"
                                style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
                                {stat.value}
                            </div>
                            <div className="text-sm text-[#64748B]">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonial marquee — full-width, outside container */}
            <div
                className="relative w-full"
                style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                }}
            >
                <div
                    className="flex"
                    style={{
                        animation: 'testimonial-scroll 35s linear infinite',
                        width: 'max-content',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
                    onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
                >
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((item, i) => (
                        <TestimonialCard key={i} item={item} />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes testimonial-scroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    )
}
