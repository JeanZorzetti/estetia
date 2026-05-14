# Checklist LGPD para Clínicas de Estética e Dermatologia

Conformidade com a Lei Geral de Proteção de Dados — com ênfase em **dados de saúde (Art. 11)**.

> ⚠️ **Nota jurídica:** Este checklist é um guia técnico-operacional. Antes do go-live, recomendamos revisão por advogado especializado em LGPD ou DPO externo.

---

## Por que dados de saúde têm tratamento especial?

A LGPD classifica dados de saúde como **dados sensíveis** (Art. 5º, II), sujeitos a regras mais rígidas do **Art. 11**:

- Só podem ser tratados com **consentimento específico e destacado** ou para **proteção da vida** / **tutela da saúde** pelo profissional habilitado
- Exigem **medidas de segurança reforçadas**
- A violação tem multa máxima de **R$ 50 milhões por infração** (Art. 52)

---

## Checklist por área

### 1. Base legal e consentimentos

- [ ] **Consentimento LGPD ativo** para coleta de dados de saúde (anamnese, alergias, medicações)
  - *Como configurar:* `Dashboard → Consentimentos → Novo Consentimento → Tipo: LGPD_DADOS_SAUDE`
  - O Estetia cria log imutável de cada consentimento com timestamp, IP e hash do documento

- [ ] **Consentimento de uso de imagem** separado e granular (fotos antes/depois)
  - Deve distinguir: uso interno (prontuário) × uso externo (marketing, Instagram)
  - *Como configurar:* `Dashboard → Consentimentos → Tipo: USO_FOTO`

- [ ] **Termo de autorização de procedimento** para cada tipo de procedimento de risco
  - Inclui: descrição do procedimento, riscos, alternativas, profissional responsável
  - *Como configurar:* `Dashboard → Consentimentos → Tipo: AUTORIZACAO_PROCEDIMENTO`

- [ ] **Política de privacidade** atualizada no site com:
  - Identificação do controlador (CNPJ, endereço, email do DPO)
  - Finalidade específica do tratamento de dados de saúde
  - Direitos do titular (Art. 18)
  - Prazo de retenção dos dados
  - *Link:* `estetiacrm.com.br/privacy` (personalize em `app/(marketing)/privacy/page.tsx`)

- [ ] **Aviso de privacidade** exibido no formulário de anamnese (antes do preenchimento)

---

### 2. Segurança técnica

- [ ] **Criptografia de dados sensíveis** ativa
  - Campos criptografados com AES-256-GCM: anamnese (`respostas`), CPF, fotos clínicas
  - Verificar: `lib/encryption.ts` — chave via `ENCRYPTION_KEY` (env var, nunca hardcoded)
  - *Comando de verificação:* `grep -r "encrypt(" app/api/clinica/anamnese/`

- [ ] **Controle de acesso por perfil** configurado
  - `ADMIN`: acesso total (dono da clínica, médico responsável)
  - `MEMBER`: agenda e cadastro de pacientes, sem acesso a prontuário
  - Teste: logar com usuário MEMBER e tentar acessar `/api/clinica/prontuario/[id]` → deve retornar 403

- [ ] **Audit log imutável** de acessos a prontuário ativo
  - Cada acesso a prontuário gera um registro em `MedicalAccessLog` com: userId, patientId, ação, IP, timestamp
  - A tabela não tem UPDATE/DELETE no código — apenas INSERT
  - *Verificar:* `lib/audit/medical-access-log.ts`

- [ ] **Variáveis de ambiente sensíveis** não estão no código-fonte
  - `ENCRYPTION_KEY`, `DATABASE_URL`, chaves de API → somente em `.env.local` / painel do servidor
  - `.env` não deve estar no `.gitignore` violado
  - *Comando:* `git status --short | grep ".env"` → deve retornar vazio

- [ ] **Conexão com banco de dados** via SSL/TLS
  - Verificar `DATABASE_URL` — deve ter `?sslmode=require` (produção)
  - *Exceção:* `sslmode=disable` é aceitável apenas em dev local

---

### 3. Direitos do titular (Art. 18)

- [ ] **Portabilidade (Art. 18 II):** endpoint de exportação funcionando
  - `GET /api/lgpd/export?pacienteId=<id>` → retorna JSON com todos os dados do paciente
  - Inclui: dados pessoais, anamneses descriptografadas, histórico de tratamentos, consentimentos, logs de acesso
  - *Prazo legal:* responder em até 15 dias

- [ ] **Direito ao esquecimento (Art. 18 VI):** endpoint de anonimização funcionando
  - `POST /api/lgpd/delete` com `{ pacienteId, reason }` → anonimiza dados pessoais
  - Preserva: dados financeiros/fiscais (NFS-e, guias TISS) — obrigatório por lei fiscal
  - Anonimiza: nome (→ "Paciente Anônimo #N"), CPF, email, telefone, anamneses, fotos
  - *Nota:* só admins podem executar; ação é logada permanentemente

- [ ] **Revogação de consentimento:** funcionalidade disponível
  - `PATCH /api/lgpd/consent-history` com `{ consentId, action: "revogar" }`
  - Após revogação, dados de saúde não podem mais ser tratados para aquela finalidade
  - *Interface:* `Dashboard → Consentimentos → [paciente] → Revogar`

- [ ] **Canal de contato para o titular** publicado
  - Email de contato para requisições LGPD deve estar na política de privacidade
  - Sugestão: `privacidade@suaclinica.com.br` com resposta em até 15 dias

---

### 4. Gestão de fornecedores (Art. 46 §1º)

- [ ] **DPA (Data Processing Agreement)** com a Estetia/ROI Labs assinado
  - A Estetia atua como **operadora** (Art. 5º, VII) — processa dados em nome da clínica
  - A clínica atua como **controladora** — define finalidade e responsável perante o titular
  - *Solicite via:* juridico@estetiacrm.com.br

- [ ] **Lista de subprocessadores** revisada
  - Estetia usa: PostgreSQL (banco), Meta/WhatsApp (mensageria), Focus NFe ou NFE.io (NFS-e), Resend (email)
  - Cada um tem DPA próprio disponível nos respectivos sites

- [ ] **Transferência internacional** verificada (se aplicável)
  - WhatsApp (Meta): dados trafegam nos EUA — coberto pelo DPA da Meta com cláusulas padrão da ANPD

---

### 5. Governança e DPO

- [ ] **DPO (Encarregado) designado** (Art. 41)
  - Para clínicas pequenas (<20 funcionários), pode ser o próprio dono ou um DPO externo
  - Nome e email do DPO devem constar na política de privacidade
  - *Serviços de DPO externo:* IAPP, DPOnet, BugHunt (valores a partir de ~R$ 500/mês)

- [ ] **Registro de atividades de tratamento (ROPA)** documentado
  - Liste: quais dados coleta, para qual finalidade, por quanto tempo, quem acessa
  - Não precisa ser entregue à ANPD proativamente — mas deve existir para inspeções
  - *Modelo simples abaixo*

- [ ] **Plano de resposta a incidentes** documentado
  - Em caso de vazamento: ANPD deve ser notificada em até 72h (Resolução CD/ANPD 02/2022)
  - Titulares afetados devem ser notificados sem demora indevida
  - *Contato ANPD:* anpd.gov.br

- [ ] **Treinamento da equipe** realizado
  - Recepcionistas, profissionais e assistentes devem saber: o que é LGPD, como tratar acesso a prontuário, como responder solicitações de titulares

---

## Modelo ROPA simplificado

| Atividade | Dado | Finalidade | Base legal | Retenção | Acesso |
|---|---|---|---|---|---|
| Cadastro de paciente | Nome, telefone, email | Gestão de agenda e comunicação | Contrato (Art. 7º, V) | Vigência do contrato + 5 anos | Admin, Member |
| Anamnese | Histórico de saúde, alergias, medicações | Segurança do procedimento clínico | Consentimento específico (Art. 11, I) + Tutela da saúde (Art. 11, II, f) | Vigência + 20 anos (CFM) | Admin (médico) |
| Foto clínica | Imagem antes/depois | Acompanhamento clínico | Consentimento específico | Vigência + 20 anos | Admin (médico) |
| Foto marketing | Imagem antes/depois | Divulgação em redes sociais | Consentimento específico (opt-in) | Até revogação do consentimento | Admin |
| NFS-e / Guia TISS | Nome, CPF, dados financeiros | Obrigação fiscal/legal | Obrigação legal (Art. 7º, II) | 5 anos (legislação fiscal) | Admin |
| Log de acesso | userId, IP, timestamp | Auditoria de segurança | Interesse legítimo (Art. 10) | 2 anos | Admin |

---

## Prazos importantes

| Situação | Prazo legal |
|---|---|
| Responder solicitação do titular | 15 dias (prorrogável por igual período com justificativa) |
| Notificar ANPD sobre incidente | 72 horas após ciência do fato |
| Notificar titulares sobre incidente | Sem demora indevida |
| Atender solicitação de portabilidade | 15 dias |
| Excluir dados após pedido de esquecimento | 15 dias |

---

## Configuração rápida no Estetia

```bash
# Verificar se os endpoints LGPD estão respondendo:
curl -X GET "https://estetiacrm.com.br/api/lgpd/consent-history?pacienteId=TEST" \
  -H "Authorization: Bearer <token>"
# Deve retornar 404 (paciente não encontrado), não 500

# Verificar audit log:
curl -X GET "https://estetiacrm.com.br/api/clinica/prontuario/<id>" \
  -H "Authorization: Bearer <token>"
# Deve criar entrada em MedicalAccessLog
```

---

*Versão 1.0 — Maio 2026*
*Este documento não substitui consultoria jurídica especializada.*
