'use client'

import dynamic from 'next/dynamic'
import { LenisProvider } from '@/components/marketing/experience-v2/shared/lenis-provider'

const CustomCursor = dynamic(
  () => import('@/components/marketing/experience-v2/shared/custom-cursor').then(m => m.CustomCursor),
  { ssr: false },
)

const ScrollProgress = dynamic(
  () => import('@/components/marketing/experience-v2/shared/scroll-progress').then(m => m.ScrollProgress),
  { ssr: false },
)

const PersistentLogo = dynamic(
  () => import('@/components/marketing/experience-v2/shared/persistent-logo').then(m => m.PersistentLogo),
  { ssr: false },
)

const StaggerHero = dynamic(
  () => import('@/components/marketing/experience-v2/stagger-hero/stagger-hero').then(m => m.StaggerHero),
  { ssr: false },
)

const ProductShowcase = dynamic(
  () => import('@/components/marketing/experience-v2/product-showcase/product-showcase').then(m => m.ProductShowcase),
  { ssr: false },
)

const MagneticShowcase = dynamic(
  () => import('@/components/marketing/experience-v2/magnetic-showcase/magnetic-showcase').then(m => m.MagneticShowcase),
  { ssr: false },
)

const MorphingManifesto = dynamic(
  () => import('@/components/marketing/experience-v2/morphing-manifesto/morphing-manifesto').then(m => m.MorphingManifesto),
  { ssr: false },
)

const NumberStats = dynamic(
  () => import('@/components/marketing/experience-v2/number-stats/number-stats').then(m => m.NumberStats),
  { ssr: false },
)

const TimelineJourney = dynamic(
  () => import('@/components/marketing/experience-v2/timeline-journey/timeline-journey').then(m => m.TimelineJourney),
  { ssr: false },
)

const CodeDrivingDemo = dynamic(
  () => import('@/components/marketing/experience-v2/code-driving-demo/code-driving-demo').then(m => m.CodeDrivingDemo),
  { ssr: false },
)

const ClosingWave = dynamic(
  () => import('@/components/marketing/experience-v2/closing-wave/closing-wave').then(m => m.ClosingWave),
  { ssr: false },
)

const FAQSection = dynamic(
  () => import('@/components/marketing/experience-v2/faq/faq-section').then(m => m.FAQSection),
  { ssr: false },
)

export function ExperienceV2Client() {
  return (
    <LenisProvider>
      <CustomCursor />
      <ScrollProgress />
      <PersistentLogo />
      <StaggerHero />
      <ProductShowcase />
      <MagneticShowcase />
      <MorphingManifesto />
      <NumberStats />
      <TimelineJourney />
      <CodeDrivingDemo />
      <FAQSection />
      <ClosingWave />
    </LenisProvider>
  )
}
