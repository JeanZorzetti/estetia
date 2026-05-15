import { Card } from '@/components/ui/card'
import { Check, X } from 'lucide-react'

interface Row {
  feature: string
  estetia: string | boolean
  iclinic: string | boolean
  feegow: string | boolean
  clinicorp: string | boolean
  belle: string | boolean
}

const ROWS: Row[] = [
  { feature: 'Preço entrada', estetia: 'R$ 39', iclinic: 'R$ 99/prof', feegow: 'R$ 129/prof', clinicorp: 'R$ 127', belle: 'sob consulta' },
  { feature: 'Modular (paga só o que usa)', estetia: true, iclinic: false, feegow: false, clinicorp: false, belle: 'parcial' },
  { feature: 'Calculadora pública de preço', estetia: true, iclinic: false, feegow: false, clinicorp: false, belle: false },
  { feature: 'Por clínica (não por usuário)', estetia: true, iclinic: false, feegow: false, clinicorp: true, belle: true },
  { feature: 'Trial gratuito 7 dias', estetia: true, iclinic: true, feegow: true, clinicorp: true, belle: 'sob consulta' },
  { feature: 'TISS XML ANS 4.01', estetia: true, iclinic: 'Plus+', feegow: true, clinicorp: 'add-on', belle: 'add-on' },
  { feature: 'WhatsApp Cloud API (oficial)', estetia: true, iclinic: false, feegow: false, clinicorp: false, belle: 'R$ 229' },
  { feature: 'IA agentes', estetia: true, iclinic: false, feegow: 'voz', clinicorp: false, belle: false },
  { feature: 'Marketing em massa', estetia: 'R$ 49', iclinic: 'Plus', feegow: false, clinicorp: false, belle: 'R$ 150' },
  { feature: 'Fotos antes/depois LGPD', estetia: 'R$ 19', iclinic: 'limitado', feegow: true, clinicorp: true, belle: true },
  { feature: 'Fidelidade + Indicações', estetia: true, iclinic: false, feegow: false, clinicorp: false, belle: false },
  { feature: 'LGPD nativo (audit + DPO)', estetia: true, iclinic: 'parcial', feegow: 'parcial', clinicorp: 'parcial', belle: 'parcial' },
]

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
  if (value === false) return <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
  return <span className="text-xs text-muted-foreground tabular-nums">{value}</span>
}

export function CompetitorComparison() {
  return (
    <Card className="border-border/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 border-b border-border/60">
              <th className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider">Recurso</th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider bg-primary/10 text-primary">Estetia</th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">iClinic</th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Feegow</th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Clinicorp</th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Belle</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.feature} className={i % 2 === 0 ? '' : 'bg-muted/20'}>
                <td className="py-2.5 px-4 font-medium">{r.feature}</td>
                <td className="py-2.5 px-4 text-center bg-primary/5"><Cell value={r.estetia} /></td>
                <td className="py-2.5 px-4 text-center"><Cell value={r.iclinic} /></td>
                <td className="py-2.5 px-4 text-center"><Cell value={r.feegow} /></td>
                <td className="py-2.5 px-4 text-center"><Cell value={r.clinicorp} /></td>
                <td className="py-2.5 px-4 text-center"><Cell value={r.belle} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
