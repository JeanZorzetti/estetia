import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { NovoPacienteForm } from '@/components/pacientes/novo-paciente-form'

export const dynamic = 'force-dynamic'

export default async function NovoPacientePage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Novo Paciente</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Preencha os dados para cadastrar um novo paciente na clínica.
        </p>
      </div>

      <NovoPacienteForm />
    </div>
  )
}
