import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Pencil } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/financeiro/guias-tiss/status-badge'
import { XmlViewer } from '@/components/financeiro/guias-tiss/xml-viewer'
import { RespostaDialog } from '@/components/financeiro/guias-tiss/resposta-dialog'
import { GerarXmlButton } from '@/components/financeiro/guias-tiss/gerar-xml-button'

export const dynamic = 'force-dynamic'

const TIPO_LABELS: Record<string, string> = {
  CONSULTA: 'Consulta', SADT: 'SADT', SP_SADT: 'SP-SADT', INTERNACAO: 'Internação', HONORARIOS: 'Honorários',
}

const formatBRL = (v: number | null) =>
  v == null ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export default async function GuiaTissDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { id } = await params
  const guia = await prisma.guiaTiss.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      operadora: { select: { id: true, nome: true, codigoAns: true } },
      paciente: { select: { id: true, nome: true, telefone: true } },
    },
  })
  if (!guia) notFound()

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/financeiro/guias-tiss"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              Guia {guia.numeroGuia ?? guia.id.slice(0, 8)}
            </h1>
            <StatusBadge status={guia.status} />
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {TIPO_LABELS[guia.tipo] ?? guia.tipo} · {guia.operadora.nome} · {guia.paciente.nome}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {guia.status === 'RASCUNHO' && (
            <Link href={`/dashboard/financeiro/guias-tiss/${guia.id}/editar`}>
              <Button variant="outline">
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </Link>
          )}
          {guia.status === 'RASCUNHO' && <GerarXmlButton guiaId={guia.id} />}
          {guia.status === 'ENVIADA' && <RespostaDialog guiaId={guia.id} />}
        </div>
      </div>

      {/* Dados */}
      <Card className="border-border/60">
        <CardContent className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">TUSS</p>
            <p className="font-mono text-sm">{guia.codigoTuss ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Valor procedimento</p>
            <p className="font-semibold tabular-nums">{formatBRL(guia.valorProcedimento != null ? Number(guia.valorProcedimento) : null)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Valor total</p>
            <p className="font-semibold tabular-nums">{formatBRL(guia.valorTotal != null ? Number(guia.valorTotal) : null)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Execução</p>
            <p className="text-sm">{guia.dataExecucao ? new Date(guia.dataExecucao).toLocaleDateString('pt-BR') : '—'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Motivo glosa */}
      {guia.motivoGlosa && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-2">Motivo da glosa</p>
            <p className="text-sm text-amber-900 dark:text-amber-100 whitespace-pre-wrap">{guia.motivoGlosa}</p>
          </CardContent>
        </Card>
      )}

      {/* XML Enviado */}
      <XmlViewer
        xml={guia.xmlEnviado}
        title="XML Enviado (TISS 4.01.00)"
        filename={`guia-${guia.numeroGuia ?? guia.id.slice(0, 8)}.xml`}
      />

      {/* XML Resposta */}
      {guia.xmlResposta && (
        <XmlViewer
          xml={guia.xmlResposta}
          title="XML de Resposta"
          filename={`resposta-${guia.numeroGuia ?? guia.id.slice(0, 8)}.xml`}
        />
      )}
    </div>
  )
}
