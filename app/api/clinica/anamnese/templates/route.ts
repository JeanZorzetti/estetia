import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
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

const TemplateSchema = z.object({
  nome: z.string().min(2),
  procedimento: z.string().optional(),
  descricao: z.string().optional(),
  template: z.object({
    version: z.number().default(1),
    sections: z.array(SectionSchema),
  }),
})

/**
 * GET /api/clinica/anamnese/templates
 * List anamnesis templates for the org.
 *
 * POST /api/clinica/anamnese/templates
 * Create a new template (or new version of existing).
 */

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const templates = await prisma.anamnesisTemplate.findMany({
    where: { organizationId: user.organizationId, ativo: true },
    select: {
      id: true,
      nome: true,
      procedimento: true,
      descricao: true,
      versao: true,
      templateHash: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { nome: 'asc' },
  })

  return NextResponse.json({ templates })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const body = await req.json()
  const parsed = TemplateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid template', details: parsed.error.flatten() }, { status: 400 })
  }

  const { nome, procedimento, descricao, template } = parsed.data
  const templateHash = createHash('sha256').update(JSON.stringify(template)).digest('hex')

  const created = await prisma.anamnesisTemplate.create({
    data: {
      organizationId: user.organizationId,
      nome,
      procedimento: procedimento ?? null,
      descricao: descricao ?? null,
      template,
      versao: 1,
      templateHash,
    },
  })

  return NextResponse.json({ template: created }, { status: 201 })
}
