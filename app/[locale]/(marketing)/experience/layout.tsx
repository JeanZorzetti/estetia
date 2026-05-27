import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Estetia — Experience',
  description: 'Uma experiência de design estado da arte.',
  robots: { index: false, follow: false },
}

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#04080F] text-white">
      {children}
    </div>
  )
}
