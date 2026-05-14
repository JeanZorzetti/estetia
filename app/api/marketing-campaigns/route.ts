import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CreateCampaignSchema } from '@/lib/marketing-campaigns/schema'

async function getOrgId() {
  const session = await getSession()
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  return user?.organizationId ?? null
}

export async function GET(req: Request) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const where: Record<string, unknown> = { organizationId: orgId }
  if (status) where.status = status

  const campaigns = await prisma.marketingCampaign.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  return NextResponse.json({ campaigns })
}

export async function POST(req: Request) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = CreateCampaignSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const campaign = await prisma.marketingCampaign.create({
    data: {
      organizationId: orgId,
      nome: parsed.data.nome,
      canal: parsed.data.canal,
      segmento: parsed.data.segmento as object,
      mensagem: parsed.data.mensagem,
      agendadoPara: parsed.data.agendadoPara ? new Date(parsed.data.agendadoPara) : null,
      status: parsed.data.agendadoPara ? 'AGENDADA' : 'RASCUNHO',
    },
  })
  return NextResponse.json({ campaign }, { status: 201 })
}
