import { Calendar, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react"

interface DailyKPIsProps {
  totalToday: number
  confirmed: number
  noShowPredicted: number
  revenueExpected: number
}

export function DailyKPIs({
  totalToday,
  confirmed,
  noShowPredicted,
  revenueExpected,
}: DailyKPIsProps) {
  const cards = [
    {
      label: "Atendimentos hoje",
      value: totalToday,
      icon: <Calendar className="w-5 h-5" />,
      accent: "text-[#489FB5]",
      bg: "bg-[#489FB5]/8 border-[#489FB5]/15",
      glow: "hover:shadow-[#489FB5]/5 hover:border-[#489FB5]/25",
      iconGlow: "shadow-[#489FB5]/10 bg-[#489FB5]/10",
    },
    {
      label: "Confirmados",
      value: confirmed,
      icon: <CheckCircle2 className="w-5 h-5" />,
      accent: "text-[#10B981]",
      bg: "bg-[#10B981]/8 border-[#10B981]/15",
      glow: "hover:shadow-[#10B981]/5 hover:border-[#10B981]/25",
      iconGlow: "shadow-[#10B981]/10 bg-[#10B981]/10",
    },
    {
      label: "Risco de no-show",
      value: noShowPredicted,
      icon: <AlertTriangle className="w-5 h-5" />,
      accent: "text-[#E05A4E]",
      bg: "bg-[#E05A4E]/8 border-[#E05A4E]/15",
      glow: "hover:shadow-[#E05A4E]/5 hover:border-[#E05A4E]/25",
      iconGlow: "shadow-[#E05A4E]/10 bg-[#E05A4E]/10",
    },
    {
      label: "Receita prevista",
      value:
        revenueExpected > 0
          ? new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              maximumFractionDigits: 0,
            }).format(revenueExpected)
          : "—",
      icon: <TrendingUp className="w-5 h-5" />,
      accent: "text-[#C5A059]",
      bg: "bg-[#C5A059]/8 border-[#C5A059]/15",
      glow: "hover:shadow-[#C5A059]/5 hover:border-[#C5A059]/25",
      iconGlow: "shadow-[#C5A059]/10 bg-[#C5A059]/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`flex items-center gap-4.5 rounded-2xl border border-white bg-white/70 backdrop-blur-xl p-5 shadow-lg shadow-slate-100/50 hover:bg-white/95 hover:-translate-y-0.5 transition-all duration-300 group relative ${card.glow}`}
        >
          {/* Subtle inside double-border */}
          <div className="absolute inset-1 rounded-[12px] border border-white/40 pointer-events-none" />

          {/* Avatar / Icon Container */}
          <div className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 border transition-all duration-300 ${card.bg} ${card.iconGlow}`}>
            <span className={`${card.accent} transition-transform duration-300 group-hover:scale-105`}>{card.icon}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight truncate mb-1">{card.label}</p>
            <p className={`text-xl font-black leading-none tracking-tight font-serif ${card.accent}`}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

