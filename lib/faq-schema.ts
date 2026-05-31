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

/**
 * FAQ data for CRM para Clínica de Estética blog post
 */
export const crmClinicaEsteticaFAQs: FAQItem[] = [
  {
    question: 'O que é CRM para clínica de estética?',
    answer: 'CRM para clínica de estética é um sistema de gestão que centraliza o relacionamento com pacientes: histórico de procedimentos, agenda inteligente com confirmação automática, prontuário eletrônico, recall automático de recompra e dashboard de KPIs clínicos. Diferencia-se de um software de agendamento genérico por incluir funcionalidades específicas do setor clínico: anamnese digital com alertas de contraindicação, no-show predictor com IA e conformidade LGPD para dados sensíveis de saúde.',
  },
  {
    question: 'Qual o melhor CRM para clínica de estética?',
    answer: 'O melhor CRM para clínica de estética é o especializado no setor clínico — não um CRM genérico adaptado. Os critérios de avaliação são: prontuário eletrônico com fotodocumentação, anamnese digital com alertas de contraindicação, integração com WhatsApp Business API oficial, no-show predictor com IA, recall automático por procedimento, conformidade LGPD Art. 11 e suporte em português. O Estetia CRM foi desenvolvido especificamente para clínicas de estética e dermatologia no Brasil.',
  },
  {
    question: 'CRM é diferente de software de agendamento para clínicas?',
    answer: 'Sim. Software de agendamento organiza horários. CRM clínico gerencia o relacionamento completo com o paciente: histórico de procedimentos, comunicação automatizada, prontuário eletrônico, recall de recompra, KPIs e LGPD compliance. Um CRM clínico inclui agendamento, mas vai muito além — aumenta o LTV do paciente e reduz o no-show de forma sistemática.',
  },
  {
    question: 'Vale a pena CRM para clínica de estética pequena (1-2 profissionais)?',
    answer: 'Sim. Para clínicas pequenas, o CRM resolve os gargalos de crescimento: tempo gasto em confirmações manuais, falta de recall sistemático e ausência de dados para decisões. Uma clínica solo com 80 pacientes ativos e ticket médio de R$400 pode recuperar R$5.600/mês combinando redução de no-show com recall automático — sobre investimento de R$149/mês. O ROI se paga em menos de 30 dias.',
  },
  {
    question: 'CRM funciona com WhatsApp para clínicas de estética?',
    answer: 'Sim. O Estetia CRM integra com WhatsApp Business API oficial (não ferramentas não homologadas que causam bloqueio de número). Isso permite envio automático de confirmações, lembretes, links de anamnese e recalls de recompra — tudo personalizado por paciente e procedimento, sem esforço da recepção.',
  },
  {
    question: 'Quanto custa um CRM para clínica de estética?',
    answer: 'O custo varia de R$100 a R$1.200/mês dependendo do porte e funcionalidades. O Estetia CRM tem planos a partir de R$149/mês para clínicas com 1 profissional e até 300 pacientes. O plano Pro (R$349/mês) inclui no-show predictor IA e recall automático para até 3 profissionais. Todos os planos têm 14 dias de teste gratuito sem cartão de crédito.',
  },
  {
    question: 'Em quanto tempo vejo resultado com CRM para clínica de estética?',
    answer: 'Confirmações automáticas têm impacto imediato — redução de no-show visível na primeira semana. Recall automático começa a gerar retorno em 30-45 dias (tempo mínimo para o primeiro ciclo de recall). Dashboard de KPIs com dados confiáveis: 60-90 dias de uso. ROI positivo na maioria das clínicas: antes de 30 dias, com base na redução de no-show isolada.',
  },
  {
    question: 'CRM para clínica de estética é obrigatório para conformidade com LGPD?',
    answer: 'A LGPD não exige especificamente um CRM, mas exige controles que são praticamente impossíveis sem sistema adequado: criptografia de prontuários, audit trail de acessos, coleta de consentimento digital específico e mecanismos para resposta a solicitações de titulares. Um CRM clínico LGPD-compliant é o caminho prático para atender esses requisitos sem contratar consultoria jurídica custosa.',
  },
  {
    question: 'Como migrar para CRM sem perder o histórico de pacientes?',
    answer: 'A migração é feita em 3 etapas: (1) importação da base de pacientes via planilha CSV, que leva 1-2 dias; (2) operação paralela de 2-4 semanas onde novos agendamentos entram no CRM enquanto o sistema antigo fica em modo leitura; (3) transição completa após validar que os dados críticos foram migrados. O Estetia CRM oferece suporte de migração assistida para clínicas com histórico extenso.',
  },
]

/**
 * FAQ data for Software de Gestão para Dermatologia blog post
 */
export const softwareDermatologiaFAQs: FAQItem[] = [
  {
    question: 'Software de gestão para dermatologia é diferente de software para clínica de estética?',
    answer: 'Sim. Software para dermatologia precisa ter campos específicos para diagnósticos dermatológicos (CID-10 de dermato), mapeamento de lesões com diagrama corporal, controle de biopsias e laudos anatomopatológicos, fototerapia com controle de dose acumulada e integração TISS/TUSS para convênios. Clínicas de estética focam em procedimentos estéticos sem necessidade de diagnóstico clínico. Sistemas como o Estetia CRM atendem ambos com módulos configuráveis por especialidade.',
  },
  {
    question: 'Software de dermatologia precisa de integração TISS?',
    answer: 'Depende do perfil de atendimento. Se a clínica atende convênios de saúde, o padrão TISS (Troca de Informações em Saúde Suplementar) da ANS é obrigatório para faturamento eletrônico. Clínicas 100% particulares não precisam do módulo TISS. O Estetia CRM oferece o módulo TISS/TUSS no plano Business, com suporte para emissão de guias, controle de glosas e faturamento eletrônico às operadoras.',
  },
  {
    question: 'Como funciona o prontuário eletrônico para dermatologia?',
    answer: 'O prontuário dermatológico eletrônico inclui: diagrama corporal clicável para mapeamento de lesões, fotodocumentação por região com comparação temporal (before/after por data), CID-10 de dermatologia com busca rápida, registro de biopsias e laudos, controle de retorno por condição clínica e histórico de fototerapia com dose acumulada. Todos os dados são criptografados e acessíveis com controle de permissão por perfil de profissional.',
  },
  {
    question: 'Dermatologista pode usar CRM genérico (Salesforce, HubSpot)?',
    answer: 'Pode, mas com lacunas críticas. CRMs genéricos não têm prontuário eletrônico, mapeamento de lesões, anamnese com alertas de contraindicação, controle de biopsias ou módulo TISS. Adaptar um CRM genérico para uso clínico gera retrabalho manual, riscos de conformidade (LGPD Art. 11) e ausência de funcionalidades específicas que impactam a qualidade clínica. CRM especializado para dermato é o caminho mais seguro e eficiente.',
  },
  {
    question: 'Software de dermato funciona para convênio e particular no mesmo sistema?',
    answer: 'Sim. O Estetia CRM gerencia os dois fluxos no mesmo sistema: consultas cobertas por convênio (com TISS, CID-10 e guia eletrônica) e procedimentos particulares de estética (com anamnese por procedimento, fotodocumentação e recall). O prontuário do paciente é unificado, mas o faturamento é separado por tipo de atendimento, facilitando a contabilidade e os relatórios por convênio.',
  },
  {
    question: 'Quanto tempo leva para implementar software de gestão de dermatologia?',
    answer: 'Configuração básica (cadastros, agenda, confirmações automáticas): 2-3 dias. Operação plena com prontuário eletrônico: 2-3 semanas para a equipe se adaptar completamente. Módulo TISS com convênios: 1-2 semanas adicionais para configurar guias e testar envio às operadoras. Total esperado para operação 100% digital: 30 dias. O Estetia CRM tem onboarding guiado e suporte via chat para acelerar o processo.',
  },
  {
    question: 'Como migrar prontuários físicos para sistema digital de dermato?',
    answer: 'A migração é feita gradualmente para não travar a operação: (1) dados cadastrais são importados via planilha CSV; (2) prontuários históricos em papel são digitalizados quando o paciente retorna — na próxima consulta, a recepção digitaliza o histórico relevante; (3) em 3-6 meses, a maioria dos pacientes ativos tem prontuário digital completo. Para clínicas com volume alto de histórico em papel, o Estetia CRM oferece serviço de migração assistida.',
  },
  {
    question: 'O sistema de gestão para dermato é compatível com receituário digital?',
    answer: 'Sim. O Estetia CRM gera receituário digital com assinatura eletrônica válida via certificado digital ICP-Brasil. O paciente recebe o receituário por WhatsApp ou email com autenticidade verificável. A validade jurídica é garantida pelo CFM Resolução 2.299/2021, que homologou o receituário digital para médicos. Para biomédicos e enfermeiros, a assinatura eletrônica simples (Lei 14.063/2020) é suficiente para documentos clínicos.',
  },
]

/**
 * FAQ data for Prontuário Eletrônico para Clínica de Estética blog post
 */
export const prontuarioEletronicoFAQs: FAQItem[] = [
  {
    question: 'O que é prontuário eletrônico para clínica de estética?',
    answer: 'Prontuário eletrônico é o registro digital completo do paciente na clínica: anamneses realizadas, procedimentos executados, fotos de evolução (before/after), termos de consentimento assinados digitalmente, observações clínicas e histórico de retornos. Substitui as fichas físicas em papel e tem validade jurídica garantida pela Lei 14.063/2020. É acessível de qualquer dispositivo da clínica com controle de acesso por perfil de profissional.',
  },
  {
    question: 'Prontuário eletrônico é obrigatório por lei para clínicas de estética?',
    answer: 'Para procedimentos realizados por médicos, sim — o CFM exige prontuário para todo atendimento médico (Res. 1.638/2002). Para biomédicos e enfermeiros, os respectivos Conselhos têm obrigação equivalente. Para esteticistas, não há obrigação formal, mas a LGPD exige controles de dados de saúde (criptografia, consentimento, audit trail) que são inviáveis sem sistema digital. Na prática, toda clínica que coleta dados de saúde deve ter documentação estruturada.',
  },
  {
    question: 'Qual a diferença entre anamnese e prontuário eletrônico?',
    answer: 'A anamnese é o questionário de saúde preenchido pelo paciente antes do procedimento: histórico clínico, alergias, medicamentos, contraindicações e consentimento informado. O prontuário é o registro completo do que foi feito na clínica: procedimentos realizados, materiais usados, fotos de evolução, intercorrências, orientações pós-procedimento. A anamnese é o primeiro documento do prontuário — ela se torna parte do histórico do paciente.',
  },
  {
    question: 'Prontuário eletrônico vale como prova jurídica em caso de processo?',
    answer: 'Sim. Prontuários eletrônicos com assinatura eletrônica têm validade jurídica plena pela Lei 14.063/2020. O documento precisa ter: registro de data/hora (timestamp), identificação de quem preencheu, hash do conteúdo (detecta alterações posteriores) e assinatura do paciente para consentimentos. O Estetia CRM registra automaticamente todos esses elementos, garantindo que o prontuário seja prova robusta em caso de questionamento judicial.',
  },
  {
    question: 'Por quanto tempo guardar prontuário de clínica de estética?',
    answer: 'O prazo mínimo recomendado é 20 anos após o último atendimento (padrão CFM para médicos). Para biomédicos: mínimo 5 anos (CFBio). Para esteticistas: recomendação de 5 anos mínimo com base em jurisprudência civil. Adotar 20 anos como padrão para toda a clínica é a decisão mais segura — o custo de armazenamento digital é irrisório comparado ao risco de descarte precoce em caso de ação judicial tardia.',
  },
  {
    question: 'Como armazenar fotos de pacientes em conformidade com a LGPD?',
    answer: 'Fotos de procedimentos estéticos são dados sensíveis de saúde pela LGPD Art. 11. Devem ser armazenadas em sistema com: criptografia AES-256 em repouso, acesso restrito por perfil, consentimento específico do paciente para cada finalidade (prontuário clínico vs. divulgação em redes sociais), e audit trail de todos os acessos. WhatsApp pessoal, Google Drive sem criptografia e armazenamento local sem backup não são conformes com a LGPD.',
  },
  {
    question: 'É possível implementar prontuário eletrônico sem parar a operação da clínica?',
    answer: 'Sim, com migração gradual. A estratégia mais segura é: (1) novos pacientes entram diretamente no sistema digital; (2) pacientes existentes têm o histórico digitalizado na próxima consulta; (3) em 3-6 meses, a maioria dos ativos tem prontuário digital completo. O sistema antigo (papel ou sistema legado) fica em modo leitura para consultas de histórico durante a transição. O treinamento da equipe leva menos de 2 horas para sistemas bem desenhados.',
  },
  {
    question: 'Como funciona a fotodocumentação clínica no prontuário eletrônico?',
    answer: 'A fotodocumentação no Estetia CRM é organizada por data e procedimento com comparação temporal (before/after lado a lado). O sistema tem guias de enquadramento por procedimento para garantir padronização. O paciente deve assinar consentimento digital específico para fotodocumentação antes de qualquer registro fotográfico. As fotos são armazenadas com criptografia e acesso controlado — não saem do sistema para WhatsApp ou drives externos.',
  },
]

/**
 * FAQ data for Agendamento Online para Clínica de Estética blog post
 */
export const agendamentoOnlineFAQs: FAQItem[] = [
  {
    question: 'Agendamento online reduz no-show em clínicas de estética?',
    answer: 'Sim, diretamente. O agendamento online com confirmação automática via WhatsApp em 3 momentos (48h, 24h, 2h antes) elimina o principal motivo de no-show: esquecimento. Clínicas que implementam esse sistema reportam redução de 35-45% no no-show nos primeiros 60 dias. A lista de espera automática complementa: mesmo quando o no-show ocorre, 55-70% dos horários cancelados são preenchidos automaticamente por pacientes da lista.',
  },
  {
    question: 'O paciente pode agendar pelo WhatsApp sem falar com a recepcionista?',
    answer: 'Sim. Com o Estetia CRM integrado à WhatsApp Business API, o paciente envia uma mensagem para o WhatsApp da clínica e recebe automaticamente um menu interativo com os procedimentos disponíveis, profissionais e horários livres. O agendamento é confirmado sem nenhuma intervenção da recepcionista — ela só é acionada se o paciente tiver uma dúvida específica.',
  },
  {
    question: 'Lista de espera automática realmente funciona para preencher horários vagos?',
    answer: 'Sim, com alta taxa de conversão. Quando um cancelamento ocorre, o sistema notifica imediatamente os pacientes na lista de espera para aquele procedimento via WhatsApp. Como a mensagem chega em tempo real e exige apenas 1 clique para confirmar, a taxa de aceite é de 55-70% nos primeiros 30 minutos. É muito mais eficiente do que a recepcionista ligar manualmente — e funciona 24/7, inclusive para cancelamentos de última hora.',
  },
  {
    question: 'O agendamento online integra com Google Agenda do profissional?',
    answer: 'Sim. O Estetia CRM sincroniza bidirecionalmente com Google Calendar: todo agendamento feito no sistema aparece automaticamente na agenda Google do profissional, e bloqueios no Google Calendar (reunião pessoal, horário reservado) travam automaticamente a disponibilidade no sistema da clínica. Funciona também com Apple Calendar via iCloud. A sincronização é em tempo real — sem delay.',
  },
  {
    question: 'Como calcular a taxa de ocupação de uma clínica de estética?',
    answer: 'Taxa de ocupação = (Horários preenchidos ÷ Total de horários disponíveis no período) × 100. A meta saudável varia por modelo: clínicas com procedimentos curtos (30min) buscam 80-90%, clínicas com procedimentos longos (1h+) operam bem com 70-80%. Abaixo de 60% por mais de 30 dias indica problema de captação ou no-show que precisa de ação. O dashboard do Estetia CRM exibe essa taxa em tempo real com alertas configuráveis.',
  },
  {
    question: 'Posso personalizar os horários disponíveis por tipo de procedimento?',
    answer: 'Sim. No Estetia CRM, cada procedimento tem configuração independente: duração do atendimento, intervalo de preparação entre consultas, quais profissionais realizam e em quais horários ficam disponíveis. Uma limpeza de pele de 60 minutos não ocupa o mesmo slot que um botox de 30 minutos. Procedimentos que exigem sala específica (laser, por exemplo) só aparecem quando aquela sala está livre.',
  },
  {
    question: 'Quanto tempo leva para configurar o agendamento online na clínica?',
    answer: 'Com o Estetia CRM, a configuração básica leva 2-3 horas: cadastrar profissionais, configurar procedimentos com duração e intervalo, definir horários de atendimento e conectar o WhatsApp Business. Em seguida, gerar o link de agendamento e adicioná-lo ao Instagram, site e Google Business Profile. A lista de espera é ativada com 1 toggle. Em menos de 1 dia útil, a clínica já está recebendo agendamentos automáticos.',
  },
  {
    question: 'O agendamento online funciona para clínicas com múltiplos profissionais e salas?',
    answer: 'Sim. O Estetia CRM gerencia múltiplos profissionais e salas simultaneamente. Cada profissional tem sua agenda própria com disponibilidades configuradas independentemente. Salas e equipamentos podem ser associados a procedimentos específicos — o sistema bloqueia automaticamente quando um recurso já está ocupado. Perfeito para clínicas com 2-10 profissionais e múltiplas salas de procedimento.',
  },
]

/**
 * FAQ data for WhatsApp Business para Clínicas de Estética blog post
 */
export const whatsappBusinessClinicaFAQs: FAQItem[] = [
  {
    question: 'WhatsApp Business é diferente do WhatsApp pessoal para clínicas?',
    answer: 'Sim. O WhatsApp Business App tem funcionalidades adicionais para empresas: perfil com informações da clínica, catálogo de serviços, respostas rápidas e mensagens de ausência. Mas a diferença mais importante é a WhatsApp Business API — a versão para automação real em escala, que permite integração com sistemas de gestão como o Estetia CRM para envio automático de confirmações, recalls e anamneses sem risco de bloqueio do número.',
  },
  {
    question: 'Posso usar WhatsApp para recall automático de pacientes?',
    answer: 'Sim, e é a melhor prática para clínicas de estética. Recall enviado por WhatsApp tem taxa de abertura de 95-98% versus 8-15% por email. A base legal pela LGPD é execução de contrato (Art. 7, V) — recalls de procedimentos já realizados não exigem consentimento adicional. O Estetia CRM configura o timing automático por procedimento: toxina botulínica com recall em 90 dias, limpeza de pele em 30 dias, laser em 45 dias.',
  },
  {
    question: 'LGPD permite enviar mensagens automáticas por WhatsApp para pacientes?',
    answer: 'Sim, com base legal adequada. Confirmações de agendamento e recalls de procedimentos realizados têm base legal em execução de contrato (LGPD Art. 7, V), sem necessidade de consentimento adicional. Mensagens promocionais (descontos, novidades, lançamentos) exigem opt-in explícito prévio. Todo envio automático deve incluir opção de opt-out ("Responda PARAR para não receber mais mensagens"), e o sistema deve honrá-la imediatamente.',
  },
  {
    question: 'Como configurar mensagens automáticas no WhatsApp para clínica de estética?',
    answer: 'O caminho correto é via WhatsApp Business API (Cloud API da Meta) integrada a um sistema de gestão clínica como o Estetia CRM. O processo: (1) criar conta no Meta Business Manager; (2) registrar o número da clínica na API; (3) conectar ao Estetia CRM em Configurações > Integrações > WhatsApp; (4) criar e submeter templates de mensagem para aprovação Meta (até 24h); (5) ativar as automações de confirmação, lembrete e recall. Total: menos de 30 minutos de configuração.',
  },
  {
    question: 'Quais ferramentas de automação de WhatsApp são seguras para clínicas?',
    answer: 'Apenas ferramentas que usam a WhatsApp Business API oficial (Cloud API da Meta) são seguras. Ferramentas que usam emulação (Evolution API, whatsapp-web.js, ferramentas de "disparo em massa") violam os Termos de Serviço do WhatsApp e resultam em bloqueio permanente do número. Perder o número WhatsApp da clínica significa perder o histórico de conversas e o acesso a pacientes — prejuízo muito maior que o custo da API oficial.',
  },
  {
    question: 'Qual o custo do WhatsApp Business API para uma clínica de estética?',
    answer: 'A API é gratuita para conversas iniciadas pelo paciente. Conversas iniciadas pela clínica (confirmações, recalls — chamadas utility conversations) custam entre R$ 0,05 e R$ 0,15 por conversa de 24 horas, independentemente do número de mensagens nessa janela. Uma clínica com 100 consultas/semana e 200 recalls/mês pagaria R$ 40-80/mês de custo de API — irrisório comparado ao retorno da redução de no-show e aumento de recompra.',
  },
  {
    question: 'Como o WhatsApp Business ajuda a reduzir no-show em clínicas?',
    answer: 'Com confirmações automáticas em 3 momentos: 48h antes (confirmação inicial com opção de cancelar), 24h antes (lembrete com link para reagendar) e 2h antes (lembrete final). Cada mensagem tem botão de confirmação ou cancelamento em 1 clique. Quando o paciente cancela, o sistema ativa automaticamente a lista de espera e oferece o horário a quem está aguardando — via WhatsApp. Clínicas com essa configuração reduzem no-show em 35-45%.',
  },
  {
    question: 'O WhatsApp Business da clínica pode ser usado por múltiplos atendentes?',
    answer: 'Sim, via WhatsApp Business API. Com a API integrada ao Estetia CRM, múltiplos atendentes podem ver e responder mensagens de pacientes na caixa compartilhada do sistema — cada um com seu login, sem precisar compartilhar o telefone físico. As automações (confirmações, recalls) funcionam independente de qual atendente está online. É a solução correta para clínicas com mais de 1 pessoa na recepção.',
  },
]

/**
 * FAQ data for Melhor CRM para Clínica de Estética blog post
 */
export const melhorCrmClinicaFAQs: FAQItem[] = [
  {
    question: 'Qual o melhor CRM para clínica de estética pequena em 2026?',
    answer: 'Para clínicas pequenas (1-2 profissionais), o melhor CRM é o que combina facilidade de uso com funcionalidades clínicas essenciais: confirmação automática via WhatsApp Business API oficial, anamnese digital, prontuário eletrônico e recall automático por procedimento. O Estetia CRM Starter (R$149/mês) foi desenhado para esse perfil — setup em menos de 2 horas, todas as automações incluídas e suporte em português.',
  },
  {
    question: 'CRM genérico ou específico para clínica de estética: qual escolher?',
    answer: 'Para clínicas de estética, o CRM vertical especializado é claramente superior para fluxos clínicos. CRMs genéricos (HubSpot, Salesforce) exigem customização de R$15.000-80.000 para ter prontuário eletrônico, anamnese com contraindicações e recall por timing de procedimento — funcionalidades que um CRM clínico já inclui no plano base. A exceção é clínicas com TI interna dedicada e requisitos muito atípicos.',
  },
  {
    question: 'Como testar um CRM para clínica de estética antes de contratar?',
    answer: 'Use o trial de 14 dias estruturado: Dias 1-3 para configuração básica e importação de 20-30 pacientes de teste. Dias 4-7 para fluxo real — 5-10 agendamentos reais, confirmações WhatsApp, registro de procedimento no prontuário. Dias 8-12 para automações — recall, no-show predictor, KPIs. Dias 13-14 para avaliação coletiva da equipe. O que a equipe não consegue usar sem ajuda indica problema de usabilidade.',
  },
  {
    question: 'O que avaliar antes de contratar um CRM para clínica de estética?',
    answer: 'Os 5 critérios eliminatórios: (1) WhatsApp Business API oficial (Cloud API Meta, não ferramentas informais); (2) Prontuário eletrônico com assinatura digital e validade jurídica; (3) Conformidade LGPD Art. 11 documentada; (4) Exportação gratuita de dados a qualquer momento; (5) Suporte em português com resposta em tempo real. Sistemas que não passam em qualquer um desses 5 critérios devem ser eliminados independentemente do preço.',
  },
  {
    question: 'Em quanto tempo vejo resultado após implementar um CRM para clínica de estética?',
    answer: 'Primeiros resultados em 15-30 dias: redução imediata de no-show com confirmação automática ativa, economia de 15-20 horas/semana de trabalho manual da recepcionista. Aumento de recompra visível em 60-90 dias, quando os recalls automáticos começam a converter pacientes para retorno. Payback típico do investimento: 2-3 meses para clínicas com 30+ consultas por semana.',
  },
  {
    question: 'CRM para clínica de estética precisa ter prontuário eletrônico integrado?',
    answer: 'Sim, e essa integração é fundamental. CRM separado do prontuário exige que o profissional alterne entre dois sistemas durante o atendimento — perda de tempo e risco de inconsistência de dados. Com ambos integrados, o profissional abre o prontuário diretamente do agendamento, registra o procedimento e as fotos, e o histórico fica automaticamente vinculado ao perfil do paciente no CRM.',
  },
  {
    question: 'No-show predictor por IA realmente funciona para clínicas de estética?',
    answer: 'Sim, com precisão crescente. O no-show predictor analisa padrões históricos de cada paciente (frequência de cancelamento, horário preferido, tipo de procedimento, tempo entre agendamento e consulta) para calcular um score de risco. Pacientes com score alto recebem confirmação adicional ou ligação pessoal da recepção. Clínicas com no-show predictor ativo reportam redução adicional de 10-15% de no-show comparado à confirmação automática sozinha.',
  },
  {
    question: 'Qual a diferença entre CRM para estética e software de agendamento para salão?',
    answer: 'São produtos para fluxos completamente diferentes. Software de agendamento para salão gerencia horários e serviços. CRM clínico para estética gerencia o relacionamento com o paciente ao longo do tempo: prontuário com histórico clínico, anamnese com alertas de contraindicações médicas, recall baseado em timing de procedimento (não de agenda), conformidade LGPD Art. 11 para dados sensíveis de saúde e analytics de LTV e recompra. O fluxo de um procedimento estético tem dimensão clínica que um software de salão não cobre.',
  },
]

/**
 * FAQ data for ROI CRM para Clínicas de Estética blog post
 */
export const roiCrmClinicaFAQs: FAQItem[] = [
  {
    question: 'Qual o ROI típico de um CRM para clínica de estética?',
    answer: 'O ROI varia com o volume, mas a média de mercado aponta para 500-2.000% no primeiro ano de uso pleno. Para uma clínica com 60 consultas/semana, ticket médio de R$350 e no-show atual de 20%: recuperação de no-show (R$8.400/mês) + aumento de recompra (R$5.250/mês) + economia de tempo (R$2.100/mês) = R$15.750/mês em valor gerado para um CRM de R$349/mês. ROI de 4.412% no primeiro mês pleno.',
  },
  {
    question: 'Quanto custa o no-show para uma clínica de estética por mês?',
    answer: 'Fórmula: Consultas/mês × Taxa de no-show × Ticket médio = Custo mensal. Exemplo: 200 consultas × 18% × R$380 = R$13.680/mês perdido em no-show. Com CRM reduzindo no-show em 40%, recuperação de R$5.472/mês — 15x o custo mensal de um CRM profissional.',
  },
  {
    question: 'Como calcular o impacto do recall automático no faturamento?',
    answer: 'Base de cálculo: Pacientes atendidos/mês × % com procedimento que tem recall × Taxa de conversão do recall × Ticket médio. Exemplo: 200 atendimentos × 60% com recall configurado × 20% taxa de conversão × R$350 = R$8.400/mês de receita adicional gerada pelo recall automático. Clínicas com recall bem configurado reportam crescimento de 20-35% na receita recorrente em 90 dias.',
  },
  {
    question: 'Em quanto tempo um CRM para clínica de estética se paga?',
    answer: 'O payback depende do volume: clínicas com 20-30 consultas/semana recuperam o investimento em 15-30 dias; com 30-60 consultas/semana, em 10-20 dias; com 60-120 consultas/semana, em 5-12 dias. O payback mais rápido vem da redução de no-show — o resultado é imediato quando as confirmações automáticas são ativadas, ainda na primeira semana de uso.',
  },
  {
    question: 'Qual a diferença de faturamento entre clínicas com e sem CRM?',
    answer: 'Dados de benchmark do setor (2025): clínicas com CRM clínico completo (confirmação automática + recall + no-show predictor) faturam em média 28-42% mais que clínicas similares sem sistema automatizado, controlando por localização, número de profissionais e ticket médio. A diferença vem de 3 fontes: menor no-show (+10-15% de consultas realizadas), maior taxa de recompra (+20-35%) e melhor ocupação da agenda (+8-12%).',
  },
  {
    question: 'O CRM aumenta o LTV dos pacientes de clínica de estética?',
    answer: 'Sim, de forma direta. O LTV (valor do ciclo de vida) aumenta por 3 mecanismos: (1) recall automático que traz o paciente de volta no timing correto de cada procedimento; (2) NPS automatizado que identifica detratores antes de perder o paciente; (3) histórico completo de procedimentos que permite ao profissional fazer up-sell contextualizados ("Você fez laser mês passado — já considerou adicionar microagulhamento para potencializar o resultado?"). Clínicas com CRM reportam LTV médio 35-55% maior que sem sistema.',
  },
  {
    question: 'Vale a pena investir em CRM para uma clínica pequena com poucos pacientes?',
    answer: 'Sim, a partir de 20 consultas por semana. Para uma clínica pequena com 25 consultas/semana, ticket médio R$250 e no-show de 15%: custo do no-show = R$2.250/mês. Com CRM Starter (R$149/mês) reduzindo no-show em 40%, recuperação = R$900/mês. ROI de 504% só na redução de no-show. O recall automático adiciona mais receita. Qualquer clínica com pacientes regulares se beneficia da automação.',
  },
]

/**
 * FAQ data for Quanto Custa CRM para Clínica de Estética blog post
 */
export const quantoCustaCrmFAQs: FAQItem[] = [
  {
    question: 'Quanto custa um CRM para clínica de estética em 2026?',
    answer: 'A faixa de mercado em 2026 vai de R$149/mês (planos básicos para 1 profissional) a R$2.500+/mês (enterprise para redes multi-unidade). A mediana para clínicas com 1-5 profissionais está entre R$299-599/mês para um sistema completo com WhatsApp, prontuário e recall incluídos. O Estetia CRM tem 3 planos: Starter R$149/mês, Pro R$349/mês e Business R$799/mês — todos com as funcionalidades essenciais incluídas sem add-ons obrigatórios.',
  },
  {
    question: 'Existe CRM gratuito para clínica de estética?',
    answer: 'Existem planos freemium, mas invariavelmente com limitações críticas para uso profissional: sem integração WhatsApp, sem prontuário eletrônico ou sem recall automático. Para uso profissional completo, o investimento mínimo realista é R$149-200/mês. Considere: um único paciente que retorna por recall automático em um procedimento de R$250 já cobre o custo mensal de um plano básico.',
  },
  {
    question: 'O WhatsApp Business API tem custo extra no CRM?',
    answer: 'Depende do sistema. Alguns sistemas cobram a integração WhatsApp como add-on (+R$99-299/mês). No Estetia CRM, a integração está incluída em todos os planos. Separadamente, há o custo da API da Meta por conversa: R$0,05-0,15 por "conversa de 24 horas" — não por mensagem individual. Uma clínica com 100 consultas/semana paga R$40-80/mês de custo de API Meta. Esse valor é cobrado diretamente pela Meta, não pelo sistema de CRM.',
  },
  {
    question: 'Plano anual de CRM compensa para clínica de estética?',
    answer: 'Compensa após validar o sistema por 30-60 dias. O desconto típico no plano anual é de 15-25% (economizando R$500-1.000/ano no plano Pro). A recomendação: use o trial de 14 dias, fique no plano mensal nos primeiros 2 meses para validar que o sistema funciona para o fluxo da sua clínica, e migre para o anual quando tiver certeza. Fazer o anual antes de validar gera lock-in em um sistema que pode não ser ideal.',
  },
  {
    question: 'Quais custos escondidos devo verificar antes de contratar um CRM?',
    answer: 'Os mais comuns: (1) limite de pacientes com cobrança por excedente; (2) WhatsApp como add-on pago; (3) prontuário eletrônico separado; (4) taxa de setup/onboarding de R$300-2.000; (5) suporte premium em plano adicional; (6) taxa de exportação de dados ao cancelar. Pergunte por escrito sobre cada um antes de assinar. Um sistema "mais barato" com todos esses extras pode custar 2-3x mais que um sistema all-in.',
  },
  {
    question: 'CRM para dermatologia custa mais que para estética?',
    answer: 'Não necessariamente. Sistemas verticais como o Estetia CRM cobrem estética e dermatologia no mesmo plano, com configurações específicas para cada especialidade. Sistemas especializados exclusivamente em dermatologia hospitalar ou convênios intensivos podem ter preços diferentes, mas para dermatologistas com foco em procedimentos estéticos, o CRM clínico padrão cobre todas as necessidades.',
  },
  {
    question: 'O custo total de propriedade (TCO) de um CRM muda muito entre sistemas?',
    answer: 'Sim, e pode ser decisivo. Um sistema com assinatura de R$199/mês mas com add-ons obrigatórios de R$350/mês (WhatsApp + prontuário + recall) tem TCO de R$549/mês — mais caro que um sistema all-in de R$349/mês. Sempre calcule o TCO real: assinatura + add-ons + custo de API WhatsApp + taxa de setup + custo de tempo de onboarding. O sistema mais transparente na precificação é frequentemente mais barato no longo prazo.',
  },
]

/**
 * FAQ data for Como Migrar CRM para Clínica de Estética blog post
 */
export const migrarCrmClinicaFAQs: FAQItem[] = [
  {
    question: 'Quanto tempo leva a migração para um novo CRM clínico?',
    answer: 'Com o processo correto, a migração completa leva 5-7 dias úteis: Dias 1-2 para configuração do novo sistema (profissionais, procedimentos, WhatsApp), Dia 3 para importação da base de pacientes, Dias 4-5 para operação em paralelo e validação, Dias 6-7 para treinamento da equipe e desativação do sistema antigo. Para bases acima de 2.000 pacientes ou com muito histórico em papel, planejar 10-14 dias.',
  },
  {
    question: 'Como exportar meus dados do sistema atual de CRM?',
    answer: 'A maioria dos sistemas modernos permite exportação em CSV ou Excel na área de configurações/conta do usuário. Se não houver essa opção visível, solicite por escrito ao suporte — é obrigação legal do fornecedor pela LGPD (direito à portabilidade de dados, Art. 18, V). Se o fornecedor dificultar ou cobrar pela exportação, isso é sinal de má prática e você deve insistir juridicamente ou buscar outro fornecedor.',
  },
  {
    question: 'Posso perder dados ao migrar para um novo CRM?',
    answer: 'O risco existe se a migração for feita sem processo adequado, mas é totalmente evitável. As 3 proteções essenciais: (1) exportação completa do sistema antigo como backup antes de qualquer ação; (2) importação com validação de amostra antes da importação completa; (3) operação em paralelo por 48-72 horas conferindo agendamentos futuros em ambos os sistemas. Com essas 3 camadas, a probabilidade de perda de dados é mínima.',
  },
  {
    question: 'Como digitalizar prontuários físicos ao migrar para CRM?',
    answer: 'A abordagem mais prática é a migração progressiva por atividade: quando um paciente retorna para consulta, a recepcionista digitaliza o histórico relevante da ficha física no prontuário eletrônico. Em 3-6 meses, 80-90% dos pacientes ativos terão prontuário digital completo sem nenhum sprint de digitalização. Para as consultas imediatas, digitalize pelo menos: alergias/contraindicações, últimos 2-3 procedimentos e dados de contato.',
  },
  {
    question: 'A equipe precisa de muito treinamento para o novo CRM?',
    answer: 'Com um sistema bem projetado, o treinamento efetivo leva 2-4 horas. O treinamento mais eficaz é prático com casos reais: a recepcionista agenda uma consulta real, confirma via WhatsApp e emite um recibo; o profissional acessa um prontuário real e registra um procedimento. Crie um "guia de 1 página" por função com os 5 fluxos mais comuns — é o documento que a equipe vai consultar nos primeiros dias.',
  },
  {
    question: 'Devo cancelar o sistema antigo imediatamente após migrar?',
    answer: 'Não. Mantenha acesso ao sistema antigo por pelo menos 30 dias após a migração completa. Histórico pré-migração, referências de procedimentos anteriores e dúvidas sobre dados migrados são comuns nas primeiras semanas. Se o sistema antigo cobrar mensalidade, verifique se há opção de "acesso somente leitura" por menos — ou simplesmente inclua no orçamento da transição 1 mês extra de assinatura do sistema antigo.',
  },
  {
    question: 'O suporte do novo CRM ajuda na migração?',
    answer: 'Deve ajudar — se não oferece suporte à migração, é um sinal de alerta. No Estetia CRM, o onboarding inclui uma chamada dedicada onde o especialista executa a importação junto com você, valida a integridade dos dados e configura as automações de WhatsApp. Para bases acima de 500 pacientes, o onboarding dedicado é a forma mais segura de garantir que a migração ocorra sem perda de dados.',
  },
]

/**
 * FAQ data for Comparar Sistema de Gestão para Clínica de Estética blog post
 */
export const compararSistemaClinicaFAQs: FAQItem[] = [
  {
    question: 'Qual a diferença entre sistema de gestão clínica e CRM para clínica de estética?',
    answer: 'Na prática do mercado brasileiro, os termos se sobrepõem para clínicas de estética. Um CRM clínico completo inclui: gestão de relacionamento com paciente (CRM), agenda inteligente com automações, prontuário eletrônico, analytics de KPIs e conformidade LGPD. "Sistema de gestão clínica" enfatiza o operacional; "CRM" enfatiza o relacionamento com o paciente. Os melhores produtos entregam ambos na mesma plataforma integrada.',
  },
  {
    question: 'Como comparar sistemas de gestão para clínica de estética objetivamente?',
    answer: 'Use um scorecard com 6 dimensões: (1) Fluxo clínico nativo — anamnese, prontuário e recall foram construídos para estética ou adaptados? (2) WhatsApp — usa Cloud API oficial Meta (Nível 3+) ou ferramentas informais? (3) LGPD Art. 11 — conformidade documentada? (4) Suporte — chat em tempo real em português? (5) Modelo de preços — exportação gratuita, sem lock-in? (6) Estabilidade — changelog público, comunidade ativa? Some os pontos, elimine os que não passam nos critérios eliminatórios.',
  },
  {
    question: 'Sistema de agendamento para salão de beleza funciona para clínica de estética?',
    answer: 'Não para uso profissional completo. Software de salão gerencia horários e serviços; CRM clínico para estética gerencia o relacionamento clínico: prontuário com histórico médico, anamnese com alertas de contraindicações, recall baseado em timing médico de procedimento, conformidade LGPD Art. 11 para dados sensíveis de saúde. Usar software de salão em clínica de estética é como usar Excel para gestão de hospital — funciona para o básico, mas deixa de capturar tudo que realmente importa.',
  },
  {
    question: 'Preciso de sistemas diferentes para estética facial e corporal?',
    answer: 'Não. Um CRM clínico vertical moderno como o Estetia CRM cobre estética facial (toxina, preenchimento, peelings, laser facial), estética corporal (criolipólise, radiofrequência, laser corporal, depilação) e dermatologia estética na mesma plataforma. Cada área tem seus templates de anamnese, prontuário e recall configurados especificamente. O gestor tem visão unificada de todos os procedimentos no mesmo dashboard.',
  },
  {
    question: 'Como testar um sistema de gestão para clínica sem comprometer a operação?',
    answer: 'Faça o trial sem migrar dados reais inicialmente. Configure o sistema com 5-10 pacientes fictícios e execute os fluxos críticos: agendar, confirmar via WhatsApp, registrar procedimento, buscar histórico. Se o sistema passar nesse teste básico, importe 20-30 pacientes reais para validar a importação. Só migre a base completa quando confirmar que o sistema funciona como esperado. Nenhuma operação real precisa ser interrompida durante esse processo.',
  },
  {
    question: 'Sistema de gestão clínica precisa ter integração com convênios (TISS)?',
    answer: 'Depende do perfil da clínica. Clínicas de estética que atendem exclusivamente procedimentos estéticos (não cobertos por planos de saúde) não precisam de TISS. Clínicas mistas que também atendem dermatologia com convênio precisam de suporte TISS/TUSS. O Estetia CRM Business inclui módulo de convênios — para clínicas puramente estéticas, o módulo não é necessário e não agrega custo.',
  },
  {
    question: 'Como saber se um sistema de gestão clínica vai ser adotado pela minha equipe?',
    answer: 'O teste definitivo: deixe a recepcionista usar o sistema sozinha por 30 minutos, sem treinamento, e execute os 3 fluxos mais comuns da sua clínica. O que ela não consegue fazer intuitivamente será o ponto de resistência no dia a dia. Sistemas com alta taxa de adoção têm fluxos tão óbvios que novos funcionários produzem resultado no primeiro dia. Se a recepcionista precisar de 2+ horas de treinamento para fazer o básico, o sistema tem problemas de usabilidade. <a href="/pt-BR/register">Testar o Estetia CRM grátis →</a>',
  },
]

/**
 * FAQ data for Gestão de Toxina Botulínica blog post
 */
export const toxinaBotulinicaFAQs: FAQItem[] = [
  {
    question: 'Com que frequência devo fazer recall para pacientes de botox?',
    answer: 'O ideal é configurar o recall por região tratada: 80–90 dias para glabela, pés de galinha e testa; 120–150 dias para masseter e pescoço; 180–240 dias para hiperidrose. Recall enviado cedo (quando o efeito ainda está pleno) tem baixa taxa de conversão. Enviado tarde, o paciente já buscou outra clínica. O timing certo é quando o efeito começa a diminuir — entre 80% e 90% do tempo médio de duração.',
  },
  {
    question: 'Como precificar toxina botulínica de forma competitiva sem comprometer a margem?',
    answer: 'O modelo híbrido funciona melhor: preço por região com mínimo de unidades incluído, mais custo adicional por unidade extra. Calcule o custo real considerando produto, materiais descartáveis, tempo do profissional e estrutura — muitas clínicas descobrem que preços abaixo de R$500 para glabela operam com margem negativa. A competitividade deve vir da experiência e do resultado, não do menor preço.',
  },
  {
    question: 'Qual é o LTV médio de um paciente fiel de toxina botulínica?',
    answer: 'Um paciente que retorna 3 vezes por ano com ticket médio de R$900 e permanece ativo por 4 anos tem LTV de R$10.800 — apenas com botox. Com upsell de masseter ou skincare, o LTV pode chegar a R$15.000–20.000 por paciente em 5 anos. Isso muda a perspectiva sobre custo de aquisição: R$150–200 de CAC para um LTV de R$10.000+ é extremamente viável.',
  },
  {
    question: 'Como reduzir o churn de pacientes de botox?',
    answer: 'As três alavancas principais são: (1) recall automático no timing certo por região tratada; (2) fotodocumentação com comparativo antes/depois no retorno — ver o resultado visualmente é o maior argumento de retenção; (3) plano de tratamento progressivo — quando o paciente sabe que na próxima sessão será avaliada uma nova área, tem motivo concreto para voltar. Clínicas que combinam essas três estratégias reportam churn abaixo de 12% em 6 meses.',
  },
  {
    question: 'É necessário um CRM específico para clínicas de estética ou serve um CRM genérico?',
    answer: 'Para gestão de botox especificamente, um CRM genérico tem limitações críticas: não tem campo de região tratada, não calcula recall por procedimento, não integra com WhatsApp Business API para disparo automático e não exibe KPIs clínicos. Um CRM vertical como o Estetia CRM tem esses módulos nativos — sem customização cara ou planilhas paralelas.',
  },
]

/**
 * FAQ data for Preenchimento com Ácido Hialurônico blog post
 */
export const preenchimentoAhFAQs: FAQItem[] = [
  {
    question: 'Qual é o melhor canal para captar pacientes de preenchimento com ácido hialurônico?',
    answer: 'Instagram e SEO local são os dois canais principais. Instagram funciona para os perfis em fase de conscientização e consideração — conteúdo educativo, antes/depois e depoimentos. SEO local (Google Meu Negócio + site) funciona para quem já decidiu fazer e está buscando clínica na região. O ideal é ter presença em ambos: Instagram nutre, Google converte.',
  },
  {
    question: 'Vale oferecer avaliação gratuita para captar pacientes de preenchimento?',
    answer: 'Sim, desde que a avaliação seja estruturada para converter. Uma avaliação gratuita sem processo claro vira consulta de cortesia sem resultado comercial. Avaliação bem estruturada converte 60–80% dos pacientes — tornando o custo da avaliação grátis altamente justificável pelo LTV do paciente captado.',
  },
  {
    question: 'Como responder a pacientes que pedem preço por Instagram sem agendar avaliação?',
    answer: 'Responda com âncora de faixa ("nosso preenchimento de sulco parte de R$X") e convite para avaliação gratuita. Nunca dê preço exato sem ver o paciente. A resposta ideal: "O valor varia conforme a área e o volume indicado — posso te dizer com precisão na avaliação. Você tem disponibilidade essa semana para uma avaliação gratuita?"',
  },
  {
    question: 'Quanto tempo dura o preenchimento com ácido hialurônico?',
    answer: 'A duração varia por área: lábios duram 6–9 meses; sulcos nasogenianos, 9–12 meses; maçãs do rosto, olheiras, queixo e mandíbula, 12–18 meses. O timing ideal do recall é 80–85% do tempo de duração esperada por área — quando o efeito começa a diminuir mas antes de desaparecer completamente.',
  },
  {
    question: 'Como superar a objeção de preço em preenchimento com ácido hialurônico?',
    answer: 'Divida o custo no tempo: "O ácido hialurônico dura entre 12 e 18 meses — isso representa um custo por mês de R$X". Além disso, ofereça opção de entrada menor: "Podemos começar com a área que mais te incomoda e ver o resultado antes de decidir sobre as outras." Valor agregado e âncora temporal reduzem a percepção de alto custo.',
  },
]

/**
 * FAQ data for Harmonização Facial blog post
 */
export const harmonizacaoFacialFAQs: FAQItem[] = [
  {
    question: 'Como precificar harmonização facial em uma cidade com concorrência de preço baixo?',
    answer: 'Competir por preço em harmonização facial é estratégia de curto prazo com margem baixa. A alternativa sustentável é competir por resultado e experiência: portfólio documentado, depoimentos de pacientes reais, certificações do produto (ANVISA) e da técnica. Pacientes de alto ticket buscam o melhor resultado, não o menor preço.',
  },
  {
    question: 'É possível vender protocolo completo de harmonização na primeira consulta?',
    answer: 'Sim, para pacientes que chegam já com essa intenção (geralmente indicados). Para pacientes pela primeira vez, o modelo de sessões progressivas funciona melhor — começa por uma área, mostra o resultado, e a segunda sessão é decisão muito mais fácil. Sempre deixe o plano completo documentado no prontuário para que o paciente conheça o caminho.',
  },
  {
    question: 'Quanto custa um protocolo de harmonização facial no Brasil em 2026?',
    answer: 'Um protocolo completo de harmonização facial (toxina zona superior + preenchimento de 1–2 áreas + bioestimulador) tem custo total de R$3.800 a R$6.100, dependendo das áreas tratadas, dos produtos utilizados e da localidade. O custo direto dos produtos e materiais para o profissional fica entre R$970 e R$1.720, com margem bruta de 65–75%.',
  },
  {
    question: 'Como lidar com pacientes que pedem desconto em pacote de harmonização?',
    answer: 'Em vez de dar desconto direto (que desvaloriza a expertise), ofereça alternativas: sessão de bônus de acompanhamento sem custo adicional, ou desconto percentual para pagamento à vista (8–10%). Valor agregado funciona melhor do que redução de preço — e não cria o precedente de que o preço é negociável.',
  },
  {
    question: 'Qual é o papel do CRM na gestão de pacientes de harmonização facial?',
    answer: 'Para harmonização, o CRM precisa registrar: protocolo completo proposto (com itens e quantidades), o que foi feito em cada sessão, fotos de evolução por data, recall configurado por componente e plano de próximas sessões. Sem esse registro sistemático, o profissional depende de memória para atender o mesmo paciente em sessões diferentes — comprometendo a experiência e a continuidade.',
  },
]

/**
 * FAQ data for Depilação a Laser blog post
 */
export const depilacaoLaserFAQs: FAQItem[] = [
  {
    question: 'Quantas sessões de depilação a laser um paciente precisa?',
    answer: 'O número padrão recomendado é de 6 a 8 sessões para a maioria das áreas, mas pode variar conforme o fototipo do paciente, a grossura e cor do pelo e a área tratada. Por isso é importante fazer avaliação antes de vender o pacote — para dimensionar corretamente e não gerar expectativas irreais.',
  },
  {
    question: 'Como evitar que pacientes abandonem o pacote de depilação laser no meio?',
    answer: 'As três alavancas são: (1) agendar a próxima sessão sempre antes do paciente sair — compromisso já marcado tem muito maior taxa de comparecimento; (2) recall automático quando o intervalo ideal está próximo de vencer sem agendamento; (3) atualizações de resultado ao paciente após cada sessão — "você está na sessão 4 de 8, com X% de redução visível" cria engajamento com o processo.',
  },
  {
    question: 'O que é manutenção de depilação a laser e quando é necessária?',
    answer: 'Após o protocolo inicial (6–8 sessões), a maioria dos pelos é eliminada, mas pelos em fases de crescimento diferentes podem surgir ao longo dos meses. A manutenção é uma sessão anual (ou a cada 12–18 meses) para eliminar pelos residuais e manter o resultado. É muito menos intensa que o protocolo inicial — geralmente 1 sessão por ano é suficiente.',
  },
  {
    question: 'Qual o intervalo correto entre sessões de depilação a laser?',
    answer: 'O intervalo varia por área: axilas e virilha a cada 30–45 dias; pernas (meia e inteira) a cada 45–60 dias; buço a cada 30–45 dias. O intervalo correto respeita o ciclo de crescimento dos pelos da área tratada. Intervalos muito longos comprometem o resultado e a satisfação do paciente — por isso o recall automático de sessão atrasada é fundamental.',
  },
  {
    question: 'Como estruturar pacotes combo de depilação a laser para aumentar o ticket médio?',
    answer: 'Combine áreas complementares com desconto por volume: Axilas + Virilha (áreas mais demandadas juntas), Pernas Completas + Virilha, Full Body (todas as áreas com desconto maior). O desconto de pacote combo é justificável porque você concentra múltiplas áreas no mesmo horário, reduzindo o custo de atendimento por área. Repassar parte dessa eficiência como desconto aumenta o ticket médio sem comprometer a margem.',
  },
]

/**
 * FAQ data for Limpeza de Pele e Protocolos Faciais blog post
 */
export const limpezaPeleFAQs: FAQItem[] = [
  {
    question: 'Com que frequência um paciente deve fazer limpeza de pele?',
    answer: 'Depende do tipo de pele: oleosas e acneicas se beneficiam de limpeza a cada 28–30 dias; mistas, a cada 30–35 dias; normais e secas, a cada 35–45 dias; sensíveis, a cada 45–60 dias. A regularidade é mais importante do que a frequência absoluta — é melhor fazer de forma consistente do que esporadicamente.',
  },
  {
    question: 'Como usar limpeza de pele como porta de entrada para procedimentos mais avançados?',
    answer: 'O caminho natural é: primeira sessão (limpeza + diagnóstico detalhado), segunda e terceira sessões (construção de confiança + registro de evolução), terceira ou quarta sessão (apresentação de protocolo complementar baseado na queixa identificada). A chave é registrar cada sessão no prontuário — sem histórico detalhado, a progressão não é personalizada e o paciente não percebe valor na evolução.',
  },
  {
    question: 'Qual é o melhor momento para apresentar procedimentos de alto ticket para pacientes de limpeza?',
    answer: 'O momento mais eficaz é após o paciente verbalizar satisfação com o resultado — geralmente na 3ª ou 4ª sessão. A abordagem consultiva: "Você está tendo ótimos resultados. Para potencializar ainda mais a [queixa que o paciente mencionou], tenho um protocolo que complementaria perfeitamente." Nunca na primeira sessão — a relação ainda não tem o nível de confiança necessário.',
  },
  {
    question: 'Limpeza de pele tem boa margem para a clínica?',
    answer: 'A margem bruta da limpeza de pele é razoável (50–65%), mas o que justifica estrategicamente o procedimento é o LTV do paciente que ela origina. Um paciente que paga R$120/mês em limpeza e migra para protocolos de R$500–800/mês em 6 meses representa R$6.000–9.000/ano de receita. Sem a limpeza como porta de entrada, esse paciente nunca teria chegado — ou teria chegado por canal muito mais caro.',
  },
  {
    question: 'Como a tecnologia pode ajudar na fidelização de pacientes de skincare?',
    answer: 'Três aplicações críticas: (1) anamnese digital com histórico acumulado por sessão — sem papel, sem perda de informação; (2) recall automático segmentado por tipo de pele — o sistema envia o lembrete no timing certo para cada paciente; (3) alerta de risco de churn — quando o intervalo entre sessões aumenta, o sistema avisa proativamente antes que o paciente desapareça.',
  },
]

/**
 * FAQ data for Bioestimuladores de Colágeno blog post
 */
export const bioestimuladoresFAQs: FAQItem[] = [
  {
    question: 'Quantas sessões de bioestimulador de colágeno são necessárias?',
    answer: 'Depende do produto: Sculptra geralmente requer 2–4 sessões com intervalos de 4–6 semanas; Radiesse e Ellansé costumam precisar de 1–2 sessões. O número varia conforme o grau de flacidez e perda de volume. A avaliação antes de vender o protocolo é fundamental para dimensionar corretamente.',
  },
  {
    question: 'Quanto custa um protocolo de bioestimulador de colágeno no Brasil?',
    answer: 'Um protocolo completo de Sculptra (2–4 sessões) custa entre R$4.500 e R$8.000 em clínicas brasileiras em 2026. Radiesse e Ellansé têm faixa de R$2.200 a R$7.000 por protocolo. O investimento é mais alto que um preenchedor pontual, mas o resultado dura 2–3× mais tempo.',
  },
  {
    question: 'Como gerenciar as expectativas do paciente de bioestimulador?',
    answer: 'A chave é educação antes da primeira sessão: explicar que o resultado é progressivo (4–8 semanas para aparecer), que pode haver nódulos temporários com Sculptra, e mostrar fotos de outros pacientes no mesmo timeline. Clínicas que fazem essa gestão têm NPS muito mais alto — mesmo com resultado técnico idêntico.',
  },
  {
    question: 'Como configurar o recall de manutenção de bioestimulador no CRM?',
    answer: 'Configure o recall por produto: Sculptra em 18–20 meses após a última sessão; Radiesse em 12–13 meses; Ellansé conforme a versão (S: 10m, M: 20m, L: 30m). O recall enviado quando o resultado começa a diminuir tem taxa de conversão de 40–60% para manutenção.',
  },
  {
    question: 'Bioestimulador pode ser combinado com outros procedimentos?',
    answer: 'Sim, e a combinação é muito comum: bioestimulador para restaurar volume e estimular colágeno, toxina botulínica para relaxar musculatura de expressão, e preenchimento com ácido hialurônico para correção pontual. Cada procedimento age em uma camada diferente — a sinergia melhora o resultado global.',
  },
]

/**
 * FAQ data for Criolipólise e Gordura Localizada blog post
 */
export const criolipoliseFAQs: FAQItem[] = [
  {
    question: 'Quantas sessões de criolipólise são necessárias para ver resultado?',
    answer: 'Para a maioria das áreas, 1 sessão já mostra resultado visível em 8–12 semanas. Para resultado mais intenso, 2 sessões com 60–90 dias de intervalo são recomendadas. O resultado máximo de cada sessão é avaliado 10–12 semanas após a aplicação — por isso o cronograma precisa ser respeitado antes de decidir sobre uma segunda sessão.',
  },
  {
    question: 'Como estruturar um pacote de criolipólise para aumentar o ticket médio?',
    answer: 'Combos de áreas complementares são a forma mais eficaz: abdômen + flancos, culote + face interna da coxa. Ofereça desconto de 15–20% no combo versus áreas separadas — o desconto é viável porque você concentra o atendimento no mesmo horário. Pacotes de 2 sessões por área também têm ticket maior e garantem que o paciente complete o protocolo.',
  },
  {
    question: 'Como reduzir o abandono de protocolo em criolipólise?',
    answer: 'Três estratégias combinadas: (1) agendar a segunda sessão antes do paciente sair da primeira — compromisso pré-existente tem taxa de comparecimento 2–3× maior; (2) recall automático em 55 dias alertando que está chegando a hora da segunda sessão; (3) compartilhar o resultado parcial com o paciente em 6 semanas — mostrar que está funcionando cria engajamento.',
  },
  {
    question: 'Criolipólise tem manutenção?',
    answer: 'As células de gordura destruídas pela criolipólise são eliminadas permanentemente. Porém, se o paciente ganhar peso, outras células podem se acumular na região. A manutenção anual (1 sessão por área) é uma boa prática para quem quer garantir o resultado a longo prazo e representa receita recorrente estruturada para a clínica.',
  },
  {
    question: 'Quanto tempo dura o resultado da criolipólise?',
    answer: 'As células de gordura destruídas não se regeneram — o resultado é permanente para essas células. O resultado completo é visível 8–12 semanas após a sessão. O corpo elimina as células destruídas gradualmente por metabolismo natural. Com estilo de vida saudável, o resultado se mantém por anos; ganho de peso pode resultar em acúmulo de novas células na região.',
  },
]

/**
 * FAQ data for Microagulhamento blog post
 */
export const microagulhamentoFAQs: FAQItem[] = [
  {
    question: 'Quantas sessões de microagulhamento são necessárias para ver resultado?',
    answer: 'Melhora visível geralmente aparece a partir da 3ª sessão. O resultado completo do protocolo é avaliado 4–6 semanas após a última sessão. Para cicatrizes de acne, o protocolo típico é de 4–6 sessões; para rejuvenescimento, 3–4 sessões são geralmente suficientes.',
  },
  {
    question: 'O que é drug delivery no microagulhamento e vale a pena?',
    answer: 'Drug delivery é a aplicação de ativos (vitamina C, fatores de crescimento, ácido hialurônico) imediatamente após o microagulhamento, aproveitando os microcanais para aumentar a absorção. Vale muito: potencializa o resultado e justifica aumento de ticket de R$100–400 por sessão.',
  },
  {
    question: 'Com que frequência deve ser feita a manutenção de microagulhamento?',
    answer: 'Após o protocolo inicial (3–6 sessões), a manutenção trimestral (a cada 90–120 dias) é suficiente para a maioria dos pacientes de rejuvenescimento. Para tratamento ativo de cicatrizes em progresso, a frequência pode ser mensal. O profissional avalia no retorno o que é mais adequado.',
  },
  {
    question: 'Microagulhamento pode ser feito em qualquer tipo de pele?',
    answer: 'O microagulhamento tem boa tolerância em diferentes fototipos, mas requer cuidado especial em fototipos mais altos (IV–VI) pelo risco de hiperpigmentação pós-inflamatória. Contraindicações absolutas: acne ativa intensa, dermatites ativas, uso atual de isotretinoína e feridas abertas.',
  },
  {
    question: 'Qual a diferença entre microagulhamento facial e do couro cabeludo?',
    answer: 'O mecanismo é o mesmo — indução de colágeno e aumento de absorção de ativos — mas as indicações e ativos são diferentes. No couro cabeludo, o microagulhamento é indicado para alopecia androgenética e é combinado com minoxidil, finasterida tópica ou fatores de crescimento (PRP). O intervalo entre sessões no couro cabeludo é menor (14–21 dias) versus o facial (28–35 dias).',
  },
]

/**
 * FAQ data for Peeling Químico blog post
 */
export const peelingQuimicoFAQs: FAQItem[] = [
  {
    question: 'Qual peeling químico é melhor para manchas no rosto?',
    answer: 'Depende do tipo de mancha: manchas pós-inflamatórias (acne) respondem bem ao ácido mandélico ou glicólico; melasma exige abordagem cuidadosa com TCA de baixa concentração ou peelings despigmentantes combinados com fotoproteção; manchas solares respondem bem ao glicólico e retinóico. A avaliação por profissional qualificado é fundamental.',
  },
  {
    question: 'Peeling químico dói? Tem tempo de recuperação?',
    answer: 'Peelings superficiais (salicílico, glicólico, mandélico) causam no máximo ardência leve durante a aplicação, sem downtime significativo — descamação sutil por 2–3 dias. Peelings médios (TCA) causam ardência moderada e descamação visível por 4–7 dias. Para quem não pode ter downtime, os peelings superficiais são a melhor opção.',
  },
  {
    question: 'Quantas sessões de peeling são necessárias?',
    answer: 'Para peelings superficiais: 4–6 sessões com 15–28 dias de intervalo para resultado consistente. Para peelings médios: 2–4 sessões com 30–45 dias de intervalo. O resultado começa após a 2ª sessão e consolida 4–6 semanas após a última sessão do ciclo. Manutenção mensal ou bimestral é recomendada para acne e melasma.',
  },
  {
    question: 'Peeling químico pode ser feito em pele negra ou morena escura?',
    answer: 'Sim, mas com escolha criteriosa do ácido e concentração. Fototipos IV–VI têm maior risco de hiperpigmentação pós-inflamatória com peelings mais agressivos. Ácidos mandélico, lático e fítico têm melhor perfil de segurança para fototipos altos. A avaliação do fototipo (escala de Fitzpatrick) e o preparo da pele com despigmentantes antes do peeling são essenciais.',
  },
  {
    question: 'Peeling químico pode ser combinado com microagulhamento?',
    answer: 'Sim, e a combinação está entre as tendências mais fortes de 2026. O microagulhamento cria microcanais que aumentam a penetração do ácido; o peeling potencializa a renovação celular iniciada pelo microagulhamento. O resultado combinado é superior a qualquer um isolado, com ticket 50–80% maior que o procedimento único.',
  },
]

/**
 * FAQ data for Fios de PDO (Lifting) blog post
 */
export const fiosPdoFAQs: FAQItem[] = [
  {
    question: 'Quanto dura o resultado de fios de PDO?',
    answer: 'Depende do tipo: fios mono e twist duram 6–9 meses; fios cog (com ganchos, para sustentação) duram 12–18 meses; fios de PLLA ou PDLLA duram 18–24 meses. Após a absorção do fio, o colágeno estimulado mantém parte do resultado. A manutenção no timing certo preserva o resultado de forma contínua.',
  },
  {
    question: 'Fios de PDO dói? Qual o tempo de recuperação?',
    answer: 'O procedimento é realizado com anestesia local, tornando o desconforto mínimo. Após, é comum leve inchaço, hematomas pontuais e sensação de tensão por 3–7 dias. Irregularidades táteis nos primeiros 7–14 dias se resolvem espontaneamente. A maioria retorna às atividades normais em 24–48 horas, evitando exercícios intensos por 1 semana.',
  },
  {
    question: 'Qual a diferença entre fios de PDO e preenchimento com ácido hialurônico?',
    answer: 'Mecanismos complementares: o preenchimento com ácido hialurônico repõe volume dérmico; os fios de PDO criam sustentação mecânica e estímulo de colágeno. Para ptose (queda) de tecidos, os fios são mais indicados; para perda de volume, o preenchimento. Muitos protocolos combinam ambos para resultado completo.',
  },
  {
    question: 'Como a clínica deve registrar o protocolo de fios no prontuário?',
    answer: 'O prontuário de fios de PDO deve incluir: tipo e quantidade de fios por área, técnica utilizada, fotos padronizadas pré e pós-procedimento, termo de consentimento informado específico, orientações pós-procedimento e data de recall configurada. Sem esse registro, a continuidade do tratamento e a documentação legal ficam comprometidas.',
  },
  {
    question: 'Quanto custa um protocolo de fios de PDO no Brasil?',
    answer: 'Os preços variam por região e profissional: lifting de mandíbula e jowl fica entre R$2.800 e R$5.000; sobrancelha (Fox Eyes) entre R$1.500 e R$3.000; pescoço entre R$1.800 e R$3.500; Full Face Lifting entre R$6.000 e R$12.000. O custo por mês de resultado é competitivo comparado a manutenções frequentes de preenchimento na mesma área.',
  },
]
