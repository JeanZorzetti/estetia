import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidateDashboardUser } from '@/lib/dashboard-user'
import {
  createOrgSubscription,
  updateOrgSubscription,
} from '@/lib/billing/asaas-orchestrator'

const Body = z.object({
  slug: z.string().min(1),
})

/**
 * Adds a single module to the current modular subscription.
 * - If the org has no Asaas subscription yet: creates one with [base, slug].
 * - Otherwise: appends slug to billingActiveModules and updates Asaas (with proration).
 *
 * Auth: OWNER or GERENTE only.
 */
export async function POST(req: Request) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = Body.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }
  const { slug } = parsed.data

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, orgRole: true, email: true },
  })
  if (!user?.organizationId) {
    return NextResponse.json({ error: 'Org não encontrada' }, { status: 404 })
  }
  if (user.orgRole !== 'OWNER' && user.orgRole !== 'GERENTE') {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  const module_ = await prisma.pricingModule.findUnique({ where: { slug } })
  if (!module_ || !module_.ativo) {
    return NextResponse.json({ error: 'Módulo inválido' }, { status: 404 })
  }

  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: user.organizationId },
    select: {
      asaasSubscriptionId: true,
      billingActiveModules: true,
      billingCycle: true,
      cnpj: true,
    },
  })

  const current = Array.isArray(org.billingActiveModules)
    ? (org.billingActiveModules as string[]).filter((s): s is string => typeof s === 'string')
    : []

  if (current.includes(slug)) {
    return NextResponse.json({ ok: true, alreadyActive: true })
  }

  const next = current.length > 0 ? [...current, slug] : ['base', slug]

  try {
    if (!org.asaasSubscriptionId) {
      const result = await createOrgSubscription(
        user.organizationId,
        next,
        (org.billingCycle as 'MONTHLY' | 'YEARLY' | null) ?? 'MONTHLY',
        org.cnpj ?? undefined,
      )
      await revalidateDashboardUser(user.email)
      return NextResponse.json({
        ok: true,
        action: 'created',
        invoiceUrl: result.invoiceUrl,
        monthlyTotal: result.monthlyTotal,
      })
    }

    const result = await updateOrgSubscription(user.organizationId, next)
    await revalidateDashboardUser(user.email)
    return NextResponse.json({
      ok: true,
      action: 'updated',
      invoiceUrl: result.invoiceUrl,
      monthlyTotal: result.monthlyTotal,
      prorationR$: result.prorationR$,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Falha ao atualizar assinatura' },
      { status: 500 },
    )
  }
}
