import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { TemplateEditorClient } from '@/components/anamnese/template-editor-client'
import type { AnamnesisTemplate } from '@/components/anamnese/form-builder'

export const dynamic = 'force-dynamic'

const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

export default async function EditarTemplatePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { id } = await params

  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const template = await prisma.anamnesisTemplate.findFirst({
    where: { id, organizationId: user.organizationId },
  })
  if (!template) notFound()

  const s = serialize(template)

  return (
    <div className="p-6">
      <TemplateEditorClient
        mode="edit"
        templateId={template.id}
        initialNome={s.nome}
        initialProcedimento={s.procedimento ?? ''}
        initialDescricao={s.descricao ?? ''}
        initialTemplate={s.template as unknown as AnamnesisTemplate}
      />
    </div>
  )
}
