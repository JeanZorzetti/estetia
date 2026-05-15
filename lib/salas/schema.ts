import { z } from 'zod'
import { CargaHorariaSchema } from '@/lib/profissionais/schema'

export const SalaCreateSchema = z.object({
  nome: z.string().min(2).max(120),
  tipo: z.enum(['CONSULTA', 'PROCEDIMENTO', 'LASER', 'PEELING', 'RECUPERACAO']).default('PROCEDIMENTO'),
  equipamentos: z.array(z.string().max(80)).default([]),
  cor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().or(z.literal('')),
  capacidade: z.coerce.number().int().min(1).max(99).optional().nullable(),
  disponibilidade: CargaHorariaSchema.optional().nullable(),
  ativo: z.boolean().default(true),
})

export const SalaUpdateSchema = SalaCreateSchema.partial()

export type SalaCreateInput = z.infer<typeof SalaCreateSchema>
