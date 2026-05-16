import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createInviteWithPrefill } from '@/lib/equipe-clinica/invite-wizard'
import { canManageRole } from '@/lib/role-permissions'
import { OrgRole, UserCategoria } from '@prisma/client'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const actor = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { organization: { select: { name: true } } },
  })
  if (!actor?.organizationId) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const body = await req.json()
  const { email, role, jobTitle, categoria, prefilledData } = body as {
    email: string
    role: OrgRole
    jobTitle?: string
    categoria: UserCategoria
    prefilledData?: Record<string, unknown>
  }

  if (!email || !role || !categoria) {
    return NextResponse.json({ error: 'email, role e categoria são obrigatórios' }, { status: 400 })
  }

  if (!canManageRole(actor.orgRole, role)) {
    return NextResponse.json({ error: 'Sem permissão para convidar com essa função' }, { status: 403 })
  }

  try {
    const invite = await createInviteWithPrefill(
      actor.id,
      actor.organizationId,
      actor.name,
      actor.organization?.name ?? 'Estetia CRM',
      { email, role, jobTitle, categoria, prefilledData }
    )
    return NextResponse.json({ success: true, inviteId: invite.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar convite'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
