import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/encryption'

export interface AnamnesisField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'boolean' | 'scale' | 'date' | 'signature' | 'photo'
  required: boolean
  options?: string[] // for select/multiselect
  section?: string
}

export interface AnamnesisTemplate {
  version: string  // e.g. "1.0"
  procedimento: string
  fields: AnamnesisField[]
}

export interface AnamnesisAnswers {
  [fieldId: string]: string | string[] | boolean | number
}

// Default anamnesis template for general aesthetic procedures
export const DEFAULT_ANAMNESIS_TEMPLATE: AnamnesisTemplate = {
  version: '1.0',
  procedimento: 'geral',
  fields: [
    { id: 'queixaPrincipal', label: 'Queixa principal', type: 'textarea', required: true, section: 'Histórico' },
    { id: 'medicacoes', label: 'Usa alguma medicação?', type: 'textarea', required: false, section: 'Histórico' },
    { id: 'alergias', label: 'Possui alergias? Quais?', type: 'textarea', required: false, section: 'Histórico' },
    { id: 'gravidezAmamentacao', label: 'Está grávida ou amamentando?', type: 'boolean', required: true, section: 'Histórico' },
    { id: 'doencasCronicas', label: 'Doenças crônicas (diabetes, hipertensão, etc.)', type: 'textarea', required: false, section: 'Histórico' },
    { id: 'cirurgiasAnteriores', label: 'Cirurgias ou procedimentos anteriores', type: 'textarea', required: false, section: 'Histórico' },
    { id: 'skintype', label: 'Tipo de pele', type: 'select', required: false, options: ['Normal', 'Seca', 'Oleosa', 'Mista', 'Sensível'], section: 'Pele' },
    { id: 'exposicaoSolar', label: 'Frequência de exposição solar', type: 'select', required: false, options: ['Baixa', 'Moderada', 'Alta'], section: 'Pele' },
    { id: 'protetor', label: 'Usa protetor solar diariamente?', type: 'boolean', required: false, section: 'Pele' },
    { id: 'tratamentosEmCurso', label: 'Faz outros tratamentos estéticos atualmente?', type: 'textarea', required: false, section: 'Tratamentos' },
    { id: 'expectativas', label: 'Quais são suas expectativas com este tratamento?', type: 'textarea', required: true, section: 'Expectativas' },
    { id: 'assinatura', label: 'Assinatura do paciente', type: 'signature', required: true, section: 'Consentimento' },
  ],
}

export const BOTOX_ANAMNESIS_TEMPLATE: AnamnesisTemplate = {
  version: '1.0',
  procedimento: 'botox',
  fields: [
    ...DEFAULT_ANAMNESIS_TEMPLATE.fields.filter(f => f.id !== 'assinatura'),
    { id: 'aplicacaoAnterior', label: 'Já fez aplicação de toxina botulínica antes?', type: 'boolean', required: true, section: 'Histórico Específico' },
    { id: 'quantoTempo', label: 'Se sim, há quanto tempo foi a última aplicação?', type: 'text', required: false, section: 'Histórico Específico' },
    { id: 'neuropatias', label: 'Possui doenças neuromusculares (Miastenia Gravis, etc.)?', type: 'boolean', required: true, section: 'Histórico Específico' },
    { id: 'anticoagulantes', label: 'Usa anticoagulantes ou antiagregantes plaquetários?', type: 'boolean', required: true, section: 'Histórico Específico' },
    { id: 'assinatura', label: 'Assinatura do paciente', type: 'signature', required: true, section: 'Consentimento' },
  ],
}

function getTemplateHash(template: AnamnesisTemplate): string {
  const { createHash } = require('crypto') as typeof import('crypto')
  return createHash('sha256').update(JSON.stringify(template)).digest('hex')
}

export async function createAnamnesis(
  organizationId: string,
  data: {
    pacienteId: string
    treatmentId?: string
    profissionalId?: string
    template: AnamnesisTemplate
    answers: AnamnesisAnswers
    assinaturaDigital?: string
    preenchidoPor?: 'profissional' | 'paciente' | 'recepcao'
    ip?: string
  }
) {
  const templateHash = getTemplateHash(data.template)

  // Answers contain sensitive health data — encrypt before storing (LGPD Art. 11)
  const encryptedAnswers = encrypt(
    JSON.stringify({ template: data.template, answers: data.answers })
  )

  let assinaturaHash: string | undefined
  if (data.assinaturaDigital) {
    const { createHash } = require('crypto') as typeof import('crypto')
    assinaturaHash = createHash('sha256').update(data.assinaturaDigital).digest('hex')
  }

  return prisma.anamnesis.create({
    data: {
      organizationId,
      pacienteId: data.pacienteId,
      treatmentId: data.treatmentId,
      profissionalId: data.profissionalId,
      respostas: encryptedAnswers,
      templateHash,
      assinaturaDigital: assinaturaHash,
      assinadoEm: assinaturaHash ? new Date() : undefined,
      assinadoIp: data.ip,
      preenchidoPor: data.preenchidoPor ?? 'profissional',
    },
  })
}

export async function getAnamnesisDecrypted(
  id: string,
  organizationId: string
): Promise<{ template: AnamnesisTemplate; answers: AnamnesisAnswers } | null> {
  const record = await prisma.anamnesis.findFirst({
    where: { id, organizationId },
  })
  if (!record) return null

  const decrypted = decrypt(record.respostas)
  return JSON.parse(decrypted)
}

export async function getPatientAnamneses(pacienteId: string, organizationId: string) {
  return prisma.anamnesis.findMany({
    where: { pacienteId, organizationId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      treatmentId: true,
      templateHash: true,
      assinadoEm: true,
      preenchidoPor: true,
      createdAt: true,
      profissional: { select: { nome: true } },
      // Do NOT return respostas here (encrypted, decrypt on demand)
    },
  })
}
