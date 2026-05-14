# Integração TISS — Guia Prático para Clínicas

Guia para clínicas de estética e dermatologia que atendem planos de saúde e precisam enviar guias no padrão TISS da ANS.

---

## O que é TISS?

**TISS (Troca de Informações em Saúde Suplementar)** é o padrão XML obrigatório da ANS para comunicação entre prestadores de serviços de saúde (clínicas, hospitais) e operadoras de planos de saúde.

Versão suportada pelo Estetia: **TISS 4.01.00** (vigente desde 2024).

---

## Pré-requisitos

Para usar TISS no Estetia você precisa:

1. **Plano Business** (o único que inclui TISS/convênios)
2. **Registro como prestador** em pelo menos uma operadora de saúde
3. **Código de prestador** fornecido pela operadora após credenciamento
4. **Tabela TUSS** dos procedimentos negociados com a operadora

---

## Tipos de guia suportados

| Tipo | Quando usar |
|---|---|
| **Guia de Consulta** | Atendimento ambulatorial simples (ex: consulta dermatológica) |
| **Guia SADT** | Serviço Auxiliar de Diagnóstico e Terapia — procedimentos estéticos, laser, peeling |

> Procedimentos puramente estéticos sem CID médico **não são cobertos por planos**. TISS só se aplica a procedimentos com cobertura contratual. Consulte o seu credenciamento.

---

## Configuração inicial

### 1. Cadastrar operadoras

Acesse: `Dashboard → Operadoras → Nova Operadora`

| Campo | Onde encontrar |
|---|---|
| Nome | Nome comercial da operadora (ex: Bradesco Saúde) |
| Código ANS | No seu contrato de credenciamento (6 dígitos) |
| CNPJ | Site da operadora ou contrato |
| Código de prestador | Fornecido pela operadora no credenciamento |
| Email de faturamento | Operadora informa no credenciamento |
| Prazo de repasse | Contrato (ex: 30 dias após protocolo) |

### 2. Cadastrar convênios por procedimento

Para cada procedimento que você atende via plano:

Acesse: `Operadoras → [nome da operadora] → Convênios → Adicionar`

| Campo | Descrição |
|---|---|
| Código TUSS | Código do procedimento na tabela TUSS (ex: 10101012 = consulta médica) |
| Descrição TUSS | Nome oficial conforme tabela |
| Valor negociado | Valor que a operadora paga por procedimento |

**Tabela TUSS útil para estética/dermato:**

| Código TUSS | Descrição | Observação |
|---|---|---|
| 10101012 | Consulta em consultório (horário normal) | Consulta dermatológica |
| 10101039 | Consulta em consultório (retorno) | Retorno dermato |
| 40302083 | Toxina botulínica — aplicação | Exige CRM e CID |
| 40312083 | Peeling químico | Superficial/médio |
| 40302415 | Microagulhamento | Com autorização prévia |
| 40308050 | Fototerapia (laser/luz intensa) | Laser fracionado médico |

> Para a tabela TUSS completa, acesse: [tuss.datasus.gov.br](https://tuss.datasus.gov.br)

### 3. Configurar dados do prestador

Acesse: `Dashboard → Configurações → Dados do Prestador`

| Campo | Descrição |
|---|---|
| Nome do contratado | Razão social da clínica |
| Código prestador | Fornecido pela operadora |
| CNES | Cadastro Nacional de Estabelecimentos de Saúde (obrigatório para SADT) |

---

## Emitindo uma guia TISS

### Fluxo: Consulta Dermatológica (Guia de Consulta)

1. Registre a sessão normalmente na agenda
2. Ao marcar como **REALIZADA**, selecione **"Faturar via convênio"**
3. O sistema preenche automaticamente:
   - Dados da operadora (Registro ANS, código prestador)
   - Dados do beneficiário (número do plano da paciente)
   - Dados do profissional (CRM, especialidade)
4. Clique em **"Gerar Guia TISS"**
5. O XML é gerado e salvo em `Operadoras → Guias TISS`

### Fluxo: Procedimento Estético (Guia SADT)

1. Igual ao acima, porém selecione tipo **SADT**
2. Adicione os procedimentos realizados (código TUSS + quantidade + valor)
3. O sistema inclui automaticamente os campos obrigatórios do cabeçalho SADT

---

## Enviando para a operadora

O Estetia **gera o XML** mas **não faz o envio eletrônico** para as operadoras (cada operadora tem seu próprio portal). O processo é:

1. Acesse `Operadoras → Guias TISS → [status: RASCUNHO]`
2. Clique em **"Marcar como Enviada"** após fazer o upload no portal da operadora
3. Guarde o protocolo de recebimento da operadora na observação da guia

**Portais das principais operadoras:**

| Operadora | Portal |
|---|---|
| Bradesco Saúde | prestador.bradescosaude.com.br |
| Amil | portaldoprestador.amil.com.br |
| SulAmérica | portaldoprestador.sulamerica.com.br |
| Unimed | Varia por regional — consulte sua regional |
| Hapvida/NotreDame | portalprestador.hapvida.com.br |

---

## Gerenciando glosas

Uma **glosa** é uma negativa de pagamento pela operadora (total ou parcial).

### Fluxo de glosa no Estetia:

1. Receba notificação de glosa da operadora (email ou portal)
2. Acesse `Operadoras → Guias TISS → [status: ENVIADA]`
3. Clique em **"Registrar Glosa"** e preencha o motivo
4. A guia muda para status `GLOSADA`
5. Analise o motivo: muitos são recorríveis (código TUSS errado, ausência de autorização prévia)
6. Se recorrível: corrija e gere nova guia com a opção **"Recurso de Glosa"**

### Principais motivos de glosa e como evitar:

| Motivo | Prevenção |
|---|---|
| Procedimento sem cobertura | Confirme cobertura antes da sessão |
| Código TUSS incorreto | Use a tabela de convênios configurada no sistema |
| Ausência de autorização prévia | Configure alerta para procedimentos que exigem prévia |
| Dados do beneficiário incorretos | Valide número do plano na admissão |
| CRM do profissional inválido | O sistema valida automaticamente — garanta que está ativo |
| Guia fora do prazo | Envie guias em até 30 dias da realização |

---

## Status das guias

| Status | Descrição |
|---|---|
| `RASCUNHO` | Guia gerada, não enviada para a operadora |
| `ENVIADA` | Guia enviada, aguardando processamento |
| `AUTORIZADA` | Aprovada pela operadora |
| `PAGA` | Pagamento confirmado |
| `GLOSADA` | Negada (total ou parcialmente) |
| `CANCELADA` | Cancelada antes do envio |

---

## NFS-e integrada com TISS

Ao marcar uma guia como `PAGA`, o Estetia pode emitir a **NFS-e automaticamente** com os dados financeiros da guia.

Para ativar, configure as variáveis de NFS-e (ver [CLINICA-SETUP-GUIDE.md](./CLINICA-SETUP-GUIDE.md#10-configurando-nfs-e-opcional)).

---

## Relatório ANS

Acesse: `Dashboard → Relatórios → ANS`

O relatório mostra:
- Volume de atendimentos por operadora no período
- Taxa de aprovação vs. glosa por operadora
- Valor total enviado vs. valor pago
- Procedimentos mais glosados

Útil para renegociar contratos com operadoras e se preparar para auditorias ANS.

---

## Dúvidas frequentes

**P: Posso usar TISS sem ser médico?**
R: TISS se aplica a qualquer profissional de saúde credenciado em plano. Biomédicos (CRBM), enfermeiros (COREN) e fisioterapeutas (CREFITO) também podem enviar guias SADT. A cobertura depende do contrato com a operadora.

**P: A guia precisa ser gerada antes ou depois do procedimento?**
R: Para consultas, pode ser posterior. Para SADT com procedimentos de alto custo, a operadora pode exigir **autorização prévia** (AP) antes da realização. Configure quais procedimentos exigem AP no cadastro do convênio.

**P: Como validar o XML antes de enviar?**
R: O Estetia valida o XML contra o XSD oficial da ANS antes de exibir a guia. Se houver inconsistência, um alerta aparece na tela com o campo problemático.

**P: O sistema guarda o histórico das guias?**
R: Sim. Todas as guias ficam salvas com o XML original, data de geração, status e histórico de alterações. Você pode reemitir o XML de qualquer guia a qualquer momento.

---

*Versão 1.0 — Maio 2026*
