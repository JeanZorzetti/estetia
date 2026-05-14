import { z } from 'zod'

export const CreateProcedureSchema = z.object({
  nome: z.string().min(2).max(120),
  categoria: z.enum(['facial', 'corporal', 'capilar', 'outros']).optional().or(z.literal('')),
  descricao: z.string().max(2000).optional().or(z.literal('')),
  duracaoMinutos: z.coerce.number().int().min(5).max(600).default(60),
  valorPadrao: z.coerce.number().min(0).optional().nullable(),
  contraindicacoesGerais: z.array(z.string()).default([]),
  preCuidados: z.string().max(3000).optional().or(z.literal('')),
  posCuidados: z.string().max(3000).optional().or(z.literal('')),
  exigeAnamneseEspecifica: z.boolean().default(false),
  profissionaisHabilitadosIds: z.array(z.string().uuid()).default([]),
  ativo: z.boolean().default(true),
})

export const UpdateProcedureSchema = CreateProcedureSchema.partial()

export type ProcedureInput = z.infer<typeof CreateProcedureSchema>
export type ProcedureUpdateInput = z.infer<typeof UpdateProcedureSchema>
