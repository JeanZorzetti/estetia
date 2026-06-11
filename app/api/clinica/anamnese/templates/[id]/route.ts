import { NextRequest, NextResponse } from 'next/server'
import { requireClinicalAccess } from '@/lib/clinica/access'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { createHash } from 'crypto'

const FieldSchema = z.object({
  id: z.string(),
  tipo: z.enum(['text', 'textarea', 'select', 'multiselect', 'boolean', 'scale', 'date', 'signature', 'photo']),
  label: z.string(),
  obrigatorio: z.boolean().default(false),
  opcoes: z.array(z.string()).optional(),
  placeholder: z.string().optional(),
})

const SectionSchema = z.object({
  titulo: z.string(),
  campos: z.array(FieldSchema),
})

const UpdateTemplateSchema = z.object({
  nome: z.string().min(2),
  procedimento: z.string().optional(),
  descricao: z.string().optional(),
  template: z.object({
    version: z.number().default(1),
    sections: z.array(SectionSchema),
  }),
})

const PatchTemplateSchema = z.object({
  ativo: z.boolean(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const access = await requireClinicalAccess()
  if (!access.ok) return access.response
  const { user } = access

  const template = await prisma.anamnesisTemplate.findFirst({
    where: { id, organizationId: user.organizationId },
  })
  if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ template })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const access = await requireClinicalAccess()
  if (!access.ok) return access.response
  const { user } = access

  const existing = await prisma.anamnesisTemplate.findFirst({
    where: { id, organizationId: user.organizationId },
    select: { id: true, versao: true },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = UpdateTemplateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const { nome, procedimento, descricao, template } = parsed.data
  const templateHash = createHash('sha256').update(JSON.stringify(template)).digest('hex')

  const updated = await prisma.anamnesisTemplate.update({
    where: { id },
    data: {
      nome,
      procedimento: procedimento ?? null,
      descricao: descricao ?? null,
      template,
      templateHash,
      versao: existing.versao + 1,
    },
  })

  return NextResponse.json({ template: updated })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const access = await requireClinicalAccess()
  if (!access.ok) return access.response
  const { user } = access

  const existing = await prisma.anamnesisTemplate.findFirst({
    where: { id, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = PatchTemplateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const updated = await prisma.anamnesisTemplate.update({
    where: { id },
    data: { ativo: parsed.data.ativo },
    select: { id: true, ativo: true },
  })

  return NextResponse.json({ template: updated })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const access = await requireClinicalAccess()
  if (!access.ok) return access.response
  const { user } = access

  const template = await prisma.anamnesisTemplate.findFirst({
    where: { id, organizationId: user.organizationId },
    select: { id: true, templateHash: true },
  })
  if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Prevent deletion if anamneses were filled using this template hash
  const inUse = await prisma.anamnesis.count({
    where: { organizationId: user.organizationId, templateHash: template.templateHash },
  })
  if (inUse > 0) {
    return NextResponse.json(
      { error: 'Template em uso — desative em vez de excluir', count: inUse },
      { status: 409 }
    )
  }

  await prisma.anamnesisTemplate.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
