import { Send, CheckCircle, Calendar, Activity } from 'lucide-react'

interface RecallKpisProps {
  totalAtivas: number
  envios30d: number
  taxaResposta: number
  agendamentos30d: number
}

export function RecallKpis({ totalAtivas, envios30d, taxaResposta, agendamentos30d }: RecallKpisProps) {
  const kpis = [
    { 
      label: 'Regras ativas', 
      value: totalAtivas, 
      icon: Activity, 
      glowColor: 'bg-cyan-500/20',
      iconBg: 'bg-gradient-to-br from-cyan-50 to-cyan-100/50',
      iconColor: 'text-cyan-600'
    },
    { 
      label: 'Envios (30d)', 
      value: envios30d, 
      icon: Send, 
      glowColor: 'bg-blue-500/20',
      iconBg: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
      iconColor: 'text-blue-600'
    },
    { 
      label: 'Taxa resposta', 
      value: `${taxaResposta.toFixed(0)}%`, 
      icon: CheckCircle, 
      glowColor: 'bg-emerald-500/20',
      iconBg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50',
      iconColor: 'text-emerald-600'
    },
    { 
      label: 'Agendamentos', 
      value: agendamentos30d, 
      icon: Calendar, 
      glowColor: 'bg-amber-500/20',
      iconBg: 'bg-gradient-to-br from-amber-50 to-amber-100/50',
      iconColor: 'text-[#C5A059]'
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
      {kpis.map(({ label, value, icon: Icon, glowColor, iconBg, iconColor }) => (
        <div 
          key={label} 
          className="relative group overflow-hidden rounded-2xl border border-slate-200/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center gap-4"
        >
          {/* Moldura interna de seda branca para o Glassmorphic Duplo */}
          <div className="absolute inset-0.5 border border-white/60 pointer-events-none rounded-[14px]" />
          
          {/* Glow de acento sob o hover */}
          <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${glowColor}`} />
          
          <div className="relative flex items-center gap-4 z-10 w-full">
            {/* Vitrine metálica de luxo para o ícone */}
            <div className={`relative flex items-center justify-center rounded-xl p-3 border border-white/80 shadow-md shrink-0 ${iconBg}`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div>
              <p className="font-serif text-3xl font-extrabold text-slate-800 tracking-tight leading-none mb-1 tabular-nums">
                {value}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
