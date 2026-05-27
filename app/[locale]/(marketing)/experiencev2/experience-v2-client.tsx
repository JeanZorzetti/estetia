'use client'

import dynamic from 'next/dynamic'

const StaggerHero = dynamic(
  () => import('@/components/marketing/experience-v2/stagger-hero/stagger-hero').then(m => m.StaggerHero),
  { ssr: false },
)

const MorphingManifesto = dynamic(
  () => import('@/components/marketing/experience-v2/morphing-manifesto/morphing-manifesto').then(m => m.MorphingManifesto),
  { ssr: false },
)

const TimelineJourney = dynamic(
  () => import('@/components/marketing/experience-v2/timeline-journey/timeline-journey').then(m => m.TimelineJourney),
  { ssr: false },
)

const ClosingWave = dynamic(
  () => import('@/components/marketing/experience-v2/closing-wave/closing-wave').then(m => m.ClosingWave),
  { ssr: false },
)

export function ExperienceV2Client() {
  return (
    <>
      <StaggerHero />
      <MorphingManifesto />
      <TimelineJourney />
      <ClosingWave />
    </>
  )
}
