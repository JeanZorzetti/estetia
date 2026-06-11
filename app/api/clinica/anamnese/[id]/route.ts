import { NextRequest, NextResponse } from 'next/server'
import { requireClinicalAccess } from '@/lib/clinica/access'
import { prisma } from '@/lib/prisma'
import { logMedicalAccess } from '@/lib/audit/medical-access-log'
import { decrypt } from '@/lib/encryption'

/**
 * GET /api/clinica/anamnese/[id]
 * Returns decrypted anamnesis answers.
 * Access is logged — every read is audited.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const access = await requireClinicalAccess()
  if (!access.ok) return access.response
  const { user } = access

  const anamnesis = await prisma.anamnesis.findFirst({
    where: { id, organizationId: user.organizationId },
  })

  if (!anamnesis) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let respostasDecrypted: unknown
  try {
    respostasDecrypted = JSON.parse(decrypt(anamnesis.respostas))
  } catch {
    return NextResponse.json({ error: 'Decryption failed' }, { status: 500 })
  }

  await logMedicalAccess({
    organizationId: user.organizationId,
    userId: user.id,
    pacienteId: anamnesis.pacienteId,
    recordType: 'Anamnesis',
    recordId: id,
    action: 'VIEW',
  })

  return NextResponse.json({
    anamnesis: {
      id: anamnesis.id,
      pacienteId: anamnesis.pacienteId,
      treatmentId: anamnesis.treatmentId,
      profissionalId: anamnesis.profissionalId,
      templateHash: anamnesis.templateHash,
      preenchidoPor: anamnesis.preenchidoPor,
      assinadoEm: anamnesis.assinadoEm,
      createdAt: anamnesis.createdAt,
      respostas: respostasDecrypted,
    },
  })
}
