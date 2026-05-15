import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getMediaUrl } from '@/lib/storage'
import { ProfessionalForm } from '@/components/profissionais/professional-form'
import { DEFAULT_HORARIO } from '@/lib/profissionais/schema'

export default async function EditarProfissionalPage({
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

  const [professional, users, procedures] = await Promise.all([
    prisma.professional.findFirst({
      where: { id, organizationId: user.organizationId },
    }),
    prisma.user.findMany({
      where: { organizationId: user.organizationId },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    }),
    prisma.procedure.findMany({
      where: { organizationId: user.organizationId, ativo: true },
      select: { id: true, nome: true, categoria: true },
      orderBy: { nome: 'asc' },
    }),
  ])
  if (!professional) notFound()

  let initialPhotoSignedUrl: string | null = null
  if (professional.fotoUrl) {
    try { initialPhotoSignedUrl = await getMediaUrl(professional.fotoUrl) } catch { /* ignore */ }
  }

  const initialData = {
    id: professional.id,
    nome: professional.nome,
    conselho: professional.conselho as any,
    numeroConselho: professional.numeroConselho ?? '',
    ufConselho: professional.ufConselho ?? '',
    conselhoStatus: (professional.conselhoStatus ?? '') as any,
    especialidades: professional.especialidades,
    bio: professional.bio ?? '',
    fotoUrl: professional.fotoUrl ?? '',
    cargaHoraria: (professional.cargaHoraria as any) ?? DEFAULT_HORARIO,
    procedimentosHabilitadosIds: professional.procedimentosHabilitadosIds,
    userId: professional.userId ?? '',
    ativo: professional.ativo,
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div>
        <Link
          href="/dashboard/settings/profissionais"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Editar Profissional</h1>
        <p className="text-muted-foreground text-sm mt-1">{professional.nome}</p>
      </div>

      <ProfessionalForm
        initialData={initialData}
        initialPhotoSignedUrl={initialPhotoSignedUrl}
        users={users}
        procedures={procedures}
      />
    </div>
  )
}
