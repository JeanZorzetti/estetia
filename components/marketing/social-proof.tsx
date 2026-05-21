'use client'

import { motion } from 'framer-motion'

const TESTIMONIALS = [
    { q: '"Reduzi faltas em 60% no primeiro mês. O retorno foi imediato!"', name: 'Dra. Ana Beatriz', role: 'Clínica AB Estética' },
    { q: '"Setup em 5 minutos, retorno em 3 dias. Surpreendente!"', name: 'Carla Pereira', role: 'Studio Bella' },
    { q: '"O WhatsApp integrado mudou nossa operação e fidelização de vez."', name: 'Fernanda Matos', role: 'Espaço Revitalis' },
    { q: '"A inteligência artificial preenche a anamnese por mim. Incrível!"', name: 'Dra. Mariana Luz', role: 'Clínica Derma Luz' },
    { q: '"Dashboard financeiro impecável, muito melhor que qualquer planilha."', name: 'Roberto Santos', role: 'NovaSkin Clínica' },
    { q: '"Nossa agenda online reduziu o no-show em 45% logo no primeiro mês."', name: 'Beatriz Oliveira', role: 'Studio Glow' },
    { q: '"O prontuário digital e a segurança LGPD mudaram o patamar da clínica."', name: 'Dra. Julia Mendes', role: 'Clínica DermaJulia' },
]

function TestimonialCard({ item }: { item: typeof TESTIMONIALS[0] }) {
    const initials = item.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
    return (
        <div className="shrink-0 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.01] backdrop-blur-md px-6 py-5 w-72 shadow-xl mx-3 hover:border-[#C5A059]/30 hover:from-white/[0.08] hover:to-white/[0.02] transition-all duration-300 relative group select-none">
            {/* Sutil glow de borda dourado interno */}
            <div className="absolute inset-px rounded-[15px] border border-white/5 pointer-events-none" />
            
            {/* Aspas estilizadas translúcidas */}
            <span className="absolute top-2 right-4 text-5xl font-serif text-[#C5A059]/10 select-none pointer-events-none">“</span>
            
            <p className="text-[11px] text-slate-300 italic mb-5 leading-relaxed font-medium relative z-10">{item.q}</p>
            <div className="flex items-center gap-3 relative z-10 pt-3 border-t border-white/[0.05]">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#C5A059] via-[#AC863F] to-[#C5A059] flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-md shadow-black/10">
                    {initials}
                </div>
                <div>
                    <div className="text-[11px] font-extrabold text-white group-hover:text-[#C5A059] transition-colors duration-300">{item.name}</div>
                    <div className="text-[9px] font-semibold text-slate-400">{item.role}</div>
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
        <section className="py-32 bg-[#0A1F3D] relative overflow-hidden border-y border-[#C5A059]/15">
            {/* Textura de ruído fino */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: '128px 128px'
            }} />

            {/* Malha geométrica de blueprint sutil */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0" style={{
                backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                backgroundSize: '80px 80px'
            }} />

            {/* Halos atmosféricos internos */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-0 opacity-30 blur-[130px]"
                style={{ background: 'radial-gradient(circle, rgba(72,159,181,0.22) 0%, transparent 70%)' }} />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-20 blur-[110px]"
                style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.15) 0%, transparent 70%)' }} />

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-3 mb-6 bg-white/5 border border-white/10 rounded-full px-4.5 py-1.5 shadow-inner"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#C5A059]">Prova social</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-serif text-white leading-tight mb-5 tracking-tight"
                        style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}
                    >
                        Ajudando <span className="text-[#C5A059] relative">120+ clínicas<span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A059]/60 to-transparent rounded-full" /></span> a crescerem<br className="hidden sm:block" /> com tecnologia de ponta
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-slate-300 max-w-xl mx-auto leading-relaxed text-sm sm:text-base font-medium"
                    >
                        De pequenos estúdios de estética a redes multi-unidade — clínicas de todo o Brasil usam o Estetia para fidelizar pacientes, reduzir faltas e alavancar a receita.
                    </motion.p>
                </div>

                {/* Stats row - editorial custom cards in glassmorphism */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 relative z-10">
                    {stats.map((stat, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="relative bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-md rounded-2xl border border-white/[0.08] px-8 py-10 text-center hover:border-[#C5A059]/30 transition-all duration-500 group shadow-lg"
                        >
                            {/* Glow dourado de canto sutil no hover */}
                            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#C5A059]/0 via-transparent to-[#C5A059]/0 group-hover:from-[#C5A059]/10 group-hover:to-[#C5A059]/5 transition-all duration-500 pointer-events-none" />
                            
                            <div className="font-serif font-black text-white mb-2 tracking-tight group-hover:text-[#C5A059] transition-colors duration-300"
                                style={{ fontSize: 'clamp(2.5rem, 4vw, 3.25rem)' }}>
                                {stat.value}
                            </div>
                            <div className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-400 group-hover:text-slate-300 transition-colors duration-300">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Testimonial marquee — full-width, outside container */}
            <div
                className="relative w-full overflow-hidden"
                style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                }}
            >
                <div
                    className="flex py-4"
                    style={{
                        animation: 'testimonial-scroll 45s linear infinite',
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

