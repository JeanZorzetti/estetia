import { z } from 'zod'

const DayScheduleSchema = z.object({
  atende: z.boolean().default(false),
  inicio: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  fim: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
})

export const CargaHorariaSchema = z.object({
  seg: DayScheduleSchema,
  ter: DayScheduleSchema,
  qua: DayScheduleSchema,
  qui: DayScheduleSchema,
  sex: DayScheduleSchema,
  sab: DayScheduleSchema,
  dom: DayScheduleSchema,
})

export const ProfessionalCreateSchema = z.object({
  nome: z.string().min(2).max(120),
  conselho: z.enum(['CRM', 'CRO', 'CRBM', 'CRF', 'COREN', 'CFBM', 'CREFITO', 'CRP']).optional().nullable(),
  numeroConselho: z.string().max(30).optional().or(z.literal('')),
  ufConselho: z.string().length(2).optional().or(z.literal('')),
  conselhoStatus: z.enum(['ativo', 'inativo', 'pendente', 'nao_aplicavel']).optional().or(z.literal('')),
  especialidades: z.array(z.string().max(60)).default([]),
  bio: z.string().max(3000).optional().or(z.literal('')),
  fotoUrl: z.string().max(500).optional().or(z.literal('')),
  cargaHoraria: CargaHorariaSchema.optional().nullable(),
  procedimentosHabilitadosIds: z.array(z.string().uuid()).default([]),
  userId: z.string().uuid().optional().or(z.literal('')),
  ativo: z.boolean().default(true),
})

export const ProfessionalUpdateSchema = ProfessionalCreateSchema.partial()

export type CargaHorariaInput = z.infer<typeof CargaHorariaSchema>
export type ProfessionalCreateInput = z.infer<typeof ProfessionalCreateSchema>

export const DEFAULT_HORARIO: CargaHorariaInput = {
  seg: { atende: false, inicio: null, fim: null },
  ter: { atende: false, inicio: null, fim: null },
  qua: { atende: false, inicio: null, fim: null },
  qui: { atende: false, inicio: null, fim: null },
  sex: { atende: false, inicio: null, fim: null },
  sab: { atende: false, inicio: null, fim: null },
  dom: { atende: false, inicio: null, fim: null },
}
