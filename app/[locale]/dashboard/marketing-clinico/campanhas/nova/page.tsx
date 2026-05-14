import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { CampaignForm } from '@/components/marketing-clinico/campaigns/campaign-form'

export default async function NovaCampanhaPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div>
        <Link
          href="/dashboard/marketing-clinico/campanhas"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Campanhas
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Nova Campanha</h1>
        <p className="text-muted-foreground text-sm mt-1">Crie uma campanha de mensagens para seus pacientes</p>
      </div>

      <CampaignForm />
    </div>
  )
}
