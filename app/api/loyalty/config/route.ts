import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LoyaltyConfigSchema } from '@/lib/loyalty/schema'

async function getOrgId() {
  const session = await getSession()
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  return user?.organizationId ?? null
}

export async function GET() {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const config = await prisma.loyaltyConfig.findUnique({
    where: { organizationId: orgId },
  })
  return NextResponse.json({ config })
}

export async function PUT(req: Request) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = LoyaltyConfigSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const config = await prisma.loyaltyConfig.upsert({
    where: { organizationId: orgId },
    create: { organizationId: orgId, ...parsed.data },
    update: parsed.data,
  })
  return NextResponse.json({ config })
}
