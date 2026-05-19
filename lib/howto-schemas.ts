/**
 * HowTo schemas for tutorial blog posts.
 * Google displays structured steps directly in search results.
 * Reference: https://schema.org/HowTo
 */

interface HowToStep {
  name: string
  text: string
}

interface HowToSchema {
  '@context': 'https://schema.org'
  '@type': 'HowTo'
  name: string
  description: string
  totalTime?: string // ISO 8601 duration: PT10M = 10 minutes
  estimatedCost?: { '@type': 'MonetaryAmount'; currency: string; value: string }
  step: Array<{ '@type': 'HowToStep'; name: string; text: string }>
}

function buildHowTo(
  name: string,
  description: string,
  steps: HowToStep[],
  opts?: { totalTime?: string; cost?: string }
): HowToSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(opts?.totalTime && { totalTime: opts.totalTime }),
    ...(opts?.cost && {
      estimatedCost: { '@type': 'MonetaryAmount', currency: 'BRL', value: opts.cost },
    }),
    step: steps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
  }
}

export const howToSchemas: Record<string, HowToSchema> = {
  'spin-selling-para-clinicas-de-estetica': buildHowTo(
    'Como Aplicar SPIN Selling na Consulta de Avaliação Estética',
    'Guia em 5 passos para usar as 4 perguntas SPIN (Situação, Problema, Implicação, Necessidade) na consulta de avaliação inicial e aumentar a conversão em procedimentos estéticos.',
    [
      { name: 'Prepare-se com o prontuário antes da consulta', text: 'Revise o histórico do paciente no Estetia CRM: procedimentos anteriores, queixas registradas e preferências. Esse contexto alimenta as perguntas de Situação sem precisar perguntar o óbvio.' },
      { name: 'Faça perguntas de Situação para entender o contexto', text: 'Pergunte sobre rotina de skincare, histórico de procedimentos e expectativas: "Você já fez algum tratamento para essa região antes? Como foi a experiência?"' },
      { name: 'Explore Problemas com perguntas abertas', text: 'Identifique o que realmente incomoda o paciente: "O que te faz sentir mais insatisfeita com essa área?", "Isso te afeta no dia a dia de alguma forma?"' },
      { name: 'Amplie com perguntas de Implicação', text: 'Ajude o paciente a perceber o impacto emocional: "Como você se sente quando percebe isso no espelho?", "Isso já afetou sua autoestima em alguma situação específica?"' },
      { name: 'Conduza para a Necessidade e apresente a solução', text: 'Pergunte sobre o resultado ideal: "Qual seria o resultado perfeito para você após o tratamento?" Só depois apresente o procedimento como solução para a necessidade que o próprio paciente articulou.' },
    ],
    { totalTime: 'PT45M', cost: '0' }
  ),

  'como-reduzir-no-show-em-clinicas-de-estetica': buildHowTo(
    'Como Reduzir No-Show em Clínicas de Estética com Confirmação Automática',
    'Passo a passo para configurar um sistema de redução de no-show com 3 camadas: confirmação automática, no-show predictor e lista de espera.',
    [
      { name: 'Configure lembretes automáticos em 3 momentos', text: 'No Estetia CRM, ative: lembrete 48h antes (confirmação via WhatsApp), 24h antes (com opção de cancelamento/reagendamento) e 2h antes (lembrete final). Cada lembrete pode ser personalizado com nome do paciente e procedimento.' },
      { name: 'Ative o no-show predictor por paciente', text: 'O sistema analisa histórico de cancelamentos, tempo de agendamento, tipo de procedimento e horário para calcular um score de risco. Pacientes com score alto recebem abordagem extra (ligação pessoal da recepção).' },
      { name: 'Monte uma lista de espera ativa', text: 'Configure a lista de espera para cada horário. Quando um paciente cancela, o sistema contacta automaticamente o próximo da lista via WhatsApp com um link de confirmação em 1 clique.' },
      { name: 'Defina política clara de sinal para novos pacientes', text: 'Para procedimentos de alto ticket com novos pacientes, exija sinal de 30-50% no agendamento. Informe claramente no momento da marcação — reduz no-show em até 70% nesse perfil.' },
      { name: 'Monitore e ajuste mensalmente', text: 'Acompanhe a taxa de no-show mensal no dashboard do Estetia CRM. Identifique profissional, horário ou tipo de procedimento com maior incidência e ajuste a estratégia de confirmação.' },
    ],
    { totalTime: 'PT20M', cost: '0' }
  ),

  'lgpd-para-clinicas-de-estetica-guia-2026': buildHowTo(
    'Como Adequar sua Clínica de Estética à LGPD em 5 Passos',
    'Roteiro prático de conformidade LGPD para clínicas de estética e dermatologia — foco em dados sensíveis de saúde (Art. 11) sem precisar de consultoria jurídica inicial.',
    [
      { name: 'Mapeie todos os dados coletados da clínica', text: 'Liste onde estão os dados de pacientes: fichas físicas, WhatsApp, planilhas, sistemas, email. Para cada dado, identifique: o que é coletado, onde está armazenado, quem acessa e por quanto tempo é guardado.' },
      { name: 'Colete consentimento específico para dados de saúde', text: 'Crie um termo de consentimento digital para anamneses, fotos antes/depois e histórico clínico. O consentimento deve ser livre, informado e específico — um checkbox genérico não é suficiente para o Art. 11.' },
      { name: 'Publique a Política de Privacidade no site', text: 'Inclua: quais dados são coletados, para que finalidade, como são protegidos, por quanto tempo são guardados e como o paciente pode exercer seus direitos (acesso, exclusão, portabilidade).' },
      { name: 'Configure controles de acesso no sistema', text: 'No Estetia CRM, defina quem pode ver quais dados: recepcionista acessa agenda, técnico acessa prontuário do seu paciente, gestor tem visão geral. O sistema mantém audit trail de todos os acessos.' },
      { name: 'Designe um responsável pela proteção de dados (DPO)', text: 'Para clínicas de pequeno porte, o DPO pode ser o próprio proprietário ou um DPO externo contratado por horas. O responsável cuida de responder solicitações de titulares e comunicar incidentes à ANPD.' },
    ],
    { totalTime: 'PT60M', cost: '0' }
  ),

  'anamnese-digital-clinica-de-estetica': buildHowTo(
    'Como Implementar Anamnese Digital na sua Clínica de Estética',
    'Passo a passo para substituir fichas de papel por anamnese digital — com alertas de contraindicação, assinatura eletrônica e integração com prontuário.',
    [
      { name: 'Crie as fichas de anamnese por procedimento', text: 'No Estetia CRM, configure fichas específicas para cada procedimento: toxina botulínica, preenchimento, laser, microagulhamento, peeling. Cada ficha tem campos obrigatórios e de contraindicação configuráveis.' },
      { name: 'Configure os alertas de contraindicação', text: 'Cadastre as contraindicações de cada procedimento: gravidez (todos os procedimentos), anticoagulantes (microagulhamento, laser), lúpus (IPL), isotretinoína (peeling profundo). O sistema alerta automaticamente.' },
      { name: 'Ative o envio automático pré-consulta', text: 'Configure para enviar o link da anamnese digital via WhatsApp quando o agendamento é confirmado. O paciente preenche pelo celular em qualquer momento antes da consulta.' },
      { name: 'Revise alertas antes do atendimento', text: 'Antes de cada consulta, abra o prontuário no Estetia CRM. Se houver alerta de contraindicação, o sistema exibe em destaque vermelho. O profissional decide se procede, adapta ou cancela o procedimento.' },
      { name: 'Arquivo e acesso seguro ao histórico', text: 'Todas as anamneses ficam no prontuário do paciente com data, hora e assinatura eletrônica. Para consultas futuras, o profissional vê o histórico completo sem preencher tudo novamente — só atualiza o que mudou.' },
    ],
    { totalTime: 'PT30M', cost: '0' }
  ),

  'kpis-essenciais-clinica-de-estetica': buildHowTo(
    'Como Montar um Dashboard de KPIs Clínicos no Estetia CRM',
    'Guia passo a passo para configurar o monitoramento dos 5 KPIs essenciais de clínicas de estética e tomar decisões baseadas em dados.',
    [
      { name: 'Configure a taxa de ocupação da agenda', text: 'No dashboard do Estetia CRM, ative a visualização de taxa de ocupação diária, semanal e mensal. Defina a meta (80-90%) e configure alerta quando cair abaixo de 70% por 3 dias consecutivos.' },
      { name: 'Acompanhe o no-show em tempo real', text: 'O painel mostra no-show do dia, semana e mês por profissional e tipo de procedimento. Identifique padrões: horários com maior índice, procedimentos mais cancelados, perfil de paciente.' },
      { name: 'Calcule a taxa de recompra mensal', text: 'Configure o filtro de "pacientes que retornaram em 90 dias" como KPI fixo no dashboard. A meta saudável é acima de 40%. Abaixo de 25% indica problema de fidelização que requer ação.' },
      { name: 'Monitore o ticket médio por procedimento', text: 'Analise ticket médio por tipo de procedimento, profissional e período. Isso revela quais tratamentos têm maior margem, quais profissionais convertem melhor e sazonalidade da receita.' },
      { name: 'Revise os KPIs semanalmente em reunião de equipe', text: 'Separe 15 minutos por semana para revisar o dashboard com a equipe. Para cada KPI fora da meta: identifique causa, defina ação e responsável, avalie resultado na semana seguinte.' },
    ],
    { totalTime: 'PT25M', cost: '0' }
  ),
}

/** Returns the HowTo schema for a slug, or null if not defined */
export function getHowToSchema(slug: string): HowToSchema | null {
  return howToSchemas[slug] ?? null
}
