import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Estetia — Experience v2',
  description: 'Showcase Anime.js v4 — sem GSAP, sem Lenis, sem R3F.',
  robots: { index: false, follow: false },
}

export default function ExperienceV2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#04080F] text-white">
      {children}
    </div>
  )
}
