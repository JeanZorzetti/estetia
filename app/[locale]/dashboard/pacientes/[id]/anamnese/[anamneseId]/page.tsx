import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { logMedicalAccess } from '@/lib/audit/medical-access-log'
import { decrypt } from '@/lib/encryption'
import { AnamnesisFormBuilder, type AnamnesisTemplate } from '@/components/anamnese/form-builder'
import { Award, Shield } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function VisualizarAnamnesePage({
  params,
}: {
  params: Promise<{ locale: string; id: string; anamneseId: string }>
}) {
  const { id: pacienteId, anamneseId } = await params

  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const anamnesis = await prisma.anamnesis.findFirst({
    where: { id: anamneseId, pacienteId, organizationId: user.organizationId },
    include: { profissional: { select: { nome: true } } },
  })
  if (!anamnesis) notFound()

  let respostas: Record<string, unknown> = {}
  try {
    const raw = decrypt(anamnesis.respostas)
    const parsed = JSON.parse(raw)
    respostas = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    // encrypted but unreadable — show empty
  }

  const templateRecord = await prisma.anamnesisTemplate.findFirst({
    where: { organizationId: user.organizationId, ativo: true },
    orderBy: { updatedAt: 'desc' },
    select: { template: true },
  })

  const templateData =
    templateRecord?.template &&
    typeof templateRecord.template === 'object' &&
    !Array.isArray(templateRecord.template) &&
    templateRecord.template !== null
      ? (templateRecord.template as unknown as AnamnesisTemplate)
      : null

  await logMedicalAccess({
    organizationId: user.organizationId,
    userId: user.id,
    pacienteId,
    recordType: 'Anamnesis',
    recordId: anamneseId,
    action: 'VIEW',
    metadata: { page: 'anamnese-view' },
  })

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-teal-500" />
            <h2 className="text-sm font-black text-foreground">Anamnese Clínico-Estética</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Preenchida em {new Date(anamnesis.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            {anamnesis.profissional && ` · Profissional: ${anamnesis.profissional.nome}`}
          </p>
        </div>
        {anamnesis.assinadoEm && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            Assinada digitalmente em {new Date(anamnesis.assinadoEm).toLocaleDateString('pt-BR')}
          </div>
        )}
      </div>

      {templateData ? (
        <AnamnesisFormBuilder
          template={templateData}
          onSubmit={async () => {}}
          readOnly
          initialValues={respostas}
        />
      ) : (
        <div className="bg-card/45 border border-border/40 rounded-2xl p-6">
          <p className="text-sm font-bold text-foreground mb-4">Respostas registradas</p>
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-muted/30 rounded-xl p-4">
            {JSON.stringify(respostas, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
