/**
 * Seed de demonstração para o nicho de Estética & Dermatologia.
 * Cria org "Clínica Bella" com 3 profissionais, 10 procedimentos,
 * 20 pacientes e 30 sessões para demo/onboarding.
 *
 * Uso: npx tsx prisma/seed-estetica.ts
 */

import { PrismaClient, TreatmentType, TreatmentStatus, SessionStatus } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

const PROCEDURES: Array<{
  nome: string
  categoria: string
  duracaoMinutos: number
  valorPadrao: number
  tipoTratamento: TreatmentType
}> = [
  { nome: 'Toxina Botulínica (Botox)', categoria: 'facial', duracaoMinutos: 30, valorPadrao: 800, tipoTratamento: 'BOTOX' },
  { nome: 'Preenchimento Labial (Ácido Hialurônico)', categoria: 'facial', duracaoMinutos: 45, valorPadrao: 1200, tipoTratamento: 'PREENCHIMENTO' },
  { nome: 'Harmonização Facial Completa', categoria: 'facial', duracaoMinutos: 90, valorPadrao: 3500, tipoTratamento: 'HARMONIZACAO_FACIAL' },
  { nome: 'Limpeza de Pele Profunda', categoria: 'facial', duracaoMinutos: 60, valorPadrao: 250, tipoTratamento: 'LIMPEZA_PELE' },
  { nome: 'Peeling Químico', categoria: 'facial', duracaoMinutos: 45, valorPadrao: 350, tipoTratamento: 'PEELING' },
  { nome: 'Microagulhamento com Vitaminas', categoria: 'facial', duracaoMinutos: 60, valorPadrao: 450, tipoTratamento: 'MICROAGULHAMENTO' },
  { nome: 'Laser CO2 Fracionado', categoria: 'facial', duracaoMinutos: 60, valorPadrao: 1800, tipoTratamento: 'LASER' },
  { nome: 'Criolipólise Abdominal', categoria: 'corporal', duracaoMinutos: 90, valorPadrao: 1500, tipoTratamento: 'CRIOLIPOLISE' },
  { nome: 'Depilação a Laser (Buço)', categoria: 'corporal', duracaoMinutos: 20, valorPadrao: 120, tipoTratamento: 'DEPILACAO_LASER' },
  { nome: 'Radiofrequência Facial', categoria: 'facial', duracaoMinutos: 50, valorPadrao: 400, tipoTratamento: 'RADIOFREQUENCIA' },
]

const PATIENT_NAMES = [
  'Ana Paula Ferreira', 'Beatriz Santos', 'Carla Oliveira', 'Daniela Costa',
  'Eduarda Lima', 'Fernanda Alves', 'Gabriela Rodrigues', 'Helena Martins',
  'Isabela Pereira', 'Juliana Sousa', 'Kamila Nunes', 'Larissa Barbosa',
  'Mariana Castro', 'Natália Gomes', 'Olívia Mendes', 'Patrícia Rocha',
  'Quintina Silva', 'Rafaela Dias', 'Sabrina Cardoso', 'Tatiana Nascimento',
]

const ORIGENS = ['instagram', 'indicacao', 'google', 'walk_in', 'indicacao', 'instagram']

const STATUSES: TreatmentStatus[] = [
  'AVALIACAO', 'ORCAMENTO_ENVIADO', 'AGENDADO', 'EM_ANDAMENTO', 'FINALIZADO', 'RETORNO',
  'AGENDADO', 'EM_ANDAMENTO', 'FINALIZADO', 'FINALIZADO',
]

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function daysFromNow(n: number): Date {
  return new Date(Date.now() + n * 24 * 60 * 60 * 1000)
}

async function main() {
  console.log('🌸 Seeding Clínica Bella demo data...')

  // Create org
  const org = await prisma.organization.upsert({
    where: { slug: 'clinica-bella-demo' },
    update: {},
    create: {
      name: 'Clínica Bella',
      slug: 'clinica-bella-demo',
      description: 'Clínica de estética avançada e dermatologia cosmética',
      segment: 'Estética',
      tier: 'PRO',
    },
  })
  console.log(`✅ Org: ${org.name} (${org.id})`)

  // Create owner user
  const ownerPassword = await hash('demo123456', 10)
  const owner = await prisma.user.upsert({
    where: { email: 'dra.bella@clinicabella.demo' },
    update: {},
    create: {
      email: 'dra.bella@clinicabella.demo',
      name: 'Dra. Isabella Beaumont',
      password: ownerPassword,
      organizationId: org.id,
      role: 'ADMIN',
      orgRole: 'OWNER',
    },
  })

  // Create professional profiles
  const professional1 = await prisma.professional.upsert({
    where: { userId: owner.id },
    update: {},
    create: {
      organizationId: org.id,
      userId: owner.id,
      nome: 'Dra. Isabella Beaumont',
      conselho: 'CRM',
      numeroConselho: '123456',
      ufConselho: 'SP',
      conselhoStatus: 'ativo',
      especialidades: ['Medicina Estética', 'Dermatologia Cosmética'],
      ativo: true,
    },
  })

  const nurse1Password = await hash('demo123456', 10)
  const nurse1User = await prisma.user.upsert({
    where: { email: 'carol@clinicabella.demo' },
    update: {},
    create: {
      email: 'carol@clinicabella.demo',
      name: 'Carol Estética',
      password: nurse1Password,
      organizationId: org.id,
      role: 'USER',
      orgRole: 'MEMBER',
    },
  })
  const professional2 = await prisma.professional.upsert({
    where: { userId: nurse1User.id },
    update: {},
    create: {
      organizationId: org.id,
      userId: nurse1User.id,
      nome: 'Carol Estética',
      conselho: 'COREN',
      numeroConselho: 'SP-789012',
      ufConselho: 'SP',
      conselhoStatus: 'ativo',
      especialidades: ['Enfermagem Estética', 'Depilação a Laser'],
      ativo: true,
    },
  })

  const tech1Password = await hash('demo123456', 10)
  const tech1User = await prisma.user.upsert({
    where: { email: 'mario@clinicabella.demo' },
    update: {},
    create: {
      email: 'mario@clinicabella.demo',
      name: 'Mário Laser',
      password: tech1Password,
      organizationId: org.id,
      role: 'USER',
      orgRole: 'MEMBER',
    },
  })
  const professional3 = await prisma.professional.upsert({
    where: { userId: tech1User.id },
    update: {},
    create: {
      organizationId: org.id,
      userId: tech1User.id,
      nome: 'Mário Laser',
      especialidades: ['Laser Corporal', 'Criolipólise'],
      ativo: true,
    },
  })

  const professionals = [professional1, professional2, professional3]
  console.log(`✅ Profissionais: ${professionals.length}`)

  // Create clinic rooms
  await prisma.clinicRoom.createMany({
    skipDuplicates: true,
    data: [
      { id: `${org.id}-sala1`, organizationId: org.id, nome: 'Sala 1 — Botox/Preenchimento', tipo: 'PROCEDIMENTO' },
      { id: `${org.id}-sala2`, organizationId: org.id, nome: 'Sala 2 — Laser', tipo: 'LASER' },
      { id: `${org.id}-sala3`, organizationId: org.id, nome: 'Sala 3 — Facial', tipo: 'PROCEDIMENTO' },
      { id: `${org.id}-consulta`, organizationId: org.id, nome: 'Consultório', tipo: 'CONSULTA' },
    ],
  })
  console.log('✅ Salas criadas')

  // Create procedures
  for (const proc of PROCEDURES) {
    await prisma.procedure.upsert({
      where: { id: `${org.id}-${proc.nome}` },
      update: {},
      create: {
        id: `${org.id}-${proc.nome}`,
        organizationId: org.id,
        ...proc,
        preCuidados: 'Evitar exposição solar 48h antes. Não usar retinóides 3 dias antes.',
        posCuidados: 'Aplicar protetor solar FPS 50+. Evitar calor excessivo por 24h.',
        exigeAnamneseEspecifica: proc.tipoTratamento === 'BOTOX' || proc.tipoTratamento === 'PREENCHIMENTO',
      },
    })
  }
  console.log(`✅ Procedimentos: ${PROCEDURES.length}`)

  // Create patients, treatments and sessions
  let sessionCount = 0
  for (let i = 0; i < PATIENT_NAMES.length; i++) {
    const patient = await prisma.patient.create({
      data: {
        organizationId: org.id,
        nome: PATIENT_NAMES[i],
        telefone: `(11) 9${String(90000000 + i).padStart(8, '0')}`,
        email: `paciente${i + 1}@demo.clinicabella.com`,
        dataNascimento: new Date(1985 + (i % 20), i % 12, (i % 28) + 1),
        sexo: 'F',
        origem: randomFrom(ORIGENS),
        profissionalAssignedId: professionals[i % 3].id,
      },
    })

    const proc = PROCEDURES[i % PROCEDURES.length]
    const status = STATUSES[i % STATUSES.length]

    const treatment = await prisma.treatment.create({
      data: {
        organizationId: org.id,
        pacienteId: patient.id,
        tipoTratamento: proc.tipoTratamento,
        status,
        valorTotal: proc.valorPadrao,
        sessoesPrevistas: Math.ceil(Math.random() * 4) + 1,
        profissionalResponsavelId: professionals[i % 3].id,
        dataInicio: daysFromNow(-(i * 3)),
      },
    })

    // Add 1-2 sessions per treatment
    const numSessions = i < 10 ? 1 : 2
    for (let s = 0; s < numSessions; s++) {
      const sessionStatus: SessionStatus =
        status === 'FINALIZADO' ? 'REALIZADA'
        : status === 'CANCELADO' ? 'CANCELADA'
        : s === 0 && i < 5 ? 'CONFIRMADA'
        : 'AGENDADA'

      await prisma.treatmentSession.create({
        data: {
          organizationId: org.id,
          treatmentId: treatment.id,
          dataAgendada: daysFromNow(s === 0 ? -i * 2 : i + 7),
          dataRealizada: sessionStatus === 'REALIZADA' ? daysFromNow(-i * 2) : undefined,
          status: sessionStatus,
          profissionalId: professionals[i % 3].id,
          duracaoMinutos: proc.duracaoMinutos,
        },
      })
      sessionCount++
    }
  }

  console.log(`✅ Pacientes: ${PATIENT_NAMES.length}`)
  console.log(`✅ Tratamentos: ${PATIENT_NAMES.length}`)
  console.log(`✅ Sessões: ${sessionCount}`)
  console.log()
  console.log('🎉 Seed concluído!')
  console.log()
  console.log('Acesso demo:')
  console.log('  Email:  dra.bella@clinicabella.demo')
  console.log('  Senha:  demo123456')
  console.log('  Org:    Clínica Bella')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
