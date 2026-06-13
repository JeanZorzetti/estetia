import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Next bundles core-js polyfills (Array.prototype.at, Object.hasOwn,
// String.prototype.trimStart, URL.canParse…) into the client bundle
// unconditionally — all natively supported by our browserslist targets
// (chrome>=90/safari>=15/etc.). Alias the polyfill module to an empty file so
// PageSpeed stops flagging "legacy JavaScript". Covers both bundlers.
const emptyPolyfills = path.resolve(__dirname, 'lib/empty-polyfills.js');

const nextConfig: NextConfig = {
  // Standalone duplicates the entire .next tree (doubles disk use). Allow opting
  // out for local validation builds via NEXT_NO_STANDALONE=1; production keeps it.
  output: process.env.NEXT_NO_STANDALONE ? undefined : ('standalone' as const),
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns', 'recharts'],
    staleTimes: { dynamic: 30, static: 180 },
    // inlineCss was disabled: it inlined ~711KB of (uncompressed) CSS into every
    // page, bloating the homepage HTML to ~1.9MB, delaying FCP, and — critically —
    // suppressing next/font's <link rel=preload> for fonts (0 preloads were
    // emitted), which left the Newsreader woff2 on the LCP critical path. A single
    // cacheable external stylesheet (~78KB gzip, shared across navigations) is the
    // better trade-off here. Re-evaluate if the external CSS request ever blocks LCP.
    // inlineCss: true,
  },

  /* Drop Next's unconditional legacy polyfills (Turbopack path) */
  turbopack: {
    resolveAlias: {
      'next/dist/build/polyfills/polyfill-module': emptyPolyfills,
    },
  },

  /* Drop Next's unconditional legacy polyfills (webpack fallback path) */
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/dist/build/polyfills/polyfill-module': emptyPolyfills,
    }
    return config
  },

  /* Image Optimization */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.easypanel.host',
      },
    ],
    formats: ['image/webp', 'image/avif'], // Modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon sizes
    minimumCacheTTL: 60 * 60 * 24 * 365, // Cache for 1 year (3600 * 24 * 365)
  },

  /* SEO Redirects - Fix 404s from Ahrefs */
  async redirects() {
    return [
      // www → apex (non-www canonical)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.estetiacrm.com.br' }],
        destination: 'https://estetiacrm.com.br/:path*',
        permanent: true,
      },
      // Legacy EasyPanel host → estetiacrm.com.br (preserve path/query)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'doc-crm-estetia.7c17iw.easypanel.host' }],
        destination: 'https://estetiacrm.com.br/:path*',
        permanent: true,
      },
      // Feature pages → Main features page
      {
        source: '/features/sales-playbook',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/features/discovery-templates',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/features/custom-fields',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/features/email-automation',
        destination: '/features',
        permanent: true,
      },
      // Blog posts → Main blog page
      {
        source: '/blog/discovery-meeting-template',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/crm-completo-iniciantes',
        destination: '/blog',
        permanent: true,
      },
      // Help pages → Main help page
      {
        source: '/help/primeiros-passos/entendendo-pipeline-kanban',
        destination: '/help',
        permanent: true,
      },
      {
        source: '/help/primeiros-passos/cadastrar-contatos',
        destination: '/help',
        permanent: true,
      },
      // ROI Calculator variants
      {
        source: '/calculadora-roi-spin',
        destination: '/ferramentas/calculadora-roi',
        permanent: true,
      },
      // Contact page (PT → EN)
      {
        source: '/contato',
        destination: '/contact',
        permanent: true,
      },
      // /cadastro → /register (linked from multiple blog posts)
      {
        source: '/cadastro',
        destination: '/register',
        permanent: true,
      },
      // /agradecimento → home
      {
        source: '/agradecimento',
        destination: '/',
        permanent: true,
      },
      // Sirius legacy pages → nearest Estetia equivalent
      {
        source: '/blog/planilha-controle-comissao-corretor',
        destination: '/blog/kpis-essenciais-clinica-de-estetica',
        permanent: true,
      },
      // Missing blog posts → closest existing posts
      {
        source: '/blog/pipeline-vendas-guia',
        destination: '/blog/kpis-essenciais-clinica-de-estetica',
        permanent: true,
      },
      {
        source: '/blog/crm-vendas-consultivas',
        destination: '/blog/spin-selling-para-clinicas-de-estetica',
        permanent: true,
      },
      {
        source: '/blog/link-telegram',
        destination: '/blog/spin-selling-para-clinicas-de-estetica',
        permanent: true,
      },
      // /pricing → /precos (permanent, eliminates 308 chain from server component)
      {
        source: '/pricing',
        destination: '/precos',
        permanent: true,
      },
      // Pricing billing fragments crawled as paths (definitive → 301).
      // Moved here from middleware.ts, which emitted a 307 (temporary) and
      // overlapped with /m%C3%AAs. Config redirects are cheaper (no middleware
      // JS) and return a proper 301. Covers raw, accented and encoded variants.
      {
        source: '/ano',
        destination: '/precos',
        permanent: true,
      },
      {
        source: '/m%C3%AAs',
        destination: '/precos',
        permanent: true,
      },
      {
        source: '/mês',
        destination: '/precos',
        permanent: true,
      },
      {
        source: '/mes',
        destination: '/precos',
        permanent: true,
      },
      {
        source: '/month',
        destination: '/precos',
        permanent: true,
      },
      // Malformed URLs crawled by Google (definitive → 301)
      {
        source: '/&',
        destination: '/',
        permanent: true,
      },
      {
        source: '/$',
        destination: '/',
        permanent: true,
      },
      // PT slugs from old links → actual EN routes (404 fixes from Ahrefs 2026-05-26)
      {
        source: '/comunidade',
        destination: '/community',
        permanent: true,
      },
      {
        source: '/ajuda',
        destination: '/help',
        permanent: true,
      },
      {
        source: '/cadastrar',
        destination: '/register',
        permanent: true,
      },
      // Wrong feature slugs that were linked internally
      {
        source: '/features/ia',
        destination: '/features/estetia-ia',
        permanent: true,
      },
      {
        source: '/features/prontuario-digital',
        destination: '/features/prontuario-eletronico',
        permanent: true,
      },
      // Help article that doesn't exist → help index
      {
        source: '/help/planos/free-vs-pro',
        destination: '/precos',
        permanent: true,
      },
      // EN locale doesn't exist (site is PT-only). The catch-all /en/:path* below
      // only strips the /en prefix — but several inherited Sirius URLs also had
      // ENGLISH path segments (tools/, solutions/, ltv-calculator…) that map to
      // no PT route, so stripping /en still 404s. These specific rules (404
      // cleanup from GSC Coverage Drilldown 2026-06-13) must come BEFORE the
      // catch-all, since Next stops at the first matching redirect.
      {
        source: '/en/tools/ltv-calculator',
        destination: '/ferramentas/calculadora-ltv',
        permanent: true,
      },
      {
        source: '/en/solutions/:slug*',
        destination: '/solucoes/:slug*',
        permanent: true,
      },
      {
        source: '/en/features/agenda',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/en/features/analytics',
        destination: '/features/analytics-pro',
        permanent: true,
      },
      // Old EN help tree (structure changed) → help index. Covers literal
      // [category] template paths and every /en/help/* variant in one rule.
      {
        source: '/en/help/:path*',
        destination: '/help',
        permanent: true,
      },
      // EN locale doesn't exist (site is PT-only) → redirect every remaining
      // /en/* path to its PT counterpart (slug already in PT, just strip prefix).
      {
        source: '/en',
        destination: '/',
        permanent: true,
      },
      {
        source: '/en/:path*',
        destination: '/:path*',
        permanent: true,
      },
      // Redundant /pt-BR prefix (next-intl uses 'as-needed' so prefix should never appear)
      {
        source: '/pt-BR',
        destination: '/',
        permanent: true,
      },
      {
        source: '/pt-BR/:path*',
        destination: '/:path*',
        permanent: true,
      },
      // Sirius-niche ROI calculators removed (not relevant to aesthetics) →
      // /ferramentas. Redirect in case Google already crawled these inherited
      // URLs, avoiding new 404s.
      {
        source: '/ferramentas/calculadora-roi-:niche(agencias|consultores|corretores|energia-solar|representantes)',
        destination: '/ferramentas',
        permanent: true,
      },
      // Sirius legacy slugs that GSC still crawls (404 cleanup 2026-06-01)
      {
        source: '/year',
        destination: '/precos',
        permanent: true,
      },
      {
        source: '/vs',
        destination: '/',
        permanent: true,
      },
      {
        source: '/features/analytics',
        destination: '/features/analytics-pro',
        permanent: true,
      },
      // /fundadores → /about (página de fundadores não existe, about é o equivalente)
      {
        source: '/fundadores',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/en/founders',
        destination: '/about',
        permanent: true,
      },
      // /features/marketing e /features/agenda → /features (slugs inexistentes)
      {
        source: '/features/marketing',
        destination: '/features',
        permanent: true,
      },
      {
        source: '/features/agenda',
        destination: '/features',
        permanent: true,
      },
      // /automated-sales (EN) → /vendas-automaticas (PT canônica)
      {
        source: '/automated-sales',
        destination: '/vendas-automaticas',
        permanent: true,
      },
      // Literal [slug] / [category] crawled from broken HTML templates
      // (these template paths are never valid → 301)
      {
        source: '/blog/:slug([\\[\\]]+.*)',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/help/:category([\\[\\]]+.*)/:slug*',
        destination: '/help',
        permanent: true,
      },
    ]
  },

  /* Security & Performance Headers */
  async headers() {
    return [
      // Prevent manifest.json and favicon from being indexed as pages
      {
        source: '/manifest.json',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/favicon.ico',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      // Cache immutable static assets (JS, CSS, fonts) for 1 year
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://js.sentry-cdn.com https://vercel.live https://*.clarity.ms https://www.mercadopago.com https://sdk.mercadopago.com https://cdn.jsdelivr.net https://*.posthog.com https://*.i.posthog.com",
              "style-src 'self' 'unsafe-inline' https://www.mercadopago.com https://sdk.mercadopago.com",
              "img-src 'self' data: https: blob:",
              "media-src 'self' data: blob: https://*.easypanel.host",
              "font-src 'self' data: https://www.mercadopago.com https://sdk.mercadopago.com https://fonts.scalar.com",
              "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://*.sentry.io https://vitals.vercel-insights.com https://*.clarity.ms https://api.mercadopago.com https://cdn.jsdelivr.net https://*.posthog.com https://*.i.posthog.com https://*.pusher.com wss://*.pusher.com https://*.roilabs.com.br wss://*.roilabs.com.br https://*.estetiacrm.com.br wss://*.estetiacrm.com.br https://estetiacrm.com.br https://vercel.live wss://vercel.live https://*.easypanel.host",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://vercel.live https://www.mercadopago.com https://sdk.mercadopago.com",
              "base-uri 'self'",
              "form-action 'self'",
              "worker-src 'self' blob:",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ]
  },
};

const withIntl = withNextIntl(nextConfig);

// Only wrap with Sentry when SENTRY_ORG is configured (skips heavy webpack plugins on VPS builds)
export default process.env.SENTRY_ORG
  ? withSentryConfig(withIntl, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: !process.env.CI,
      widenClientFileUpload: true,
      tunnelRoute: "/monitoring",
    })
  : withIntl;
