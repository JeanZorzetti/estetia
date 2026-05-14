/**
 * CFM / CRO / CRBM / CRF professional council validator.
 *
 * Strategy (in order):
 *  1. CFM: scrape cfmedicina.cfm.org.br public lookup (HTML form)
 *  2. Others: manual verification fallback (marks status = "pendente_manual")
 *
 * Results are cached in Professional.conselhoStatus + Professional.conselhoValidadoEm.
 * Never blocks clinical workflow — returns { valid: false, status: 'error' } on failure.
 */

import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'

export type CouncilStatus = 'ativo' | 'inativo' | 'suspenso' | 'cancelado' | 'pendente_manual' | 'error'

export interface ValidateCouncilResult {
  valid: boolean
  status: CouncilStatus
  nome?: string
  especialidade?: string
  uf?: string
  message?: string
  source: 'cfm_api' | 'manual' | 'cache' | 'error'
}

// CRM validation via CFM public endpoint
async function validateCRM(numero: string, uf: string): Promise<ValidateCouncilResult> {
  try {
    const url = `https://sistemas.cfm.org.br/servicos/publico/medicos/crm/${uf}/${numero}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 CRM-EsteticaBot/1.0' },
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      return { valid: false, status: 'error', source: 'cfm_api', message: `HTTP ${res.status}` }
    }

    const text = await res.text()

    // CFM returns JSON-like structure for valid registrations
    if (text.includes('"situacao"')) {
      try {
        const data = JSON.parse(text) as {
          situacao?: string
          nome?: string
          especialidade?: string
        }
        const situacao = (data.situacao ?? '').toLowerCase()
        const ativo = situacao.includes('ativo') || situacao.includes('regular')

        return {
          valid: ativo,
          status: ativo ? 'ativo' : 'inativo',
          nome: data.nome,
          especialidade: data.especialidade,
          uf,
          source: 'cfm_api',
        }
      } catch {
        // fallthrough
      }
    }

    // If HTML contains "Médico não encontrado" or similar
    if (text.toLowerCase().includes('não encontrado') || text.toLowerCase().includes('not found')) {
      return { valid: false, status: 'inativo', source: 'cfm_api', message: 'Registro não encontrado' }
    }

    // Inconclusive — flag for manual review
    return { valid: false, status: 'pendente_manual', source: 'cfm_api', message: 'Resposta inconclusiva' }
  } catch (err) {
    logger.warn({ err, numero, uf }, 'CFM validation request failed')
    return { valid: false, status: 'error', source: 'error', message: String(err) }
  }
}

// Other councils use manual verification (upload de comprovante)
function validateManual(conselho: string): ValidateCouncilResult {
  return {
    valid: false,
    status: 'pendente_manual',
    source: 'manual',
    message: `Conselho ${conselho} requer verificação manual via upload de comprovante de inscrição ativo.`,
  }
}

/**
 * Validate a professional's council registration and persist result.
 */
export async function validateProfessionalCouncil(professionalId: string): Promise<ValidateCouncilResult> {
  const prof = await prisma.professional.findUnique({
    where: { id: professionalId },
    select: {
      conselho: true,
      numeroConselho: true,
      ufConselho: true,
      conselhoValidadoEm: true,
      conselhoStatus: true,
    },
  })

  if (!prof) return { valid: false, status: 'error', source: 'error', message: 'Professional not found' }

  // Use cache if validated within last 30 days
  if (prof.conselhoValidadoEm && prof.conselhoStatus) {
    const ageMs = Date.now() - prof.conselhoValidadoEm.getTime()
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
    if (ageMs < thirtyDaysMs) {
      return {
        valid: prof.conselhoStatus === 'ativo',
        status: prof.conselhoStatus as CouncilStatus,
        source: 'cache',
      }
    }
  }

  if (!prof.conselho || !prof.numeroConselho) {
    return { valid: false, status: 'pendente_manual', source: 'manual', message: 'Dados do conselho incompletos' }
  }

  let result: ValidateCouncilResult

  if (prof.conselho === 'CRM' && prof.ufConselho) {
    result = await validateCRM(prof.numeroConselho, prof.ufConselho)
  } else {
    result = validateManual(prof.conselho)
  }

  // Persist result
  await prisma.professional.update({
    where: { id: professionalId },
    data: {
      conselhoStatus: result.status,
      conselhoValidadoEm: new Date(),
    },
  })

  return result
}

/**
 * Bulk validate all professionals in an org that haven't been checked recently.
 */
export async function bulkValidateOrg(organizationId: string): Promise<{
  total: number
  ativos: number
  pendentes: number
  erros: number
}> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const professionals = await prisma.professional.findMany({
    where: {
      organizationId,
      ativo: true,
      OR: [
        { conselhoValidadoEm: null },
        { conselhoValidadoEm: { lt: thirtyDaysAgo } },
      ],
    },
    select: { id: true },
  })

  const stats = { total: professionals.length, ativos: 0, pendentes: 0, erros: 0 }

  for (const p of professionals) {
    const result = await validateProfessionalCouncil(p.id)
    if (result.status === 'ativo') stats.ativos++
    else if (result.status === 'error') stats.erros++
    else stats.pendentes++
  }

  return stats
}
