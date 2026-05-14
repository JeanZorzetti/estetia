import { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from "./register-form"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { getTranslations } from 'next-intl/server'
import { buildLocaleAlternates } from "@/lib/seo/canonical"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing.register.meta' })
  const alternates = buildLocaleAlternates(locale, '/cadastrar', '/register')
  return {
    title: t('title'),
    description: t('description'),
    alternates,
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: alternates.canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
    },
  }
}

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ invite?: string }>
}) {
    const { invite: inviteToken } = await searchParams
    let inviteData = null

    if (inviteToken) {
        inviteData = await prisma.invite.findUnique({
            where: { token: inviteToken },
            include: { organization: true }
        })
    }

    return (
        <div className="flex min-h-screen bg-[#F8F9FC]">
            {/* Left side - Value Proposition (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#0A1F3D] overflow-hidden flex-col justify-center p-12 xl:p-24">
                {/* Gold glow */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#C5A059]/10 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#489FB5]/10 blur-[100px] pointer-events-none" />

                <div className="relative z-10 space-y-12 max-w-lg">
                    <div>
                        <h1 className="font-serif text-4xl xl:text-5xl font-bold text-[#FFFFFF] leading-tight mb-6">
                            Feche mais negócios em menos tempo
                        </h1>
                        <p className="text-lg text-[#94A3B8] leading-relaxed">
                            Junte-se a 120+ times que já aumentaram suas vendas com o Estetia CRM.
                        </p>
                    </div>

                    {/* Social Proof Benefits */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 flex-shrink-0 bg-[#C5A059]/10 p-2 rounded-full border border-[#C5A059]/20">
                                <svg className="h-5 w-5 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#FFFFFF] mb-1">Configure em 5 minutos</h3>
                                <p className="text-sm text-[#94A3B8] leading-relaxed">Interface intuitiva e pronta para usar. Pare de perder tempo configurando planilhas.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="mt-1 flex-shrink-0 bg-[#C5A059]/10 p-2 rounded-full border border-[#C5A059]/20">
                                <svg className="h-5 w-5 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#FFFFFF] mb-1">Sem cartão de crédito</h3>
                                <p className="text-sm text-[#94A3B8] leading-relaxed">Teste completo por 14 dias. Sem pegadinhas ou cobranças surpresa.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="mt-1 flex-shrink-0 bg-[#C5A059]/10 p-2 rounded-full border border-[#C5A059]/20">
                                <svg className="h-5 w-5 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-[#FFFFFF] mb-1">Dados 100% seguros</h3>
                                <p className="text-sm text-[#94A3B8] leading-relaxed">Adequação total à LGPD e criptografia de ponta a ponta.</p>
                            </div>
                        </div>
                    </div>

                    {/* Mini testimonial */}
                    <div className="border border-[#FFFFFF]/10 bg-[#FFFFFF]/5 rounded-2xl p-6 backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-full bg-[#C5A059] flex items-center justify-center text-[#0A1F3D] font-bold text-sm">
                                CS
                            </div>
                            <div>
                                <div className="font-bold text-[#FFFFFF]">Carlos Silva</div>
                                <div className="text-xs text-[#94A3B8] tracking-widest uppercase mt-1">CEO, Clínica Face</div>
                            </div>
                        </div>
                        <p className="text-sm text-[#FFFFFF] italic leading-relaxed">
                            "Em 10 minutos já estava usando. <span className="text-[#C5A059] font-bold">+40% de conversão</span> no primeiro mês."
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side - Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <Card className="w-full max-w-md bg-[#FFFFFF] border-none shadow-[0_8px_40px_rgba(10,31,61,0.08)] rounded-3xl overflow-hidden">
                    <CardHeader className="space-y-3 pb-6 pt-10 px-8 border-b border-[#0A1F3D]/5">
                        {!inviteData && (
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-2 w-2 rounded-full bg-[#489FB5] animate-pulse" />
                                <span className="text-xs font-bold tracking-widest uppercase text-[#489FB5]">Teste grátis 14 dias</span>
                            </div>
                        )}
                        <CardTitle className="font-serif text-3xl font-bold text-[#0A1F3D]">
                            {inviteData ? `Junte-se a ${inviteData.organization.name}` : "Crie sua conta"}
                        </CardTitle>
                        <CardDescription className="text-sm text-[#64748B]">
                            {inviteData ? "Crie sua conta para acessar o time." : "Preencha seus dados para começar."}
                        </CardDescription>
                    </CardHeader>
                    <div className="px-8 pb-10 pt-6">
                        <RegisterForm inviteData={inviteData} inviteToken={inviteToken} />
                    </div>
                </Card>
            </div>
        </div>
    )
}
