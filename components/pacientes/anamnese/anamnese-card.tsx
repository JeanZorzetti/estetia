import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, ExternalLink } from 'lucide-react'
import type { AnamnesisEntry } from '@/lib/clinical/types'

interface Props {
  anamnese: AnamnesisEntry
  patientId: string
}

const PREENCHIDO_POR_LABELS: Record<string, string> = {
  profissional: 'Profissional',
  paciente: 'Paciente',
  recepcao: 'Recepção',
}

export function AnamneseCard({ anamnese, patientId }: Props) {
  return (
    <Card className="overflow-hidden border-border/40 bg-card/45 backdrop-blur-sm transition-all duration-300 hover:border-teal-500/25 hover:shadow-md rounded-2xl group relative pl-3">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal to-teal-600 rounded-l-2xl" />

      <CardContent className="p-5 text-xs space-y-3 font-semibold">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="font-extrabold text-sm text-foreground/90 flex items-center gap-1.5 leading-tight">
            <Award className="w-4 h-4 text-teal-500" />
            Ficha de Anamnese Clínico-Estética
          </span>
          {anamnese.assinadoEm && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-[10px] font-bold shadow-sm select-none leading-tight">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500" />
              </span>
              Assinada
            </span>
          )}
        </div>

        <div className="text-muted-foreground font-semibold text-[10px] md:text-xs flex items-center gap-1.5 flex-wrap leading-relaxed">
          <span>Preenchida em: {new Date(anamnese.createdAt).toLocaleDateString('pt-BR')}</span>
          <span>·</span>
          <span>Responsável: {PREENCHIDO_POR_LABELS[anamnese.preenchidoPor] ?? anamnese.preenchidoPor}</span>
          {anamnese.profissional && (
            <>
              <span>·</span>
              <span>Profissional: {anamnese.profissional.nome}</span>
            </>
          )}
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-xl border border-teal/20 bg-teal-500/5 hover:bg-teal hover:text-white transition-all duration-300 text-xs font-bold text-teal-600 dark:text-teal-400 shadow-sm cursor-pointer"
            asChild
          >
            <a href={`/dashboard/pacientes/${patientId}/anamnese/${anamnese.id}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Visualizar questionário →
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
