import { NextResponse } from 'next/server'
import { processPendingFlows } from '@/lib/automation/whatsapp-flows-estetica'
import logger from '@/lib/logger'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// GET /api/cron/whatsapp-flows-estetica
// Called by Vercel Cron every 30 minutes
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const stats = await processPendingFlows()
    logger.info({ stats }, 'WhatsApp flows estetica processed')
    return NextResponse.json({ ok: true, ...stats })
  } catch (err) {
    logger.error({ err }, 'WhatsApp flows estetica cron failed')
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
