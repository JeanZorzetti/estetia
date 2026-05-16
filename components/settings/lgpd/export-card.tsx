'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Download, ClipboardList } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export function ExportCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Direitos do Titular</CardTitle>
        <CardDescription>Ferramentas para atender solicitações dos titulares de dados (Art. 18 LGPD)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
          <Download className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">Exportar dados de paciente</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Solicite o pacote ZIP com todos os dados pessoais e clínicos de um paciente específico.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => toast.info('Funcionalidade em desenvolvimento — abrirá fluxo de seleção de paciente')}
            >
              Solicitar exportação
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-border/50 p-3">
          <ClipboardList className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">Auditoria de consentimentos</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Visualize o histórico completo de consentimentos aceitos e revogados.
            </p>
            <Link href="/dashboard/settings/lgpd/consent-audit">
              <Button variant="outline" size="sm" className="mt-2">
                Abrir auditoria
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
