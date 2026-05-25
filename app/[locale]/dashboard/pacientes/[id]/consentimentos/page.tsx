import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { logMedicalAccess } from '@/lib/audit/medical-access-log'
import { ConsentimentoCard } from '@/components/pacientes/consentimentos/consentimento-card'
import { EmptyState } from '@/components/pacientes/shared/empty-state'
import { Shield } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ConsentimentosPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { id: pacienteId } = await params

  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const patient = await prisma.patient.findFirst({
    where: { id: pacienteId, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!patient) notFound()

  const consentLogs = await prisma.consentLog.findMany({
    where: { pacienteId, organizationId: user.organizationId },
    select: { id: true, tipo: true, aceitoEm: true, revokedAt: true },
    orderBy: { aceitoEm: 'desc' },
  })

  await logMedicalAccess({
    organizationId: user.organizationId,
    userId: user.id,
    pacienteId,
    recordType: 'Patient',
    recordId: pacienteId,
    action: 'VIEW',
    metadata: { page: 'consentimentos' },
  })

  const active = consentLogs.filter(c => !c.revokedAt)
  const revoked = consentLogs.filter(c => c.revokedAt)

  const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-sm font-black text-foreground">Consentimentos LGPD</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Termos de privacidade, uso de imagem e autorização de procedimentos</p>
      </div>

      {consentLogs.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="Nenhum consentimento registrado"
          description="Termos de privacidade LGPD e imagem do paciente aparecerão aqui"
        />
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                Ativos ({active.length})
              </p>
              <div className="space-y-3">
                {serialize(active).map((c: typeof consentLogs[number]) => (
                  <ConsentimentoCard key={c.id} consent={c} />
                ))}
              </div>
            </div>
          )}

          {revoked.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                Revogados ({revoked.length})
              </p>
              <div className="space-y-3">
                {serialize(revoked).map((c: typeof consentLogs[number]) => (
                  <ConsentimentoCard key={c.id} consent={c} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
