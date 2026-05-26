import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Newsreader, Manrope } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import type { Locale } from '@/i18n/config'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
})

// Estetia CRM Identity — headline serif
const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
})

// Estetia CRM Identity — body sans
const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
})

import { Suspense } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { PWAInstallPrompt } from '@/components/pwa-install-prompt'
import { PWARegister } from '@/components/pwa-register'
import { PushNotificationManager } from '@/components/push-notification-manager'
import { OfflineStatus } from '@/components/offline-status'
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/google-tag-manager'
import { GoogleAnalytics } from '@/components/google-analytics'
import { analyticsConfig } from '@/lib/analytics-config'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from '@/components/ui/sonner'
import { PostHogProvider } from '../providers'
import { AiTrafficMonitor } from '@/components/analytics/ai-traffic-monitor'
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider'

// ─── Metadata dinâmica por locale ──────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://estetiacrm.com.br'

  return {
    title: 'Estetia CRM | Gestão para Clínicas de Estética',
    description:
      'CRM completo para clínicas de estética e dermatologia. Agenda inteligente, anamnese digital, WhatsApp automático e conformidade LGPD.',
    keywords: ['CRM Estética', 'Clínica Estética', 'Agenda Online', 'Anamnese Digital', 'LGPD', 'Estetia', 'ROI Labs'],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: 'Estetia CRM | Sua clínica sempre cheia',
      description:
        'CRM para clínicas de estética: agenda, anamnese digital, recall automático, WhatsApp e LGPD. 14 dias grátis.',
      url: baseUrl,
      siteName: 'Estetia CRM',
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Estetia CRM',
      description: 'Transforme leads em receita recorrente.',
      creator: '@roilabs',
    },
  }
}

// ─── Static params ──────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// ─── Schema.org dinâmico por locale ────────────────────────────────────────────

function buildSchemaOrg() {
  const baseUrl = 'https://estetiacrm.com.br'

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Estetia CRM',
        description: 'CRM intuitivo para gestão de clínicas de estética com agenda inteligente, anamnese digital, WhatsApp integrado e métricas em tempo real.',
        publisher: { '@id': `${baseUrl}/#organization` },
        inLanguage: 'pt-BR',
      },
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'ROI Labs',
        legalName: 'ROI Labs Tecnologia',
        url: 'https://roilabs.com.br',
        description: 'ROI Labs é a empresa de tecnologia por trás do Estetia CRM, plataforma SaaS de gestão clínica para clínicas de estética e dermatologia no Brasil.',
        foundingDate: '2024-01-01',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
          width: 512,
          height: 512,
        },
        image: `${baseUrl}/og-image.png`,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'BR',
          addressRegion: 'GO',
          addressLocality: 'Goiânia',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          telephone: '+55-62-98344-3919',
          email: 'roilabs.ia@gmail.com',
          contactOption: 'TollFree',
          areaServed: 'BR',
          availableLanguage: ['Portuguese'],
        },
        sameAs: [
          'https://twitter.com/roilabs',
          'https://www.linkedin.com/company/roilabs',
          'https://github.com/JeanZorzetti',
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Estetia CRM',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BRL',
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          ratingCount: '12',
          bestRating: '5',
          worstRating: '1',
        },
        provider: { '@id': `${baseUrl}/#organization` },
        description: 'CRM intuitivo para gestão de clínicas de estética. Agenda inteligente, anamnese digital, WhatsApp integrado, recall automático e métricas em tempo real.',
        featureList: [
          'Agenda Inteligente Online',
          'Anamnese Digital',
          'WhatsApp com 1 Clique',
          'Recall Automático',
          'Métricas e Analytics em Tempo Real',
          'Conformidade LGPD',
        ],
        screenshot: `${baseUrl}/og-image.png`,
        url: baseUrl,
        softwareVersion: '1.0',
      },
    ],
  }
}

// ─── Viewport — viewport-fit=cover for notch/safe area support ──────────────────
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
}

// ─── Root locale layout ─────────────────────────────────────────────────────────

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Valida o locale — se inválido, retorna 404
  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  // Carrega as mensagens para o locale atual (passadas ao client via NextIntlClientProvider)
  const messages = await getMessages()

  const schemaOrg = buildSchemaOrg()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://js.sentry-cdn.com" />
        <link rel="preconnect" href="https://us.i.posthog.com" />
        <link rel="preconnect" href="https://us-assets.i.posthog.com" crossOrigin="anonymous" />
        {/* Schema.org JSON-LD — locale-aware */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${manrope.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        {analyticsConfig.gtm.enabled && (
          <GoogleTagManagerNoScript gtmId={analyticsConfig.gtm.id} />
        )}
        {/* Google Tag Manager */}
        {analyticsConfig.gtm.enabled && <GoogleTagManager gtmId={analyticsConfig.gtm.id} />}
        {/* Google Analytics (GA4) — direct gtag.js for guaranteed detection */}
        {analyticsConfig.ga.enabled && <GoogleAnalytics gaId={analyticsConfig.ga.id} />}

        {/* Provedor de i18n — passa mensagens ao client */}
        <NextIntlClientProvider messages={messages}>
          <PostHogProvider>
            <Suspense fallback={null}>
              <AiTrafficMonitor />
            </Suspense>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <SmoothScrollProvider>{children}</SmoothScrollProvider>
              <SpeedInsights />
              <PWARegister />
              <PWAInstallPrompt />
              <PushNotificationManager />
              <OfflineStatus />
              <Toaster />
            </ThemeProvider>
          </PostHogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
