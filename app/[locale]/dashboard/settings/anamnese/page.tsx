import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Plus, FileHeart } from 'lucide-react'
import { TemplatesListClient } from '@/components/anamnese/templates-list-client'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

export default async function TemplatesAnamnесePage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const templates = await prisma.anamnesisTemplate.findMany({
    where: { organizationId: user.organizationId },
    orderBy: [{ ativo: 'desc' }, { updatedAt: 'desc' }],
  })

  const totalAtivos = templates.filter((t) => t.ativo).length

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Configurações
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Templates de Anamnese</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Modelos por procedimento ·{' '}
            {totalAtivos > 0
              ? `${totalAtivos} template${totalAtivos !== 1 ? 's' : ''} ativo${totalAtivos !== 1 ? 's' : ''}`
              : 'Nenhum template configurado'}
          </p>
        </div>
        {templates.length > 0 && (
          <Link
            href="/dashboard/settings/anamnese/novo"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Novo Template
          </Link>
        )}
      </div>

      {/* Content */}
      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/40 py-20 px-6 text-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#489FB5]/10 border border-[#489FB5]/20 flex items-center justify-center">
            <FileHeart className="w-7 h-7 text-[#2d7a8e]" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Nenhum template configurado</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              Templates definem as perguntas da ficha de anamnese. Crie um template para cada
              procedimento da sua clínica ou comece com o modelo padrão.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Button asChild className="rounded-xl bg-[#0A1F3D] hover:bg-[#0A1F3D]/85 text-white text-sm font-bold gap-2">
              <Link href="/dashboard/settings/anamnese/novo?source=default">
                <FileHeart className="w-4 h-4" />
                Começar com modelo padrão
              </Link>
            </Button>
            <Button variant="outline" asChild className="rounded-xl text-sm font-semibold">
              <Link href="/dashboard/settings/anamnese/novo">
                <Plus className="w-4 h-4 mr-1.5" />
                Criar do zero
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <TemplatesListClient initialTemplates={serialize(templates) as any} />
      )}
    </div>
  )
}
