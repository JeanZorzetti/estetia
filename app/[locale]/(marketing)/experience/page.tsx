import dynamic from 'next/dynamic'

// Carregamento sem SSR para componentes com WebGL/Canvas
const HeroWebGL = dynamic(
  () => import('@/components/marketing/experience/hero-webgl/hero-webgl').then(m => m.HeroWebGL),
  { ssr: false },
)

const EditorialManifesto = dynamic(
  () => import('@/components/marketing/experience/editorial-manifesto/editorial-manifesto').then(m => m.EditorialManifesto),
  { ssr: false },
)

const Procedural3D = dynamic(
  () => import('@/components/marketing/experience/procedural-3d/procedural-3d').then(m => m.Procedural3D),
  { ssr: false },
)

const SvgJourney = dynamic(
  () => import('@/components/marketing/experience/svg-journey/svg-journey').then(m => m.SvgJourney),
  { ssr: false },
)

const InfiniteGallery = dynamic(
  () => import('@/components/marketing/experience/infinite-gallery/infinite-gallery').then(m => m.InfiniteGallery),
  { ssr: false },
)

const ClosingCurtain = dynamic(
  () => import('@/components/marketing/experience/closing-curtain/closing-curtain').then(m => m.ClosingCurtain),
  { ssr: false },
)

export default function ExperiencePage() {
  return (
    <>
      {/* F1 — Hero WebGL com distortion shader + letter-by-letter */}
      <HeroWebGL />

      {/* F2 — Editorial Manifesto (tipografia serif massiva) */}
      <EditorialManifesto />

      {/* F3 — Procedural 3D scroll-driven (R3F + iridescent) */}
      <Procedural3D />

      {/* F4 — SVG line-drawing jornada do paciente */}
      <SvgJourney />

      {/* F5 — Galeria XY infinita arrastável */}
      <InfiniteGallery />

      {/* F6 — Closing curtain + CTA final */}
      <ClosingCurtain />
    </>
  )
}
