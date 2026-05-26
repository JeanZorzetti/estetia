import { HeroCinematic } from '@/components/marketing/hero-cinematic'

export const metadata = {
  title: 'Hero Cinematic — Design System',
  robots: { index: false, follow: false },
}

export default function HeroCinematicDemoPage() {
  return (
    <main>
      <HeroCinematic />

      <section className="bg-white px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-4xl tracking-tight text-[#0A1F3D]">
            Próxima seção
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Esta seção serve apenas para você testar o scroll. Quando descer 80px, o
            indicador acima desaparece com fade-out de 0.4s.
          </p>
          <p className="mt-8 text-sm text-slate-500">
            Para testar <code className="rounded bg-slate-100 px-1.5 py-0.5">prefers-reduced-motion</code>,
            abra DevTools → Rendering → Emulate CSS media feature → reduce.
          </p>
        </div>
      </section>
    </main>
  )
}
