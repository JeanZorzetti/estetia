import { z } from 'zod'

export const DpoUpdateSchema = z.object({
  dpoName: z.string().max(120).optional().or(z.literal('')),
  dpoEmail: z.string().email().optional().or(z.literal('')),
  dpoPhone: z.string().max(30).optional().or(z.literal('')),
  dpoCpf: z.string().max(20).optional().or(z.literal('')),
})

export const AuditLogFilterSchema = z.object({
  userId: z.string().uuid().optional(),
  pacienteId: z.string().uuid().optional(),
  action: z.enum(['VIEW', 'CREATE', 'UPDATE', 'EXPORT', 'DELETE', 'ANONYMIZE']).optional(),
  recordType: z.enum(['MedicalRecord', 'Anamnesis', 'ConsentLog', 'Patient']).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
})

export const ConsentCreateSchema = z.object({
  pacienteId: z.string().uuid(),
  tipo: z.enum(['LGPD_DADOS_SAUDE', 'USO_FOTO_MARKETING', 'AUTORIZACAO_PROCEDIMENTO', 'TERMO_RISCO', 'TERMO_MENOR_IDADE']),
  versaoDocumento: z.string().min(1).max(120),
  evidencia: z.object({
    metodo: z.enum(['click', 'assinatura_digital', 'voz']).default('click'),
    evidencia: z.string().optional(),
  }).optional(),
})

export type DpoUpdateInput = z.infer<typeof DpoUpdateSchema>
export type AuditLogFilterInput = z.infer<typeof AuditLogFilterSchema>
export type ConsentCreateInput = z.infer<typeof ConsentCreateSchema>
