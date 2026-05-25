import { AlertTriangle } from 'lucide-react'

interface MedicalAlertPanelProps {
  medicacoesUso: string[]
  contraindicacoes: string[]
}

export function MedicalAlertPanel({ medicacoesUso, contraindicacoes }: MedicalAlertPanelProps) {
  if (medicacoesUso.length === 0 && contraindicacoes.length === 0) return null

  return (
    <div className="bg-amber-500/[0.04] dark:bg-amber-500/[0.01] border border-amber-500/20 dark:border-amber-500/10 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-5 items-start shadow-md backdrop-blur-sm">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-inner animate-pulse">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="flex-1 space-y-4 text-xs font-semibold leading-relaxed">
        {medicacoesUso.length > 0 && (
          <div className="space-y-1">
            <span className="text-amber-600 dark:text-amber-400 font-black uppercase text-[10px] tracking-widest block">Medicamentos em uso</span>
            <p className="text-foreground/90 font-bold text-sm">{medicacoesUso.join(', ')}</p>
          </div>
        )}
        {contraindicacoes.length > 0 && (
          <div className="space-y-1">
            <span className="text-red-600 dark:text-red-400 font-black uppercase text-[10px] tracking-widest block">Contraindicações clínicas</span>
            <p className="text-red-600 dark:text-red-400 font-bold text-sm">{contraindicacoes.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
