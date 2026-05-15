import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ConsentimentosTable } from '@/components/lgpd/consentimentos/consentimentos-table'
import { NovoConsentimentoDialog } from '@/components/lgpd/consentimentos/novo-consentimento-dialog'

export const dynamic = 'force-dynamic'

const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

const TIPO_LABELS: Record<string, string> = {
  LGPD_DADOS_SAUDE: 'Dados de Saúde',
  USO_FOTO_MARKETING: 'Foto/Marketing',
  AUTORIZACAO_PROCEDIMENTO: 'Procedimento',
  TERMO_RISCO: 'Termo de Risco',
  TERMO_MENOR_IDADE: 'Menor de Idade',
}

export default async function ConsentimentosPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { organizationId } = user

  const [consents, byTipo] = await Promise.all([
    prisma.consentLog.findMany({
      where: { organizationId },
      include: { paciente: { select: { id: true, nome: true } } },
      orderBy: { aceitoEm: 'desc' },
      take: 500,
    }),
    prisma.consentLog.groupBy({
      by: ['tipo'],
      where: { organizationId, revokedAt: null },
      _count: { id: true },
    }),
  ])

  const tipoMap = Object.fromEntries(byTipo.map(t => [t.tipo, t._count.id]))

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/lgpd"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            LGPD & Compliance
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Consentimentos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gestão de termos de consentimento — LGPD Art. 7º e 11º · {consents.length} registro{consents.length !== 1 ? 's' : ''}
          </p>
        </div>
        <NovoConsentimentoDialog />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.entries(TIPO_LABELS).map(([tipo, label]) => (
          <Card key={tipo} className="border-border/60">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 truncate">{label}</p>
              <p className="text-2xl font-bold tabular-nums">{tipoMap[tipo] ?? 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConsentimentosTable initialConsents={serialize(consents) as any} />
    </div>
  )
}
