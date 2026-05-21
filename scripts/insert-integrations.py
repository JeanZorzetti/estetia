#!/usr/bin/env python3
"""
Inserts 10 new integration items into pt-BR and en marketing.json files.
Uses JSON parsing for reliability.
"""
import json
import sys
import os

NEW_ITEMS_PTBR = {
    "whatsappEvolution": {
        "name": "WhatsApp Evolution",
        "shortDesc": "API WhatsApp self-hosted — controle total da sua instância, sem depender da Meta.",
        "detail": {
            "headline": "WhatsApp sem custo de API — hospede sua instância e pague só pela infraestrutura",
            "planInfo": "Disponível nos planos Pro e Business.",
            "benefits": {
                "1": {"title": "Zero custo de mensagem", "text": "Sem pagar por conversa à Meta. O custo é só da hospedagem (servidor VPS ou Docker), geralmente abaixo de R$ 50/mês."},
                "2": {"title": "Controle total da instância", "text": "Você gerencia o número, o QR code e as configurações. Ideal para clínicas com TI interno ou parceiros técnicos."},
                "3": {"title": "Múltiplos atendentes", "text": "Conecte quantos atendentes quiser ao mesmo número. O Chat Center do Estetia distribui as conversas automaticamente."},
                "4": {"title": "Automações ilimitadas", "text": "Dispare confirmações, lembretes e recall sem limites de cota. Integra com N8N e Make para fluxos complexos."}
            },
            "howItWorks": {
                "1": {"title": "Instale o Evolution API", "text": "Use o Docker Compose fornecido pela Evolution (open source). Sobe em qualquer VPS com 1GB de RAM em menos de 10 minutos."},
                "2": {"title": "Gere a API Key", "text": "No painel do Evolution, crie uma instância e copie a API Key e a URL do servidor."},
                "3": {"title": "Configure no Estetia", "text": "Em Configurações > Integrações > WhatsApp Evolution, cole a URL e a API Key. Conecte pelo QR code."},
                "4": {"title": "Ative os fluxos", "text": "Configure quais eventos disparam mensagens: agendamento criado, lembrete D-1, confirmação de pagamento e recall."}
            },
            "useCases": {
                "1": {"persona": "Clínica com TI", "scenario": "Migrou do WhatsApp Business API para Evolution e reduziu o custo de comunicação de R$ 800/mês para R$ 45/mês."},
                "2": {"persona": "Franquia de Estética", "scenario": "Cada unidade tem sua instância própria. O CRM consolida todas as conversas em um único Chat Center centralizado."},
                "3": {"persona": "Agência de Marketing", "scenario": "Configura o Evolution para clientes sem conta Meta Business. Setup em 20 minutos, sem aprovação de templates."}
            },
            "faq": {
                "1": {"q": "Tem risco de banimento?", "a": "Sim, em menor grau. A Evolution API usa a versão não-oficial do WhatsApp. Não envie spam e mantenha taxas de bloqueio baixas. Para alto volume com garantia, use o WhatsApp Oficial."},
                "2": {"q": "Precisa de servidor dedicado?", "a": "Não. Funciona em qualquer VPS com 1GB RAM. Digital Ocean, Hetzner ou Contabo a partir de €4/mês são suficientes."},
                "3": {"q": "Posso usar meu número atual?", "a": "Sim. Escaneie o QR code com o número que já usa. Se o número estiver no WhatsApp Business, melhor ainda."}
            }
        }
    },
    "whatsappZapi": {
        "name": "WhatsApp Z-API",
        "shortDesc": "Provider brasileiro de WhatsApp — setup em 5 minutos, suporte em português.",
        "detail": {
            "headline": "WhatsApp com suporte brasileiro e setup sem complicação",
            "planInfo": "Disponível em todos os planos pagos.",
            "benefits": {
                "1": {"title": "Setup em 5 minutos", "text": "Sem Meta Business Manager, sem aprovação de conta. Crie uma instância no Z-API, escaneie o QR e conecte ao Estetia."},
                "2": {"title": "Suporte em português", "text": "Time brasileiro disponível por WhatsApp e email. Resposta em horas, não dias. Ideal para quem não tem TI."},
                "3": {"title": "Preço fixo previsível", "text": "Plano fixo em reais (~R$ 99/mês). Sem pagar por conversa. Custo 100% previsível no orçamento da clínica."},
                "4": {"title": "Estabilidade comprovada", "text": "Centenas de clínicas no Brasil usam Z-API. Uptime de 99.5% e infraestrutura própria no Brasil."}
            },
            "howItWorks": {
                "1": {"title": "Crie conta no Z-API", "text": "Acesse z-api.io e crie uma instância. O plano básico já inclui tudo que a clínica precisa."},
                "2": {"title": "Conecte o número", "text": "Escaneie o QR code com o WhatsApp do celular da recepção ou de um número exclusivo da clínica."},
                "3": {"title": "Configure no Estetia", "text": "Em Configurações > Integrações > WhatsApp Z-API, cole o Token e o Instance ID fornecidos pelo Z-API."},
                "4": {"title": "Ative os disparos", "text": "Escolha quais eventos enviam mensagens: confirmação de agendamento, lembrete 24h antes, recall de paciente inativo."}
            },
            "useCases": {
                "1": {"persona": "Clínica Pequena", "scenario": "Proprietária sem TI configurou sozinha em uma tarde. Agora 80% das confirmações chegam pelo WhatsApp, sem ligar."},
                "2": {"persona": "Dermatologista Solo", "scenario": "Usa o mesmo número pessoal de WhatsApp para atendimento. Com Z-API, as mensagens automáticas saem do número dela."},
                "3": {"persona": "Clínica em crescimento", "scenario": "Testou Z-API antes de contratar WhatsApp Oficial. Quando atingiu 2.000 pacientes, migrou para a API Meta com histórico preservado."}
            },
            "faq": {
                "1": {"q": "É oficial da Meta?", "a": "Não. Z-API conecta ao WhatsApp Web. Não tem garantia anti-banimento, mas é estável para volumes moderados (até ~500 mensagens/dia)."},
                "2": {"q": "O que acontece se o celular ficar sem internet?", "a": "A instância fica offline. Z-API recomenda manter o celular sempre conectado ou usar um chip dedicado."},
                "3": {"q": "Posso migrar para WhatsApp Oficial depois?", "a": "Sim. O Estetia mantém o histórico. Basta desconectar Z-API, conectar a API Meta e reassociar o número."}
            }
        }
    },
    "instagramDirect": {
        "name": "Instagram Direct",
        "shortDesc": "Receba e responda DMs do Instagram direto no Chat Center do Estetia.",
        "detail": {
            "headline": "Transforme DMs do Instagram em pacientes atendidos",
            "planInfo": "Disponível nos planos Pro e Business.",
            "benefits": {
                "1": {"title": "Nunca perca um lead de DM", "text": "Toda mensagem direta do Instagram chega no Chat Center. Sem precisar alternar entre apps ou perder mensagens no celular."},
                "2": {"title": "Resposta rápida automática", "text": "Configure mensagens de boas-vindas para novos contatos via DM. Capture nome e interesse antes de o humano assumir."},
                "3": {"title": "Histórico unificado do paciente", "text": "As conversas do Instagram ficam no mesmo perfil do paciente no CRM, junto com WhatsApp, agendamentos e histórico clínico."},
                "4": {"title": "Integração com Meta Business", "text": "Usa a API oficial do Instagram (Meta). Segura, sem risco de banimento. Suporta múltiplas contas do Instagram."}
            },
            "howItWorks": {
                "1": {"title": "Conecte sua conta Business", "text": "Seu Instagram precisa ser uma Conta Profissional (Business ou Creator) vinculada a uma Página do Facebook."},
                "2": {"title": "Autorize no Meta Business", "text": "Em Configurações > Integrações > Instagram Direct, clique em Conectar e autorize o acesso via Meta Business Suite."},
                "3": {"title": "Configure as respostas automáticas", "text": "Defina a mensagem de boas-vindas para novos seguidores que entrarem em contato e os horários de atendimento."},
                "4": {"title": "Distribua para a equipe", "text": "Atribua conversas do Instagram para atendentes específicos ou use a fila automática do Chat Center."}
            },
            "useCases": {
                "1": {"persona": "Clínica de Estética", "scenario": "Recebe 40 DMs por semana de pessoas interessadas em botox. Com o Chat Center, a equipe responde a todas em menos de 5 minutos."},
                "2": {"persona": "Dermatologista Influencer", "scenario": "Tem 80K seguidores e recebia DMs apenas no celular. Com a integração, não perde mais leads e tem conversas rastreadas."},
                "3": {"persona": "Rede de Clínicas", "scenario": "Cada unidade tem seu perfil no Instagram. O CRM centraliza todas as DMs com roteamento por cidade."}
            },
            "faq": {
                "1": {"q": "Precisa de conta Business no Instagram?", "a": "Sim. Contas pessoais não têm acesso à API de mensagens. Converter para conta Business é gratuito e leva 1 minuto."},
                "2": {"q": "Funciona com Instagram Stories?", "a": "Sim. Respostas de Stories via DM também chegam no Chat Center."},
                "3": {"q": "Tem limite de mensagens?", "a": "A API Meta permite até 1.000 conversas ativas por dia no plano standard. Suficiente para qualquer clínica."}
            }
        }
    },
    "asaas": {
        "name": "Asaas",
        "shortDesc": "PIX, boleto e cartão com cobrança recorrente. A fintech preferida das clínicas brasileiras.",
        "detail": {
            "headline": "Elimine a inadimplência com cobrança automática via PIX e boleto",
            "planInfo": "Disponível em todos os planos.",
            "benefits": {
                "1": {"title": "PIX nativo com QR Code", "text": "Gere cobranças PIX diretamente da consulta. O paciente paga na hora, sem maquininha."},
                "2": {"title": "Boleto e cartão de crédito", "text": "Emita boletos com vencimento e parcele no cartão. Ideal para procedimentos de alto valor."},
                "3": {"title": "Assinaturas e recorrência", "text": "Crie planos mensais para pacientes frequentes. A cobrança é automática no cartão ou boleto, sem retrabalho."},
                "4": {"title": "Conciliação automática", "text": "Cada pagamento recebido no Asaas atualiza automaticamente o prontuário e o financeiro do Estetia."},
                "5": {"title": "Antifraude e compliance", "text": "Asaas tem certificação PCI-DSS e seguro D&O. Seus dados financeiros estão protegidos."}
            },
            "howItWorks": {
                "1": {"title": "Abra sua conta Asaas", "text": "Acesse asaas.com e abra sua conta gratuita (PJ). Aprovação em até 24h. Sem mensalidade."},
                "2": {"title": "Conecte ao Estetia", "text": "Em Configurações > Integrações > Asaas, cole sua API Key do Asaas. A sincronização começa imediatamente."},
                "3": {"title": "Crie cobranças no prontuário", "text": "Na ficha do paciente, clique em Nova Cobrança. Escolha PIX, boleto ou cartão e o valor."},
                "4": {"title": "Acompanhe no financeiro", "text": "Todos os pagamentos e inadimplências aparecem no módulo Financeiro do Estetia em tempo real."}
            },
            "useCases": {
                "1": {"persona": "Clínica com planos mensais", "scenario": "Oferece plano de skincare mensal por R$ 350. O Asaas cobra automaticamente no cartão todo mês, sem retrabalho."},
                "2": {"persona": "Clínica de Alto Padrão", "scenario": "Parcela procedimentos de R$ 5.000 em até 12x. O CRM registra cada parcela e notifica antes do vencimento."},
                "3": {"persona": "Recepcionista", "scenario": "Gera QR Code PIX durante o agendamento. Paciente paga antes mesmo de chegar na clínica."}
            },
            "faq": {
                "1": {"q": "O Asaas é gratuito?", "a": "A conta é gratuita. Cobrança por transação: PIX 1%, Boleto R$ 1,99 + 1%, Cartão 2,99% + R$ 0,49. Sem mensalidade."},
                "2": {"q": "O dinheiro vai direto para minha conta?", "a": "Sim. Asaas deposita em D+0 (PIX), D+1 (Boleto) ou D+30 (Cartão) na sua conta bancária."},
                "3": {"q": "Precisa ser PJ para usar Asaas?", "a": "Sim. Asaas é para MEI, ME e empresas. CPF para receber pagamentos usa uma conta diferente (ex: Mercado Pago)."}
            }
        }
    },
    "stripe": {
        "name": "Stripe",
        "shortDesc": "Pagamentos internacionais com cartão de crédito, débito e link de pagamento.",
        "detail": {
            "headline": "Aceite pagamentos internacionais e links de pagamento premium",
            "planInfo": "Disponível nos planos Pro e Business.",
            "benefits": {
                "1": {"title": "Cartões internacionais", "text": "Aceite Visa, Mastercard, Amex de qualquer país. Ideal para clínicas que atendem turistas ou pacientes do exterior."},
                "2": {"title": "Link de pagamento elegante", "text": "Gere links de pagamento com a identidade visual da clínica. Envie por WhatsApp e receba em segundos."},
                "3": {"title": "Assinaturas e recorrência", "text": "Crie planos de assinatura para protocolos mensais. Cobrança automática sem retrabalho."},
                "4": {"title": "Checkout integrado", "text": "Pacientes pagam sem sair do seu site ou app. Experiência premium que aumenta a conversão."}
            },
            "howItWorks": {
                "1": {"title": "Crie conta no Stripe", "text": "Acesse stripe.com/br e crie sua conta. Aprovação imediata. Sem mensalidade."},
                "2": {"title": "Conecte ao Estetia", "text": "Em Configurações > Integrações > Stripe, clique em Conectar com Stripe. Autorize o acesso em 1 clique."},
                "3": {"title": "Emita cobranças", "text": "Na ficha do paciente, escolha Stripe como método de pagamento. Gere link ou cobre diretamente no cartão."},
                "4": {"title": "Monitore no financeiro", "text": "Todos os pagamentos Stripe aparecem no módulo Financeiro com reconciliação automática."}
            },
            "useCases": {
                "1": {"persona": "Clínica de Turismo Médico", "scenario": "Atende pacientes da Argentina e EUA. Stripe processa pagamentos em USD e EUR diretamente."},
                "2": {"persona": "Clínica Premium", "scenario": "Usa link de pagamento Stripe no orçamento digital. Aprovação do procedimento e pagamento em uma etapa."},
                "3": {"persona": "Clínica SaaS", "scenario": "Oferece plano de assinatura anual com desconto. Stripe gerencia as renovações automaticamente."}
            },
            "faq": {
                "1": {"q": "Qual é a taxa do Stripe no Brasil?", "a": "2,9% + R$ 0,50 por transação aprovada em cartão. PIX e boleto estão disponíveis via Stripe no Brasil."},
                "2": {"q": "Funciona com cartão de débito?", "a": "Sim. Stripe aceita débito de bandeiras internacionais. Para débito nacional, Asaas ou Mercado Pago são mais indicados."},
                "3": {"q": "Em quanto tempo recebo o dinheiro?", "a": "Stripe deposita em D+2 por padrão. Pode ser acelerado para D+0 em planos com volume maior."}
            }
        }
    },
    "pagseguro": {
        "name": "PagSeguro",
        "shortDesc": "PagBank — checkout, link de pagamento e maquininha integrados ao Estetia.",
        "detail": {
            "headline": "PagBank no CRM — do link de pagamento à maquininha em um só lugar",
            "planInfo": "Disponível em todos os planos.",
            "benefits": {
                "1": {"title": "Marca consolidada no Brasil", "text": "PagSeguro/PagBank é conhecido e confiável. Pacientes têm mais confiança ao pagar em plataformas conhecidas."},
                "2": {"title": "Link de pagamento", "text": "Envie link de pagamento por WhatsApp com valor e descrição do procedimento. Pague com cartão, PIX ou boleto."},
                "3": {"title": "Cobrança recorrente", "text": "Crie planos mensais com cobrança automática. Ideal para protocolos e pacotes de tratamento."},
                "4": {"title": "Conta PagBank integrada", "text": "Receba pagamentos diretamente na sua conta PagBank e transfira para seu banco a qualquer momento."}
            },
            "howItWorks": {
                "1": {"title": "Crie conta no PagBank", "text": "Acesse pagbank.com.br e crie sua conta PJ gratuita. Aprovação em horas."},
                "2": {"title": "Obtenha suas credenciais", "text": "No painel do PagBank, gere seu Token de integração em Configurações > Integrações."},
                "3": {"title": "Configure no Estetia", "text": "Em Configurações > Integrações > PagSeguro, cole o Token e o E-mail da conta PagBank."},
                "4": {"title": "Emita cobranças", "text": "Na ficha do paciente, selecione PagSeguro como meio de pagamento. Gere link ou QR Code PIX em segundos."}
            },
            "useCases": {
                "1": {"persona": "Clínica com maquininha", "scenario": "Já usa maquininha PagBank no balcão. Com a integração, o pagamento presencial atualiza automaticamente o CRM."},
                "2": {"persona": "Clínica de Tricologia", "scenario": "Pacotes de 12 sessões com pagamento em link. Paciente parcela em 12x e a clínica recebe em D+30."},
                "3": {"persona": "Recepcionista", "scenario": "Envia link de pagamento pelo WhatsApp 24h antes da consulta. Taxa de não-comparecimento caiu 35%."}
            },
            "faq": {
                "1": {"q": "PagSeguro ou Asaas? Qual escolher?", "a": "Asaas tem taxas menores para boleto e PIX. PagSeguro é melhor se você já usa a maquininha PagBank ou tem conta no PagBank."},
                "2": {"q": "Funciona com parcelamento?", "a": "Sim. Parcelamento em até 12x com ou sem juros. Você decide se absorve os juros ou repassa ao paciente."},
                "3": {"q": "Tem antifraude?", "a": "Sim. PagSeguro tem sistema antifraude próprio com aprovação automática para transações de baixo risco."}
            }
        }
    },
    "googleAds": {
        "name": "Google Ads",
        "shortDesc": "Capture leads do Google direto no pipeline e meça o custo real por consulta agendada.",
        "detail": {
            "headline": "Pare de adivinhar o ROI — meça o custo real de cada paciente captado pelo Google",
            "planInfo": "Disponível nos planos Pro e Business.",
            "benefits": {
                "1": {"title": "Custo por consulta real", "text": "Veja quanto você gastou em anúncios para cada consulta efetivamente realizada, não só para cliques ou leads."},
                "2": {"title": "Leads com UTM automático", "text": "Cada lead captado via Google Ads chega no Estetia com a campanha, o grupo de anúncios e a palavra-chave de origem."},
                "3": {"title": "Conversões offline para o Google", "text": "Envie de volta ao Google quais leads viraram pacientes. O algoritmo otimiza campanhas para clientes de maior valor."},
                "4": {"title": "Retargeting de pacientes inativos", "text": "Exporte listas de pacientes que não voltam há 6 meses e crie campanhas de retargeting segmentadas."}
            },
            "howItWorks": {
                "1": {"title": "Configure o Google Tag Manager", "text": "Instale o GTM no site da clínica. O Estetia fornece as tags prontas para rastrear formulários de contato."},
                "2": {"title": "Conecte a conta Google Ads", "text": "Em Configurações > Integrações > Google Ads, faça login com a conta Google do gestor de anúncios."},
                "3": {"title": "Ative o rastreamento de conversões", "text": "Selecione quais eventos do Estetia devem ser enviados ao Google: lead criado, consulta agendada, pagamento recebido."},
                "4": {"title": "Acompanhe o ROAS no painel", "text": "No módulo Analytics do Estetia, veja por campanha: leads, agendamentos, receita e ROAS calculado automaticamente."}
            },
            "useCases": {
                "1": {"persona": "Gestor de Marketing", "scenario": "Descobriu que campanhas de botox tinham CAC de R$ 45 e as de bioestimulador R$ 280. Realocou o budget e reduziu custo 40%."},
                "2": {"persona": "Dono de Clínica", "scenario": "Enviando conversões offline ao Google, o algoritmo passou a trazer leads com 3x mais chance de fechar procedimento de alto valor."},
                "3": {"persona": "Rede de Clínicas", "scenario": "Cada unidade tem seu ID de conversão. O relatório centralizado mostra qual unidade tem melhor ROAS por campanha."}
            },
            "faq": {
                "1": {"q": "Precisa de Google Tag Manager?", "a": "Sim para rastreamento web. Para conversões offline (via API), só o ID da conta Google Ads é necessário."},
                "2": {"q": "Quanto custa?", "a": "A integração é gratuita. Os gastos em anúncios são definidos por você diretamente no Google Ads."},
                "3": {"q": "Funciona com Google Analytics 4?", "a": "Sim. O Estetia pode enviar eventos para GA4 via Measurement Protocol, complementando o rastreamento."}
            }
        }
    },
    "metaAds": {
        "name": "Meta Ads",
        "shortDesc": "Facebook e Instagram Ads com atribuição completa — saiba exatamente quais anúncios geram consultas.",
        "detail": {
            "headline": "Feche o loop entre anúncio e consulta agendada no Meta Ads",
            "planInfo": "Disponível nos planos Pro e Business.",
            "benefits": {
                "1": {"title": "Lead Forms importados automaticamente", "text": "Leads dos formulários nativos do Facebook e Instagram chegam no Estetia em até 60 segundos, prontos para follow-up."},
                "2": {"title": "Custo por consulta agendada", "text": "Não só custo por lead — veja quanto gastou para cada consulta efetivamente realizada via Meta Ads."},
                "3": {"title": "Conversions API (CAPI)", "text": "Envie eventos de conversão server-side, contornando bloqueadores de anúncios. Dados mais precisos, campanhas mais eficientes."},
                "4": {"title": "Audiências personalizadas", "text": "Exporte pacientes do Estetia para criar Lookalike Audiences no Meta. Anuncie para pessoas parecidas com seus melhores pacientes."}
            },
            "howItWorks": {
                "1": {"title": "Conecte o Meta Business", "text": "Em Configurações > Integrações > Meta Ads, faça login com o perfil administrador do Meta Business Suite."},
                "2": {"title": "Selecione a conta de anúncios", "text": "Escolha qual conta de anúncios sincronizar. Suporta múltiplas contas para redes de clínicas."},
                "3": {"title": "Configure os eventos de conversão", "text": "Selecione: Lead Criado, Consulta Agendada, Pagamento Recebido. O Estetia envia via CAPI automaticamente."},
                "4": {"title": "Analise o desempenho", "text": "No painel de Analytics, filtre por fonte Meta Ads e veja funil completo do clique ao paciente."}
            },
            "useCases": {
                "1": {"persona": "Clínica de Cirurgia Plástica", "scenario": "Lead Forms de rinoplastia chegam no CRM em 1 minuto. O atendente liga ainda enquanto o lead está quente."},
                "2": {"persona": "Gestor de Performance", "scenario": "Com CAPI, recuperou 30% das conversões que o iOS bloqueava. ROAS subiu 25% sem aumentar budget."},
                "3": {"persona": "Rede de Clínicas", "scenario": "Exportou lista de pacientes que fizeram procedimentos acima de R$ 2.000 e criou Lookalike. CPA caiu 40%."}
            },
            "faq": {
                "1": {"q": "O que é Conversions API?", "a": "CAPI é uma API server-to-server que envia eventos de conversão diretamente do servidor para o Meta, sem depender do pixel no browser."},
                "2": {"q": "Lead Forms funcionam sem site?", "a": "Sim! Lead Forms nativos do Facebook/Instagram não precisam de site. O lead preenche dentro da própria rede social."},
                "3": {"q": "Funciona com Instagram Ads?", "a": "Sim. Meta Ads gerencia Facebook e Instagram na mesma plataforma. Todos os eventos são rastreados."}
            }
        }
    },
    "zapier": {
        "name": "Zapier",
        "shortDesc": "Conecte o Estetia a mais de 5.000 apps sem escrever uma linha de código.",
        "detail": {
            "headline": "Automatize sem código — conecte o Estetia a qualquer app em minutos",
            "planInfo": "Disponível em todos os planos pagos.",
            "benefits": {
                "1": {"title": "5.000+ integrações nativas", "text": "Gmail, Google Sheets, Mailchimp, Calendly, ActiveCampaign, Typeform — se está no Zapier, conecta com o Estetia."},
                "2": {"title": "Automações sem código", "text": "Monte fluxos de Trigger > Action em minutos. Não precisa de dev ou conhecimento técnico."},
                "3": {"title": "Templates prontos para clínicas", "text": "Use Zaps prontos: novo lead > planilha Google, agendamento criado > email de confirmação customizado."},
                "4": {"title": "Ideal para times pequenos", "text": "Automatize tarefas repetitivas que tomam horas da recepção. Reposição de estoque, alertas, relatórios — no automático."}
            },
            "howItWorks": {
                "1": {"title": "Crie conta no Zapier", "text": "Acesse zapier.com e crie sua conta gratuita. O plano Free já permite até 100 tarefas/mês."},
                "2": {"title": "Conecte o Estetia como Trigger", "text": "No Zapier, busque Estetia CRM. Configure o webhook do Estetia como trigger (ex: Novo Agendamento)."},
                "3": {"title": "Configure o Action", "text": "Escolha o app de destino (ex: Google Sheets) e mapeie os campos do Estetia para o destino."},
                "4": {"title": "Teste e ative", "text": "O Zapier testa o fluxo com dados reais. Se tudo OK, ative e o Zap roda automaticamente."}
            },
            "useCases": {
                "1": {"persona": "Recepcionista", "scenario": "Todo novo lead do site vai automaticamente para uma planilha de controle e recebe email de boas-vindas."},
                "2": {"persona": "Gestor de Marketing", "scenario": "Pacientes que concluem tratamento são adicionados automaticamente a uma campanha de reativação no Mailchimp."},
                "3": {"persona": "Dono de Clínica", "scenario": "Recebe notificação no Slack sempre que um paciente VIP agenda uma consulta."}
            },
            "faq": {
                "1": {"q": "Precisa pagar pelo Zapier?", "a": "O plano gratuito inclui 100 tarefas/mês e Zaps de 2 etapas. Para clínicas com mais volume, o plano Starter (~$19/mês) é suficiente."},
                "2": {"q": "É diferente de N8N?", "a": "Zapier é mais simples e sem servidor. N8N é mais poderoso e self-hostable. Comece com Zapier, migre para N8N quando precisar de mais controle."},
                "3": {"q": "Posso usar Zapier e N8N ao mesmo tempo?", "a": "Sim. Use Zapier para automações simples e rápidas, e N8N para fluxos complexos que precisam de lógica avançada."}
            }
        }
    },
    "make": {
        "name": "Make (Integromat)",
        "shortDesc": "Automações visuais avançadas — o Zapier para quem precisa de mais poder.",
        "detail": {
            "headline": "Fluxos de automação complexos com visual builder — sem código, sem limites",
            "planInfo": "Disponível em todos os planos pagos.",
            "benefits": {
                "1": {"title": "Visual builder poderoso", "text": "Monte fluxos multi-etapa arrastando e conectando módulos. Loops, condicionais, iteradores — tudo visual."},
                "2": {"title": "Mais barato que Zapier em escala", "text": "Make cobra por operações, não por tarefas. Em automações de alto volume, o custo pode ser 5x menor."},
                "3": {"title": "Transformação de dados nativa", "text": "Manipule JSON, faça cálculos, filtre listas — tudo dentro do Make sem precisar de código externo."},
                "4": {"title": "1.000+ integrações", "text": "Todos os apps essenciais: Google Workspace, HubSpot, Slack, Notion, Typeform e muito mais."}
            },
            "howItWorks": {
                "1": {"title": "Crie conta no Make", "text": "Acesse make.com e crie sua conta. O plano gratuito inclui 1.000 operações/mês."},
                "2": {"title": "Crie um Cenário", "text": "No Make, crie um novo Cenário. Adicione o módulo Estetia CRM como trigger (ex: Watch New Appointments)."},
                "3": {"title": "Configure as actions", "text": "Adicione os módulos de destino (Google Sheets, email, Slack) e mapeie os dados do Estetia para cada campo."},
                "4": {"title": "Agende a execução", "text": "Defina se o cenário roda a cada 15 minutos, hora ou em tempo real via webhook instantâneo."}
            },
            "useCases": {
                "1": {"persona": "Gestor de Operações", "scenario": "Automação que consolida agendamentos de 5 unidades em um Google Sheets de controle, com alertas de overbooking."},
                "2": {"persona": "Analista de Dados", "scenario": "Sincroniza dados do Estetia com o BI da empresa a cada hora. Make transforma e formata os dados no caminho."},
                "3": {"persona": "Clínica Escalando", "scenario": "Fluxo de onboarding de novos pacientes: cria conta, envia kit de boas-vindas, agenda call com coordenador."}
            },
            "faq": {
                "1": {"q": "Make ou Zapier? Qual escolher?", "a": "Zapier é mais simples para automações básicas. Make é mais poderoso para fluxos complexos e mais econômico em escala acima de 1.000 tarefas/mês."},
                "2": {"q": "Precisa saber programar?", "a": "Não. O builder visual cobre 95% dos casos. Para os 5% restantes, Make tem um módulo de JavaScript para lógica customizada."},
                "3": {"q": "Make é confiável?", "a": "Sim. Fundado em 2012 (como Integromat), processou 5 bilhões de operações. Adquirido pela Celonis em 2020."}
            }
        }
    }
}

NEW_ITEMS_EN = {
    "whatsappEvolution": {
        "name": "WhatsApp Evolution",
        "shortDesc": "Self-hosted WhatsApp API — full control of your instance, no Meta dependency.",
        "detail": {
            "headline": "WhatsApp without API costs — host your own instance and pay only for infrastructure",
            "planInfo": "Available on Pro and Business plans.",
            "benefits": {
                "1": {"title": "Zero per-message cost", "text": "No per-conversation fees to Meta. Only hosting cost (VPS or Docker), typically under R$ 50/month."},
                "2": {"title": "Full instance control", "text": "You manage the number, QR code and settings. Ideal for clinics with in-house IT or technical partners."},
                "3": {"title": "Multiple agents", "text": "Connect as many agents as needed to the same number. Estetia's Chat Center distributes conversations automatically."},
                "4": {"title": "Unlimited automations", "text": "Send confirmations, reminders and recalls without quota limits. Integrates with N8N and Make for complex flows."}
            },
            "howItWorks": {
                "1": {"title": "Install Evolution API", "text": "Use the Docker Compose provided by Evolution (open source). Runs on any 1GB RAM VPS in under 10 minutes."},
                "2": {"title": "Generate the API Key", "text": "In the Evolution panel, create an instance and copy the API Key and server URL."},
                "3": {"title": "Configure in Estetia", "text": "Under Settings > Integrations > WhatsApp Evolution, paste the URL and API Key. Connect via QR code."},
                "4": {"title": "Activate flows", "text": "Configure which events trigger messages: appointment created, D-1 reminder, payment confirmation and recall."}
            },
            "useCases": {
                "1": {"persona": "Clinic with IT", "scenario": "Switched from WhatsApp Business API to Evolution and reduced communication costs from R$ 800/month to R$ 45/month."},
                "2": {"persona": "Aesthetics Franchise", "scenario": "Each unit has its own instance. The CRM consolidates all conversations in a single centralized Chat Center."},
                "3": {"persona": "Marketing Agency", "scenario": "Sets up Evolution for clients without Meta Business accounts. 20-minute setup, no template approval needed."}
            },
            "faq": {
                "1": {"q": "Is there a ban risk?", "a": "Yes, to a lesser degree. Evolution API uses the unofficial WhatsApp version. Don't send spam and keep block rates low. For high volume with guarantees, use Official WhatsApp."},
                "2": {"q": "Does it need a dedicated server?", "a": "No. Works on any VPS with 1GB RAM. Digital Ocean, Hetzner or Contabo from €4/month are enough."},
                "3": {"q": "Can I use my current number?", "a": "Yes. Scan the QR code with the number you already use. If it's on WhatsApp Business, even better."}
            }
        }
    },
    "whatsappZapi": {
        "name": "WhatsApp Z-API",
        "shortDesc": "Brazilian WhatsApp provider — 5-minute setup, Portuguese support.",
        "detail": {
            "headline": "WhatsApp with Brazilian support and hassle-free setup",
            "planInfo": "Available on all paid plans.",
            "benefits": {
                "1": {"title": "5-minute setup", "text": "No Meta Business Manager, no account approval. Create an instance in Z-API, scan the QR and connect to Estetia."},
                "2": {"title": "Portuguese support", "text": "Brazilian team available via WhatsApp and email. Response in hours, not days. Ideal for non-technical users."},
                "3": {"title": "Fixed predictable pricing", "text": "Fixed plan in BRL (~R$ 99/month). No per-conversation fees. 100% predictable cost for the clinic budget."},
                "4": {"title": "Proven stability", "text": "Hundreds of Brazilian clinics use Z-API. 99.5% uptime with infrastructure based in Brazil."}
            },
            "howItWorks": {
                "1": {"title": "Create Z-API account", "text": "Visit z-api.io and create an instance. The basic plan includes everything the clinic needs."},
                "2": {"title": "Connect the number", "text": "Scan the QR code with the WhatsApp on the receptionist's phone or a dedicated clinic number."},
                "3": {"title": "Configure in Estetia", "text": "Under Settings > Integrations > WhatsApp Z-API, paste the Token and Instance ID provided by Z-API."},
                "4": {"title": "Activate triggers", "text": "Choose which events send messages: appointment confirmation, 24h-before reminder, inactive patient recall."}
            },
            "useCases": {
                "1": {"persona": "Small Clinic", "scenario": "Owner without IT configured it alone in an afternoon. Now 80% of confirmations come via WhatsApp, without calling."},
                "2": {"persona": "Solo Dermatologist", "scenario": "Uses the same personal WhatsApp number for care. With Z-API, automated messages go out from her number."},
                "3": {"persona": "Growing Clinic", "scenario": "Tested Z-API before getting Official WhatsApp. When they reached 2,000 patients, migrated to Meta API with history preserved."}
            },
            "faq": {
                "1": {"q": "Is it official Meta?", "a": "No. Z-API connects to WhatsApp Web. No anti-ban guarantee, but stable for moderate volumes (up to ~500 messages/day)."},
                "2": {"q": "What happens if the phone loses internet?", "a": "The instance goes offline. Z-API recommends keeping the phone always connected or using a dedicated SIM."},
                "3": {"q": "Can I migrate to Official WhatsApp later?", "a": "Yes. Estetia keeps the history. Just disconnect Z-API, connect the Meta API and reassociate the number."}
            }
        }
    },
    "instagramDirect": {
        "name": "Instagram Direct",
        "shortDesc": "Receive and reply to Instagram DMs directly in Estetia's Chat Center.",
        "detail": {
            "headline": "Turn Instagram DMs into attended patients",
            "planInfo": "Available on Pro and Business plans.",
            "benefits": {
                "1": {"title": "Never miss a DM lead", "text": "Every Instagram direct message arrives in the Chat Center. No need to switch apps or miss messages on your phone."},
                "2": {"title": "Automatic quick reply", "text": "Set up welcome messages for new DM contacts. Capture name and interest before the human takes over."},
                "3": {"title": "Unified patient history", "text": "Instagram conversations live in the same patient profile in the CRM, alongside WhatsApp, appointments and clinical history."},
                "4": {"title": "Meta Business integration", "text": "Uses the official Instagram API (Meta). Safe, no ban risk. Supports multiple Instagram accounts."}
            },
            "howItWorks": {
                "1": {"title": "Connect your Business account", "text": "Your Instagram needs to be a Professional Account (Business or Creator) linked to a Facebook Page."},
                "2": {"title": "Authorize in Meta Business", "text": "Under Settings > Integrations > Instagram Direct, click Connect and authorize access via Meta Business Suite."},
                "3": {"title": "Set up automatic replies", "text": "Define welcome messages for new followers who reach out and set business hours."},
                "4": {"title": "Distribute to the team", "text": "Assign Instagram conversations to specific agents or use the Chat Center's automatic queue."}
            },
            "useCases": {
                "1": {"persona": "Aesthetics Clinic", "scenario": "Receives 40 DMs per week from people interested in botox. With the Chat Center, the team responds to all of them in under 5 minutes."},
                "2": {"persona": "Dermatologist Influencer", "scenario": "Has 80K followers and only received DMs on the phone. With the integration, no more missed leads and conversations are tracked."},
                "3": {"persona": "Clinic Network", "scenario": "Each unit has its own Instagram profile. The CRM centralizes all DMs with routing by city."}
            },
            "faq": {
                "1": {"q": "Does it need a Business Instagram account?", "a": "Yes. Personal accounts don't have access to the messaging API. Converting to Business is free and takes 1 minute."},
                "2": {"q": "Does it work with Instagram Stories?", "a": "Yes. Story replies via DM also arrive in the Chat Center."},
                "3": {"q": "Is there a message limit?", "a": "The Meta API allows up to 1,000 active conversations per day on the standard tier. Enough for any clinic."}
            }
        }
    },
    "asaas": {
        "name": "Asaas",
        "shortDesc": "PIX, bank slip and card with recurring billing. Brazil's preferred fintech for clinics.",
        "detail": {
            "headline": "Eliminate overdue payments with automatic PIX and bank slip billing",
            "planInfo": "Available on all plans.",
            "benefits": {
                "1": {"title": "Native PIX with QR Code", "text": "Generate PIX charges directly from the appointment. The patient pays on the spot, no card reader needed."},
                "2": {"title": "Bank slip and credit card", "text": "Issue bank slips with due dates and installment on credit card. Ideal for high-value procedures."},
                "3": {"title": "Subscriptions and recurring billing", "text": "Create monthly plans for frequent patients. Billing is automatic by card or bank slip, no manual work."},
                "4": {"title": "Automatic reconciliation", "text": "Each payment received in Asaas automatically updates the patient record and the Estetia financial module."},
                "5": {"title": "Anti-fraud and compliance", "text": "Asaas is PCI-DSS certified. Your financial data is protected."}
            },
            "howItWorks": {
                "1": {"title": "Open your Asaas account", "text": "Visit asaas.com and open your free account (business entity). Approval within 24h. No monthly fee."},
                "2": {"title": "Connect to Estetia", "text": "Under Settings > Integrations > Asaas, paste your Asaas API Key. Sync starts immediately."},
                "3": {"title": "Create charges in the patient record", "text": "In the patient profile, click New Charge. Choose PIX, bank slip or card and the amount."},
                "4": {"title": "Monitor in financials", "text": "All payments and overdue accounts appear in Estetia's Financial module in real time."}
            },
            "useCases": {
                "1": {"persona": "Clinic with monthly plans", "scenario": "Offers a monthly skincare plan for R$ 350. Asaas charges automatically to the card every month, no manual work."},
                "2": {"persona": "High-End Clinic", "scenario": "Installments R$ 5,000 procedures up to 12x. The CRM records each installment and notifies before due date."},
                "3": {"persona": "Receptionist", "scenario": "Generates PIX QR Code during scheduling. Patient pays before even arriving at the clinic."}
            },
            "faq": {
                "1": {"q": "Is Asaas free?", "a": "The account is free. Transaction fees: PIX 1%, Bank Slip R$ 1.99 + 1%, Card 2.99% + R$ 0.49. No monthly fee."},
                "2": {"q": "Does the money go directly to my account?", "a": "Yes. Asaas deposits D+0 (PIX), D+1 (Bank Slip) or D+30 (Card) to your bank account."},
                "3": {"q": "Does it need to be a business?", "a": "Yes. Asaas is for MEI, ME and companies. CPF to receive payments uses a different account (e.g. Mercado Pago)."}
            }
        }
    },
    "stripe": {
        "name": "Stripe",
        "shortDesc": "International payments with credit card, debit and payment links.",
        "detail": {
            "headline": "Accept international payments and premium payment links",
            "planInfo": "Available on Pro and Business plans.",
            "benefits": {
                "1": {"title": "International cards", "text": "Accept Visa, Mastercard, Amex from any country. Ideal for clinics serving tourists or international patients."},
                "2": {"title": "Elegant payment link", "text": "Generate payment links with the clinic's branding. Send via WhatsApp and receive in seconds."},
                "3": {"title": "Subscriptions and recurring billing", "text": "Create subscription plans for monthly protocols. Automatic billing with no manual work."},
                "4": {"title": "Integrated checkout", "text": "Patients pay without leaving your website or app. Premium experience that increases conversion."}
            },
            "howItWorks": {
                "1": {"title": "Create Stripe account", "text": "Visit stripe.com/br and create your account. Immediate approval. No monthly fee."},
                "2": {"title": "Connect to Estetia", "text": "Under Settings > Integrations > Stripe, click Connect with Stripe. Authorize access in 1 click."},
                "3": {"title": "Issue charges", "text": "In the patient profile, choose Stripe as payment method. Generate a link or charge the card directly."},
                "4": {"title": "Monitor in financials", "text": "All Stripe payments appear in the Financial module with automatic reconciliation."}
            },
            "useCases": {
                "1": {"persona": "Medical Tourism Clinic", "scenario": "Serves patients from Argentina and the USA. Stripe processes payments in USD and EUR directly."},
                "2": {"persona": "Premium Clinic", "scenario": "Uses Stripe payment link in digital quotes. Procedure approval and payment in one step."},
                "3": {"persona": "SaaS Clinic", "scenario": "Offers annual subscription plan with discount. Stripe manages renewals automatically."}
            },
            "faq": {
                "1": {"q": "What is Stripe's rate in Brazil?", "a": "2.9% + R$ 0.50 per approved card transaction. PIX and bank slip are available via Stripe in Brazil."},
                "2": {"q": "Does it work with debit cards?", "a": "Yes. Stripe accepts international debit cards. For domestic Brazilian debit, Asaas or Mercado Pago are better options."},
                "3": {"q": "How soon do I receive the money?", "a": "Stripe deposits in D+2 by default. Can be accelerated to D+0 on higher-volume plans."}
            }
        }
    },
    "pagseguro": {
        "name": "PagSeguro",
        "shortDesc": "PagBank — checkout, payment link and card reader integrated with Estetia.",
        "detail": {
            "headline": "PagBank in the CRM — from payment link to card reader in one place",
            "planInfo": "Available on all plans.",
            "benefits": {
                "1": {"title": "Established brand in Brazil", "text": "PagSeguro/PagBank is trusted and well-known. Patients have more confidence paying on recognized platforms."},
                "2": {"title": "Payment link", "text": "Send payment link via WhatsApp with procedure amount and description. Pay by card, PIX or bank slip."},
                "3": {"title": "Recurring billing", "text": "Create monthly plans with automatic billing. Ideal for protocols and treatment packages."},
                "4": {"title": "Integrated PagBank account", "text": "Receive payments directly in your PagBank account and transfer to your bank at any time."}
            },
            "howItWorks": {
                "1": {"title": "Create PagBank account", "text": "Visit pagbank.com.br and create your free business account. Approval in hours."},
                "2": {"title": "Get your credentials", "text": "In the PagBank panel, generate your integration Token under Settings > Integrations."},
                "3": {"title": "Configure in Estetia", "text": "Under Settings > Integrations > PagSeguro, paste the Token and PagBank account email."},
                "4": {"title": "Issue charges", "text": "In the patient profile, select PagSeguro as payment method. Generate a link or PIX QR Code in seconds."}
            },
            "useCases": {
                "1": {"persona": "Clinic with card reader", "scenario": "Already uses PagBank card reader at the front desk. With the integration, in-person payment automatically updates the CRM."},
                "2": {"persona": "Trichology Clinic", "scenario": "12-session packages with payment link. Patient pays in 12x installments, clinic receives in D+30."},
                "3": {"persona": "Receptionist", "scenario": "Sends payment link via WhatsApp 24h before the appointment. No-show rate dropped 35%."}
            },
            "faq": {
                "1": {"q": "PagSeguro or Asaas? Which to choose?", "a": "Asaas has lower fees for bank slips and PIX. PagSeguro is better if you already use the PagBank card reader or have a PagBank account."},
                "2": {"q": "Does it support installments?", "a": "Yes. Installments up to 12x with or without interest. You decide whether to absorb the interest or pass it to the patient."},
                "3": {"q": "Does it have anti-fraud?", "a": "Yes. PagSeguro has its own anti-fraud system with automatic approval for low-risk transactions."}
            }
        }
    },
    "googleAds": {
        "name": "Google Ads",
        "shortDesc": "Capture Google leads directly into your pipeline and measure the real cost per booked appointment.",
        "detail": {
            "headline": "Stop guessing ROI — measure the real cost of every patient acquired via Google",
            "planInfo": "Available on Pro and Business plans.",
            "benefits": {
                "1": {"title": "Real cost per appointment", "text": "See exactly how much you spent on ads for each appointment actually performed, not just clicks or leads."},
                "2": {"title": "Leads with automatic UTM", "text": "Every Google Ads lead arrives in Estetia tagged with the campaign, ad group and originating keyword."},
                "3": {"title": "Offline conversions for Google", "text": "Send back to Google which leads became patients. The algorithm optimizes campaigns for higher-value customers."},
                "4": {"title": "Inactive patient retargeting", "text": "Export lists of patients who haven't returned in 6 months and create targeted retargeting campaigns."}
            },
            "howItWorks": {
                "1": {"title": "Set up Google Tag Manager", "text": "Install GTM on the clinic website. Estetia provides ready-made tags to track contact forms."},
                "2": {"title": "Connect your Google Ads account", "text": "Under Settings > Integrations > Google Ads, sign in with the ad manager's Google account."},
                "3": {"title": "Enable conversion tracking", "text": "Select which Estetia events to send to Google: lead created, appointment booked, payment received."},
                "4": {"title": "Monitor ROAS in the dashboard", "text": "In Estetia's Analytics module, view by campaign: leads, bookings, revenue and ROAS calculated automatically."}
            },
            "useCases": {
                "1": {"persona": "Marketing Manager", "scenario": "Discovered that botox campaigns had CAC of R$ 45 and biostimulator R$ 280. Reallocated budget and reduced cost by 40%."},
                "2": {"persona": "Clinic Owner", "scenario": "By sending offline conversions to Google, the algorithm started bringing leads 3x more likely to close high-value procedures."},
                "3": {"persona": "Clinic Network", "scenario": "Each unit has its own conversion ID. The centralized report shows which unit has the best ROAS per campaign."}
            },
            "faq": {
                "1": {"q": "Is Google Tag Manager required?", "a": "Yes for web tracking. For offline conversions (via API), only the Google Ads account ID is needed."},
                "2": {"q": "How much does it cost?", "a": "The integration is free. Ad spend is set by you directly in Google Ads."},
                "3": {"q": "Does it work with Google Analytics 4?", "a": "Yes. Estetia can send events to GA4 via Measurement Protocol, complementing the tracking."}
            }
        }
    },
    "metaAds": {
        "name": "Meta Ads",
        "shortDesc": "Facebook & Instagram Ads with full attribution — know exactly which ads generate appointments.",
        "detail": {
            "headline": "Close the loop between ad and booked appointment in Meta Ads",
            "planInfo": "Available on Pro and Business plans.",
            "benefits": {
                "1": {"title": "Lead Forms imported automatically", "text": "Leads from Facebook and Instagram native forms arrive in Estetia within 60 seconds, ready for follow-up."},
                "2": {"title": "Cost per booked appointment", "text": "Not just cost per lead — see how much you spent for each appointment actually performed via Meta Ads."},
                "3": {"title": "Conversions API (CAPI)", "text": "Send conversion events server-side, bypassing ad blockers. More accurate data, more efficient campaigns."},
                "4": {"title": "Custom audiences", "text": "Export Estetia patients to create Lookalike Audiences in Meta. Advertise to people similar to your best patients."}
            },
            "howItWorks": {
                "1": {"title": "Connect Meta Business", "text": "Under Settings > Integrations > Meta Ads, sign in with the Meta Business Suite admin profile."},
                "2": {"title": "Select the ad account", "text": "Choose which ad account to sync. Supports multiple accounts for clinic networks."},
                "3": {"title": "Configure conversion events", "text": "Select: Lead Created, Appointment Booked, Payment Received. Estetia sends via CAPI automatically."},
                "4": {"title": "Analyze performance", "text": "In the Analytics panel, filter by Meta Ads source and view the full funnel from click to patient."}
            },
            "useCases": {
                "1": {"persona": "Plastic Surgery Clinic", "scenario": "Rhinoplasty Lead Forms arrive in the CRM in 1 minute. The agent calls while the lead is still hot."},
                "2": {"persona": "Performance Manager", "scenario": "With CAPI, recovered 30% of conversions iOS was blocking. ROAS increased 25% without raising budget."},
                "3": {"persona": "Clinic Network", "scenario": "Exported list of patients who had procedures over R$ 2,000 and created Lookalike. CPA dropped 40%."}
            },
            "faq": {
                "1": {"q": "What is Conversions API?", "a": "CAPI is a server-to-server API that sends conversion events directly from the server to Meta, without relying on the browser pixel."},
                "2": {"q": "Do Lead Forms work without a website?", "a": "Yes! Facebook/Instagram native Lead Forms don't need a website. The lead fills out within the social network itself."},
                "3": {"q": "Does it work with Instagram Ads?", "a": "Yes. Meta Ads manages Facebook and Instagram on the same platform. All events are tracked."}
            }
        }
    },
    "zapier": {
        "name": "Zapier",
        "shortDesc": "Connect Estetia to 5,000+ apps without writing a single line of code.",
        "detail": {
            "headline": "Automate without code — connect Estetia to any app in minutes",
            "planInfo": "Available on all paid plans.",
            "benefits": {
                "1": {"title": "5,000+ native integrations", "text": "Gmail, Google Sheets, Mailchimp, Calendly, ActiveCampaign, Typeform — if it's on Zapier, it connects with Estetia."},
                "2": {"title": "No-code automations", "text": "Build Trigger > Action flows in minutes. No developer or technical knowledge required."},
                "3": {"title": "Ready-made clinic templates", "text": "Use pre-built Zaps: new lead > Google Sheet, appointment created > custom confirmation email."},
                "4": {"title": "Ideal for small teams", "text": "Automate repetitive tasks that take the receptionist hours. Stock alerts, reports, notifications — on autopilot."}
            },
            "howItWorks": {
                "1": {"title": "Create Zapier account", "text": "Visit zapier.com and create a free account. The Free plan allows up to 100 tasks/month."},
                "2": {"title": "Connect Estetia as Trigger", "text": "In Zapier, search for Estetia CRM. Configure the Estetia webhook as the trigger (e.g. New Appointment)."},
                "3": {"title": "Configure the Action", "text": "Choose the destination app (e.g. Google Sheets) and map Estetia fields to the destination."},
                "4": {"title": "Test and activate", "text": "Zapier tests the flow with real data. If all good, activate and the Zap runs automatically."}
            },
            "useCases": {
                "1": {"persona": "Receptionist", "scenario": "Every new website lead goes automatically to a control spreadsheet and receives a welcome email."},
                "2": {"persona": "Marketing Manager", "scenario": "Patients who complete treatment are automatically added to a reactivation campaign in Mailchimp."},
                "3": {"persona": "Clinic Owner", "scenario": "Receives a Slack notification whenever a VIP patient books an appointment."}
            },
            "faq": {
                "1": {"q": "Does Zapier require payment?", "a": "The free plan includes 100 tasks/month and 2-step Zaps. For higher-volume clinics, the Starter plan (~$19/month) is sufficient."},
                "2": {"q": "How is it different from N8N?", "a": "Zapier is simpler with no server required. N8N is more powerful and self-hostable. Start with Zapier, migrate to N8N when you need more control."},
                "3": {"q": "Can I use Zapier and N8N at the same time?", "a": "Yes. Use Zapier for simple, quick automations and N8N for complex flows requiring advanced logic."}
            }
        }
    },
    "make": {
        "name": "Make (Integromat)",
        "shortDesc": "Advanced visual automations — Zapier for those who need more power.",
        "detail": {
            "headline": "Complex automation flows with visual builder — no code, no limits",
            "planInfo": "Available on all paid plans.",
            "benefits": {
                "1": {"title": "Powerful visual builder", "text": "Build multi-step flows by dragging and connecting modules. Loops, conditionals, iterators — all visual."},
                "2": {"title": "Cheaper than Zapier at scale", "text": "Make charges per operation, not per task. At high volumes, the cost can be 5x lower."},
                "3": {"title": "Native data transformation", "text": "Manipulate JSON, perform calculations, filter lists — all inside Make without external code."},
                "4": {"title": "1,000+ integrations", "text": "All essential apps: Google Workspace, HubSpot, Slack, Notion, Typeform and much more."}
            },
            "howItWorks": {
                "1": {"title": "Create Make account", "text": "Visit make.com and create your account. The free plan includes 1,000 operations/month."},
                "2": {"title": "Create a Scenario", "text": "In Make, create a new Scenario. Add the Estetia CRM module as the trigger (e.g. Watch New Appointments)."},
                "3": {"title": "Configure actions", "text": "Add destination modules (Google Sheets, email, Slack) and map Estetia data to each field."},
                "4": {"title": "Schedule execution", "text": "Define whether the scenario runs every 15 minutes, hourly, or in real-time via instant webhook."}
            },
            "useCases": {
                "1": {"persona": "Operations Manager", "scenario": "Automation that consolidates appointments from 5 units into a control Google Sheet, with overbooking alerts."},
                "2": {"persona": "Data Analyst", "scenario": "Syncs Estetia data with the company BI every hour. Make transforms and formats the data along the way."},
                "3": {"persona": "Scaling Clinic", "scenario": "New patient onboarding flow: creates account, sends welcome kit, schedules coordinator call."}
            },
            "faq": {
                "1": {"q": "Make or Zapier? Which to choose?", "a": "Zapier is simpler for basic automations. Make is more powerful for complex flows and more cost-effective at scale above 1,000 tasks/month."},
                "2": {"q": "Do you need to know how to code?", "a": "No. The visual builder covers 95% of cases. For the remaining 5%, Make has a JavaScript module for custom logic."},
                "3": {"q": "Is Make reliable?", "a": "Yes. Founded in 2012 (as Integromat), it has processed 5 billion operations. Acquired by Celonis in 2020."}
            }
        }
    }
}


def insert_items(filepath, new_items, locale):
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        data = json.load(f)

    items = data['integrations']['items']

    # Check if already inserted
    if 'whatsappEvolution' in items:
        print(f"[{locale}] whatsappEvolution already exists — skipping")
        return

    items.update(new_items)
    print(f"[{locale}] Inserted {len(new_items)} new items")

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"[{locale}] File written successfully")


# Determine script dir
script_dir = os.path.dirname(os.path.abspath(__file__))
base = os.path.dirname(script_dir)

ptbr_file = os.path.join(base, 'messages', 'pt-BR', 'marketing.json')
en_file = os.path.join(base, 'messages', 'en', 'marketing.json')

insert_items(ptbr_file, NEW_ITEMS_PTBR, 'pt-BR')
insert_items(en_file, NEW_ITEMS_EN, 'en')

print("Done!")
