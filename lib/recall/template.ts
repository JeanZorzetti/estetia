export interface RecallTemplateVars {
  paciente_nome: string
  procedimento?: string
  dias_sem_visita: number
  link_agendamento: string
}

export function resolveRecallTemplate(template: string, vars: RecallTemplateVars): string {
  return template
    .replace(/\{\{paciente_nome\}\}/g, vars.paciente_nome)
    .replace(/\{\{procedimento\}\}/g, vars.procedimento ?? 'procedimento')
    .replace(/\{\{dias_sem_visita\}\}/g, String(vars.dias_sem_visita))
    .replace(/\{\{link_agendamento\}\}/g, vars.link_agendamento)
}
