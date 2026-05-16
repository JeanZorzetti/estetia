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
      organization: { select: { asanaApiKey: true, asanaProjectId: true } },
    },
  })
  const { asanaApiKey, asanaProjectId } = user?.organization ?? {}
  if (!asanaApiKey || !asanaProjectId) {
    return NextResponse.json({ error: 'API key e Project ID obrigatórios' }, { status: 400 })
  }

  try {
    const project = await getAsanaProject(asanaApiKey, asanaProjectId)
    return NextResponse.json({ ok: true, result: { projectName: project.name } })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Falha ao consultar Asana' },
      { status: 502 }
    )
  }
}
