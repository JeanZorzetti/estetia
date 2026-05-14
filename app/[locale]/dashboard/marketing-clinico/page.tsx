import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Marketing Clínico</h1>
        <p className="text-muted-foreground text-sm mt-1">Campanhas, fidelidade e indicações</p>
      </div>
      <div className="rounded-lg border border-dashed border-border p-12 flex flex-col items-center justify-center gap-3 text-center">
        <p className="text-muted-foreground text-sm">Em desenvolvimento</p>
        <p className="text-xs text-muted-foreground/60">Esta funcionalidade estará disponível em breve.</p>
      </div>
    </div>
  )
}
