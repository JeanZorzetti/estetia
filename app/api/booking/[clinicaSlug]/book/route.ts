import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const BookSchema = z.object({
  procedureId: z.string().uuid(),
  profissionalId: z.string().uuid(),
  dataAgendada: z.string().datetime(),
  pacienteNome: z.string().min(2),
  pacienteTelefone: z.string().min(8),
  pacienteEmail: z.string().email().optional().or(z.literal('')),
})

// POST /api/booking/[clinicaSlug]/book
// Public — creates or finds patient, creates treatment + session
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ clinicaSlug: string }> }
) {
  const { clinicaSlug } = await params

  const org = await prisma.organization.findUnique({
    where: { slug: clinicaSlug },
    select: { id: true },
  })

  if (!org) {
    return NextResponse.json({ error: 'Clínica não encontrada' }, { status: 404 })
  }

  const body = await req.json()
  const parsed = BookSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.flatten() }, { status: 400 })
  }

  const { procedureId, profissionalId, dataAgendada, pacienteNome, pacienteTelefone, pacienteEmail } = parsed.data

  // Validate procedure belongs to org
  const procedure = await prisma.procedure.findFirst({
    where: { id: procedureId, organizationId: org.id },
    select: { id: true, nome: true, duracaoMinutos: true },
  })
  if (!procedure) {
    return NextResponse.json({ error: 'Procedimento não encontrado' }, { status: 404 })
  }

  // Validate professional belongs to org
  const professional = await prisma.professional.findFirst({
    where: { id: profissionalId, organizationId: org.id },
    select: { id: true },
  })
  if (!professional) {
    return NextResponse.json({ error: 'Profissional não encontrado' }, { status: 404 })
  }

  // Check slot is still available
  const slotStart = new Date(dataAgendada)
  const slotEnd = new Date(slotStart.getTime() + procedure.duracaoMinutos * 60 * 1000)

  const conflict = await prisma.treatmentSession.findFirst({
    where: {
      organizationId: org.id,
      profissionalId,
      status: { in: ['AGENDADA', 'CONFIRMADA'] },
      dataAgendada: { gte: slotStart, lt: slotEnd },
    },
  })

  if (conflict) {
    return NextResponse.json({ error: 'Horário não disponível' }, { status: 409 })
  }

  // Find or create patient by phone
  let patient = await prisma.patient.findFirst({
    where: { organizationId: org.id, telefone: pacienteTelefone },
    select: { id: true },
  })

  if (!patient) {
    patient = await prisma.patient.create({
      data: {
        organizationId: org.id,
        nome: pacienteNome,
        telefone: pacienteTelefone,
        email: pacienteEmail || null,
        origem: 'site',
        consentLgpd: {
          tipo: 'BOOKING_PUBLICO',
          aceitoEm: new Date().toISOString(),
          ip: req.headers.get('x-forwarded-for') ?? 'unknown',
        },
      },
      select: { id: true },
    })
  }

  // Create treatment + session in a transaction
  const result = await prisma.$transaction(async (tx: typeof prisma) => {
    const treatment = await tx.treatment.create({
      data: {
        organizationId: org.id,
        pacienteId: patient!.id,
        tipoTratamento: 'OUTROS',
        descricaoCustomizada: procedure.nome,
        status: 'AGENDADO',
        sessoesPrevistas: 1,
        sessoesRealizadas: 0,
        profissionalResponsavelId: profissionalId,
        contraindicacoesVerificadas: false,
      },
      select: { id: true },
    })

    const session = await tx.treatmentSession.create({
      data: {
        organizationId: org.id,
        treatmentId: treatment.id,
        profissionalId,
        dataAgendada: slotStart,
        duracaoMinutos: procedure.duracaoMinutos,
        status: 'AGENDADA',
      },
      select: { id: true },
    })

    return { treatmentId: treatment.id, sessionId: session.id }
  })

  return NextResponse.json({
    ok: true,
    sessionId: result.sessionId,
    treatmentId: result.treatmentId,
    patientId: patient.id,
  }, { status: 201 })
}
