import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { OperadoraForm } from '@/components/financeiro/operadoras/operadora-form'

export default async function NovaOperadoraPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div>
        <Link
          href="/dashboard/financeiro/operadoras"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Nova Operadora</h1>
        <p className="text-muted-foreground text-sm mt-1">Cadastre uma operadora de saúde, convênio ou particular</p>
      </div>

      <OperadoraForm />
    </div>
  )
}
