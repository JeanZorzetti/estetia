/**
 * Shared settings POST handler factory.
 *
 * Each integration's /settings/route.ts can call:
 *   export const POST = makeSettingsHandler(...)
 *
 * Reduces boilerplate from ~30 lines to ~5 lines per integration.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildSettingsData, type CredentialFieldSpec } from './generic-credential-helpers'

interface Spec {
  enabledColumn: string
  fields: CredentialFieldSpec[]
}

export function makeSettingsHandler(spec: Spec) {
  return async function POST(req: NextRequest) {
    const session = await getSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { organizationId: true },
    })
    if (!user?.organizationId) {
      return NextResponse.json({ error: 'Org not found' }, { status: 404 })
    }
    const body = await req.json()
    const data = buildSettingsData(body, spec.enabledColumn, spec.fields)
    await prisma.organization.update({ where: { id: user.organizationId }, data })
    return NextResponse.json({ ok: true })
  }
}

/**
 * Generic test handler that just verifies a sensitive credential is set.
 * For integrations without a real API to ping, returns ok if column has value.
 */
export function makeStubTestHandler(credentialColumn: string, integrationType?: string) {
  return async function POST() {
    const session = await getSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        organization: {
          select: {
            id: true,
            [credentialColumn]: true,
          } as Record<string, true>,
        },
      },
    })
    const org = user?.organization as (Record<string, unknown> & { id?: string }) | undefined
    const val = org?.[credentialColumn]
    const orgId = org?.id ?? ''
    if (!val) {
      return NextResponse.json({ error: 'Credencial não configurada' }, { status: 400 })
    }
    if (integrationType && orgId) {
      await prisma.integrationLog.create({
        data: {
          organizationId: orgId,
          type: integrationType as never,
          action: 'test:connection',
          status: 'SUCCESS',
          request: {} as never,
          response: { stored: true } as never,
        },
      }).catch(() => {})
    }
    return NextResponse.json({
      ok: true,
      result: { stored: true, note: 'Credencial validada (sem teste de API real)' },
    })
  }
}
