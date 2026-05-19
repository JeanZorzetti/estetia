/**
 * FAQ Schema Markup Generator for SEO
 * Generates JSON-LD FAQPage schema for Google Featured Snippets
 */

export interface FAQItem {
  question: string
  answer: string
}

/**
 * Strip HTML tags and get plain text for schema markup
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
}

/**
 * Generate FAQPage JSON-LD schema for a blog post
 */
export function generateFAQSchema(faqs: FAQItem[], url: string) {
  if (faqs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(faq.answer),
      },
    })),
  }
}

/**
 * FAQ data for homepage — perguntas gerais sobre Estetia CRM
 */
export const estetiaHomepageFAQs: FAQItem[] = [
  {
    question: 'O que é o Estetia CRM?',
    answer: 'O Estetia CRM é um sistema de gestão clínica SaaS desenvolvido para clínicas de estética e dermatologia. Reúne em uma plataforma: agenda inteligente com no-show predictor, prontuário eletrônico LGPD-compliant, recall automático via WhatsApp, integração com convênios TISS/TUSS e dashboard de KPIs clínicos.',
  },
  {
    question: 'O Estetia CRM é aprovado para clínicas de saúde segundo a LGPD?',
    answer: 'Sim. O Estetia CRM foi desenvolvido em conformidade com a LGPD Art. 11, que regula o tratamento de dados sensíveis de saúde. A plataforma utiliza criptografia AES-256, coleta consentimento digital do paciente, mantém audit trail de acessos e permite ao paciente exercer seus direitos LGPD (acesso, portabilidade, exclusão).',
  },
  {
    question: 'O Estetia CRM funciona para dermatologia e estética corporal também?',
    answer: 'Sim. Além de clínicas de estética facial, o Estetia CRM atende dermatologistas, clínicas de estética corporal e redes multi-unidade. Cada especialidade conta com campos de anamnese e prontuário customizados, além de soluções verticais específicas em /solucoes/dermatologia e /solucoes/estetica-corporal.',
  },
  {
    question: 'Como o Estetia CRM reduz no-show em clínicas?',
    answer: 'O Estetia CRM combina 3 camadas: (1) No-show predictor — IA que identifica pacientes com alto risco de cancelamento com base em histórico; (2) Confirmação automática — lembretes via WhatsApp, SMS ou email no prazo ideal para cada paciente; (3) Lista de espera — preenchimento automático de horários vagos. Clínicas que usam as 3 camadas reportam redução de 35-45% nos índices de no-show.',
  },
  {
    question: 'O Estetia CRM integra com convênios (TISS/TUSS)?',
    answer: 'Sim. O plano Business inclui módulo de convênios com suporte ao padrão TISS/TUSS da ANS. Permite emissão de guias de consulta e procedimento, controle de glosas, faturamento eletrônico para operadoras de saúde e relatórios por convênio. Compatível com as principais operadoras do mercado brasileiro.',
  },
  {
    question: 'Quanto custa o Estetia CRM?',
    answer: 'O Estetia CRM tem 3 planos: Starter (R$149/mês) para 1 profissional e até 300 pacientes; Pro (R$349/mês) para até 3 profissionais, 1.500 pacientes e no-show predictor IA; Business (R$799/mês) para profissionais ilimitados, multi-unidade e convênios TISS. Todos os planos incluem período de teste gratuito de 14 dias.',
  },
  {
    question: 'Em quanto tempo consigo configurar o Estetia CRM?',
    answer: 'A maioria das clínicas conclui o setup básico em menos de 2 dias: importação de base de pacientes, configuração da agenda e ativação do WhatsApp. O onboarding guiado inclui checklist passo a passo, vídeos e suporte via chat. Redes multi-unidade têm onboarding dedicado com especialista.',
  },
]

/**
 * FAQ data for SPIN Selling para Clínicas de Estética blog post
 */
export const spinSellingClinicaFAQs: FAQItem[] = [
  {
    question: 'SPIN Selling funciona para clínicas de estética?',
    answer: 'Sim. SPIN Selling foi adaptado para consultas de avaliação estética — onde o profissional precisa entender a necessidade real do paciente antes de apresentar um procedimento. Em vez de fazer um pitch do tratamento, o profissional usa perguntas de Situação, Problema, Implicação e Necessidade para que o próprio paciente identifique e verbalize a solução ideal.',
  },
  {
    question: 'Como usar SPIN Selling na consulta de avaliação inicial?',
    answer: 'Na consulta de avaliação: (1) Situação — entenda a rotina de skincare e histórico de procedimentos do paciente; (2) Problema — explore o que incomoda o paciente (manchas, flacidez, acne); (3) Implicação — ajude o paciente a perceber o impacto emocional e social do problema; (4) Necessidade — pergunte qual seria o resultado ideal para ele. A conversão acontece porque o paciente chegou à conclusão, não porque o profissional vendeu.',
  },
  {
    question: 'Qual a taxa de conversão com SPIN Selling em clínicas de estética?',
    answer: 'Clínicas que treinam a equipe em SPIN Selling para avaliações reportam aumento de 25-40% na taxa de conversão de avaliações em procedimentos. O maior impacto ocorre em procedimentos de alto ticket (acima de R$500) onde o paciente precisa de mais confiança antes de decidir. O SPIN reduz objeções como "vou pensar" porque o paciente chegou à decisão pelo próprio raciocínio.',
  },
  {
    question: 'Como o Estetia CRM ajuda na aplicação do SPIN Selling?',
    answer: 'O Estetia CRM mantém o histórico completo de consultas anteriores, procedimentos realizados e observações de cada paciente. Antes de uma avaliação, o profissional revisa o prontuário e já chega com informações para as perguntas de Situação (procedimentos passados, queixas anteriores). O CRM também registra as perguntas-chave e respostas do paciente para uso futuro.',
  },
  {
    question: 'SPIN Selling é adequado para procedimentos de alta complexidade como laser?',
    answer: 'Especialmente para eles. Procedimentos de alta complexidade (laser CO2, peeling profundo, radiofrequência) têm maior ticket médio e maior hesitação de compra. O SPIN Selling é mais eficaz exatamente nesses casos, pois ajuda o paciente a compreender as implicações do problema (fotoenvelhecimento progressivo, perda de colágeno) antes de apresentar a solução.',
  },
  {
    question: 'Como treinar a equipe em SPIN Selling para avaliações?',
    answer: 'Processo em 3 fases: (1) Workshop prático de 2h com role-playing de consultas — distribuir o roteiro das 12 perguntas SPIN adaptadas para estética; (2) Shadowing — profissional sênior acompanha as primeiras 5 avaliações e dá feedback; (3) Revisão semanal nos primeiros 30 dias com análise de taxa de conversão por profissional no dashboard do Estetia CRM.',
  },
  {
    question: 'SPIN Selling viola a ética médica/estética na consulta?',
    answer: 'Não. O SPIN Selling não é uma técnica de pressão — é um framework de escuta ativa. Todas as perguntas têm como objetivo entender melhor a necessidade do paciente, não manipulá-lo. O método é compatível com os princípios de boas práticas clínicas e com o Código de Ética dos Conselhos profissionais de medicina e biomedicina.',
  },
]

/**
 * FAQ data for No-Show em Clínicas de Estética blog post
 */
export const noShowClinicaFAQs: FAQItem[] = [
  {
    question: 'Qual o índice médio de no-show em clínicas de estética?',
    answer: 'O índice médio de no-show em clínicas de estética no Brasil varia entre 15% e 30% das consultas agendadas, dependendo do tipo de procedimento e do perfil de clientela. Procedimentos de avaliação gratuita têm os maiores índices (25-35%). Clínicas sem sistema de confirmação automática ficam na faixa superior desse intervalo.',
  },
  {
    question: 'Como o lembretes automáticos reduzem no-show em clínicas?',
    answer: 'Lembretes automáticos reduzem no-show porque eliminam o principal motivo de cancelamento: esquecimento. O timing ideal é: 48h antes (confirmação inicial), 24h antes (lembrete com opção de cancelamento) e 2h antes (lembrete final). Clínicas que usam os 3 lembretes via WhatsApp reduzem no-show em 35-45% sem aumentar carga operacional.',
  },
  {
    question: 'Lista de espera resolve o problema de no-show em clínicas?',
    answer: 'A lista de espera não evita o no-show, mas minimiza o impacto financeiro. Quando um paciente cancela, o sistema contacta automaticamente o próximo da lista de espera para preencher o horário. Com Estetia CRM, o processo é automático: o paciente da lista recebe mensagem via WhatsApp e pode confirmar com 1 clique. Clínicas com lista de espera ativa recuperam 60-70% dos horários vagos.',
  },
  {
    question: 'Qual o custo financeiro real do no-show para uma clínica de estética?',
    answer: 'Para uma clínica com ticket médio de R$300 e 20% de no-show em 100 consultas/semana: 20 consultas perdidas × R$300 = R$6.000/semana em receita não realizada. Em um mês, isso representa R$24.000. Além da receita, há custo de oportunidade (profissional parado), custo de insumos preparados e custo administrativo de remarcação. Use a Calculadora No-Show do Estetia em /ferramentas/calculadora-no-show para calcular o impacto na sua clínica.',
  },
  {
    question: 'Como o no-show predictor de IA do Estetia CRM funciona?',
    answer: 'O no-show predictor analisa o histórico de comportamento de cada paciente: frequência de cancelamentos anteriores, tempo médio entre agendamento e consulta, canal de comunicação preferido, tipo de procedimento e horário preferencial. Com base nesses padrões, o sistema atribui um score de risco a cada agendamento e adapta automaticamente a estratégia de confirmação para pacientes de alto risco.',
  },
  {
    question: 'Devo cobrar taxa de no-show em clínicas de estética?',
    answer: 'A cobrança de taxa de no-show é legalmente permitida no Brasil desde que informada no momento do agendamento e aceita pelo paciente. O impacto na relação com o paciente depende da forma como é comunicada. A melhor prática é exigir sinal (30-50% do valor) para procedimentos de alto ticket ou novos pacientes, e usar lembretes automáticos como primeira linha de defesa antes de implementar penalidades.',
  },
]

/**
 * FAQ data for LGPD para Clínicas de Estética blog post
 */
export const lgpdClinicaFAQs: FAQItem[] = [
  {
    question: 'A LGPD se aplica a clínicas de estética?',
    answer: 'Sim. Clínicas de estética e dermatologia tratam dados sensíveis de saúde (Art. 11 da LGPD), que têm regime mais rigoroso do que dados pessoais comuns. Isso inclui: anamneses, prontuários, fotos de procedimentos, histórico de tratamentos, informações sobre condições de saúde e resultados de exames. O descumprimento pode gerar multas de até 2% do faturamento anual, limitado a R$50 milhões por infração.',
  },
  {
    question: 'Quais dados de pacientes são considerados sensíveis pela LGPD?',
    answer: 'Pela LGPD Art. 5 e Art. 11, são dados sensíveis de saúde: histórico de doenças e condições clínicas, resultados de exames laboratoriais e de imagem, medicamentos em uso, alergias, procedimentos realizados, fotos de antes/depois de tratamentos estéticos, informações de saúde mental, dados genéticos e biométricos. Todos esses dados requerem consentimento específico e explícito do paciente.',
  },
  {
    question: 'Posso usar fotos de pacientes para divulgação da clínica?',
    answer: 'Somente com consentimento livre, informado, específico e inequívoco do paciente (LGPD Art. 11). O consentimento precisa descrever claramente: quais fotos serão usadas, em quais canais (Instagram, site, material impresso), por quanto tempo e que o paciente pode revogar a qualquer momento. O Estetia CRM gera e armazena esse termo de consentimento digital com assinatura eletrônica.',
  },
  {
    question: 'Por quanto tempo posso guardar o prontuário de pacientes?',
    answer: 'O CFM (Conselho Federal de Medicina) estabelece guarda mínima de 20 anos para prontuários médicos. O CFB (Conselho Federal de Biomedicina) e os Conselhos de Enfermagem têm normas similares. Para clínicas de estética não médicas, a recomendação é guardar pelo menos 5 anos após o último atendimento. O Estetia CRM mantém prontuários por tempo configurável com backup automático criptografado.',
  },
  {
    question: 'O que é o DPO e clínicas de estética precisam ter um?',
    answer: 'DPO (Data Protection Officer / Encarregado de Dados) é o responsável pela proteção de dados da organização. A LGPD torna o DPO obrigatório para operadores e controladores que tratam dados em larga escala. Para clínicas pequenas e médias, o DPO pode ser externo (contratado por hora). O Estetia CRM oferece relatórios de conformidade que facilitam o trabalho do DPO.',
  },
  {
    question: 'Como implementar LGPD na prática em uma clínica de estética?',
    answer: 'Os passos fundamentais são: (1) Mapeamento de dados — listar todos os dados coletados e onde são armazenados; (2) Base legal — definir a base legal para cada tratamento (consentimento, obrigação legal, legítimo interesse); (3) Termo de consentimento — criar e coletar consentimento digitalmente; (4) Política de privacidade — publicar no site e exibir no momento do agendamento; (5) Procedimentos de resposta — definir como responder a solicitações de titulares (acesso, exclusão, portabilidade). O Estetia CRM automatiza os passos 3, 4 e 5.',
  },
]

/**
 * FAQ data for Anamnese Digital em Clínicas de Estética blog post
 */
export const anamneseDigitalFAQs: FAQItem[] = [
  {
    question: 'O que é anamnese digital em clínicas de estética?',
    answer: 'Anamnese digital é a versão eletrônica da ficha de anamnese — o questionário clínico preenchido pelo paciente antes do procedimento. Em vez de papel, o paciente preenche pelo celular ou tablet, e as respostas são armazenadas automaticamente no prontuário eletrônico. Inclui: histórico de saúde, alergias, medicamentos, contraindicações ao procedimento e consentimento informado com assinatura digital.',
  },
  {
    question: 'Quais são as vantagens da anamnese digital sobre o papel?',
    answer: 'As principais vantagens são: (1) Disponibilidade — o paciente pode preencher antes de chegar à clínica, reduzindo tempo de espera; (2) Legibilidade — sem caligrafia ilegível ou campos em branco; (3) Alertas automáticos — o sistema avisa quando há contraindicações (gravidez, anticoagulantes, lúpus); (4) Histórico acessível — profissionais acessam anamneses anteriores em segundos; (5) LGPD — assinatura digital e armazenamento criptografado.',
  },
  {
    question: 'A anamnese digital tem validade legal e jurídica?',
    answer: 'Sim, desde que coletada com certificação adequada. A Lei 14.063/2020 regulamenta o uso de assinaturas eletrônicas em saúde no Brasil. Assinaturas digitais com certificação ICP-Brasil têm a mesma validade jurídica que assinaturas físicas. O Estetia CRM utiliza assinatura eletrônica simples (aceita para ficha clínica) com registro de IP, data/hora e hash do documento para comprovação de autenticidade.',
  },
  {
    question: 'Como configurar alertas de contraindicação na anamnese digital?',
    answer: 'No Estetia CRM, cada procedimento pode ter uma lista de contraindicações configuradas. Quando o paciente preenche a anamnese e indica uma condição contraindicada (ex: gravidez para laser IPL, anticoagulantes para microagulhamento), o sistema gera um alerta vermelho visível para o profissional antes da consulta. Isso evita intercorrências e demonstra due diligence em caso de questionamentos legais.',
  },
  {
    question: 'O paciente pode preencher a anamnese antes de chegar à clínica?',
    answer: 'Sim. Com o Estetia CRM, o link da anamnese digital é enviado automaticamente via WhatsApp quando o paciente é agendado. O paciente preenche pelo celular em qualquer momento antes da consulta. Ao chegar à clínica, o profissional já tem a ficha completa e o atendimento começa diretamente no procedimento, sem preencher papéis na recepção.',
  },
  {
    question: 'Quantos procedimentos diferentes posso ter na anamnese digital?',
    answer: 'O Estetia CRM permite criar fichas de anamnese personalizadas por procedimento ou grupo de procedimentos. Uma clínica pode ter fichas específicas para: toxina botulínica, preenchimento com AH, laser, microagulhamento, tratamentos faciais (limpeza, peelings), estética corporal, procedimentos para convênio. Cada ficha pode ter campos obrigatórios e opcionais configuráveis pela gestão.',
  },
]

/**
 * FAQ data for KPIs Essenciais para Clínicas de Estética blog post
 */
export const kpisClinicaFAQs: FAQItem[] = [
  {
    question: 'Quais são os KPIs mais importantes para clínicas de estética?',
    answer: 'Os 5 KPIs prioritários para clínicas de estética são: (1) Taxa de ocupação da agenda — percentual de horários preenchidos; (2) Taxa de no-show — percentual de consultas que não comparecem; (3) Taxa de recompra — pacientes que retornam em até 90 dias; (4) LTV do paciente (Lifetime Value) — receita total gerada por paciente no tempo de relacionamento; (5) Ticket médio por procedimento. Esses 5 indicadores cobrem ocupação, retenção e rentabilidade.',
  },
  {
    question: 'O que é taxa de recompra em clínicas de estética e como calcular?',
    answer: 'Taxa de recompra é o percentual de pacientes que retornam para novos procedimentos após a primeira consulta. Cálculo: (pacientes que fizeram 2+ procedimentos nos últimos 90 dias ÷ total de pacientes únicos atendidos no período) × 100. Uma taxa saudável para clínicas de estética é acima de 40%. Taxas abaixo de 25% indicam problema de fidelização — revisar qualidade do atendimento, recall e programas de fidelidade.',
  },
  {
    question: 'Como calcular o LTV (Lifetime Value) de paciente em clínica de estética?',
    answer: 'Fórmula básica: LTV = Ticket Médio × Frequência de Procedimentos por Ano × Anos de Relacionamento. Exemplo: paciente com ticket médio de R$400, 6 procedimentos/ano (a cada 2 meses) e relacionamento médio de 3 anos → LTV = R$400 × 6 × 3 = R$7.200. Esse valor ajuda a definir quanto investir em captação (CAC) e em programas de retenção. Use a Calculadora LTV em /ferramentas/calculadora-ltv.',
  },
  {
    question: 'Qual deve ser a taxa de ocupação ideal de uma clínica de estética?',
    answer: 'A taxa de ocupação saudável para clínicas de estética varia por modelo: clínicas focadas em procedimentos longos (laser, 1h+) funcionam bem com 70-80% de ocupação. Clínicas com mix de procedimentos rápidos e longos buscam 80-90%. Acima de 90% consistentemente indica necessidade de expansão de capacidade (mais profissionais ou horários). Abaixo de 60% por mais de 30 dias indica problema de captação ou no-show.',
  },
  {
    question: 'Com que frequência analisar os KPIs de uma clínica de estética?',
    answer: 'KPIs operacionais (taxa de ocupação, no-show do dia, confirmações) devem ser verificados diariamente — o dashboard do Estetia CRM exibe esses dados em tempo real. KPIs táticos (taxa de recompra mensal, ticket médio, receita por profissional) são analisados semanalmente. KPIs estratégicos (LTV, CAC, crescimento de base de pacientes) são revisados mensalmente para decisões de investimento.',
  },
  {
    question: 'Como o Estetia CRM ajuda a monitorar KPIs clínicos?',
    answer: 'O dashboard do Estetia CRM exibe em tempo real: taxa de ocupação da agenda, alertas de pacientes em risco de churn, receita do dia/semana/mês, procedimentos mais realizados e taxa de recompra por período. Relatórios automáticos semanais são enviados por email para a gestão. Todos os KPIs podem ser filtrados por profissional, procedimento, período e unidade (em plano multi-unidade).',
  },
]
