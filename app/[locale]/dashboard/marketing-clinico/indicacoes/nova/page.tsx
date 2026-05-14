import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ReferralForm } from '@/components/marketing-clinico/referrals/referral-form'

export default async function NovaIndicacaoPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div>
        <Link
          href="/dashboard/marketing-clinico/indicacoes"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Indicações
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Nova Indicação</h1>
        <p className="text-muted-foreground text-sm mt-1">Registre uma indicação de paciente para paciente</p>
      </div>

      <ReferralForm />
    </div>
  )
}
