import { Card } from '@/components/ui/card'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Row {
  feature: string
  estetia: string | boolean
  iclinic: string | boolean
  feegow: string | boolean
  clinicorp: string | boolean
  belle: string | boolean
}

const ROWS: Row[] = [
  { feature: 'Preço inicial', estetia: 'R$ 39/mês', iclinic: 'R$ 99/prof', feegow: 'R$ 129/prof', clinicorp: 'R$ 127/mês', belle: 'sob consulta' },
  { feature: 'Modular (paga apenas o que usar)', estetia: true, iclinic: false, feegow: false, clinicorp: false, belle: 'parcial' },
  { feature: 'Calculadora pública transparente', estetia: true, iclinic: false, feegow: false, clinicorp: false, belle: false },
  { feature: 'Licença por clínica (recepção ilimitada)', estetia: true, iclinic: false, feegow: false, clinicorp: true, belle: true },
  { feature: 'Período de teste grátis (7 dias)', estetia: true, iclinic: true, feegow: true, clinicorp: true, belle: 'sob consulta' },
  { feature: 'Faturamento TISS XML ANS 4.01', estetia: true, iclinic: 'Plano Plus+', feegow: true, clinicorp: 'add-on pago', belle: 'add-on pago' },
  { feature: 'WhatsApp Cloud API Oficial (Sem chips bloqueados)', estetia: true, iclinic: false, feegow: false, clinicorp: false, belle: 'R$ 229/mês' },
  { feature: 'Agendamento com Agentes de IA Inteligentes', estetia: true, iclinic: false, feegow: 'apenas voz', clinicorp: false, belle: false },
  { feature: 'Marketing e Disparos em Massa', estetia: 'R$ 49/mês', iclinic: 'Plano Plus', feegow: false, clinicorp: false, belle: 'R$ 150/mês' },
  { feature: 'Galeria Antes/Depois segura e LGPD', estetia: 'R$ 19/mês', iclinic: 'limitado', feegow: true, clinicorp: true, belle: true },
  { feature: 'Programa de Fidelidade + Sistema de Indicações', estetia: true, iclinic: false, feegow: false, clinicorp: false, belle: false },
  { feature: 'Conformidade LGPD nativa (DPO dedicado)', estetia: true, iclinic: 'parcial', feegow: 'parcial', clinicorp: 'parcial', belle: 'parcial' },
]

function Cell({ value, isEstetia }: { value: string | boolean; isEstetia?: boolean }) {
  if (value === true) {
    return isEstetia 
      ? <Check className="w-4.5 h-4.5 text-[#C5A059] mx-auto stroke-[3] animate-scale-in" />
      : <Check className="w-4 h-4 text-slate-500/80 mx-auto stroke-[2.5]" />
  }
  if (value === false) {
    return <X className="w-4 h-4 text-slate-350 dark:text-slate-700 mx-auto stroke-[2]" />
  }
  return (
    <span className={cn(
      "text-xs tabular-nums font-medium",
      isEstetia ? "text-[#C5A059] font-bold" : "text-slate-500 dark:text-slate-400"
    )}>
      {value}
    </span>
  )
}

export function CompetitorComparison() {
  return (
    <Card className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-slate-200/50 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100/50 dark:bg-slate-950/40 border-b border-slate-200/40 dark:border-white/5">
              <th className="text-left py-4 px-6 font-serif font-bold text-xs uppercase tracking-wider text-[#0A1F3D] dark:text-white">
                Recurso Exclusivo
              </th>
              <th className="py-4 px-6 font-serif font-bold text-sm uppercase tracking-wider text-center bg-[#C5A059]/10 text-[#C5A059] border-x border-[#C5A059]/20 relative">
                Estetia CRM
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-[#C5A059]" />
              </th>
              <th className="py-4 px-5 font-sans font-semibold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
                iClinic
              </th>
              <th className="py-4 px-5 font-sans font-semibold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
                Feegow
              </th>
              <th className="py-4 px-5 font-sans font-semibold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
                Clinicorp
              </th>
              <th className="py-4 px-5 font-sans font-semibold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
                Belle Software
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr 
                key={r.feature} 
                className={cn(
                  "border-b border-slate-150 dark:border-slate-800/40 transition-colors duration-250",
                  i % 2 === 0 ? "bg-white/20 dark:bg-slate-900/10" : "bg-white/10 dark:bg-slate-900/5",
                  "hover:bg-slate-100/30 dark:hover:bg-slate-800/20"
                )}
              >
                <td className="py-3 px-6 font-sans font-semibold text-xs text-[#0A1F3D] dark:text-slate-200">
                  {r.feature}
                </td>
                <td className="py-3 px-6 text-center bg-[#C5A059]/5 border-x border-[#C5A059]/10">
                  <Cell value={r.estetia} isEstetia />
                </td>
                <td className="py-3 px-5 text-center">
                  <Cell value={r.iclinic} />
                </td>
                <td className="py-3 px-5 text-center">
                  <Cell value={r.feegow} />
                </td>
                <td className="py-3 px-5 text-center">
                  <Cell value={r.clinicorp} />
                </td>
                <td className="py-3 px-5 text-center">
                  <Cell value={r.belle} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

