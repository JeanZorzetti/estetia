/**
 * Shared helpers for WhatsApp conversation queries.
 *
 * Centralizes the tripled unread/total count logic that previously existed
 * separately in conversations/route.ts and chat/page.tsx. Each site was
 * maintaining 3 SQL branches (Evolution-only, WABA-only, hybrid) — any
 * fix had to be applied twice. This module is the single source of truth.
 */

import { prismaWa } from '@/lib/prisma-wa'

export interface MessageCountParams {
  organizationId: string
  contactIds: string[]
  connectionIds: string[]   // Evolution connection IDs — empty array means no Evolution
  wabaActive: boolean       // true when org has WABA configured
}

export interface MessageCounts {
  unreadMap: Map<string, number>    // contactId → unread INBOUND count
  totalCountMap: Map<string, number> // contactId → total INBOUND count
}

/**
 * Fetch unread and total inbound message counts per contact.
 * Handles three routing scenarios: Evolution-only, WABA-only, hybrid.
 */
export async function fetchMessageCounts({
  organizationId,
  contactIds,
  connectionIds,
  wabaActive,
}: MessageCountParams): Promise<MessageCounts> {
  if (contactIds.length === 0) {
    return { unreadMap: new Map(), totalCountMap: new Map() }
  }

  const hasEvolution = connectionIds.length > 0
  let unreadRows: { contact_id: string; cnt: bigint }[] = []
  let totalRows: { contact_id: string; cnt: bigint }[] = []

  if (hasEvolution && wabaActive) {
    ;[unreadRows, totalRows] = await Promise.all([
      prismaWa.$queryRaw<{ contact_id: string; cnt: bigint }[]>`
        SELECT "contactId" AS contact_id, COUNT(id)::bigint AS cnt
        FROM "WhatsAppMessage"
        WHERE "organizationId" = ${organizationId}
          AND "contactId" = ANY(${contactIds}::text[])
          AND ("connectionId" = ANY(${connectionIds}::text[]) OR "connectionId" IS NULL)
          AND direction = 'INBOUND'
          AND "isRead" = false
        GROUP BY "contactId"
      `,
      prismaWa.$queryRaw<{ contact_id: string; cnt: bigint }[]>`
        SELECT "contactId" AS contact_id, COUNT(id)::bigint AS cnt
        FROM "WhatsAppMessage"
        WHERE "organizationId" = ${organizationId}
          AND "contactId" = ANY(${contactIds}::text[])
          AND ("connectionId" = ANY(${connectionIds}::text[]) OR "connectionId" IS NULL)
          AND direction = 'INBOUND'
        GROUP BY "contactId"
      `,
    ])
  } else if (hasEvolution) {
    ;[unreadRows, totalRows] = await Promise.all([
      prismaWa.$queryRaw<{ contact_id: string; cnt: bigint }[]>`
        SELECT "contactId" AS contact_id, COUNT(id)::bigint AS cnt
        FROM "WhatsAppMessage"
        WHERE "organizationId" = ${organizationId}
          AND "contactId" = ANY(${contactIds}::text[])
          AND "connectionId" = ANY(${connectionIds}::text[])
          AND direction = 'INBOUND'
          AND "isRead" = false
        GROUP BY "contactId"
      `,
      prismaWa.$queryRaw<{ contact_id: string; cnt: bigint }[]>`
        SELECT "contactId" AS contact_id, COUNT(id)::bigint AS cnt
        FROM "WhatsAppMessage"
        WHERE "organizationId" = ${organizationId}
          AND "contactId" = ANY(${contactIds}::text[])
          AND "connectionId" = ANY(${connectionIds}::text[])
          AND direction = 'INBOUND'
        GROUP BY "contactId"
      `,
    ])
  } else {
    // WABA only — connectionId IS NULL
    ;[unreadRows, totalRows] = await Promise.all([
      prismaWa.$queryRaw<{ contact_id: string; cnt: bigint }[]>`
        SELECT "contactId" AS contact_id, COUNT(id)::bigint AS cnt
        FROM "WhatsAppMessage"
        WHERE "organizationId" = ${organizationId}
          AND "contactId" = ANY(${contactIds}::text[])
          AND "connectionId" IS NULL
          AND direction = 'INBOUND'
          AND "isRead" = false
        GROUP BY "contactId"
      `,
      prismaWa.$queryRaw<{ contact_id: string; cnt: bigint }[]>`
        SELECT "contactId" AS contact_id, COUNT(id)::bigint AS cnt
        FROM "WhatsAppMessage"
        WHERE "organizationId" = ${organizationId}
          AND "contactId" = ANY(${contactIds}::text[])
          AND "connectionId" IS NULL
          AND direction = 'INBOUND'
        GROUP BY "contactId"
      `,
    ])
  }

  return {
    unreadMap: new Map(unreadRows.map(r => [r.contact_id, Number(r.cnt)])),
    totalCountMap: new Map(totalRows.map(r => [r.contact_id, Number(r.cnt)])),
  }
}
