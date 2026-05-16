import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getMicrosoftAuthUrl } from '@/lib/integrations/outlook-calendar-client'

export async function GET(request: Request) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, id: true },
  })
  if (!user?.organizationId) {
    return NextResponse.json({ error: 'Org not found' }, { status: 404 })
  }

  const state = Buffer.from(
    JSON.stringify({ organizationId: user.organizationId, userId: user.id })
  ).toString('base64')

  return NextResponse.redirect(getMicrosoftAuthUrl(state))
}
