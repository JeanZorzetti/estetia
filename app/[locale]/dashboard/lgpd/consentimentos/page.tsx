import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ShieldCheck, Activity, Camera, Sparkles, ShieldAlert, Users, Fingerprint } from 'lucide-react'
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

const TIPO_ICONS: Record<string, any> = {
  LGPD_DADOS_SAUDE: Activity,
  USO_FOTO_MARKETING: Camera,
  AUTORIZACAO_PROCEDIMENTO: Sparkles,
  TERMO_RISCO: ShieldAlert,
  TERMO_MENOR_IDADE: Users,
}

const TIPO_COLORS: Record<string, { gradient: string; text: string; iconBg: string; border: string }> = {
  LGPD_DADOS_SAUDE: {
    gradient: 'from-teal-500/10 via-teal-500/2 to-transparent hover:border-teal-500/30',
    text: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    border: 'border-teal-500/10',
  },
  USO_FOTO_MARKETING: {
    gradient: 'from-gold-500/10 via-gold-500/2 to-transparent hover:border-gold-500/30',
    text: 'text-gold-600 dark:text-gold-400',
    iconBg: 'bg-gold-500/10 text-gold-600 border-gold-500/20',
    border: 'border-gold-500/10',
  },
  AUTORIZACAO_PROCEDIMENTO: {
    gradient: 'from-navy-500/10 via-navy-500/2 to-transparent hover:border-navy-500/30',
    text: 'text-navy dark:text-navy-200',
    iconBg: 'bg-navy-500/10 text-navy dark:text-navy-200 border-navy-500/20',
    border: 'border-navy-500/10',
  },
  TERMO_RISCO: {
    gradient: 'from-rose-500/10 via-rose-500/2 to-transparent hover:border-rose-500/30',
    text: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    border: 'border-rose-500/10',
  },
  TERMO_MENOR_IDADE: {
    gradient: 'from-indigo-500/10 via-indigo-500/2 to-transparent hover:border-indigo-500/30',
    text: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    border: 'border-indigo-500/10',
  },
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
    <div className="flex flex-col gap-6 p-4 md:p-6 relative overflow-visible">
      {/* Decorative ambient glows */}
      <div className="absolute top-0 right-0 w-[550px] h-[350px] bg-gradient-to-bl from-teal-500/10 via-navy-500/3 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-gradient-to-tr from-gold-500/5 via-navy-500/2 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Header block with visual identity */}
      <div className="relative z-10 bg-card/45 border border-border/40 rounded-3xl p-5 md:p-6 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <Link
            href="/dashboard/lgpd"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-muted-foreground hover:text-teal dark:hover:text-teal-400 transition-colors duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
            LGPD & Compliance
          </Link>
          <span className="flex items-center gap-1 text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest bg-teal-500/10 border border-teal-500/15 px-3 py-1 rounded-full shadow-inner select-none animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
            Em conformidade
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-navy via-navy-600 to-teal-500 border border-navy-500/20 flex items-center justify-center shadow-lg shadow-navy/10 shrink-0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Fingerprint className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground leading-none">Consentimentos</h1>
              <p className="text-muted-foreground text-sm font-semibold mt-2.5">
                Gestão de termos de consentimento — LGPD Art. 7º e 11º · <span className="bg-gradient-to-r from-navy to-gold bg-clip-text text-transparent dark:from-navy-200 dark:to-gold-200 font-extrabold">{consents.length} registro{consents.length !== 1 ? 's' : ''}</span>
              </p>
            </div>
          </div>
          <div className="shrink-0 self-start md:self-center">
            <NovoConsentimentoDialog />
          </div>
        </div>
      </div>

      {/* Grid count cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
        {Object.entries(TIPO_LABELS).map(([tipo, label]) => {
          const IconComponent = TIPO_ICONS[tipo] ?? ShieldCheck
          const colorStyles = TIPO_COLORS[tipo] ?? {
            gradient: 'from-muted/20 to-transparent',
            text: 'text-muted-foreground',
            iconBg: 'bg-muted text-muted-foreground',
            border: 'border-border/30',
          }

          return (
            <Card
              key={tipo}
              className={cn(
                "border border-border/40 bg-card/45 backdrop-blur-sm shadow-sm transition-all duration-300 rounded-2xl relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-md",
                colorStyles.border
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none", colorStyles.gradient)} />
              <CardContent className="p-4 flex flex-col gap-3 relative z-10">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate">{label}</span>
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border", colorStyles.iconBg)}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-black tracking-tight tabular-nums text-foreground">{tipoMap[tipo] ?? 0}</p>
                  <span className="text-[10px] text-muted-foreground/60 font-semibold">Ativos e válidos</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="relative z-10 bg-card/45 border border-border/40 rounded-3xl p-5 md:p-6 backdrop-blur-md shadow-sm">
        <ConsentimentosTable initialConsents={serialize(consents) as any} />
      </div>
    </div>
  )
}
