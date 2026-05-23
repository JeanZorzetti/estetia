'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Download, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

export function ExportCard() {
  return (
    <Card className={cn(
      "border-border/50 relative overflow-hidden",
      "bg-gradient-to-br from-card to-background/40",
      "rounded-2xl shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-300"
    )}>
      <CardHeader className="pb-3 border-b border-border/20">
        <CardTitle className="text-base font-semibold">Direitos do Titular</CardTitle>
        <CardDescription className="text-xs font-medium text-muted-foreground/80 mt-0.5">
          Ferramentas interativas para atender às requisições de titulares de dados (Art. 18 da LGPD)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        
        {/* Export Data Item */}
        <div className="flex items-start gap-4 rounded-xl border border-border/50 bg-background/30 p-4 hover:border-primary/25 hover:bg-primary/[0.01] hover:shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300 group/item">
          <div className="p-2.5 rounded-xl bg-muted/60 text-muted-foreground group-hover/item:bg-primary/10 group-hover/item:text-primary transition-all duration-300 shrink-0">
            <Download className="h-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Exportar relatório do paciente</p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              Gere e solicite o pacote estruturado em formato ZIP contendo todos os dados cadastrais, logs de acessos e prontuários clínicos.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 rounded-xl border-border/60 hover:bg-muted font-semibold"
              onClick={() => toast.info('Funcionalidade em desenvolvimento — abrirá o fluxo de seleção de paciente')}
            >
              Solicitar exportação
            </Button>
          </div>
        </div>

        {/* Audit Logs Item */}
        <div className="flex items-start gap-4 rounded-xl border border-border/50 bg-background/30 p-4 hover:border-primary/25 hover:bg-primary/[0.01] hover:shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300 group/item">
          <div className="p-2.5 rounded-xl bg-muted/60 text-muted-foreground group-hover/item:bg-primary/10 group-hover/item:text-primary transition-all duration-300 shrink-0">
            <ClipboardList className="h-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Auditoria de consentimentos</p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              Consulte a trilha de auditoria completa contendo os históricos de consentimentos aceitos, alterados e revogados pelos pacientes.
            </p>
            <Link href="/dashboard/settings/lgpd/consent-audit" className="inline-block mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl border-border/60 hover:bg-muted font-semibold"
              >
                Abrir auditoria
              </Button>
            </Link>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
