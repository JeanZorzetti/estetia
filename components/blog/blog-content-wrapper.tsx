'use client'

import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'

interface BlogContentWrapperProps {
  content: string
  slug: string
}

export function BlogContentWrapper({ content, slug }: BlogContentWrapperProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    if (slug === 'funil-de-vendas-guia-completo') {
      const calcPlaceholder = contentRef.current.querySelector('.funnel-calculator-component')
      if (calcPlaceholder && !calcPlaceholder.hasChildNodes()) {
        import('./funnel-calculator').then(({ FunnelCalculator }) => {
          const root = createRoot(calcPlaceholder)
          root.render(<FunnelCalculator />)
        })
      }
      const templatePlaceholder = contentRef.current.querySelector('.funnel-template-download-component')
      if (templatePlaceholder && !templatePlaceholder.hasChildNodes()) {
        import('./funnel-template-download').then(({ FunnelTemplateDownload }) => {
          const root = createRoot(templatePlaceholder)
          root.render(<FunnelTemplateDownload />)
        })
      }
    }

    if (slug === 'planilha-controle-comissao-corretor') {
      const placeholder = contentRef.current.querySelector('.roi-calculator-component')
      if (placeholder && !placeholder.hasChildNodes()) {
        import('@/components/calculadora-roi').then(({ CalculadoraROI }) => {
          const root = createRoot(placeholder)
          root.render(<CalculadoraROI ctaText="Pare de perder comissões - Teste o Estetia CRM Grátis" ctaHref="/register" />)
        })
      }
    }

    if (slug === 'custo-oculto-inacao-crm') {
      const placeholder = contentRef.current.querySelector('.roi-calculator-component')
      if (placeholder && !placeholder.hasChildNodes()) {
        import('@/components/calculadora-roi').then(({ CalculadoraROI }) => {
          const root = createRoot(placeholder)
          root.render(<CalculadoraROI ctaText="Calcule seu custo de inação agora" ctaHref="/register" />)
        })
      }
    }

    if (slug === 'crm-ia-inteligencia-artificial-2026') {
      const placeholder = contentRef.current.querySelector('.crm-ia-quiz-component')
      if (placeholder && !placeholder.hasChildNodes()) {
        import('./crm-ia-quiz').then(({ CRMIAQuiz }) => {
          const root = createRoot(placeholder)
          root.render(<CRMIAQuiz />)
        })
      }
    }

    if (slug === 'crm-automacao-vendas-guia-completo') {
      const placeholder = contentRef.current.querySelector('.roi-automacao-component')
      if (placeholder && !placeholder.hasChildNodes()) {
        import('./roi-automacao-calc').then(({ ROIAutomacaoCalc }) => {
          const root = createRoot(placeholder)
          root.render(<ROIAutomacaoCalc />)
        })
      }
    }

    if (slug === 'melhor-crm-2026-comparativo') {
      const placeholder = contentRef.current.querySelector('.crm-finder-component')
      if (placeholder && !placeholder.hasChildNodes()) {
        import('./crm-finder').then(({ CRMFinder }) => {
          const root = createRoot(placeholder)
          root.render(<CRMFinder />)
        })
      }
    }
  }, [slug])

  return (
    <div
      ref={contentRef}
      className="prose max-w-none
        text-base sm:text-lg leading-relaxed

        prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight
        prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b
        prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3

        [&_h2]:color-[#0A1F3D] [&_h3]:color-[#0A1F3D]
        prose-p:leading-relaxed

        prose-a:font-medium prose-a:no-underline hover:prose-a:underline
        prose-strong:font-bold

        prose-ul:my-6 prose-ul:space-y-2
        prose-ol:my-6 prose-ol:space-y-3
        prose-li:pl-1

        prose-blockquote:border-l-4 prose-blockquote:pl-5 prose-blockquote:py-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:my-8

        prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm

        prose-img:rounded-xl prose-img:shadow-md prose-img:my-8

        prose-table:my-8 prose-table:w-full
        prose-thead:border-b prose-th:py-3 prose-th:px-4 prose-th:text-left prose-th:font-semibold prose-th:text-sm
        prose-td:py-3 prose-td:px-4 prose-td:border-b prose-td:text-sm"

      style={{
        // Base text
        '--tw-prose-body': '#475569',
        '--tw-prose-headings': '#0A1F3D',
        '--tw-prose-lead': '#64748B',
        '--tw-prose-links': '#489FB5',
        '--tw-prose-bold': '#0A1F3D',
        '--tw-prose-counters': '#C5A059',
        '--tw-prose-bullets': '#C5A059',
        '--tw-prose-hr': 'rgba(10,31,61,0.1)',
        '--tw-prose-quotes': '#0A1F3D',
        '--tw-prose-quote-borders': '#C5A059',
        '--tw-prose-captions': '#94A3B8',
        '--tw-prose-code': '#0A1F3D',
        '--tw-prose-pre-code': '#e2e8f0',
        '--tw-prose-pre-bg': '#0A1F3D',
        '--tw-prose-th-borders': 'rgba(10,31,61,0.12)',
        '--tw-prose-td-borders': 'rgba(10,31,61,0.07)',
      } as React.CSSProperties}

      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
