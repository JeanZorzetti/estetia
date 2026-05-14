import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { prismaWa } from '@/lib/prisma-wa'
import { whatsmeowClient } from '@/lib/integrations/whatsmeow-client'
import { normalizePhoneNumber } from '@/lib/whatsapp-sync'
import { sendHtmlEmail } from '@/lib/email'
import { resolveRecallTemplate } from '@/lib/recall/template'
import logger from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let sent = 0
  let errors = 0
  let skipped = 0

  const organizations = await prisma.organization.findMany({
    select: { id: true, slug: true, name: true },
  })

  for (const org of organizations) {
    const rules = await prisma.recallRule.findMany({
      where: { organizationId: org.id, ativo: true, canal: { not: 'SMS' } },
    })

    for (const rule of rules) {
      const targetDate = new Date()
      targetDate.setDate(targetDate.getDate() - rule.intervaloDias)

      const windowStart = new Date(targetDate)
      windowStart.setDate(windowStart.getDate() - 1)
      const windowEnd = new Date(targetDate)
      windowEnd.setDate(windowEnd.getDate() + 1)

      // Find patients whose last session falls in the window
      const treatmentWhere = rule.procedimentoId
        ? { organizationId: org.id, procedureId: rule.procedimentoId }
        : { organizationId: org.id }

      const sessions = await prisma.treatmentSession.findMany({
        where: {
          organizationId: org.id,
          dataAgendada: { gte: windowStart, lte: windowEnd },
          status: 'REALIZADA',
          treatment: treatmentWhere,
        },
        select: {
          treatment: {
            select: {
              pacienteId: true,
              paciente: { select: { id: true, nome: true, email: true, telefone: true } },
            },
          },
        },
      })

      const uniquePatients = new Map<string, { id: string; nome: string; email: string | null; telefone: string | null }>()
      for (const s of sessions) {
        const p = s.treatment.paciente
        if (p && !uniquePatients.has(p.id)) {
          uniquePatients.set(p.id, p)
        }
      }

      // Filter out patients already recalled by this rule recently
      for (const [patientId, patient] of uniquePatients) {
        const recentLog = await prisma.recallLog.findFirst({
          where: {
            recallRuleId: rule.id,
            patientId,
            enviadoEm: { gte: new Date(Date.now() - rule.intervaloDias * 24 * 60 * 60 * 1000) },
          },
        })
        if (recentLog) {
          skipped++
          continue
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://estetiacrm.com.br'
        const linkAgendamento = `${appUrl}/booking/${org.slug}`

        const procedimentoNome = rule.procedimentoId
          ? (await prisma.procedure.findUnique({ where: { id: rule.procedimentoId }, select: { nome: true } }))?.nome
          : undefined

        const message = resolveRecallTemplate(rule.template, {
          paciente_nome: patient.nome,
          procedimento: procedimentoNome,
          dias_sem_visita: rule.intervaloDias,
          link_agendamento: linkAgendamento,
        })

        let success = false
        const logStatus: 'ENVIADO' | 'ERRO' = 'ENVIADO'

        try {
          if (rule.canal === 'WHATSAPP') {
            if (!patient.telefone) {
              skipped++
              continue
            }
            const connection = await prismaWa.whatsAppConnection.findFirst({
              where: { organizationId: org.id, status: 'CONNECTED' },
            })
            if (!connection) {
              skipped++
              continue
            }
            const phone = normalizePhoneNumber(patient.telefone)
            await whatsmeowClient.sendText(connection.instanceName, phone, message)
            success = true
          } else if (rule.canal === 'EMAIL') {
            if (!patient.email) {
              skipped++
              continue
            }
            const result = await sendHtmlEmail({
              to: patient.email,
              subject: `${rule.nome ?? 'Lembrete de visita'} — ${org.name}`,
              html: `<p style="font-family:sans-serif;line-height:1.6">${message.replace(/\n/g, '<br>')}</p>`,
            })
            success = result.success
          }
        } catch (e) {
          logger.error({ ruleId: rule.id, patientId, error: e }, 'Recall send error')
          errors++
        }

        await prisma.recallLog.create({
          data: {
            recallRuleId: rule.id,
            patientId,
            status: success ? 'ENVIADO' : 'ERRO',
            canal: rule.canal,
          },
        })

        if (success) sent++
        else if (!success) errors++
      }
    }
  }

  logger.info({ sent, errors, skipped }, 'Recall cron completed')
  return NextResponse.json({ ok: true, sent, errors, skipped })
}

// Allow GET for health-check
export async function GET(req: NextRequest) {
  return POST(req)
}
