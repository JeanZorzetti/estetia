import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getAsanaProject } from '@/lib/integrations/asana-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: { select: { id: true, asanaApiKey: true, asanaProjectId: true } },
    },
  })
  const org = user?.organization
  const orgId = org?.id ?? ''
  const { asanaApiKey, asanaProjectId } = org ?? {}
  if (!asanaApiKey || !asanaProjectId) {
    return NextResponse.json({ error: 'API key e Project ID obrigatórios' }, { status: 400 })
  }

  try {
    const project = await getAsanaProject(asanaApiKey, asanaProjectId)
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'ASANA',
        action: 'test:connection',
        status: 'SUCCESS',
        request: {} as never,
        response: { ok: true, projectName: project.name } as never,
      },
    }).catch(() => {})
    return NextResponse.json({ ok: true, result: { projectName: project.name } })
  } catch (err) {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'ASANA',
        action: 'test:connection',
        status: 'FAILED',
        request: {} as never,
        response: { error: err instanceof Error ? err.message : String(err) } as never,
      },
    }).catch(() => {})
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Falha ao consultar Asana' },
      { status: 502 }
    )
  }
}
