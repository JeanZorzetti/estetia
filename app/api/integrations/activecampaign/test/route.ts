import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createActiveCampaignClient } from '@/lib/integrations/activecampaign-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: { activecampaignApiKey: true, activecampaignUrl: true },
      },
    },
  })

  const org = user?.organization
  if (!org?.activecampaignApiKey || !org?.activecampaignUrl) {
    return NextResponse.json({ error: 'API Key e URL da conta não configurados' }, { status: 400 })
  }

  try {
    const client = createActiveCampaignClient(org.activecampaignApiKey, org.activecampaignUrl)
    const user = await client.getAccountInfo()
    return NextResponse.json({ ok: true, user })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao conectar ao ActiveCampaign' },
      { status: 400 }
    )
  }
}
