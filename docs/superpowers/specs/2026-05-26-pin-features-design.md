# Pin Features — Design Spec

**Data:** 2026-05-26
**Status:** Aprovado, em implementação
**Escopo:** Seção pin com scrub via ScrollTrigger, abaixo do hero cinematic

## Objetivo

Criar uma seção fullscreen pinada que atravessa 4 features do Estetia em sequência cinematográfica. Scroll do usuário controla o avanço (scrub), simulando movimento de câmera entre estações.

## Mecânica

```ts
ScrollTrigger.create({
  trigger: sectionRef.current,
  start: 'top top',
  end: '+=400%',
  pin: true,
  scrub: 1,
  anticipatePin: 1,
})
```

- Altura total: 400vh (4 viewports de scroll)
- Pin: seção fica fixa enquanto rola
- Scrub 1: animação ligada ao scroll com inércia de 1s (sensação de câmera)

## Timeline GSAP (atrelada ao scrub)

Cada estação ocupa 25% do progresso. Transição entre estações:

1. Fade-out da estação anterior (opacity → 0, y → -40px, duração relativa 0.2)
2. Stagger 0.2s na nova estação, na ordem:
   - Número (`01 → 02`)
   - Título
   - Descrição
   - Mockup visual (x +60 → 0, opacity)
3. Ease: `power3.out` em todos

Total por transição: ~1.0s no timeline (mapeado para 25% do scroll via scrub).

## 4 estações

| # | Título | Descrição | Visual abstrato |
|---|---|---|---|
| 01 | Agenda Inteligente | "Sua IA preenche horários ociosos com pacientes do recall automaticamente." | Grid de slots de agenda, alguns marcados |
| 02 | Financeiro Clínico | "Comissões, custo de procedimento e margem real em tempo real." | Barras de procedimentos com valores |
| 03 | Reativação WhatsApp | "A IA identifica pacientes elegíveis e dispara mensagens personalizadas." | Bolhas de chat empilhadas |
| 04 | Evolução Antes/Depois | "Slider de fotos com timeline clínica e consent automático." | Comparador de imagens side-by-side |

## Layout (estado pinado)

```
┌──────────────────────────────────────────────┐
│ ●  (progress rail 4 dots)                    │
│ ○                                            │
│ ○         ┌────────────────┐                 │
│ ○         │                │                 │
│           │   Visual       │                 │
│ 01 / 04   │   da feature   │                 │
│           │   ativa        │                 │
│ Título    │                │                 │
│ Descrição └────────────────┘                 │
└──────────────────────────────────────────────┘
```

- 50% esquerda: texto (number/title/desc)
- 50% direita: mockup visual
- Lateral esquerda: progress rail vertical de 4 dots
- Lado fixo (não alterna) — estabilidade de câmera

## Arquivos a criar

```
components/marketing/
  pin-features.tsx                          # orquestrador client
  pin-features/
    stations-data.ts                        # 4 features (texto)
    station-content.tsx                     # bloco texto
    station-visual.tsx                      # 4 mockups SVG inline
    progress-rail.tsx                       # 4 dots verticais

app/[locale]/(marketing)/design-system/
  hero-cinematic/page.tsx                   # adicionar <PinFeatures />
```

## Acessibilidade

- `prefers-reduced-motion: reduce`:
  - Pin desligado, scrub desligado
  - 4 estações renderizam empilhadas como blocos normais full-height
  - Sem GSAP
- Progress rail tem `role="progressbar"`, `aria-valuenow={station+1}`, `aria-valuemax={4}`
- Cada estação é `<article>` com `<h2>` semântico

## Performance

- Uma única timeline GSAP master
- `will-change: transform, opacity` apenas nos elementos animados
- Mockups são SVG/JSX inline (sem flash de carregamento)
- Cleanup completo: `tl.kill()` + `ScrollTrigger.getById(id).kill()` no unmount

## O que NÃO faz parte

- Navegação por clique nos dots
- Vídeos dentro dos mockups
- Versão mobile com swipe horizontal — mobile vira lista vertical sem pin (mesmo comportamento de reduced-motion)
- Animação inversa customizada — scrub já cuida via `ScrollTrigger`

## Verificação

- `npm run build` passa sem erros TS
- Rolar `/design-system/hero-cinematic` após o hero → seção pina, 4 estações entram em sequência
- Rolar pra cima → animação volta suavemente
- DevTools com `prefers-reduced-motion: reduce`: seção vira empilhada normal
