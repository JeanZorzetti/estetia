import { z } from 'zod'

export const CreatePatientSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório').max(120),
  telefone: z.string().min(8, 'Telefone obrigatório').max(20),
  dataNascimento: z.string().min(1, 'Data de nascimento obrigatória'),
  consentimentoLgpd: z.literal(true, {
    errorMap: () => ({ message: 'Consentimento LGPD obrigatório' }),
  }),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF deve ter 11 dígitos')
    .optional()
    .or(z.literal('')),
  sexo: z.enum(['M', 'F', 'NB', 'NI']).optional(),
  origem: z
    .enum(['instagram', 'indicacao', 'google', 'walk_in', 'outros'])
    .optional(),
  alergias: z.array(z.string()).default([]),
  medicacoesUso: z.array(z.string()).default([]),
  contraindicacoes: z.array(z.string()).default([]),
  observacoesMedicas: z.string().max(2000).optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
})

export const UpdatePatientSchema = CreatePatientSchema.partial().omit({
  consentimentoLgpd: true,
})

export type CreatePatientInput = z.infer<typeof CreatePatientSchema>
export type UpdatePatientInput = z.infer<typeof UpdatePatientSchema>
