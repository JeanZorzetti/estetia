import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Sparkles } from 'lucide-react'
import { ProcedureForm } from '@/components/procedimentos/procedure-form'

export default async function EditarProcedimentoPage({
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

  const procedure = await prisma.procedure.findFirst({
    where: { id, organizationId: user.organizationId },
  })
  if (!procedure) notFound()

  const serialized = {
    id: procedure.id,
    nome: procedure.nome,
    categoria: procedure.categoria,
    descricao: procedure.descricao,
    duracaoMinutos: procedure.duracaoMinutos,
    valorPadrao: procedure.valorPadrao != null ? Number(procedure.valorPadrao) : null,
    contraindicacoesGerais: procedure.contraindicacoesGerais as string[],
    preCuidados: procedure.preCuidados,
    posCuidados: procedure.posCuidados,
    exigeAnamneseEspecifica: procedure.exigeAnamneseEspecifica,
    profissionaisHabilitadosIds: procedure.profissionaisHabilitadosIds,
    ativo: procedure.ativo,
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-3xl relative overflow-visible">
      {/* Premium multi-layered decorative gradient glows */}
      <div className="absolute top-0 right-0 w-[550px] h-[350px] bg-gradient-to-bl from-teal-500/15 via-navy-500/5 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-gradient-to-tr from-gold-500/8 via-navy-500/3 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Header and navigation card */}
      <div className="relative z-10 bg-card/45 border border-border/40 rounded-3xl p-5 md:p-6 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <Link
            href="/dashboard/procedimentos"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-muted-foreground hover:text-teal dark:hover:text-teal-400 transition-colors duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar para Procedimentos
          </Link>
          <span className="flex items-center gap-1 text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest bg-teal-500/10 border border-teal-500/15 px-3 py-1 rounded-full shadow-inner select-none">
            <Sparkles className="w-3 h-3 text-teal-500 animate-pulse" />
            Configuração
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-navy via-navy-600 to-teal-500 border border-navy-500/20 flex items-center justify-center shadow-lg shadow-navy/10 shrink-0 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground leading-none">Editar Procedimento</h1>
            <p className="text-muted-foreground text-sm font-bold mt-2 bg-gradient-to-r from-navy to-gold bg-clip-text text-transparent dark:from-navy-200 dark:to-gold-200 leading-normal">{procedure.nome}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <ProcedureForm initialData={serialized} />
      </div>
    </div>
  )
}
