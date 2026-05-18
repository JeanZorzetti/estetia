import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

// Asaas uses a shared access_token header (no HMAC) — validate via env var
const WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN

export async function POST(request: Request) {
  const token = request.headers.get('asaas-access-token')
  if (WEBHOOK_TOKEN && token !== WEBHOOK_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const event = body.event as string
  const payment = body.payment as Record<string, unknown> | undefined
  const subscription = body.subscription as Record<string, unknown> | undefined

  const externalReference = (payment?.externalReference ?? subscription?.externalReference) as string | undefined

  // Find org by externalReference (orgId set when creating customer/subscription)
  let org: { id: string } | null = null
  if (externalReference && !externalReference.startsWith('proration_')) {
    org = await prisma.organization.findUnique({
      where: { id: externalReference },
      select: { id: true },
    })
  }

  switch (event) {
    case 'PAYMENT_CONFIRMED':
    case 'PAYMENT_RECEIVED': {
      if (org) {
        const nextDue = payment?.nextDueDate as string | undefined
        await prisma.organization.update({
          where: { id: org.id },
          data: {
            ...(nextDue ? { billingNextDueDate: new Date(nextDue) } : {}),
          },
        }).catch(() => {})
      }
      await prisma.integrationLog.create({
        data: {
          organizationId: org?.id ?? 'unknown',
          type: 'ASAAS',
          action: `webhook:${event}`,
          status: 'SUCCESS',
          request: JSON.stringify({ event, paymentId: payment?.id }),
          response: JSON.stringify({ orgId: org?.id }),
        },
      }).catch(() => {})
      break
    }

    case 'PAYMENT_OVERDUE': {
      // Grace period — log but don't suspend immediately
      await prisma.integrationLog.create({
        data: {
          organizationId: org?.id ?? 'unknown',
          type: 'ASAAS',
          action: 'webhook:PAYMENT_OVERDUE',
          status: 'FAILED',
          request: JSON.stringify({ event, paymentId: payment?.id }),
          response: JSON.stringify({ orgId: org?.id, action: 'grace_period' }),
        },
      }).catch(() => {})
      break
    }

    case 'SUBSCRIPTION_DELETED': {
      // Only clear org billing fields if the deleted subscription is still the active one.
      // During updates we cancel the old subscription then create a new one — the webhook for
      // the cancelled old sub arrives async and would otherwise wipe the newly-created sub.
      const deletedSubId = subscription?.id as string | undefined
      let skipped = false
      if (org && deletedSubId) {
        const current = await prisma.organization.findUnique({
          where: { id: org.id },
          select: { asaasSubscriptionId: true },
        })
        if (current?.asaasSubscriptionId === deletedSubId) {
          await prisma.organization.update({
            where: { id: org.id },
            data: {
              asaasSubscriptionId: null,
              billingActiveModules: Prisma.JsonNull,
              billingMonthlyTotal: null,
              billingNextDueDate: null,
            },
          }).catch(() => {})
        } else {
          skipped = true
        }
      }
      await prisma.integrationLog.create({
        data: {
          organizationId: org?.id ?? 'unknown',
          type: 'ASAAS',
          action: 'webhook:SUBSCRIPTION_DELETED',
          status: 'SUCCESS',
          request: JSON.stringify({ event, subscriptionId: deletedSubId }),
          response: JSON.stringify({ orgId: org?.id, skipped, reason: skipped ? 'stale_delete_after_replacement' : undefined }),
        },
      }).catch(() => {})
      break
    }

    default:
      // Unknown event — just log
      await prisma.integrationLog.create({
        data: {
          organizationId: org?.id ?? 'unknown',
          type: 'ASAAS',
          action: `webhook:${event}`,
          status: 'SUCCESS',
          request: JSON.stringify({ event }),
          response: '{}',
        },
      }).catch(() => {})
  }

  return NextResponse.json({ received: true })
}
