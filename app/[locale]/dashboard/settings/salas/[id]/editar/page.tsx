import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { SalaForm } from '@/components/salas/sala-form'
import { DEFAULT_HORARIO } from '@/lib/profissionais/schema'

export default async function EditarSalaPage({
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
  const sala = await prisma.clinicRoom.findFirst({
    where: { id, organizationId: user.organizationId },
  })
  if (!sala) notFound()

  const initialData = {
    id: sala.id,
    nome: sala.nome,
    tipo: sala.tipo as 'CONSULTA' | 'PROCEDIMENTO' | 'LASER' | 'PEELING' | 'RECUPERACAO',
    equipamentos: sala.equipamentos,
    cor: sala.cor ?? '',
    capacidade: sala.capacidade,
    disponibilidade: (sala.disponibilidade as any) ?? DEFAULT_HORARIO,
    ativo: sala.ativo,
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div>
        <Link
          href="/dashboard/settings/salas"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Editar Sala</h1>
        <p className="text-muted-foreground text-sm mt-1">{sala.nome}</p>
      </div>

      <SalaForm initialData={initialData} />
    </div>
  )
}
