import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil } from 'lucide-react'
import { RecallLogTable } from '@/components/recall/recall-log-table'
import { RecallKpis } from '@/components/recall/recall-kpis'

export const dynamic = 'force-dynamic'

export default async function RecallRulePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { id } = await params

  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const rule = await prisma.recallRule.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      logs: {
        orderBy: { enviadoEm: 'desc' },
        take: 50,
      },
    },
  })
  if (!rule) notFound()

  const procedimentoNome = rule.procedimentoId
    ? (await prisma.procedure.findUnique({
        where: { id: rule.procedimentoId },
        select: { nome: true },
      }))?.nome ?? null
    : null

  const logs = rule.logs
  const respondidos = logs.filter(l => l.respondeu).length
  const agendamentos = logs.filter(l => l.agendou).length
  const taxaResposta = logs.length > 0 ? (respondidos / logs.length) * 100 : 0

  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const logs30d = logs.filter(l => new Date(l.enviadoEm) >= since30d)

  const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

  const CANAL_LABELS: Record<string, string> = {
    WHATSAPP: 'WhatsApp',
    EMAIL: 'E-mail',
    SMS: 'SMS',
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/recall"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{rule.nome ?? `Regra ${rule.intervaloDias} dias`}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {procedimentoNome ?? 'Qualquer procedimento'} · {CANAL_LABELS[rule.canal] ?? rule.canal} · a cada {rule.intervaloDias} dias
          </p>
        </div>
        <Link
          href={`/dashboard/recall/${id}/editar`}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Editar
        </Link>
      </div>

      <RecallKpis
        totalAtivas={rule.ativo ? 1 : 0}
        envios30d={logs30d.length}
        taxaResposta={taxaResposta}
        agendamentos30d={agendamentos}
      />

      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Template da mensagem</h2>
        <div className="rounded-xl border border-border/60 bg-card px-4 py-3">
          <pre className="text-sm text-foreground/80 whitespace-pre-wrap font-sans leading-relaxed">{rule.template}</pre>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Histórico de envios
          <span className="ml-2 text-xs font-normal text-muted-foreground">({logs.length} total)</span>
        </h2>
        <RecallLogTable logs={serialize(logs) as any} />
      </div>
    </div>
  )
}
