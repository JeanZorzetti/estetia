import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TemplateEditorClient } from '@/components/anamnese/template-editor-client'

export const dynamic = 'force-dynamic'

export default async function NovoTemplatePage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>
}) {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const { source } = await searchParams
  const useDefault = source === 'default'

  return (
    <div className="p-6">
      <TemplateEditorClient
        mode="create"
        useDefault={useDefault}
        initialNome={useDefault ? 'Anamnese Padrão' : ''}
      />
    </div>
  )
}
