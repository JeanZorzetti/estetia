import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getMicrosoftAuthUrl } from '@/lib/integrations/outlook-calendar-client'

export async function GET(request: Request) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      organizationId: true,
      organization: {
        select: {
          outlookClientId: true,
          outlookClientSecret: true,
          outlookTenantId: true,
        },
      },
    },
  })

  const redirectBase = new URL(
    '/dashboard/settings/integrations/outlook-calendar',
    request.url
  )

  const org = user?.organization
  if (!user?.organizationId || !org?.outlookClientId || !org?.outlookClientSecret || !org?.outlookTenantId) {
    redirectBase.searchParams.set('error', 'missing_credentials')
    return NextResponse.redirect(redirectBase)
  }

  const state = Buffer.from(
    JSON.stringify({ organizationId: user.organizationId, userId: user.id })
  ).toString('base64')

  const redirectUri = new URL('/api/integrations/outlook-calendar/callback', request.url).toString()

  const authUrl = getMicrosoftAuthUrl(state, {
    clientId: org.outlookClientId,
    clientSecret: decrypt(org.outlookClientSecret),
    tenantId: org.outlookTenantId,
    redirectUri,
  })

  return NextResponse.redirect(authUrl)
}
