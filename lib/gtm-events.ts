/**
 * Standardized GTM/GA4 event helpers for Estetia CRM.
 * All events push to window.dataLayer (read by GTM → GA4).
 *
 * Usage:
 *   import { gtm } from '@/lib/gtm-events'
 *   gtm.ctaClick({ location: 'hero', label: 'Começar grátis' })
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

function push(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
}

export const gtm = {
  /**
   * Fired on every marketing page view with niche/page context.
   * Replaces default pageview for custom segmentation in GA4.
   */
  nichePageView(params: {
    page_path: string
    niche: 'estetica' | 'dermatologia' | 'estetica-corporal' | 'multi-unidade' | 'generic'
    page_type: 'homepage' | 'pricing' | 'blog' | 'feature' | 'solution' | 'vs' | 'tool' | 'help'
  }) {
    push('niche_page_view', params)
  },

  /**
   * Any CTA button click (hero, pricing section, blog, sticky bar).
   */
  ctaClick(params: {
    location: string
    label: string
    destination?: string
  }) {
    push('cta_click', params)
  },

  /**
   * User lands on /pricing or scrolls to pricing section.
   */
  pricingView(params: {
    source: 'direct' | 'blog' | 'vs_page' | 'feature_page' | 'tool' | 'other'
  }) {
    push('pricing_view', params)
  },

  /**
   * User clicks on a specific pricing tier (highlight, hover, or CTA).
   */
  tierSelect(params: {
    tier: 'free' | 'starter' | 'pro' | 'business'
    action: 'hover' | 'click_cta' | 'click_details'
  }) {
    push('tier_select', params)
  },

  /**
   * User reaches /register or completes registration step 1.
   * Primary conversion goal in GA4.
   */
  trialStart(params: {
    tier: 'free' | 'starter' | 'pro' | 'business'
    source?: string
  }) {
    push('trial_start', {
      ...params,
      value: params.tier === 'free' ? 0 : params.tier === 'starter' ? 149 : params.tier === 'pro' ? 349 : 799,
      currency: 'BRL',
    })
  },

  /**
   * User scrolls to bottom of blog post (>90% scroll depth).
   * Used to measure content engagement in GA4.
   */
  blogReadComplete(params: {
    slug: string
    title: string
    category: string
    read_time_seconds?: number
  }) {
    push('blog_read_complete', params)
  },

  /**
   * User expands a FAQ item (accordion click).
   */
  faqExpand(params: {
    question: string
    page_path: string
    index: number
  }) {
    push('faq_expand', params)
  },

  /**
   * User completes a calculator tool (ROI, no-show, LTV, precificação).
   */
  toolComplete(params: {
    tool: 'calculadora-roi' | 'calculadora-no-show' | 'calculadora-ltv' | 'calculadora-precificacao' | 'avaliacao-maturidade-digital'
    result_value?: number
    result_label?: string
  }) {
    push('tool_complete', params)
  },
} as const

export type GtmEventName =
  | 'niche_page_view'
  | 'cta_click'
  | 'pricing_view'
  | 'tier_select'
  | 'trial_start'
  | 'blog_read_complete'
  | 'faq_expand'
  | 'tool_complete'
