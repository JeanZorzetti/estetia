# `/experience` vs `/experiencev2` — Comparação de Stacks

## Stack

| Dimensão | v1 (`/experience`) | v2 (`/experiencev2`) |
|---|---|---|
| Scroll library | GSAP ScrollTrigger + Lenis | `onScroll` nativo Anime.js v4 |
| Animation engine | GSAP (~35KB) | Anime.js v4 (~24.5KB gzip) |
| 3D / WebGL | R3F + drei (~150KB) | Nenhum (SVG 2D puro) |
| Smooth scroll | Lenis (~8KB) | Scroll nativo + lerp manual |
| Total bundle estimate | ~200KB gzip (GSAP+Lenis+R3F) | ~25KB gzip (Anime.js só) |

## Seções

| # | v1 | v2 |
|---|---|---|
| 1 | Hero WebGL distortion shader | **Stagger Hero** — letter-by-letter `stagger({from:'center'})` + partículas SVG drift |
| 2 | Editorial Manifesto (serif typography) | **SVG Morphing Manifesto** — `morphTo` circle→triangle→line→asterisk + sticky scroll |
| 3 | Procedural 3D scroll-driven (R3F) | **Timeline Journey** — `stroke-dasharray` line draw + dot reveal + partícula viajante |
| 4 | SVG line-drawing journey | — (merged into seção 3 da v2) |
| 5 | Infinite XY gallery (drag) | — (drag/inertia DOM puro, nenhum ganho com Anime.js) |
| 6 | Closing curtain CTA | **Closing Wave** — 80 barras SVG stagger massivo + `clip-path` curtain open |

## Decisões técnicas

### O que Anime.js v4 faz melhor que GSAP
- **`stagger({from:'center'})`**: propagação radial sem função de delay customizada
- **`morphTo()`**: SVG shape morphing built-in (GSAP precisa plugin pago MorphSVG)
- **`onScroll`**: sem triple-refresh, sem `invalidateOnRefresh`, sem `ScrollTrigger.refresh()` manual
- **`animate(path, {d: morphTo(...)})`**: integração direta de d-attribute animation

### O que GSAP faz melhor
- **Timeline scrub**: GSAP scrub com Lenis é mais fluído para animações 60fps sincronizadas
- **Pin nativo**: `pin:true` no ScrollTrigger é mais ergonômico que `height:Nvh + sticky`
- **R3F integration**: shaders GLSL, WebGL — não substituível

### Lições críticas do v1 que não se repetem no v2
- **`overflow-x-hidden` killer**: nenhum ancestral da v2 tem este valor. See [memory](../../../.claude/projects/c--Users-jeanz-OneDrive-Desktop-ROI-Labs/memory/overflow_x_hidden_kills_sticky.md)
- **`dynamic(ssr:false)` em Server Component**: todos os imports dinâmicos estão no `experience-v2-client.tsx` (`'use client'`)
- **CSP + HDRI**: sem R3F → sem fetch externo → sem CSP violation

## Veredicto (a preencher após validação visual)

- [ ] Bundle real medido via DevTools Network
- [ ] FPS sustentado em scroll automatizado (Playwright `performance.now()`)
- [ ] Percepção de suavidade sem Lenis (subjetivo)
- [ ] `getBoundingClientRect().top ≈ 0` nas seções pinadas (F2 e F3)

**Stack futura recomendada**: _a preencher após validação_
