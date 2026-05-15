import { z } from 'zod'

// ============================================================================
// OPERADORA
// ============================================================================

export const OperadoraCreateSchema = z.object({
  nome: z.string().min(2).max(120),
  codigoAns: z.string().max(20).optional().or(z.literal('')),
  cnpj: z.string().max(20).optional().or(z.literal('')),
  tipo: z.enum(['CONVENIO', 'PARTICULAR', 'CORTESIA']).default('CONVENIO'),
  contatoNome: z.string().max(120).optional().or(z.literal('')),
  contatoEmail: z.string().email().optional().or(z.literal('')),
  contatoTelefone: z.string().max(30).optional().or(z.literal('')),
  prazoRepasseDias: z.coerce.number().int().min(0).max(365).optional().nullable(),
  ativo: z.boolean().default(true),
})

export const OperadoraUpdateSchema = OperadoraCreateSchema.partial()

export type OperadoraCreateInput = z.infer<typeof OperadoraCreateSchema>

// ============================================================================
// CONVENIO
// ============================================================================

export const ConvenioCreateSchema = z.object({
  operadoraId: z.string().uuid(),
  procedureId: z.string().uuid().optional().nullable(),
  codigoTuss: z.string().max(20).optional().or(z.literal('')),
  descricaoTuss: z.string().max(200).optional().or(z.literal('')),
  valorNegociado: z.coerce.number().min(0).optional().nullable(),
  porcentagemCo: z.coerce.number().min(0).max(100).optional().nullable(),
  vigenciaInicio: z.string().datetime().optional().nullable(),
  vigenciaFim: z.string().datetime().optional().nullable(),
  ativo: z.boolean().default(true),
})

export const ConvenioUpdateSchema = ConvenioCreateSchema.partial()

export type ConvenioCreateInput = z.infer<typeof ConvenioCreateSchema>

// ============================================================================
// GUIA TISS
// ============================================================================

export const GuiaTissCreateSchema = z.object({
  operadoraId: z.string().uuid(),
  pacienteId: z.string().uuid(),
  sessionId: z.string().uuid().optional().nullable(),
  tipo: z.enum(['CONSULTA', 'SADT', 'INTERNACAO', 'SP_SADT', 'HONORARIOS']).default('CONSULTA'),
  numeroGuia: z.string().max(50).optional().or(z.literal('')),
  codigoTuss: z.string().max(20).optional().or(z.literal('')),
  valorProcedimento: z.coerce.number().min(0).optional().nullable(),
  valorTotal: z.coerce.number().min(0).optional().nullable(),
  dataExecucao: z.string().datetime().optional().nullable(),
})

export const GuiaTissUpdateSchema = GuiaTissCreateSchema.partial().extend({
  status: z.enum(['RASCUNHO', 'ENVIADA', 'AUTORIZADA', 'NEGADA', 'GLOSADA', 'PAGA', 'CANCELADA']).optional(),
  motivoGlosa: z.string().max(2000).optional().or(z.literal('')),
  xmlResposta: z.string().optional().or(z.literal('')),
})

export type GuiaTissCreateInput = z.infer<typeof GuiaTissCreateSchema>
export type GuiaTissUpdateInput = z.infer<typeof GuiaTissUpdateSchema>
