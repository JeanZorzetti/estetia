/**
 * WhatsApp automation flows for Estética & Dermatologia CRM.
 * Uses the existing Meta Cloud API client (lib/integrations/whatsapp-official-client.ts).
 *
 * Flows implemented:
 *  - T-48h: confirmation request with quick-reply buttons
 *  - T-24h: reminder + pre-care instructions
 *  - T+2h:  post-care instructions
 *  - T+30d: result photo follow-up + NPS
 *  - Recall: "time to maintain your result" (configurable window)
 */

import { getWhatsAppOfficialClient, normalizePhone } from '@/lib/integrations/whatsapp-official-client'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SessionFlowContext {
  sessionId: string
  organizationId: string
  pacienteNome: string
  pacienteTelefone: string
  profissionalNome: string
  procedimentoNome: string
  dataAgendada: Date
  preCuidados?: string | null
  posCuidados?: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getFlowContext(sessionId: string, organizationId: string): Promise<SessionFlowContext | null> {
  const session = await prisma.treatmentSession.findFirst({
    where: { id: sessionId, organizationId },
    include: {
      treatment: {
        include: {
          paciente: { select: { nome: true, telefone: true } },
          profissionalResponsavel: { select: { nome: true } },
        },
      },
      profissional: { select: { nome: true } },
    },
  })

  if (!session?.treatment?.paciente?.telefone) return null

  // Look up procedure pre/post care from treatments tipo
  const procedimentoNome = session.treatment.descricaoCustomizada
    ?? formatTreatmentType(session.treatment.tipoTratamento)

  // Try to find matching procedure for care instructions
  const procedure = await prisma.procedure.findFirst({
    where: {
      organizationId,
      nome: { contains: procedimentoNome, mode: 'insensitive' },
    },
    select: { preCuidados: true, posCuidados: true },
  })

  const profissionalNome =
    session.profissional?.nome ??
    session.treatment.profissionalResponsavel?.nome ??
    'Profissional'

  return {
    sessionId,
    organizationId,
    pacienteNome: session.treatment.paciente.nome,
    pacienteTelefone: session.treatment.paciente.telefone,
    profissionalNome,
    procedimentoNome,
    dataAgendada: session.dataAgendada,
    preCuidados: procedure?.preCuidados,
    posCuidados: procedure?.posCuidados,
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}

function formatTreatmentType(tipo: string): string {
  const map: Record<string, string> = {
    BOTOX: 'Toxina Botulínica',
    PREENCHIMENTO: 'Preenchimento',
    LASER: 'Laser',
    PEELING: 'Peeling',
    HARMONIZACAO_FACIAL: 'Harmonização Facial',
    LIMPEZA_PELE: 'Limpeza de Pele',
    MICROAGULHAMENTO: 'Microagulhamento',
    CRIOLIPOLISE: 'Criolipólise',
    RADIOFREQUENCIA: 'Radiofrequência',
    LUZ_PULSADA: 'Luz Pulsada',
    DEPILACAO_LASER: 'Depilação a Laser',
    SKINBOOSTER: 'Skinbooster',
    FIOS_PDO: 'Fios de PDO',
    BICHECTOMIA: 'Bichectomia',
    RINOPLASTIA_NONCIRURGICA: 'Rinoplastia não-cirúrgica',
    OUTROS: 'Procedimento',
  }
  return map[tipo] ?? tipo
}

// ─── Flow: T-48h Confirmation ─────────────────────────────────────────────────

export async function sendConfirmationRequest(
  sessionId: string,
  organizationId: string
): Promise<boolean> {
  try {
    const ctx = await getFlowContext(sessionId, organizationId)
    if (!ctx) return false

    const client = await getWhatsAppOfficialClient(organizationId)
    if (!client) {
      logger.warn({ organizationId }, 'WhatsApp not configured for org')
      return false
    }

    const phone = normalizePhone(ctx.pacienteTelefone)
    const dataFormatada = formatDate(ctx.dataAgendada)

    // Send interactive message with confirmation buttons
    await client.sendTemplateMessage({
      to: phone,
      templateName: 'confirmacao_consulta_estetica',
      language: 'pt_BR',
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: ctx.pacienteNome.split(' ')[0] },
            { type: 'text', text: ctx.procedimentoNome },
            { type: 'text', text: dataFormatada },
            { type: 'text', text: ctx.profissionalNome },
          ],
        },
      ],
    })

    // Log the automation
    await prisma.integrationLog.create({
      data: {
        organizationId,
        integrationType: 'WHATSAPP',
        eventType: 'SESSION_CONFIRMATION_SENT',
        status: 'SUCCESS',
        metadata: { sessionId, phone, flow: 'T-48h' },
      } as Parameters<typeof prisma.integrationLog.create>[0]['data'],
    })

    return true
  } catch (err) {
    logger.error({ err, sessionId }, 'Failed to send confirmation request')
    return false
  }
}

// ─── Flow: T-24h Reminder + Pre-care ─────────────────────────────────────────

export async function sendPreCareReminder(
  sessionId: string,
  organizationId: string
): Promise<boolean> {
  try {
    const ctx = await getFlowContext(sessionId, organizationId)
    if (!ctx) return false

    const client = await getWhatsAppOfficialClient(organizationId)
    if (!client) return false

    const phone = normalizePhone(ctx.pacienteTelefone)
    const primeiroNome = ctx.pacienteNome.split(' ')[0]

    const preCuidados = ctx.preCuidados
      ?? 'Evite exposição solar 48h antes. Não use retinóides 3 dias antes. Venha com rosto limpo e sem maquiagem.'

    const mensagem = `Olá ${primeiroNome}! 🌸

Lembrando que amanhã você tem ${ctx.procedimentoNome} marcado às ${ctx.dataAgendada.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })}h com ${ctx.profissionalNome}.

*Cuidados antes do procedimento:*
${preCuidados}

Até amanhã! ✨`

    await client.sendTextMessage(phone, mensagem)

    await prisma.integrationLog.create({
      data: {
        organizationId,
        integrationType: 'WHATSAPP',
        eventType: 'PRE_CARE_REMINDER_SENT',
        status: 'SUCCESS',
        metadata: { sessionId, phone, flow: 'T-24h' },
      } as Parameters<typeof prisma.integrationLog.create>[0]['data'],
    })

    return true
  } catch (err) {
    logger.error({ err, sessionId }, 'Failed to send pre-care reminder')
    return false
  }
}

// ─── Flow: T+2h Post-care Instructions ───────────────────────────────────────

export async function sendPostCareInstructions(
  sessionId: string,
  organizationId: string
): Promise<boolean> {
  try {
    const ctx = await getFlowContext(sessionId, organizationId)
    if (!ctx) return false

    const client = await getWhatsAppOfficialClient(organizationId)
    if (!client) return false

    const phone = normalizePhone(ctx.pacienteTelefone)
    const primeiroNome = ctx.pacienteNome.split(' ')[0]

    const posCuidados = ctx.posCuidados
      ?? 'Aplique protetor solar FPS 50+ hoje. Evite calor excessivo, sauna e exercícios intensos por 24h. Não manipule a área tratada.'

    const mensagem = `${primeiroNome}, seu ${ctx.procedimentoNome} foi concluído! 💆‍♀️

*Cuidados para as próximas horas:*
${posCuidados}

Qualquer dúvida, estamos aqui! 💬`

    await client.sendTextMessage(phone, mensagem)

    return true
  } catch (err) {
    logger.error({ err, sessionId }, 'Failed to send post-care instructions')
    return false
  }
}

// ─── Flow: T+30d Result Follow-up + NPS ──────────────────────────────────────

export async function sendResultFollowUp(
  sessionId: string,
  organizationId: string
): Promise<boolean> {
  try {
    const ctx = await getFlowContext(sessionId, organizationId)
    if (!ctx) return false

    const client = await getWhatsAppOfficialClient(organizationId)
    if (!client) return false

    const phone = normalizePhone(ctx.pacienteTelefone)
    const primeiroNome = ctx.pacienteNome.split(' ')[0]

    const mensagem = `${primeiroNome}, faz 30 dias desde o seu ${ctx.procedimentoNome}! ✨

Como está o resultado? Ficamos felizes em saber que tudo correu bem!

De 0 a 10, qual nota você daria para o seu atendimento?

Sua avaliação nos ajuda a melhorar cada vez mais! 🙏`

    await client.sendTextMessage(phone, mensagem)

    await prisma.integrationLog.create({
      data: {
        organizationId,
        integrationType: 'WHATSAPP',
        eventType: 'RESULT_FOLLOWUP_SENT',
        status: 'SUCCESS',
        metadata: { sessionId, phone, flow: 'T+30d' },
      } as Parameters<typeof prisma.integrationLog.create>[0]['data'],
    })

    return true
  } catch (err) {
    logger.error({ err, sessionId }, 'Failed to send result follow-up')
    return false
  }
}

// ─── Flow: Recall (configurable window) ──────────────────────────────────────

export async function sendRecallMessage(
  pacienteId: string,
  organizationId: string,
  procedimentoNome: string,
  mesesDesdeUltimo: number
): Promise<boolean> {
  try {
    const paciente = await prisma.patient.findFirst({
      where: { id: pacienteId, organizationId },
      select: { nome: true, telefone: true },
    })
    if (!paciente?.telefone) return false

    const client = await getWhatsAppOfficialClient(organizationId)
    if (!client) return false

    const phone = normalizePhone(paciente.telefone)
    const primeiroNome = paciente.nome.split(' ')[0]

    const mensagem = `Olá ${primeiroNome}! 💛

Faz ${mesesDesdeUltimo} ${mesesDesdeUltimo === 1 ? 'mês' : 'meses'} desde o seu último ${procedimentoNome}.

Está na hora de manter o resultado! Que tal agendar sua sessão de manutenção?

Responda essa mensagem ou acesse nosso link de agendamento para escolher o melhor horário. 📅`

    await client.sendTextMessage(phone, mensagem)

    await prisma.integrationLog.create({
      data: {
        organizationId,
        integrationType: 'WHATSAPP',
        eventType: 'RECALL_SENT',
        status: 'SUCCESS',
        metadata: { pacienteId, phone, procedimentoNome, mesesDesdeUltimo },
      } as Parameters<typeof prisma.integrationLog.create>[0]['data'],
    })

    return true
  } catch (err) {
    logger.error({ err, pacienteId }, 'Failed to send recall message')
    return false
  }
}

// ─── Cron: Process pending flows ─────────────────────────────────────────────
// Called by app/api/cron/whatsapp-flows-estetica/route.ts

export async function processPendingFlows(organizationId?: string): Promise<{
  confirmations: number
  preCare: number
  postCare: number
  recalls: number
}> {
  const stats = { confirmations: 0, preCare: 0, postCare: 0, recalls: 0 }

  const now = new Date()
  const orgFilter = organizationId ? { organizationId } : {}

  // T-48h: sessions in 46-50h window not yet confirmed
  const toConfirm = await prisma.treatmentSession.findMany({
    where: {
      ...orgFilter,
      status: 'AGENDADA',
      dataAgendada: {
        gte: new Date(now.getTime() + 46 * 60 * 60 * 1000),
        lte: new Date(now.getTime() + 50 * 60 * 60 * 1000),
      },
    },
    select: { id: true, organizationId: true },
  })

  for (const s of toConfirm) {
    const sent = await sendConfirmationRequest(s.id, s.organizationId)
    if (sent) stats.confirmations++
  }

  // T-24h: sessions in 22-26h window
  const toRemind = await prisma.treatmentSession.findMany({
    where: {
      ...orgFilter,
      status: { in: ['AGENDADA', 'CONFIRMADA'] },
      dataAgendada: {
        gte: new Date(now.getTime() + 22 * 60 * 60 * 1000),
        lte: new Date(now.getTime() + 26 * 60 * 60 * 1000),
      },
    },
    select: { id: true, organizationId: true },
  })

  for (const s of toRemind) {
    const sent = await sendPreCareReminder(s.id, s.organizationId)
    if (sent) stats.preCare++
  }

  // T+2h: sessions completed 1.5-2.5h ago
  const toPostCare = await prisma.treatmentSession.findMany({
    where: {
      ...orgFilter,
      status: 'REALIZADA',
      dataRealizada: {
        gte: new Date(now.getTime() - 2.5 * 60 * 60 * 1000),
        lte: new Date(now.getTime() - 1.5 * 60 * 60 * 1000),
      },
    },
    select: { id: true, organizationId: true },
  })

  for (const s of toPostCare) {
    const sent = await sendPostCareInstructions(s.id, s.organizationId)
    if (sent) stats.postCare++
  }

  return stats
}
