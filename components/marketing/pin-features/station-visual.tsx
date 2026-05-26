import type { StationVisualId } from './stations-data'

type Props = { id: StationVisualId }

export function StationVisual({ id }: Props) {
  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0A1F3D] to-[#162D54] p-8 shadow-2xl">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#C5A059]/15 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#489FB5]/20 blur-3xl" aria-hidden="true" />

      <div className="relative h-full w-full">
        {id === 'agenda' && <AgendaVisual />}
        {id === 'finance' && <FinanceVisual />}
        {id === 'whatsapp' && <WhatsAppVisual />}
        {id === 'photos' && <PhotosVisual />}
      </div>
    </div>
  )
}

function AgendaVisual() {
  const slots = [
    { time: '09:00', patient: 'Luciana C.', proc: 'Botox', filled: true },
    { time: '10:30', patient: 'Roberta G.', proc: 'Preenchimento', filled: true },
    { time: '12:00', patient: 'Recall IA', proc: 'Sugerido', filled: 'ai' },
    { time: '14:00', patient: 'Beatriz C.', proc: 'Fios PDO', filled: true },
    { time: '15:30', patient: 'Recall IA', proc: 'Sugerido', filled: 'ai' },
    { time: '17:00', patient: 'Vazio', proc: '—', filled: false },
  ]
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C5A059]">
          Agenda de Quinta
        </span>
        <span className="rounded-md bg-[#489FB5]/15 px-2 py-0.5 text-[10px] font-bold text-[#489FB5]">
          21 Mai
        </span>
      </div>
      <div className="flex-1 space-y-2">
        {slots.map((s, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-lg border p-2.5 ${
              s.filled === 'ai'
                ? 'border-[#C5A059]/40 bg-[#C5A059]/10'
                : s.filled
                  ? 'border-white/10 bg-white/5'
                  : 'border-dashed border-white/15 bg-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-10 text-[11px] font-bold text-white/60 tabular-nums">{s.time}</span>
              <div>
                <div
                  className={`text-xs font-bold ${
                    s.filled === 'ai' ? 'text-[#C5A059]' : s.filled ? 'text-white' : 'text-white/30'
                  }`}
                >
                  {s.patient}
                </div>
                <div className="text-[10px] text-white/40">{s.proc}</div>
              </div>
            </div>
            {s.filled === 'ai' && (
              <span className="rounded bg-[#C5A059] px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-[#0A1F3D]">
                IA ✨
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function FinanceVisual() {
  const items = [
    { label: 'Botox', value: 'R$ 18.400', pct: 88, color: '#489FB5' },
    { label: 'Preenchimento', value: 'R$ 14.900', pct: 70, color: '#C5A059' },
    { label: 'Fios PDO', value: 'R$ 10.000', pct: 48, color: '#22c55e' },
    { label: 'Bioestimuladores', value: 'R$ 7.200', pct: 34, color: '#a78bfa' },
  ]
  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C5A059]">
          Receita do Mês
        </span>
        <span className="text-[10px] text-emerald-400">↑ 18% vs anterior</span>
      </div>
      <div className="mb-6 font-serif text-5xl font-bold tracking-tight text-white">
        R$ 50.500
      </div>
      <div className="flex-1 space-y-4">
        {items.map((it, i) => (
          <div key={i}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-semibold text-white/80">{it.label}</span>
              <span className="font-bold text-white tabular-nums">{it.value}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full" style={{ width: `${it.pct}%`, backgroundColor: it.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WhatsAppVisual() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.16 5.335 5.495 0 12.05 0c3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24z" />
          </svg>
        </div>
        <div>
          <div className="text-xs font-bold text-white">Inteligência Estetia</div>
          <div className="text-[10px] text-emerald-400">● online</div>
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-emerald-500/15 p-3 text-xs text-white">
          Oi Mariana! 💎 Vi que faz <b className="text-[#C5A059]">5 meses</b> do seu Botox. Que tal um retoque essa semana?
        </div>
        <div className="mr-auto max-w-[70%] rounded-2xl rounded-tl-sm bg-white/5 p-3 text-xs text-white/80">
          Nossa, que ótimo lembrar! Tem horário quinta?
        </div>
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-emerald-500/15 p-3 text-xs text-white">
          Quinta às <b className="text-[#C5A059]">12:00</b> está livre ✨ Confirmo?
        </div>
        <div className="mr-auto max-w-[40%] rounded-2xl rounded-tl-sm bg-white/5 p-3 text-xs text-white/80">
          Confirmado! ❤️
        </div>
      </div>
      <div className="mt-3 rounded-lg border border-[#C5A059]/20 bg-[#C5A059]/5 p-2 text-[10px] text-[#C5A059]">
        ✨ 47 pacientes elegíveis para reativação esta semana
      </div>
    </div>
  )
}

function PhotosVisual() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C5A059]">
          Caso #902 — Botox Frontal
        </span>
        <span className="text-[10px] text-white/60">3 sessões</span>
      </div>
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10">
        <div className="grid h-full grid-cols-2">
          <div className="relative flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
            <span className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 text-[9px] font-bold uppercase text-white">
              Antes
            </span>
          </div>
          <div className="relative flex items-center justify-center bg-gradient-to-br from-[#489FB5]/40 to-[#0A1F3D]">
            <span className="absolute bottom-2 right-2 rounded bg-emerald-500/80 px-2 py-0.5 text-[9px] font-bold uppercase text-white">
              Depois
            </span>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#C5A059] text-xs text-white shadow-2xl">
          ↔
        </div>
        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white/80 shadow-xl" />
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-white/5 p-2 text-[10px]">
        <span className="text-white/60">Consentimento digital</span>
        <span className="font-bold text-emerald-400">✓ Assinado 14/03</span>
      </div>
    </div>
  )
}
