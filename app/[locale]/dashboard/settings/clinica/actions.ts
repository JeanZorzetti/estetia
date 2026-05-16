'use server'

import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { normalizeRole } from '@/lib/role-permissions'
import { MedicalCouncil } from '@prisma/client'
import { validateCnpj, unmaskCnpj } from '@/lib/validacao-cnpj'

async function requireOwner() {
  const session = await getSession()
  if (!session?.user?.email) throw new Error('Unauthorized')
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw new Error('Unauthorized')
  if (normalizeRole(user.orgRole) !== 'OWNER') {
    throw new Error('Apenas OWNER pode editar dados da clínica')
  }
  return user
}

export interface EnderecoData {
  rua?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  uf?: string
  cep?: string
}

export async function updateClinicaDados(input: {
  cnpj?: string
  razaoSocial?: string
  inscricaoEstadual?: string
  inscricaoMunicipal?: string
  endereco?: EnderecoData
}) {
  const owner = await requireOwner()

  const data: Record<string, unknown> = {}

  if (input.cnpj !== undefined) {
    const cleaned = unmaskCnpj(input.cnpj)
    if (cleaned && !validateCnpj(cleaned)) {
      throw new Error('CNPJ inválido')
    }
    data.cnpj = cleaned || null
  }
  if (input.razaoSocial !== undefined) data.razaoSocial = input.razaoSocial.trim() || null
  if (input.inscricaoEstadual !== undefined) data.inscricaoEstadual = input.inscricaoEstadual.trim() || null
  if (input.inscricaoMunicipal !== undefined) data.inscricaoMunicipal = input.inscricaoMunicipal.trim() || null
  if (input.endereco !== undefined) data.enderecoCompleto = input.endereco as never

  await prisma.organization.update({
    where: { id: owner.organizationId },
    data,
  })

  revalidatePath('/dashboard/settings/clinica/dados')
  return { success: true }
}

export async function updateClinicaIdentidade(input: {
  logoUrl?: string | null
  brandColor?: string | null
  slogan?: string | null
}) {
  const owner = await requireOwner()

  const data: Record<string, unknown> = {}
  if (input.logoUrl !== undefined) data.logoUrl = input.logoUrl
  if (input.brandColor !== undefined) {
    if (input.brandColor && !/^#[0-9a-fA-F]{6}$/.test(input.brandColor)) {
      throw new Error('Cor inválida — use formato #RRGGBB')
    }
    data.brandColor = input.brandColor
  }
  if (input.slogan !== undefined) data.slogan = input.slogan?.trim() || null

  await prisma.organization.update({ where: { id: owner.organizationId }, data })
  revalidatePath('/dashboard/settings/clinica/identidade')
  return { success: true }
}

export async function updateClinicaHorarios(horarios: unknown) {
  const owner = await requireOwner()
  await prisma.organization.update({
    where: { id: owner.organizationId },
    data: { horarioFuncionamento: horarios as never },
  })
  revalidatePath('/dashboard/settings/clinica/horarios')
  return { success: true }
}

export async function updateResponsavelTecnico(input: {
  rtNome?: string | null
  rtConselho?: MedicalCouncil | null
  rtNumeroConselho?: string | null
  rtUfConselho?: string | null
  rtCpf?: string | null
}) {
  const owner = await requireOwner()
  await prisma.organization.update({
    where: { id: owner.organizationId },
    data: input,
  })
  revalidatePath('/dashboard/settings/clinica/responsavel-tecnico')
  return { success: true }
}
