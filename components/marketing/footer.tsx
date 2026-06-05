'use client'

import { Link } from '@/i18n/routing'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

const FOOTER_LINKS = {
    'Soluções': [
        { label: 'Estética', href: '/solucoes/estetica' },
        { label: 'Dermatologia', href: '/solucoes/dermatologia' },
        { label: 'Estética Corporal', href: '/solucoes/estetica-corporal' },
        { label: 'Multi-unidade', href: '/solucoes/multi-unidade' },
    ],
    'Funcionalidades': [
        { label: 'Agenda Inteligente', href: '/features/agenda-inteligente' },
        { label: 'Prontuário Eletrônico', href: '/features/prontuario-eletronico' },
        { label: 'Anamnese Digital', href: '/features/anamnese-digital' },
        { label: 'WhatsApp Business', href: '/features/whatsapp-business' },
        { label: 'Recall Automático', href: '/features/recall-automatico' },
        { label: 'Estetia IA', href: '/features/estetia-ia' },
        { label: 'Analytics PRO', href: '/features/analytics-pro' },
        { label: 'LGPD & Segurança', href: '/features/lgpd-seguranca' },
        { label: 'Financeiro & TISS', href: '/features/financeiro-tiss' },
        { label: 'App Mobile', href: '/features/mobile-app' },
    ],
    'Empresa': [
        { label: 'Sobre nós', href: '/about' },
        { label: 'Preços', href: '/precos' },
        { label: 'Changelog', href: '/changelog' },
        { label: 'Contato', href: '/contact' },
        { label: 'Login', href: '/login' },
    ],
    'Recursos': [
        { label: 'Por que Estetia?', href: '/about' },
        { label: 'Central de ajuda', href: '/help' },
        { label: 'Blog', href: '/blog' },
        { label: 'Calculadora ROI', href: '/ferramentas/calculadora-roi' },
        { label: 'Comunidade', href: '/community' },
        { label: 'Anuário da Estética', href: '/anuario' },
        { label: 'Indique e Ganhe', href: '/indique' },
    ],
}

const SOCIAL_LINKS = [
    {
        label: 'Instagram',
        href: 'https://instagram.com/estetiacrm',
        icon: (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        ),
    },
    {
        label: 'LinkedIn',
        href: 'https://linkedin.com/company/estetiacrm',
        icon: (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
        ),
    },
    {
        label: 'Facebook',
        href: 'https://facebook.com/estetiacrm',
        icon: (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    },
    {
        label: 'YouTube',
        href: 'https://youtube.com/@estetiacrm',
        icon: (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
            </svg>
        ),
    },
]

export function Footer() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (email) setSubmitted(true)
    }

    return (
        <footer className="bg-[#0A1F3D] text-white">
            {/* Newsletter band */}
            <div className="border-b border-white/8">
                <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="max-w-sm">
                        <h3 className="font-serif text-lg font-bold text-white mb-1">Newsletter mensal Estetia</h3>
                        <p className="text-sm text-white/50">Dicas de gestão, tendências do setor e novidades da plataforma direto no seu e-mail.</p>
                    </div>
                    {submitted ? (
                        <div className="flex items-center gap-2 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/30 px-5 py-3 text-sm text-[#22c55e] font-semibold">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Inscrito com sucesso!
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                className="rounded-xl bg-white/8 border border-white/12 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C5A059]/50 focus:bg-white/12 transition-all w-full sm:w-64"
                            />
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#C5A059] hover:bg-[#B8913F] px-5 py-2.5 text-sm font-bold text-[#0A1F3D] transition-colors shrink-0"
                            >
                                Inscrever
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        </form>
                    )}
                </div>
                {submitted && (
                    <p className="text-center text-[10px] text-white/25 pb-3 px-6">
                        Ao se inscrever, você concorda com nossa{' '}
                        <Link href="/privacy" className="underline hover:text-white/50 transition-colors">Política de Privacidade</Link>.
                    </p>
                )}
            </div>

            {/* Main columns */}
            <div className="mx-auto max-w-7xl px-6 py-14">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
                    {Object.entries(FOOTER_LINKS).map(([col, links]) => (
                        <div key={col}>
                            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/55 mb-5">{col}</h4>
                            <ul className="space-y-2.5">
                                {links.map(link => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-white/60 hover:text-white transition-colors duration-150"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/8">
                <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo + copyright */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-[#C5A059] flex items-center justify-center">
                                <span className="text-[#0A1F3D] font-bold text-xs">E</span>
                            </div>
                            <span className="font-serif font-bold text-white text-sm">Estetia CRM</span>
                        </div>
                        <span className="hidden md:block text-white/20 text-xs">·</span>
                        <span className="text-white/55 text-xs">© {new Date().getFullYear()} ROI Labs, Inc. Todos os direitos reservados.</span>
                    </div>

                    {/* Social + legal links */}
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-3">
                            {SOCIAL_LINKS.map(s => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="text-white/35 hover:text-white transition-colors"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                        <span className="text-white/15 text-xs hidden md:block">|</span>
                        <div className="hidden md:flex items-center gap-4 text-xs text-white/35">
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">Termos</Link>
                        </div>
                    </div>
                </div>

                {/* CNPJ */}
                <div className="text-center pb-4">
                    <p className="text-[10px] text-white/50">57.493.675 MARIA EDUARDA ROCHA MENDES - ME · CNPJ: 57.493.675/0001-37</p>
                </div>
            </div>
        </footer>
    )
}
