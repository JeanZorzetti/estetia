const fs = require('fs')
const path = require('path')

const BASE = path.join(__dirname, '..')

function buildFeatures(lang) {
  const isPt = lang === 'pt-BR'

  const t = {
    // meta
    metaTitle: isPt ? 'Funcionalidades | Estetia CRM' : 'Features | Estetia CRM',
    metaDesc: isPt
      ? 'Agenda inteligente, anamnese digital, recall automático via WhatsApp, prontuário eletrônico, Estetia IA e muito mais. Tudo para clínicas de estética e dermatologia.'
      : 'Intelligent scheduling, digital anamnesis, automatic WhatsApp recall, electronic records, Estetia AI and more. All for aesthetics and dermatology clinics.',
    metaOgTitle: isPt ? 'Funcionalidades — Estetia CRM' : 'Features — Estetia CRM',
    metaOgDesc: isPt
      ? 'Conheça todas as ferramentas do Estetia CRM para clínicas de estética: agenda, anamnese, recall, IA, LGPD e relatórios.'
      : 'Discover all Estetia CRM tools for aesthetic clinics: scheduling, anamnesis, recall, AI, LGPD compliance and reports.',

    // hero
    heroBadge: isPt ? 'Plataforma Completa' : 'Complete Platform',
    heroTitle: isPt ? 'Tudo que sua clínica precisa' : 'Everything your clinic needs',
    heroSubtitle: isPt
      ? 'Do agendamento ao prontuário, do recall automático à análise financeira — o Estetia centraliza a gestão da sua clínica em um único lugar.'
      : 'From scheduling to medical records, from automatic recall to financial analysis — Estetia centralizes your clinic management in one place.',
    heroSearch: isPt ? 'Buscar funcionalidade...' : 'Search features...',
    heroCta: isPt ? 'Começar Grátis' : 'Start Free',
    heroCtaSec: isPt ? 'Ver preços' : 'View pricing',

    // section labels
    navAtend: isPt ? 'Atendimento Clínico' : 'Clinical Care',
    navComm: isPt ? 'Comunicação & IA' : 'Communication & AI',
    navMgmt: isPt ? 'Gestão & Compliance' : 'Management & Compliance',
    menuAtend: isPt ? 'Atendimento Clínico' : 'Clinical Care',
    menuComm: isPt ? 'Comunicação & IA' : 'Communication & AI',
    menuMgmt: isPt ? 'Gestão & Compliance' : 'Management & Compliance',

    // highlights
    hlTitle: isPt ? 'Destaques' : 'Highlights',
    hlSub: isPt
      ? 'As funcionalidades que fazem o Estetia se destacar para clínicas de estética e dermatologia'
      : 'The features that make Estetia stand out for aesthetic and dermatology clinics',

    // heroFeatures
    hfAgendaName: isPt ? 'Agenda Inteligente' : 'Smart Scheduling',
    hfAgendaDesc: isPt
      ? 'Agendamento online 24h, confirmação automática via WhatsApp e bloqueio inteligente de horários. Reduza no-shows em até 60%.'
      : 'Online scheduling 24/7, automatic WhatsApp confirmation and smart time blocking. Reduce no-shows by up to 60%.',
    hfAnamName: isPt ? 'Anamnese Digital' : 'Digital Anamnesis',
    hfAnamDesc: isPt
      ? 'Fichas clínicas personalizadas por procedimento, assinatura digital do paciente e armazenamento seguro conforme LGPD.'
      : 'Custom clinical forms per procedure, patient digital signature and secure storage compliant with LGPD.',
    hfRecallName: isPt ? 'Recall Automático' : 'Automatic Recall',
    hfRecallDesc: isPt
      ? 'Mensagens automáticas de retorno via WhatsApp, SMS ou e-mail. Configure gatilhos por procedimento, data ou inatividade.'
      : 'Automatic return messages via WhatsApp, SMS or email. Configure triggers by procedure, date or inactivity.',
    hfIaName: isPt ? 'Estetia IA' : 'Estetia AI',
    hfIaDesc: isPt
      ? 'Assistente clínico que sugere protocolos, preenche prontuários por voz e analisa histórico do paciente com RAG + Knowledge Graph.'
      : 'Clinical assistant that suggests protocols, fills records by voice and analyzes patient history with RAG + Knowledge Graph.',

    // sections titles
    atTitle: isPt ? 'Atendimento Clínico' : 'Clinical Care',
    atSub: isPt
      ? 'Ferramentas para um atendimento de excelência do primeiro contato ao retorno'
      : 'Tools for excellence in care from first contact to return visit',
    commTitle: isPt ? 'Comunicação & IA' : 'Communication & AI',
    commSub: isPt
      ? 'Relacionamento automatizado com pacientes, recall inteligente e IA clínica integrada'
      : 'Automated patient relationships, smart recall and integrated clinical AI',
    mgTitle: isPt ? 'Gestão & Compliance' : 'Management & Compliance',
    mgSub: isPt
      ? 'Financeiro, analytics, multi-unidade, LGPD e mobilidade para uma clínica que escala'
      : 'Finance, analytics, multi-unit, LGPD compliance and mobility for a scaling clinic',

    // cta
    ctaTitle: isPt ? 'Pronto para transformar sua clínica?' : 'Ready to transform your clinic?',
    ctaSub: isPt
      ? 'Comece grátis por 14 dias. Sem cartão de crédito, sem compromisso.'
      : 'Start free for 14 days. No credit card, no commitment.',
    ctaBtn: isPt ? 'Começar Grátis Agora' : 'Start Free Now',
    ctaBtnSec: isPt ? 'Falar com especialista' : 'Talk to a specialist',
  }

  return {
    meta: {
      title: t.metaTitle, description: t.metaDesc,
      ogTitle: t.metaOgTitle, ogDescription: t.metaOgDesc,
      twitterTitle: t.metaOgTitle, twitterDescription: t.metaOgDesc
    },
    hero: {
      badge: t.heroBadge, title: t.heroTitle, subtitle: t.heroSubtitle,
      searchPlaceholder: t.heroSearch, cta: t.heroCta, ctaSecondary: t.heroCtaSec
    },
    nav: {
      atendimento: t.navAtend,
      comunicacao_ia: t.navComm,
      gestao: t.navMgmt,
      features_menu: {
        atendimento_clinico: t.menuAtend,
        comunicacao_ia: t.menuComm,
        gestao_compliance: t.menuMgmt
      }
    },
    highlights: { title: t.hlTitle, subtitle: t.hlSub },
    heroFeatures: {
      agendaInteligente: { name: t.hfAgendaName, description: t.hfAgendaDesc },
      anamneseDigital: { name: t.hfAnamName, description: t.hfAnamDesc },
      recallAutomatico: { name: t.hfRecallName, description: t.hfRecallDesc },
      estetiaIa: { name: t.hfIaName, description: t.hfIaDesc }
    },
    sections: buildSections(isPt),
    planComparison: null, // placeholder — filled from existing below
    cta: { title: t.ctaTitle, subtitle: t.ctaSub, button: t.ctaBtn, buttonSecondary: t.ctaBtnSec }
  }
}

function buildSections(isPt) {
  const p = (pt, en) => isPt ? pt : en

  return {
    atendimento: {
      title: p('Atendimento Clínico', 'Clinical Care'),
      subtitle: p('Ferramentas para um atendimento de excelência do primeiro contato ao retorno', 'Tools for excellence in care from first contact to return visit'),
      agendaInteligente: {
        name: p('Agenda Inteligente', 'Smart Scheduling'),
        description: p('Agendamento online 24h com confirmação automática via WhatsApp e redução de no-shows.', 'Online 24/7 scheduling with automatic WhatsApp confirmation and no-show reduction.'),
        detail: {
          headline: p('Sua agenda trabalha enquanto você atende — 24 horas por dia, 7 dias por semana.', 'Your schedule works while you care for patients — 24 hours a day, 7 days a week.'),
          planInfo: p('Disponível a partir do plano Starter.', 'Available from the Starter plan.'),
          benefits: {
            '1': { title: p('Agendamento online 24h', 'Online 24/7 scheduling'), text: p('Pacientes agendam diretamente pelo link da clínica ou WhatsApp, sem precisar ligar.', 'Patients schedule directly through the clinic link or WhatsApp, no phone call needed.') },
            '2': { title: p('Confirmação automática', 'Automatic confirmation'), text: p('Mensagem automática via WhatsApp confirma o horário e reduz no-shows em até 60%.', 'Automatic WhatsApp message confirms the appointment and reduces no-shows by up to 60%.') },
            '3': { title: p('Bloqueio inteligente', 'Smart blocking'), text: p('O sistema detecta conflitos de horário e impede duplos agendamentos automaticamente.', 'The system detects scheduling conflicts and prevents double bookings automatically.') },
            '4': { title: p('Múltiplos profissionais', 'Multiple professionals'), text: p('Gerencie a agenda de toda a equipe em uma única visualização, por sala ou profissional.', 'Manage the entire team schedule in a single view, by room or professional.') },
            '5': { title: p('Lista de espera', 'Waiting list'), text: p('Pacientes entram na fila automaticamente e são notificados quando um horário abre.', 'Patients join the queue automatically and are notified when a slot opens.') },
            '6': { title: p('Sincronização Google Calendar', 'Google Calendar sync'), text: p('Sincronize com Google Calendar para visualizar tudo em um só lugar.', 'Sync with Google Calendar to see everything in one place.') }
          },
          useCases: {
            '1': { persona: p('Proprietária de clínica de estética', 'Aesthetic clinic owner'), scenario: p('Reduziu no-shows de 30% para 8% em 60 dias usando confirmação automática via WhatsApp.', 'Reduced no-shows from 30% to 8% in 60 days using automatic WhatsApp confirmation.') },
            '2': { persona: p('Dermatologista', 'Dermatologist'), scenario: p('Gerencia a agenda de 3 profissionais sem secretária, com ocupação de 95% da capacidade.', 'Manages the schedule of 3 professionals without a secretary, with 95% capacity utilization.') },
            '3': { persona: p('Studio de estética corporal', 'Body aesthetic studio'), scenario: p('Pacientes agendam pelo Instagram às 23h sem precisar de atendimento humano.', 'Patients schedule via Instagram at 11pm without needing human assistance.') }
          },
          howItWorks: {
            title: p('Como funciona', 'How it works'),
            '1': { title: p('Configure sua agenda', 'Set up your schedule'), text: p('Defina horários disponíveis, durações por procedimento e regras de cada profissional.', 'Define available hours, procedure durations and rules for each professional.') },
            '2': { title: p('Compartilhe o link', 'Share the link'), text: p('Envie o link de agendamento pelo WhatsApp, Instagram, Google ou site da clínica.', 'Send the booking link via WhatsApp, Instagram, Google or the clinic website.') },
            '3': { title: p('Paciente agenda online', 'Patient books online'), text: p('O paciente escolhe data, horário e profissional. A confirmação vai automaticamente via WhatsApp.', 'The patient chooses date, time and professional. Confirmation is sent automatically via WhatsApp.') },
            '4': { title: p('Lembrete automático', 'Automatic reminder'), text: p('24h antes, o Estetia envia lembrete automático e opção de confirmar ou reagendar.', '24h before, Estetia sends an automatic reminder with option to confirm or reschedule.') }
          }
        }
      },
      anamneseDigital: {
        name: p('Anamnese Digital', 'Digital Anamnesis'),
        description: p('Fichas clínicas personalizadas por procedimento com assinatura digital e conformidade LGPD.', 'Custom clinical forms per procedure with digital signature and LGPD compliance.'),
        detail: {
          headline: p('Fichas clínicas completas, assinadas digitalmente e armazenadas com segurança máxima.', 'Complete clinical forms, digitally signed and stored with maximum security.'),
          planInfo: p('Disponível em todos os planos.', 'Available on all plans.'),
          benefits: {
            '1': { title: p('Fichas por procedimento', 'Forms per procedure'), text: p('Modelos de anamnese específicos para estética facial, corporal, dermatologia e muito mais.', 'Specific anamnesis templates for facial aesthetics, body, dermatology and more.') },
            '2': { title: p('Assinatura digital', 'Digital signature'), text: p('Paciente assina digitalmente via tablet ou smartphone. Sem papel, sem impressão.', 'Patient signs digitally via tablet or smartphone. No paper, no printing.') },
            '3': { title: p('Conformidade LGPD', 'LGPD compliance'), text: p('Dados armazenados com criptografia AES-256. Consentimento registrado com data e IP.', 'Data stored with AES-256 encryption. Consent recorded with date and IP.') },
            '4': { title: p('Preenchimento por IA', 'AI-assisted filling'), text: p('A Estetia IA preenche campos da ficha a partir da conversa com o paciente por voz ou texto.', 'Estetia AI fills form fields from conversation with the patient by voice or text.') },
            '5': { title: p('Histórico completo', 'Complete history'), text: p('Acesse todas as fichas anteriores do paciente em um único perfil, ordenadas por data.', 'Access all previous patient forms in a single profile, sorted by date.') },
            '6': { title: p('Campos personalizados', 'Custom fields'), text: p('Adicione campos específicos da sua clínica: alergias, medicações, histórico familiar.', 'Add clinic-specific fields: allergies, medications, family history.') }
          },
          useCases: {
            '1': { persona: p('Esteticista facial', 'Facial aesthetician'), scenario: p('Eliminou 100% do papel. Fichas assinadas digitalmente, acessíveis de qualquer dispositivo.', 'Eliminated 100% of paper. Digitally signed forms, accessible from any device.') },
            '2': { persona: p('Clínica de dermatologia', 'Dermatology clinic'), scenario: p('Reduziu tempo de preenchimento de 15 para 3 minutos com preenchimento assistido pela IA.', 'Reduced filling time from 15 to 3 minutes with AI-assisted input.') },
            '3': { persona: p('Rede de clínicas', 'Clinic chain'), scenario: p('Padronizou o protocolo de anamnese em 5 unidades com um único template digital.', 'Standardized the anamnesis protocol across 5 units with a single digital template.') }
          },
          howItWorks: {
            title: p('Como funciona', 'How it works'),
            '1': { title: p('Escolha ou crie o modelo', 'Choose or create the template'), text: p('Selecione um dos modelos prontos ou personalize campos para seu tipo de atendimento.', 'Select one of the ready-made templates or customize fields for your type of care.') },
            '2': { title: p('Paciente preenche', 'Patient fills in'), text: p('Envie o link da ficha por WhatsApp ou use o tablet na recepção. Preenchimento simples e rápido.', 'Send the form link via WhatsApp or use the tablet at reception. Simple and fast filling.') },
            '3': { title: p('Assinatura digital', 'Digital signature'), text: p('Paciente assina com o dedo ou mouse. Assinatura vinculada ao CPF e armazenada com hash.', 'Patient signs with finger or mouse. Signature linked to CPF and stored with hash.') },
            '4': { title: p('Armazenamento seguro', 'Secure storage'), text: p('Ficha salva no prontuário do paciente, com histórico de versões e backup automático.', 'Form saved in the patient record, with version history and automatic backup.') }
          }
        }
      },
      prontuarioEletronico: {
        name: p('Prontuário Eletrônico', 'Electronic Medical Records'),
        description: p('Histórico completo do paciente: evoluções, fotos, protocolos e prescrições em um único lugar.', 'Complete patient history: progress notes, photos, protocols and prescriptions in one place.'),
        detail: {
          headline: p('O prontuário que acompanha cada sessão, protocolo e evolução do seu paciente.', 'The record that tracks every session, protocol and patient progress.'),
          planInfo: p('Disponível a partir do plano Pro.', 'Available from the Pro plan.'),
          benefits: {
            '1': { title: p('Evoluções por sessão', 'Session progress notes'), text: p('Registre observações clínicas após cada atendimento com campos estruturados e texto livre.', 'Record clinical observations after each appointment with structured fields and free text.') },
            '2': { title: p('Fotos evolutivas', 'Progress photos'), text: p('Antes e depois com comparação lado a lado. Fotos organizadas por data e procedimento.', 'Before and after with side-by-side comparison. Photos organized by date and procedure.') },
            '3': { title: p('Protocolos personalizados', 'Custom protocols'), text: p('Monte protocolos de tratamento com número de sessões, intervalo e produtos utilizados.', 'Build treatment protocols with number of sessions, interval and products used.') },
            '4': { title: p('Prescrições digitais', 'Digital prescriptions'), text: p('Emita prescrições cosméticas e dermato com assinatura digital do profissional.', 'Issue cosmetic and dermatological prescriptions with professional digital signature.') },
            '5': { title: p('Histórico de produtos', 'Product history'), text: p('Registre quais produtos, concentrações e técnicas foram usados em cada sessão.', 'Record which products, concentrations and techniques were used in each session.') },
            '6': { title: p('Compartilhamento seguro', 'Secure sharing'), text: p('Envie o prontuário para outro profissional ou para o paciente com link temporário criptografado.', 'Send the record to another professional or patient with an encrypted temporary link.') }
          },
          useCases: {
            '1': { persona: p('Dermatologista estética', 'Aesthetic dermatologist'), scenario: p('Acompanha evolução de tratamento de manchas com fotos comparativas mensais e notas clínicas.', 'Tracks spot treatment progress with monthly comparison photos and clinical notes.') },
            '2': { persona: p('Studio de estética corporal', 'Body aesthetic studio'), scenario: p('Registra medidas corporais, fotos e protocolo de emagrecimento de cada paciente.', 'Records body measurements, photos and weight loss protocol for each patient.') },
            '3': { persona: p('Clínica multidisciplinar', 'Multidisciplinary clinic'), scenario: p('Médico e esteticista compartilham o mesmo prontuário com permissões de acesso diferenciadas.', 'Doctor and aesthetician share the same record with differentiated access permissions.') }
          },
          howItWorks: {
            title: p('Como funciona', 'How it works'),
            '1': { title: p('Abra o perfil do paciente', "Open the patient's profile"), text: p('Acesse o prontuário pelo nome, CPF ou pelo agendamento do dia. Sempre a 1 clique.', 'Access the record by name, CPF or the day\'s appointment. Always 1 click away.') },
            '2': { title: p('Registre a evolução', 'Record the progress'), text: p('Anote observações, anexe fotos, selecione produtos e protocolos usados na sessão.', 'Note observations, attach photos, select products and protocols used in the session.') },
            '3': { title: p('IA complementa o registro', 'AI completes the record'), text: p('A Estetia IA sugere campos com base no histórico e pode ditar notas por voz.', 'Estetia AI suggests fields based on history and can dictate notes by voice.') },
            '4': { title: p('Histórico sempre disponível', 'History always available'), text: p('Acesse qualquer sessão anterior, compare fotos e veja a evolução do tratamento completo.', 'Access any previous session, compare photos and see the complete treatment progress.') }
          }
        }
      },
      evolucaoFotos: {
        name: p('Evolução com Fotos', 'Photo Progress Tracking'),
        description: p('Fotos antes e depois com comparação visual e linha do tempo do tratamento.', 'Before and after photos with visual comparison and treatment timeline.'),
        detail: {
          headline: p('Mostre resultados com comparações visuais que convencem e fidelizam pacientes.', 'Show results with visual comparisons that convince and retain patients.'),
          planInfo: p('Disponível a partir do plano Pro.', 'Available from the Pro plan.'),
          benefits: {
            '1': { title: p('Antes e depois lado a lado', 'Side-by-side before & after'), text: p('Compare fotos de sessões diferentes com slider interativo. Mostre a evolução com clareza.', 'Compare photos from different sessions with an interactive slider. Show progress clearly.') },
            '2': { title: p('Linha do tempo visual', 'Visual timeline'), text: p('Todas as fotos do paciente organizadas em timeline com data, procedimento e profissional.', 'All patient photos organized in a timeline with date, procedure and professional.') },
            '3': { title: p('Padronização de ângulos', 'Angle standardization'), text: p('Guias de posicionamento para garantir fotos comparáveis em todas as sessões.', 'Positioning guides to ensure comparable photos across all sessions.') },
            '4': { title: p('Armazenamento ilimitado', 'Unlimited storage'), text: p('Fotos armazenadas na nuvem sem limite de espaço. Organizadas por paciente e data.', 'Photos stored in the cloud with no space limit. Organized by patient and date.') },
            '5': { title: p('Compartilhamento com consentimento', 'Sharing with consent'), text: p('Compartilhe fotos com o paciente ou em redes sociais apenas com consentimento digital registrado.', 'Share photos with the patient or on social media only with registered digital consent.') },
            '6': { title: p('Mapeamento corporal', 'Body mapping'), text: p('Marque pontos no mapa corporal para indicar áreas tratadas em cada sessão.', 'Mark points on the body map to indicate treated areas in each session.') }
          },
          useCases: {
            '1': { persona: p('Esteticista corporal', 'Body aesthetician'), scenario: p('Fidelizou 80% dos pacientes de gordura localizada mostrando evolução mensal com comparativo de fotos.', 'Retained 80% of localized fat patients by showing monthly progress with photo comparisons.') },
            '2': { persona: p('Clínica de harmonização facial', 'Facial harmonization clinic'), scenario: p('Usa as fotos antes/depois nas redes sociais com consentimento digital automático integrado.', 'Uses before/after photos on social media with integrated automatic digital consent.') },
            '3': { persona: p('Dermatologista', 'Dermatologist'), scenario: p('Acompanha tratamento de acne com fotos quinzenais e notas clínicas em cada registro.', 'Tracks acne treatment with biweekly photos and clinical notes in each record.') }
          },
          howItWorks: {
            title: p('Como funciona', 'How it works'),
            '1': { title: p('Tire a foto na consulta', 'Take the photo at the appointment'), text: p('Use câmera do celular ou tablet. O app guia o ângulo e iluminação para padronizar.', 'Use phone or tablet camera. The app guides angle and lighting for standardization.') },
            '2': { title: p('Associe ao prontuário', 'Link to the record'), text: p('Foto salva automaticamente no perfil do paciente, vinculada ao procedimento do dia.', "Photo automatically saved in the patient's profile, linked to today's procedure.") },
            '3': { title: p('Compare com sessões anteriores', 'Compare with previous sessions'), text: p('Selecione duas datas e veja o antes/depois lado a lado com slider interativo.', 'Select two dates and see the before/after side by side with an interactive slider.') },
            '4': { title: p('Compartilhe com segurança', 'Share securely'), text: p('Gere link temporário para o paciente ver sua evolução. Controle total sobre privacidade.', "Generate a temporary link for the patient to see their progress. Full privacy control.") }
          }
        }
      }
    },
    comunicacao: {
      title: p('Comunicação & IA', 'Communication & AI'),
      subtitle: p('Relacionamento automatizado com pacientes, recall inteligente e IA clínica integrada', 'Automated patient relationships, smart recall and integrated clinical AI'),
      whatsappBusiness: {
        name: p('WhatsApp Business', 'WhatsApp Business'),
        description: p('Integração oficial com WhatsApp Business API via Meta. Sem risco de banimento.', 'Official integration with WhatsApp Business API via Meta. No risk of banning.'),
        detail: {
          headline: p('Toda a comunicação com seus pacientes centralizada no WhatsApp — segura, oficial e automatizada.', 'All communication with your patients centralized in WhatsApp — secure, official and automated.'),
          planInfo: p('Disponível em todos os planos. API Meta requer aprovação.', 'Available on all plans. Meta API requires approval.'),
          benefits: {
            '1': { title: p('API Oficial Meta', 'Official Meta API'), text: p('Integração via WhatsApp Business API oficial. Zero risco de banimento do número da clínica.', 'Integration via official WhatsApp Business API. Zero risk of banning the clinic number.') },
            '2': { title: p('Confirmações automáticas', 'Automatic confirmations'), text: p('Confirme agendamentos, envie lembretes e reduza no-show sem trabalho manual.', 'Confirm appointments, send reminders and reduce no-shows without manual work.') },
            '3': { title: p('Templates aprovados', 'Approved templates'), text: p('Modelos de mensagem pré-aprovados pela Meta para confirmação, recall e pós-atendimento.', 'Meta pre-approved message templates for confirmation, recall and post-appointment.') },
            '4': { title: p('Inbox centralizado', 'Centralized inbox'), text: p('Responda pacientes diretamente no Estetia, sem precisar abrir o WhatsApp no celular.', 'Reply to patients directly in Estetia, without needing to open WhatsApp on your phone.') },
            '5': { title: p('Atribuição por profissional', 'Assignment by professional'), text: p('Conversas chegam ao profissional responsável pelo paciente automaticamente.', "Conversations reach the patient's responsible professional automatically.") },
            '6': { title: p('Histórico completo', 'Complete history'), text: p('Todo o histórico de conversas salvo no prontuário do paciente para referência futura.', "The entire conversation history saved in the patient's record for future reference.") }
          },
          useCases: {
            '1': { persona: p('Recepcionista de clínica', 'Clinic receptionist'), scenario: p('Reduziu tempo no WhatsApp de 4h para 30min por dia com confirmações e respostas automáticas.', 'Reduced WhatsApp time from 4h to 30min per day with automatic confirmations and replies.') },
            '2': { persona: p('Proprietária de clínica solo', 'Solo clinic owner'), scenario: p('Atende 100% dos contatos de pacientes sem secretária usando automações do Estetia.', 'Handles 100% of patient contacts without a secretary using Estetia automations.') },
            '3': { persona: p('Rede de clínicas', 'Clinic chain'), scenario: p('Centralizou comunicação de 4 unidades em um único inbox com equipe de 2 atendentes.', 'Centralized communication from 4 units in a single inbox with a team of 2 attendants.') }
          },
          howItWorks: {
            title: p('Como funciona', 'How it works'),
            '1': { title: p('Conecte seu número', 'Connect your number'), text: p('Integre seu número de WhatsApp Business à API Meta via configuração guiada no Estetia.', 'Integrate your WhatsApp Business number with the Meta API via guided setup in Estetia.') },
            '2': { title: p('Configure automações', 'Configure automations'), text: p('Defina quais mensagens são enviadas automaticamente: confirmação, lembrete, pós-consulta.', 'Define which messages are sent automatically: confirmation, reminder, post-appointment.') },
            '3': { title: p('Paciente recebe e responde', 'Patient receives and replies'), text: p('Paciente interage diretamente no WhatsApp. Respostas chegam ao inbox do Estetia.', 'Patient interacts directly in WhatsApp. Replies arrive in the Estetia inbox.') },
            '4': { title: p('Equipe responde centralizada', 'Team replies centrally'), text: p('Profissionais respondem no app. Histórico completo preservado no perfil do paciente.', "Professionals reply in the app. Complete history preserved in the patient's profile.") }
          }
        }
      },
      recallAutomatico: {
        name: p('Recall Automático', 'Automatic Recall'),
        description: p('Traga pacientes de volta com mensagens automáticas personalizadas por procedimento e inatividade.', 'Bring patients back with automatic personalized messages by procedure and inactivity.'),
        detail: {
          headline: p('Seu maior ativo são os pacientes que já atendeu — o recall automático os traz de volta.', 'Your biggest asset is the patients you have already treated — automatic recall brings them back.'),
          planInfo: p('Disponível a partir do plano Starter.', 'Available from the Starter plan.'),
          benefits: {
            '1': { title: p('Recall por procedimento', 'Recall by procedure'), text: p('Configure mensagens diferentes para cada procedimento: limpeza de pele a cada 30 dias, botox a cada 4 meses.', 'Configure different messages for each procedure: skin cleaning every 30 days, botox every 4 months.') },
            '2': { title: p('Gatilho por inatividade', 'Inactivity trigger'), text: p('Pacientes sem agendamento há X dias recebem mensagem automática de retorno.', 'Patients without an appointment for X days receive an automatic return message.') },
            '3': { title: p('Sequência de follow-up', 'Follow-up sequence'), text: p('Defina até 3 toques automáticos com intervalos configuráveis antes de marcar como inativo.', 'Define up to 3 automatic touches with configurable intervals before marking as inactive.') },
            '4': { title: p('Personalização com nome', 'Name personalization'), text: p('Todas as mensagens incluem nome do paciente e procedimento realizado automaticamente.', 'All messages include patient name and procedure performed automatically.') },
            '5': { title: p('Métricas de recall', 'Recall metrics'), text: p('Veja taxa de retorno, receita gerada e quais procedimentos têm melhor recall.', 'See return rate, generated revenue and which procedures have the best recall.') },
            '6': { title: p('Canal preferido', 'Preferred channel'), text: p('Envie por WhatsApp, SMS ou e-mail conforme preferência do paciente registrada na ficha.', 'Send via WhatsApp, SMS or email according to the patient preference recorded in the form.') }
          },
          useCases: {
            '1': { persona: p('Clínica de estética facial', 'Facial aesthetics clinic'), scenario: p('Aumentou retorno de pacientes de limpeza de pele em 45% com recall automático a cada 28 dias.', 'Increased skin cleaning patient return by 45% with automatic recall every 28 days.') },
            '2': { persona: p('Dermatologista', 'Dermatologist'), scenario: p('Recall de revisão pós-procedimento aumentou satisfação e avaliações 5 estrelas em 60%.', 'Post-procedure review recall increased satisfaction and 5-star reviews by 60%.') },
            '3': { persona: p('Studio corporal', 'Body studio'), scenario: p('Taxa de abandono de protocolo de emagrecimento caiu de 40% para 12% com follow-ups automáticos.', 'Weight loss protocol dropout rate fell from 40% to 12% with automatic follow-ups.') }
          },
          howItWorks: {
            title: p('Como funciona', 'How it works'),
            '1': { title: p('Configure o intervalo', 'Configure the interval'), text: p('Defina após quantos dias sem agendamento o recall é disparado para cada procedimento.', 'Define after how many days without an appointment the recall is triggered for each procedure.') },
            '2': { title: p('Personalize a mensagem', 'Personalize the message'), text: p('Crie o texto com variáveis dinâmicas: nome, último procedimento, data da última visita.', 'Create the text with dynamic variables: name, last procedure, date of last visit.') },
            '3': { title: p('Estetia dispara automaticamente', 'Estetia fires automatically'), text: p('No dia certo, a mensagem é enviada via WhatsApp ou SMS sem nenhuma ação manual.', 'On the right day, the message is sent via WhatsApp or SMS with no manual action.') },
            '4': { title: p('Paciente agenda online', 'Patient books online'), text: p('Link direto de agendamento na mensagem. Paciente agenda em segundos sem precisar ligar.', 'Direct booking link in the message. Patient books in seconds without calling.') }
          }
        }
      },
      estetiaIa: {
        name: p('Estetia IA', 'Estetia AI'),
        description: p('Assistente clínico com IA que preenche fichas, sugere protocolos e analisa histórico do paciente.', 'AI clinical assistant that fills forms, suggests protocols and analyzes patient history.'),
        detail: {
          headline: p('A IA que entende de estética — e libera seu tempo para o que importa: cuidar dos pacientes.', 'The AI that understands aesthetics — and frees your time for what matters: caring for patients.'),
          planInfo: p('Disponível no plano Business e Enterprise.', 'Available on Business and Enterprise plans.'),
          benefits: {
            '1': { title: p('Preenchimento de prontuário por voz', 'Voice-filled medical records'), text: p('Dite as observações clínicas. A IA transcreve, organiza e preenche os campos do prontuário.', 'Dictate clinical observations. The AI transcribes, organizes and fills record fields.') },
            '2': { title: p('Sugestão de protocolos', 'Protocol suggestions'), text: p('Com base no histórico do paciente, a IA sugere próximos procedimentos e intervalos ideais.', 'Based on patient history, the AI suggests next procedures and ideal intervals.') },
            '3': { title: p('Knowledge Graph clínico', 'Clinical Knowledge Graph'), text: p('Base de conhecimento treinada em protocolos de estética, dermato e LGPD integrada ao assistente.', 'Knowledge base trained on aesthetic, dermatology and LGPD protocols integrated into the assistant.') },
            '4': { title: p('Análise de histórico', 'History analysis'), text: p('Identifica padrões: pacientes com maior LTV, procedimentos com mais retorno, horários de pico.', 'Identifies patterns: patients with highest LTV, procedures with most returns, peak hours.') },
            '5': { title: p('Respostas rápidas inteligentes', 'Smart quick replies'), text: p('Sugere respostas para perguntas comuns de pacientes no WhatsApp com base no contexto clínico.', 'Suggests replies to common patient WhatsApp questions based on clinical context.') },
            '6': { title: p('Detecção de riscos', 'Risk detection'), text: p('Alerta sobre contraindicações baseadas na anamnese: alergias, medicamentos, histórico familiar.', 'Alerts on contraindications based on anamnesis: allergies, medications, family history.') }
          },
          useCases: {
            '1': { persona: p('Esteticista com agenda cheia', 'Fully booked aesthetician'), scenario: p('Reduziu tempo de registro pós-consulta de 10 para 2 minutos com ditado por voz para a IA.', 'Reduced post-appointment recording time from 10 to 2 minutes with voice dictation to AI.') },
            '2': { persona: p('Dermatologista', 'Dermatologist'), scenario: p('IA detectou contraindicação a ácido retinoico na anamnese antes da aplicação de peeling.', 'AI detected a contraindication to retinoic acid in anamnesis before peel application.') },
            '3': { persona: p('Gestora de clínica', 'Clinic manager'), scenario: p('IA identificou que 30% dos pacientes de toxina botulínica nunca retornaram para manutenção — gerou campanha de recall segmentada.', 'AI identified that 30% of botulinum toxin patients never returned for maintenance — generated a segmented recall campaign.') }
          },
          howItWorks: {
            title: p('Como funciona', 'How it works'),
            '1': { title: p('Abra o assistente', 'Open the assistant'), text: p('Acesse a Estetia IA no prontuário do paciente ou no chat da plataforma.', "Access Estetia AI in the patient's record or in the platform chat.") },
            '2': { title: p('Pergunte ou dite', 'Ask or dictate'), text: p('Peça análise do histórico, sugira próximo protocolo ou dite observações da consulta.', 'Request history analysis, suggest next protocol or dictate appointment observations.') },
            '3': { title: p('IA processa com contexto clínico', 'AI processes with clinical context'), text: p('O assistente consulta o Knowledge Graph de estética + histórico do paciente para responder com precisão.', "The assistant consults the aesthetics Knowledge Graph + patient history to respond accurately.") },
            '4': { title: p('Revise e salve', 'Review and save'), text: p('Confira o resultado, edite se necessário e salve com 1 clique no prontuário.', 'Check the result, edit if necessary and save with 1 click to the record.') }
          }
        }
      },
      marketingClinico: {
        name: p('Marketing Clínico', 'Clinical Marketing'),
        description: p('Campanhas segmentadas por procedimento, programa de fidelidade e captação de novos pacientes.', 'Campaigns segmented by procedure, loyalty program and new patient acquisition.'),
        detail: {
          headline: p('Atraia pacientes novos e fidelize os atuais com marketing feito para clínicas.', 'Attract new patients and retain current ones with marketing made for clinics.'),
          planInfo: p('Disponível a partir do plano Pro.', 'Available from the Pro plan.'),
          benefits: {
            '1': { title: p('Campanhas por procedimento', 'Campaigns by procedure'), text: p('Envie promoções e novidades para pacientes segmentados por procedimento realizado ou interesse.', 'Send promotions and news to patients segmented by procedure performed or interest.') },
            '2': { title: p('Programa de fidelidade', 'Loyalty program'), text: p('Pontos por sessão, recompensas e upgrade de pacientes VIP configuráveis sem código.', 'Points per session, rewards and VIP patient upgrades configurable without code.') },
            '3': { title: p('Captação via Google Maps', 'Acquisition via Google Maps'), text: p('Prospecção automática de potenciais pacientes próximos à clínica usando Google Maps.', 'Automatic prospecting of potential patients near the clinic using Google Maps.') },
            '4': { title: p('Integração Google/Meta Ads', 'Google/Meta Ads integration'), text: p('Sincronize audiências de pacientes com Google e Meta para anúncios ultrasegmentados.', 'Sync patient audiences with Google and Meta for ultra-targeted ads.') },
            '5': { title: p('Programa de indicação', 'Referral program'), text: p('Código de indicação para pacientes atuais. Novos indicados chegam com desconto automático.', 'Referral code for current patients. New referrals arrive with an automatic discount.') },
            '6': { title: p('Métricas de marketing', 'Marketing metrics'), text: p('CAC, LTV, retorno por canal e procedimentos mais lucrativos em dashboard unificado.', 'CAC, LTV, return by channel and most profitable procedures in a unified dashboard.') }
          },
          useCases: {
            '1': { persona: p('Proprietária de clínica', 'Clinic owner'), scenario: p('Campanha de Dia da Mulher segmentada para pacientes de depilação gerou 40 agendamentos em 48h.', "Women's Day campaign targeted at hair removal patients generated 40 bookings in 48h.") },
            '2': { persona: p('Gerente de marketing', 'Marketing manager'), scenario: p('Audiência de retargeting de pacientes inativos no Meta Ads gerou CPL 70% menor que campanhas frias.', 'Retargeting audience of inactive patients on Meta Ads generated 70% lower CPL than cold campaigns.') },
            '3': { persona: p('Clínica nova', 'New clinic'), scenario: p('Prospecção via Google Maps encontrou 200 potenciais pacientes no raio de 3km para campanha de inauguração.', 'Prospecting via Google Maps found 200 potential patients within a 3km radius for the opening campaign.') }
          },
          howItWorks: {
            title: p('Como funciona', 'How it works'),
            '1': { title: p('Segmente sua base', 'Segment your base'), text: p('Filtre pacientes por procedimento, última visita, valor gasto ou qualquer campo da ficha.', 'Filter patients by procedure, last visit, amount spent or any field in the form.') },
            '2': { title: p('Crie a campanha', 'Create the campaign'), text: p('Monte a mensagem com template visual. Preview em tempo real de como vai aparecer no WhatsApp.', 'Build the message with a visual template. Real-time preview of how it will appear in WhatsApp.') },
            '3': { title: p('Dispare com 1 clique', 'Fire with 1 click'), text: p('Estetia envia em lote com rate limiting automático para evitar bloqueios da API.', 'Estetia sends in bulk with automatic rate limiting to avoid API blocks.') },
            '4': { title: p('Acompanhe os resultados', 'Track results'), text: p('Taxa de abertura, cliques, agendamentos gerados e receita atribuída à campanha.', 'Open rate, clicks, generated bookings and revenue attributed to the campaign.') }
          }
        }
      }
    },
    gestao: {
      title: p('Gestão & Compliance', 'Management & Compliance'),
      subtitle: p('Financeiro, analytics, multi-unidade, LGPD e mobilidade para uma clínica que escala', 'Finance, analytics, multi-unit, LGPD compliance and mobility for a scaling clinic'),
      financeiroTiss: {
        name: p('Financeiro & TISS', 'Finance & TISS'),
        description: p('Controle financeiro completo com emissão de NFS-e, comissões e integração com operadoras TISS.', 'Complete financial control with NFS-e issuance, commissions and TISS operator integration.'),
        detail: {
          headline: p('Do caixa diário ao faturamento de convênios — financeiro completo para clínicas.', 'From daily cash flow to health plan billing — complete finance for clinics.'),
          planInfo: p('Disponível a partir do plano Pro.', 'Available from the Pro plan.'),
          benefits: {
            '1': { title: p('Emissão de NFS-e', 'NFS-e issuance'), text: p('Emita notas fiscais de serviço eletrônicas diretamente pelo Estetia, integrado com prefeituras.', 'Issue electronic service invoices directly through Estetia, integrated with municipalities.') },
            '2': { title: p('Gestão de comissões', 'Commission management'), text: p('Cálculo automático de comissão por profissional, procedimento e metas mensais.', 'Automatic commission calculation by professional, procedure and monthly goals.') },
            '3': { title: p('Integração TISS', 'TISS integration'), text: p('Envie guias TISS para operadoras de saúde. Controle de glosas e reembolsos automatizado.', 'Send TISS guides to health operators. Automated control of adjustments and reimbursements.') },
            '4': { title: p('Caixa e fluxo de caixa', 'Cash flow'), text: p('Controle de entradas, saídas e projeção de receita. Dashboard financeiro diário.', 'Control of income, expenses and revenue projection. Daily financial dashboard.') },
            '5': { title: p('Múltiplas formas de pagamento', 'Multiple payment methods'), text: p('Cartão, Pix, boleto e parcelamento integrados ao agendamento.', 'Card, Pix, bank slip and installments integrated with scheduling.') },
            '6': { title: p('Relatórios contábeis', 'Accounting reports'), text: p('Exportação de extratos e relatórios nos formatos exigidos pelo seu contador.', 'Export statements and reports in the formats required by your accountant.') }
          },
          useCases: {
            '1': { persona: p('Clínica com convênio', 'Clinic with health plan'), scenario: p('Automatizou envio de guias TISS e reduziu retrabalho de faturamento em 80%.', 'Automated TISS guide submission and reduced billing rework by 80%.') },
            '2': { persona: p('Gestora de clínica', 'Clinic manager'), scenario: p('Comissões calculadas automaticamente no fechamento do mês — zero planilha manual.', 'Commissions calculated automatically at month close — zero manual spreadsheet.') },
            '3': { persona: p('Proprietária solo', 'Solo owner'), scenario: p('Emite NFS-e diretamente pelo Estetia sem precisar acessar sistema da prefeitura.', 'Issues NFS-e directly through Estetia without needing to access the city system.') }
          },
          howItWorks: {
            title: p('Como funciona', 'How it works'),
            '1': { title: p('Configure o financeiro', 'Set up finance'), text: p('Insira tabela de preços, percentual de comissão por profissional e configurações fiscais.', 'Enter price table, commission percentage per professional and tax settings.') },
            '2': { title: p('Pagamento integrado ao agendamento', 'Payment integrated with scheduling'), text: p('Ao confirmar consulta, sistema registra o valor e forma de pagamento automaticamente.', 'When confirming an appointment, the system records the amount and payment method automatically.') },
            '3': { title: p('Fechamento automático', 'Automatic closing'), text: p('No fechamento mensal, comissões são calculadas e relatório enviado por e-mail.', 'At monthly closing, commissions are calculated and report sent by email.') },
            '4': { title: p('Faturamento de convênios', 'Health plan billing'), text: p('Selecione procedimentos do período, gere guias TISS e envie para a operadora com 1 clique.', 'Select procedures for the period, generate TISS guides and send to the operator with 1 click.') }
          }
        }
      },
      analyticsPro: {
        name: p('Analytics PRO', 'Analytics PRO'),
        description: p('Dashboard completo com métricas de retenção, receita por procedimento e previsão de faturamento.', 'Complete dashboard with retention metrics, revenue by procedure and billing forecast.'),
        detail: {
          headline: p('Dados que transformam decisões clínicas em crescimento real.', 'Data that transforms clinical decisions into real growth.'),
          planInfo: p('Disponível a partir do plano Pro.', 'Available from the Pro plan.'),
          benefits: {
            '1': { title: p('Taxa de retenção de pacientes', 'Patient retention rate'), text: p('Veja quantos pacientes retornam, qual o intervalo médio e quais procedimentos têm mais fidelidade.', 'See how many patients return, the average interval and which procedures have the most loyalty.') },
            '2': { title: p('Receita por procedimento', 'Revenue by procedure'), text: p('Compare rentabilidade entre tratamentos. Identifique seus serviços mais e menos lucrativos.', 'Compare profitability between treatments. Identify your most and least profitable services.') },
            '3': { title: p('Previsão de receita', 'Revenue forecast'), text: p('Projeção baseada em histórico + agenda futura. Planeje investimentos com segurança.', 'Projection based on history + future schedule. Plan investments with confidence.') },
            '4': { title: p('Performance por profissional', 'Performance by professional'), text: p('Atendimentos, receita e taxa de retorno de cada membro da equipe.', 'Appointments, revenue and return rate for each team member.') },
            '5': { title: p('Horários de pico', 'Peak hours'), text: p('Mapa de calor de agendamentos para otimizar equipe e capacidade por turno.', 'Appointment heat map to optimize team and capacity per shift.') },
            '6': { title: p('LTV do paciente', 'Patient LTV'), text: p('Valor total de vida de cada paciente, segmentado por procedimento e perfil demográfico.', 'Total lifetime value of each patient, segmented by procedure and demographic profile.') }
          },
          useCases: {
            '1': { persona: p('Gestora de clínica', 'Clinic manager'), scenario: p('Descobriu que limpeza de pele tem LTV 3x maior que depilação — redirecionou marketing e cresceu 25%.', 'Discovered that skin cleaning has 3x higher LTV than hair removal — redirected marketing and grew 25%.') },
            '2': { persona: p('Proprietária de clínica', 'Clinic owner'), scenario: p('Previsão de receita do Analytics PRO permitiu contratar nova esteticista com 2 meses de antecedência.', 'Analytics PRO revenue forecast allowed hiring a new aesthetician 2 months in advance.') },
            '3': { persona: p('Rede de clínicas', 'Clinic chain'), scenario: p('Comparou performance entre unidades e identificou melhores práticas da unidade com maior retenção.', 'Compared performance between units and identified best practices from the unit with highest retention.') }
          },
          howItWorks: {
            title: p('Como funciona', 'How it works'),
            '1': { title: p('Dados coletados automaticamente', 'Data collected automatically'), text: p('Todo agendamento, pagamento e atendimento alimenta o analytics em tempo real.', 'Every appointment, payment and care feeds the analytics in real time.') },
            '2': { title: p('Dashboards prontos', 'Ready dashboards'), text: p('Abra o painel Analytics PRO e veja KPIs principais sem nenhuma configuração.', 'Open the Analytics PRO panel and see key KPIs with no configuration.') },
            '3': { title: p('Filtre e aprofunde', 'Filter and drill down'), text: p('Recorte por período, profissional, procedimento ou perfil de paciente.', 'Cut by period, professional, procedure or patient profile.') },
            '4': { title: p('Exporte e compartilhe', 'Export and share'), text: p('Gere relatórios em PDF ou CSV para sócios, investidores ou para análise externa.', 'Generate reports in PDF or CSV for partners, investors or external analysis.') }
          }
        }
      },
      multiUnidade: {
        name: p('Multi-Unidade', 'Multi-Unit'),
        description: p('Gerencie múltiplas unidades em uma única conta com controle de acesso por unidade.', 'Manage multiple units in a single account with per-unit access control.'),
        detail: {
          headline: p('Escale sua rede de clínicas mantendo controle total de cada unidade.', 'Scale your clinic network while maintaining full control of each unit.'),
          planInfo: p('Disponível no plano Enterprise.', 'Available on the Enterprise plan.'),
          benefits: {
            '1': { title: p('Dashboard consolidado', 'Consolidated dashboard'), text: p('Veja métricas de todas as unidades em uma tela. Receita total, pacientes ativos, ocupação.', 'See metrics from all units on one screen. Total revenue, active patients, occupancy.') },
            '2': { title: p('Controle de acesso por unidade', 'Per-unit access control'), text: p('Profissionais acessam apenas os dados da sua unidade. Gestores veem todas.', 'Professionals access only their unit data. Managers see all.') },
            '3': { title: p('Protocolos padronizados', 'Standardized protocols'), text: p('Templates de anamnese, recall e automação sincronizados em todas as unidades.', 'Anamnesis, recall and automation templates synced across all units.') },
            '4': { title: p('Paciente compartilhado', 'Shared patient'), text: p('Paciente que atende em 2 unidades tem prontuário unificado acessível com permissão.', 'Patient who attends 2 units has a unified record accessible with permission.') },
            '5': { title: p('Relatório comparativo', 'Comparative report'), text: p('Compare performance entre unidades: receita, retenção, procedimentos, equipe.', 'Compare performance between units: revenue, retention, procedures, team.') },
            '6': { title: p('Onboarding ágil', 'Agile onboarding'), text: p('Abra nova unidade em minutos reaproveitando toda a configuração da unidade existente.', 'Open a new unit in minutes by reusing all existing unit configuration.') }
          },
          useCases: {
            '1': { persona: p('Rede com 3 clínicas', 'Network with 3 clinics'), scenario: p('Reduziu tempo de gestão financeira de 3 dias para 4 horas mensais com dashboard consolidado.', 'Reduced financial management time from 3 days to 4 hours monthly with consolidated dashboard.') },
            '2': { persona: p('Franqueadora', 'Franchisor'), scenario: p('Padronizou protocolo de 12 franquias com template único de anamnese e automações.', 'Standardized protocol across 12 franchises with a single anamnesis and automation template.') },
            '3': { persona: p('Clínica em expansão', 'Expanding clinic'), scenario: p('Abriu segunda unidade em 1 dia reaproveitando toda a configuração da unidade existente.', 'Opened second unit in 1 day reusing all existing unit configuration.') }
          },
          howItWorks: {
            title: p('Como funciona', 'How it works'),
            '1': { title: p('Crie as unidades', 'Create the units'), text: p('Adicione cada unidade com endereço, CNPJ e equipe. Configure uma e replique nas demais.', 'Add each unit with address, CNPJ and team. Configure one and replicate in the others.') },
            '2': { title: p('Defina permissões', 'Define permissions'), text: p('Gestores, profissionais e recepcionistas têm acessos configuráveis por unidade.', 'Managers, professionals and receptionists have configurable access per unit.') },
            '3': { title: p('Gerencie centralizado', 'Manage centrally'), text: p('Tudo no mesmo login: financeiro consolidado, agenda de todas as unidades, analytics comparativo.', 'Everything in the same login: consolidated finance, all unit schedules, comparative analytics.') },
            '4': { title: p('Escale facilmente', 'Scale easily'), text: p('Abra nova unidade replicando configurações. Profissionais ativos em minutos.', 'Open new unit by replicating configurations. Professionals active in minutes.') }
          }
        }
      },
      lgpdSeguranca: {
        name: p('LGPD & Segurança', 'LGPD & Security'),
        description: p('Conformidade total com LGPD, criptografia de dados e gestão de consentimento do paciente.', 'Full LGPD compliance, data encryption and patient consent management.'),
        detail: {
          headline: p('Dados dos seus pacientes protegidos com os mais altos padrões de segurança.', "Your patients' data protected with the highest security standards."),
          planInfo: p('Disponível em todos os planos.', 'Available on all plans.'),
          benefits: {
            '1': { title: p('Criptografia AES-256', 'AES-256 encryption'), text: p('Todos os dados de pacientes criptografados em trânsito e em repouso com padrão bancário.', 'All patient data encrypted in transit and at rest with banking standard.') },
            '2': { title: p('Gestão de consentimento', 'Consent management'), text: p('Consentimento LGPD coletado digitalmente com data, IP e versão do documento registrados.', 'LGPD consent collected digitally with date, IP and document version recorded.') },
            '3': { title: p('Direito ao esquecimento', 'Right to erasure'), text: p('Exclusão completa de dados do paciente a pedido, com relatório de conformidade gerado.', 'Complete patient data deletion on request, with generated compliance report.') },
            '4': { title: p('Audit log completo', 'Complete audit log'), text: p('Rastreamento de quem acessou, editou ou exportou dados de pacientes com timestamp.', 'Tracking of who accessed, edited or exported patient data with timestamp.') },
            '5': { title: p('Backup automático', 'Automatic backup'), text: p('Backups diários criptografados em múltiplas regiões. RTO de 4h e RPO de 24h.', 'Daily encrypted backups in multiple regions. RTO of 4h and RPO of 24h.') },
            '6': { title: p('SSO e MFA', 'SSO and MFA'), text: p('Login único corporativo e autenticação de dois fatores para toda a equipe.', 'Corporate single sign-on and two-factor authentication for the entire team.') }
          },
          useCases: {
            '1': { persona: p('Dermatologista', 'Dermatologist'), scenario: p('Passou em auditoria de compliance LGPD sem nenhuma adequação adicional usando apenas os recursos do Estetia.', 'Passed LGPD compliance audit with no additional adjustments using only Estetia resources.') },
            '2': { persona: p('Rede de clínicas', 'Clinic chain'), scenario: p('Implementou política de acesso baseada em função em 5 unidades com controles por cargo.', 'Implemented role-based access policy across 5 units with position controls.') },
            '3': { persona: p('Clínica com dados sensíveis', 'Clinic with sensitive data'), scenario: p('Respondeu solicitação de exclusão de dados de paciente em 2h com relatório automático.', 'Responded to patient data deletion request in 2h with automatic report.') }
          },
          howItWorks: {
            title: p('Como funciona', 'How it works'),
            '1': { title: p('Consentimento no cadastro', 'Consent at registration'), text: p('Ao cadastrar paciente, termo de consentimento LGPD é exibido e assinado digitalmente.', 'When registering a patient, the LGPD consent form is displayed and digitally signed.') },
            '2': { title: p('Dados protegidos por padrão', 'Data protected by default'), text: p('Toda informação é criptografada automaticamente. Sem configuração adicional necessária.', 'All information is automatically encrypted. No additional configuration required.') },
            '3': { title: p('Controle de acesso', 'Access control'), text: p('Configure quem vê o quê: profissional acessa só seus pacientes, gestor vê todos.', 'Configure who sees what: professional accesses only their patients, manager sees all.') },
            '4': { title: p('Relatórios de compliance', 'Compliance reports'), text: p('Gere relatório LGPD a qualquer momento: consentimentos, acessos, exclusões solicitadas.', 'Generate LGPD report at any time: consents, accesses, requested deletions.') }
          }
        }
      },
      mobileApp: {
        name: p('App Mobile iOS & Android', 'Mobile App iOS & Android'),
        description: p('Gerencie sua clínica de qualquer lugar com o app nativo para iOS e Android.', 'Manage your clinic from anywhere with the native app for iOS and Android.'),
        detail: {
          headline: p('Sua clínica no bolso — agenda, pacientes e notificações onde você estiver.', 'Your clinic in your pocket — schedule, patients and notifications wherever you are.'),
          planInfo: p('Disponível em todos os planos.', 'Available on all plans.'),
          benefits: {
            '1': { title: p('Agenda em tempo real', 'Real-time schedule'), text: p('Veja e gerencie todos os agendamentos do dia diretamente pelo celular.', 'View and manage all daily appointments directly from your phone.') },
            '2': { title: p('Notificações push', 'Push notifications'), text: p('Receba alertas de novos agendamentos, cancelamentos e mensagens de pacientes.', 'Receive alerts for new bookings, cancellations and patient messages.') },
            '3': { title: p('Prontuário móvel', 'Mobile records'), text: p('Acesse e edite prontuários de pacientes diretamente pelo celular durante o atendimento.', 'Access and edit patient records directly from your phone during care.') },
            '4': { title: p('Modo offline', 'Offline mode'), text: p('Acesse dados essenciais mesmo sem conexão. Sincroniza automaticamente ao retornar online.', 'Access essential data even without connection. Syncs automatically when back online.') },
            '5': { title: p('Câmera integrada', 'Integrated camera'), text: p('Tire fotos para prontuário diretamente pelo app com padronização de ângulo.', 'Take photos for records directly through the app with angle standardization.') },
            '6': { title: p('PWA também disponível', 'PWA also available'), text: p('Sem precisar instalar: acesse pelo navegador do celular com experiência nativa.', 'No need to install: access via mobile browser with native experience.') }
          },
          useCases: {
            '1': { persona: p('Esteticista itinerante', 'Itinerant aesthetician'), scenario: p('Realiza atendimentos domiciliares com prontuário completo acessível pelo celular, sem papel.', 'Performs home visits with complete record accessible by phone, no paper.') },
            '2': { persona: p('Médica dermatologista', 'Female dermatologist'), scenario: p('Aprova agendamentos e responde pacientes no WhatsApp pelo app durante intervalos entre consultas.', 'Approves appointments and replies to patients on WhatsApp via app during breaks between consultations.') },
            '3': { persona: p('Gestora de clínica', 'Clinic manager'), scenario: p('Acompanha métricas e agenda da clínica pelo celular mesmo em viagem.', 'Follows clinic metrics and schedule by phone even while traveling.') }
          },
          howItWorks: {
            title: p('Como funciona', 'How it works'),
            '1': { title: p('Baixe o app', 'Download the app'), text: p('Disponível na App Store e Google Play. Login com as mesmas credenciais da versão web.', 'Available on the App Store and Google Play. Login with the same credentials as the web version.') },
            '2': { title: p('Mesmo Estetia, onde estiver', 'Same Estetia, wherever you are'), text: p('Todos os dados sincronizados em tempo real entre web e mobile.', 'All data synced in real time between web and mobile.') },
            '3': { title: p('Notificações configuráveis', 'Configurable notifications'), text: p('Escolha quais alertas receber: novos agendamentos, cancelamentos, mensagens de pacientes.', 'Choose which alerts to receive: new bookings, cancellations, patient messages.') },
            '4': { title: p('Atenda onde quiser', 'Care wherever you want'), text: p('Prontuário, agenda e comunicação disponíveis no celular para atendimento presencial ou domiciliar.', 'Records, schedule and communication available on mobile for in-person or home care.') }
          }
        }
      }
    }
  }
}

// Process both locales
for (const lang of ['pt-BR', 'en']) {
  const filePath = path.join(BASE, 'messages', lang, 'marketing.json')
  const raw = fs.readFileSync(filePath, 'utf8')
  const d = JSON.parse(raw)

  const newFeat = buildFeatures(lang)
  // Preserve planComparison from existing data
  newFeat.planComparison = d.features.planComparison

  d.features = newFeat
  fs.writeFileSync(filePath, JSON.stringify(d, null, 2), { encoding: 'utf8' })
  console.log(`Updated ${lang}: features.sections = ${JSON.stringify(Object.keys(newFeat.sections))}`)
}
