import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Estetia — Experience v2',
  description: 'Showcase Anime.js v4 — sem GSAP, sem Lenis, sem R3F.',
}

export default function ExperienceV2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'radial-gradient(ellipse at 50% 0%, #0A1F3D 0%, #04080F 60%)' }} className="text-white">
      {/* Hide marketing navbar + footer + padding-top imposed by parent (marketing)/layout */}
      <style>{`
        body > div > nav,
        body > div > footer,
        body > div > main > footer { display: none !important; }
        body > div > main { padding-top: 0 !important; }
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&display=swap');
      `}</style>
      {children}
    </div>
  )
}
