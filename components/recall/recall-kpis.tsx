import { Send, CheckCircle, Calendar, Activity } from 'lucide-react'

interface RecallKpisProps {
  totalAtivas: number
  envios30d: number
  taxaResposta: number
  agendamentos30d: number
}

export function RecallKpis({ totalAtivas, envios30d, taxaResposta, agendamentos30d }: RecallKpisProps) {
  const kpis = [
    { label: 'Regras ativas', value: totalAtivas, icon: Activity, color: 'text-[#489FB5] bg-[#489FB5]/10' },
    { label: 'Envios (30d)', value: envios30d, icon: Send, color: 'text-[#0A1F3D] bg-[#0A1F3D]/8' },
    { label: 'Taxa resposta', value: `${taxaResposta.toFixed(0)}%`, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Agendamentos', value: agendamentos30d, icon: Calendar, color: 'text-[#C5A059] bg-[#C5A059]/10' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="rounded-xl border border-border/60 bg-card px-4 py-3 flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground leading-none">{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
