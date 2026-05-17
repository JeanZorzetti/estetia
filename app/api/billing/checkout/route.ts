import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createOrgSubscription, updateOrgSubscription } from '@/lib/billing/asaas-orchestrator'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, orgRole: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Org not found' }, { status: 400 })
  if (user.orgRole === 'MEMBER') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: {
    modules: string[]
    cycle: 'MONTHLY' | 'YEARLY'
    cpfCnpj?: string
    extras?: { users: number; rooms: number; profs: number }
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { modules, cycle = 'MONTHLY', cpfCnpj, extras } = body
  if (!Array.isArray(modules) || modules.length === 0) {
    return NextResponse.json({ error: 'modules é obrigatório' }, { status: 400 })
  }

  const org = await prisma.organization.findUnique({
    where: { id: user.organizationId },
    select: { asaasSubscriptionId: true },
  })

  try {
    if (org?.asaasSubscriptionId) {
      const result = await updateOrgSubscription(user.organizationId, modules, extras)
      return NextResponse.json({
        ok: true,
        action: 'updated',
        newSubscriptionId: result.newSubscriptionId,
        prorationR$: result.prorationR$,
        invoiceUrl: result.invoiceUrl,
        monthlyTotal: result.monthlyTotal,
      })
    } else {
      const result = await createOrgSubscription(user.organizationId, modules, cycle, cpfCnpj)
      return NextResponse.json({
        ok: true,
        action: 'created',
        asaasSubscriptionId: result.asaasSubscriptionId,
        invoiceUrl: result.invoiceUrl,
        monthlyTotal: result.monthlyTotal,
      })
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao processar assinatura' },
      { status: 500 },
    )
  }
}
