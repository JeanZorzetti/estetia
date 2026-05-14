# Estetia — Guia de Configuração para Clínicas

Este guia leva a clínica do zero até operacional em menos de 2 dias úteis.

---

## Índice

1. [Criando sua conta](#1-criando-sua-conta)
2. [Cadastrando profissionais](#2-cadastrando-profissionais)
3. [Configurando procedimentos](#3-configurando-procedimentos)
4. [Conectando o WhatsApp](#4-conectando-o-whatsapp)
5. [Configurando salas](#5-configurando-salas)
6. [Importando pacientes](#6-importando-pacientes)
7. [Criando templates de anamnese](#7-criando-templates-de-anamnese)
8. [Ativando agendamento público](#8-ativando-agendamento-público)
9. [Configurando convênios (opcional)](#9-configurando-convênios-opcional)
10. [Configurando NFS-e (opcional)](#10-configurando-nfs-e-opcional)
11. [Checklist pré-go-live](#11-checklist-pré-go-live)

---

## 1. Criando sua conta

1. Acesse `https://estetiacrm.com.br/auth/register`
2. Preencha: nome, email, senha, nome da clínica
3. Confirme o email (link enviado em até 2 minutos)
4. Na tela de onboarding, selecione **"Clínica de Estética / Dermatologia"**
5. Você terá **14 dias grátis** sem cartão de crédito

> **Dica:** Use o email corporativo da clínica — não o pessoal. Isso facilita o acesso por outros usuários depois.

---

## 2. Cadastrando profissionais

Acesse: `Dashboard → Configurações → Profissionais → Novo Profissional`

Para cada profissional, preencha:
- Nome completo
- Conselho profissional: **CRM, CRO, CRBM, CRF** ou **COREN**
- Número de inscrição + UF
- Especialidades (ex: Harmonização facial, Laser, Peeling)
- Foto de perfil (aparece no agendamento público)
- Carga horária (para bloqueio automático de agenda)

O sistema **valida automaticamente** a inscrição no CRM via API do CFM. Para outros conselhos, o upload do comprovante resolve.

> **Para clínicas com médicos:** A validação CFM é feita a cada 30 dias automaticamente. Se a inscrição for suspensa, você recebe um alerta por email.

---

## 3. Configurando procedimentos

Acesse: `Dashboard → Configurações → Procedimentos → Novo Procedimento`

Para cada procedimento:

| Campo | Exemplo |
|---|---|
| Nome | Toxina Botulínica — Testa |
| Categoria | BOTOX |
| Duração (min) | 30 |
| Valor padrão | R$ 600,00 |
| Exige anamnese específica | Sim |
| Pré-cuidados | "Não fazer atividade física 4h antes..." |
| Pós-cuidados | "Não deitar por 4h, não massagear..." |
| Profissionais habilitados | Selecionar quais profissionais podem realizar |

> **Dica:** Configure os pré e pós-cuidados com atenção — eles são enviados automaticamente por WhatsApp para a paciente.

**Janela de recall por categoria (padrão):**

| Procedimento | Janela padrão |
|---|---|
| Botox / Toxina | 4–6 meses |
| Preenchimento labial | 12–18 meses |
| Bioestimulador | 6 meses |
| Laser CO2 | 6–12 meses |
| Peeling químico | 3 meses |
| Microagulhamento | 4 semanas |
| Limpeza de pele | 4–6 semanas |

Você pode customizar a janela por procedimento na tela de configuração.

---

## 4. Conectando o WhatsApp

Acesse: `Dashboard → Configurações → WhatsApp`

O Estetia usa a **WhatsApp Business API** (Meta), que requer um número dedicado:

**Passo a passo:**
1. Tenha um número de telefone que **não está no WhatsApp pessoal** atualmente (pode ser um chip novo ou um número de VoIP como VIVO Empresas)
2. Clique em **"Conectar WhatsApp Business"**
3. Siga o fluxo OAuth da Meta (leva ~5 minutos)
4. Teste enviando uma mensagem para você mesmo

**Automações ativadas após conexão:**
- ✅ T-48h: Confirmação de consulta (botão Sim / Reagendar)
- ✅ T-24h: Lembrete + pré-cuidados do procedimento
- ✅ T+2h: Pós-cuidados
- ✅ T+30 dias: NPS + solicita foto de resultado
- ✅ T+janela: Recall de recompra

> **Sobre custos Meta:** O WhatsApp Business API tem uma quota gratuita de 1.000 conversas iniciadas por negócio/mês. Após isso, o custo é de ~R$ 0,22 por conversa (Meta, 2026). Para a maioria das clínicas Starter, a quota gratuita é suficiente.

---

## 5. Configurando salas

Acesse: `Dashboard → Configurações → Salas`

Crie uma sala por espaço físico de atendimento:

| Campo | Exemplo |
|---|---|
| Nome | Sala 1 — Botox |
| Tipo | PROCEDIMENTO |
| Equipamentos | Foco LED, Maca elétrica |
| Disponibilidade | Seg–Sex 08:00–19:00, Sáb 08:00–14:00 |

O sistema usa as salas para evitar conflito de agenda (dois procedimentos marcados na mesma sala ao mesmo tempo).

---

## 6. Importando pacientes

**Opção A — Importação CSV**

1. Acesse: `Pacientes → Importar → Download modelo CSV`
2. Preencha a planilha com: nome, telefone, email (opcional), data nascimento (opcional)
3. Faça upload do arquivo
4. O sistema cria um `Patient` para cada linha válida

**Opção B — Migração do Sirius CRM**

Se você estava usando o Sirius CRM, rode o script de migração:

```bash
tsx scripts/migrate-sirius-to-estetia.ts --org=<seu-org-id> --dry-run
# Revise o preview, depois:
tsx scripts/migrate-sirius-to-estetia.ts --org=<seu-org-id> --commit
```

Os `Contact` originais **não são deletados** — a migração cria novos `Patient` com referência `legacyContactId`.

**Opção C — Manual**

`Pacientes → Novo Paciente` — para volumes pequenos (< 20 pacientes).

---

## 7. Criando templates de anamnese

Acesse: `Dashboard → Anamnese → Templates → Novo Template`

**Template sugerido para Botox:**

```
Seção: Histórico de Saúde
- Você usa algum medicamento de uso contínuo? (text)
- Tem alguma alergia conhecida? (text)
- Já fez toxina botulínica antes? (boolean)
  → Se sim: quando foi a última aplicação? (date)
- Tem histórico de doenças autoimunes? (boolean)
- Está grávida ou amamentando? (boolean)

Seção: Consentimento
- Li e concordo com os riscos e procedimentos informados. (boolean — obrigatório)
- Autorizo o uso de fotos para acompanhamento clínico. (boolean)
- Autorizo o uso de imagens para fins de marketing (Instagram/site). (boolean)
```

> **Atenção LGPD:** Os campos de saúde são automaticamente criptografados (AES-256-GCM) antes de salvar no banco. Nenhum funcionário sem permissão de acesso ao prontuário consegue ler as respostas.

---

## 8. Ativando agendamento público

Acesse: `Dashboard → Configurações → Agendamento Público`

1. Defina o **slug** da clínica (ex: `clinica-bella` → link: `estetiacrm.com.br/agendar/clinica-bella`)
2. Escolha quais procedimentos aparecem para agendamento público
3. Configure o intervalo mínimo de antecedência (ex: 2 horas)
4. Copie o link e cole na bio do Instagram, no Google Meu Negócio e no site

**O que a paciente vê:**
1. Lista de procedimentos com duração e preço
2. Escolha de profissional (com foto)
3. Calendário com horários disponíveis
4. Formulário de dados (nome, telefone, observação)
5. Confirmação + WhatsApp automático

---

## 9. Configurando convênios (opcional)

*Somente plano Business.*

Acesse: `Dashboard → Operadoras → Nova Operadora`

Para cada operadora:
- Nome + Código ANS (6 dígitos)
- CNPJ
- Email de faturamento
- Prazo de repasse (dias)

Depois, adicione os **convênios por procedimento**: valor negociado com a operadora para cada código TUSS.

Ao registrar uma sessão realizada, o sistema pergunta se o pagamento é **particular ou convênio**. Se for convênio, gera automaticamente a guia TISS no formato XML.

---

## 10. Configurando NFS-e (opcional)

*Disponível nos planos Pro e Business.*

Acesse: `Dashboard → Configurações → Fiscal`

Você precisará das seguintes variáveis de ambiente (configurar no painel do servidor):

```env
NFSE_PROVIDER=focus          # ou "nfeio"
NFSE_PRESTADOR_CNPJ=00.000.000/0001-00
NFSE_PRESTADOR_IM=12345678   # Inscrição Municipal
NFSE_MUNICIPIO_IBGE=3550308  # Código IBGE do município (SP = 3550308)
NFSE_CODIGO_SERVICO=14.01    # Código de serviço municipal
NFSE_ALIQUOTA_ISS=0.05       # 5% = ISS padrão SP
NFSE_AMBIENTE=sandbox        # Mude para "producao" após homologar
```

Em sandbox, a NFS-e é emitida para homologação (não tem validade fiscal). Em produção, é emitida com valor legal.

Após configurar, a NFS-e é emitida automaticamente ao marcar uma sessão como **PAGA** ou **AUTORIZADA** (convênio).

---

## 11. Checklist pré-go-live

Antes de usar com pacientes reais:

**Configuração:**
- [ ] Pelo menos 1 profissional cadastrado com conselho validado
- [ ] Pelo menos 5 procedimentos cadastrados com pré/pós-cuidados
- [ ] WhatsApp conectado e testado (envie mensagem para você mesmo)
- [ ] Template de anamnese criado para o procedimento principal

**Teste de fluxo:**
- [ ] Criar sessão de teste → verificar se WhatsApp T-48h chegou
- [ ] Preencher anamnese de teste pelo link (celular)
- [ ] Marcar sessão como REALIZADA → verificar se NFS-e foi emitida (se configurado)
- [ ] Verificar dashboard: sessão aparece no calendário?

**LGPD:**
- [ ] Termo LGPD ativo para coleta de dados de saúde
- [ ] Termo de autorização de procedimento configurado
- [ ] Política de privacidade atualizada no site/link (use `/privacy`)

**Comunicação:**
- [ ] Link de agendamento público no Instagram
- [ ] Link de agendamento público no Google Meu Negócio
- [ ] Equipe treinada no painel (crie usuários com perfil `MEMBER` para recepção)

---

## Suporte

- **Email:** suporte@estetiacrm.com.br
- **Chat:** disponível no dashboard (ícone balão no canto inferior direito)
- **Tempo de resposta:** até 2 horas (planos Pro e Business), 24h (Starter)

---

*Versão 1.0 — Maio 2026*
