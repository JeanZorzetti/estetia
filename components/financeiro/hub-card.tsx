import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface KpiItem {
  label: string
  value: string | number
}

interface HubCardProps {
  icon: React.ElementType
  title: string
  description: string
  href: string
  kpis: KpiItem[]
  colorClass: 'FLUXO_CAIXA' | 'OPERADORAS' | 'GUIAS_TISS' | 'OMIE' | string
}

const CARD_CONFIG = {
  FLUXO_CAIXA: {
    glowColor: 'bg-emerald-500/20',
    iconBg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50',
    iconColor: 'text-emerald-600',
    iconBorder: 'border-emerald-200/40',
  },
  OPERADORAS: {
    glowColor: 'bg-blue-500/20',
    iconBg: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
    iconColor: 'text-blue-600',
    iconBorder: 'border-blue-200/40',
  },
  GUIAS_TISS: {
    glowColor: 'bg-violet-500/20',
    iconBg: 'bg-gradient-to-br from-violet-50 to-violet-100/50',
    iconColor: 'text-violet-600',
    iconBorder: 'border-violet-200/40',
  },
  OMIE: {
    glowColor: 'bg-amber-500/20',
    iconBg: 'bg-gradient-to-br from-amber-50 to-amber-100/50',
    iconColor: 'text-[#C5A059]',
    iconBorder: 'border-amber-200/40',
  },
}

export function HubCard({ icon: Icon, title, description, href, kpis, colorClass }: HubCardProps) {
  // Fallback caso a classe antiga do Tailwind seja passada
  let typeKey: keyof typeof CARD_CONFIG = 'FLUXO_CAIXA'
  if (colorClass.includes('emerald')) typeKey = 'FLUXO_CAIXA'
  else if (colorClass.includes('blue')) typeKey = 'OPERADORAS'
  else if (colorClass.includes('violet')) typeKey = 'GUIAS_TISS'
  else if (colorClass.includes('amber')) typeKey = 'OMIE'
  else if (colorClass in CARD_CONFIG) typeKey = colorClass as keyof typeof CARD_CONFIG

  const cfg = CARD_CONFIG[typeKey]

  return (
    <Link href={href} className="group block h-full">
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/50 bg-white/40 p-6 backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:bg-white/60 h-full flex flex-col justify-between">
        {/* Moldura cristalina interna */}
        <div className="absolute inset-0.5 pointer-events-none rounded-[1.9rem] border border-white/60" />

        {/* Glow de acento sob o hover */}
        <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${cfg.glowColor}`} />

        <div className="relative z-10 flex flex-col gap-5 h-full justify-between">
          <div className="flex flex-col gap-5">
            {/* Top Row: Icon Vitrine & Action Pílula */}
            <div className="flex items-start justify-between gap-3">
              {/* Vitrine metálica de luxo */}
              <div className={`relative flex items-center justify-center rounded-2xl p-3.5 border shadow-md shrink-0 ${cfg.iconBg} ${cfg.iconBorder}`}>
                <Icon className={`w-6 h-6 ${cfg.iconColor}`} />
              </div>
              
              {/* Pílula circular de seta metálica */}
              <div className="p-2 rounded-full bg-white/80 border border-slate-200/50 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-slate-700 group-hover:bg-white group-hover:translate-x-1 transition-all duration-300">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-800 group-hover:text-[#C5A059] transition-colors duration-300">
                {title}
              </h3>
              <p className="text-sm font-medium text-slate-500 mt-1 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* KPIs Section */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200/40 relative z-10">
            {kpis.map((kpi, idx) => (
              <div 
                key={kpi.label} 
                className={`flex flex-col ${
                  idx > 0 ? 'pl-3 border-l border-slate-200/30' : ''
                }`}
              >
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-1.5 truncate">
                  {kpi.label}
                </p>
                <p className="font-serif text-xl font-extrabold text-slate-800 tracking-tight leading-none truncate tabular-nums">
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
