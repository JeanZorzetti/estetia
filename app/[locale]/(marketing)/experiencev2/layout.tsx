import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Estetia — Experience v2',
  description: 'Showcase Anime.js v4 — sem GSAP, sem Lenis, sem R3F.',
  robots: { index: false, follow: false },
}

export default function ExperienceV2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#04080F] text-white">
      {/* Hide marketing navbar + footer + padding-top imposed by parent (marketing)/layout */}
      <style>{`
        body > div > nav,
        body > div > footer,
        body > div > main > footer { display: none !important; }
        body > div > main { padding-top: 0 !important; }
      `}</style>
      {children}
    </div>
  )
}
