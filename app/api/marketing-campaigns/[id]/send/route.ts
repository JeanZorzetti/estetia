import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SegmentSchema } from '@/lib/marketing-campaigns/schema'

async function getOrgId() {
  const session = await getSession()
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  return user?.organizationId ?? null
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const campaign = await prisma.marketingCampaign.findFirst({
    where: { id, organizationId: orgId },
  })
  if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (campaign.status === 'ENVIADA' || campaign.status === 'ENVIANDO') {
    return NextResponse.json({ error: 'Already sent' }, { status: 409 })
  }

  // Mark as sending
  await prisma.marketingCampaign.update({
    where: { id },
    data: { status: 'ENVIANDO' },
  })

  // Calculate recipients
  const segment = SegmentSchema.parse(campaign.segmento ?? {})
  const where: Record<string, unknown> = { organizationId: orgId }
  if (segment.tags?.length) where.tags = { hasSome: segment.tags }
  if (segment.origem) where.origem = segment.origem
  if (segment.inativosDias && segment.inativosDias > 0) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - segment.inativosDias)
    where.updatedAt = { lte: cutoff }
  }

  const totalDestinatarios = await prisma.patient.count({ where })

  // TODO: Integrate real WhatsApp/Email sending engine here.
  // When ready, loop over patients and call WhatsApp Cloud API or Resend.
  console.log(`[STUB] Enviaria ${totalDestinatarios} mensagens via ${campaign.canal} para campanha "${campaign.nome}"`)

  const updated = await prisma.marketingCampaign.update({
    where: { id },
    data: {
      status: 'ENVIADA',
      enviadoEm: new Date(),
      totalDestinatarios,
      totalEnviados: totalDestinatarios,
      totalFalhas: 0,
    },
  })

  return NextResponse.json({ campaign: updated })
}
