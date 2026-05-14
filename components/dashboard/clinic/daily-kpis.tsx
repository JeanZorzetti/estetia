import { Calendar, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react"

interface DailyKPIsProps {
  totalToday: number
  confirmed: number
  noShowPredicted: number
  revenueExpected: number
}

interface KPICard {
  label: string
  value: string | number
  icon: React.ReactNode
  accent: string
  bg: string
}

export function DailyKPIs({
  totalToday,
  confirmed,
  noShowPredicted,
  revenueExpected,
}: DailyKPIsProps) {
  const cards: KPICard[] = [
    {
      label: "Atendimentos hoje",
      value: totalToday,
      icon: <Calendar className="w-5 h-5" />,
      accent: "text-[#489FB5]",
      bg: "bg-[#489FB5]/10",
    },
    {
      label: "Confirmados",
      value: confirmed,
      icon: <CheckCircle2 className="w-5 h-5" />,
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Risco de no-show",
      value: noShowPredicted,
      icon: <AlertTriangle className="w-5 h-5" />,
      accent: "text-[#E05A4E]",
      bg: "bg-[#E05A4E]/10",
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
      bg: "bg-[#C5A059]/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-sm"
        >
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${card.bg}`}>
            <span className={card.accent}>{card.icon}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground leading-tight truncate">{card.label}</p>
            <p className={`text-xl font-bold leading-tight ${card.accent}`}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
