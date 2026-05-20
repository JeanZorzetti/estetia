import Image from 'next/image'
import NextLink from 'next/link'
import { Button } from '@/components/ui/button'
import { MobileNav } from '@/components/marketing/mobile-nav'
import { NavDropdowns, SolucoesLink } from '@/components/marketing/nav-dropdowns'
import { FeaturesDropdown } from '@/components/marketing/features-dropdown'
import { Footer } from '@/components/marketing/footer'
import { LanguageSwitcher } from '@/components/marketing/language-switcher'
import { WhatsAppButton } from '@/components/marketing/whatsapp-button'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = useTranslations('marketing.home.nav')

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-[#0A1F3D]/10 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl flex h-16 items-center px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 mr-8">
            <Image
              src="/logos/estetia-logo-cropped.png"
              alt="Estetia CRM"
              width={120}
              height={53}
              className="object-contain h-9 w-auto"
              priority
            />
          </Link>

          {/* Center: Nav links — flex-1 + justify-center */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-1">
            <FeaturesDropdown />
            <SolucoesLink />
            <NavDropdowns />
            <Link
              href={"/precos" as any}
              className="px-3 py-1.5 text-sm font-medium text-[#0A1F3D]/70 hover:text-[#0A1F3D] whitespace-nowrap rounded-lg hover:bg-[#0A1F3D]/5 transition-colors"
            >
              {t('pricing')}
            </Link>
            <Link
              href="/blog"
              className="px-3 py-1.5 text-sm font-medium text-[#0A1F3D]/70 hover:text-[#0A1F3D] whitespace-nowrap rounded-lg hover:bg-[#0A1F3D]/5 transition-colors"
            >
              {t('blog')}
            </Link>
            <Link
              href="/indique"
              className="px-3 py-1.5 text-sm font-semibold text-[#C5A059] hover:text-[#8B6E32] whitespace-nowrap rounded-lg hover:bg-[#C5A059]/8 transition-colors"
            >
              Indique e Ganhe
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <LanguageSwitcher />
            <MobileNav />
            <Button variant="ghost" asChild className="hidden md:inline-flex text-[#0A1F3D] hover:text-[#0A1F3D] hover:bg-[#0A1F3D]/8">
              <NextLink href="/login">{t('login')}</NextLink>
            </Button>
            <Button asChild className="hidden md:inline-flex bg-[#0A1F3D] hover:bg-[#162D54] text-white border-0">
              <NextLink href="/register">{t('startFree')}</NextLink>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content — padding-top compensa navbar fixed de 65px */}
      <main className="flex-1" style={{ paddingTop: '65px' }}>
        {children}
      </main>

      {/* Footer Dinâmico */}
      <Footer />

      {/* WhatsApp flutuante */}
      <WhatsAppButton />
    </div>
  )
}
