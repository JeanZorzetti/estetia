// Generates the PDF and the preview image of every anamnesis form from the page itself, so
// paper, PDF and screen never drift apart.
//
//   1. start the site (`npx next dev`, or a local build)
//   2. node scripts/gerar-fichas.mjs [http://localhost:3000]
//   3. commit public/fichas
//
// Fails if a form does not fit one A4 sheet (front and back): the pages promise that.

import { mkdirSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright'
import sharp from 'sharp'

const base = process.argv[2] || 'http://localhost:3000'
const INDICE = '/ferramentas/fichas-de-anamnese'
const DESTINO = 'public/fichas'
const A4 = { width: 794, height: 1123 } // CSS px at 96 dpi
const ESCALA = 1240 / A4.width // preview is 1240 x 1754, large enough for Google Images

mkdirSync(DESTINO, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: A4, deviceScaleFactor: ESCALA })

await page.goto(base + INDICE, { waitUntil: 'networkidle' })
const slugs = await page.$$eval(`a[href^="${INDICE}/"]`, (links) => [
  ...new Set(links.map((a) => a.getAttribute('href').split('/').pop())),
])
if (!slugs.length) throw new Error(`no forms linked from ${base + INDICE}`)

let falhou = false
for (const slug of slugs) {
  await page.goto(`${base}${INDICE}/${slug}`, { waitUntil: 'networkidle' })
  await page.emulateMedia({ media: 'print' })

  const pdf = await page.pdf({ preferCSSPageSize: true })
  const paginas = (pdf.toString('latin1').match(/\/Type\s*\/Page\b(?!s)/g) || []).length
  writeFileSync(`${DESTINO}/ficha-de-anamnese-${slug}.pdf`, pdf)

  // First page as an image: same print layout, with the paper margin drawn in.
  await page.addStyleTag({ content: 'html,body{background:#fff!important}.ficha-folha{padding:45px!important}' })
  const png = await page.screenshot({ clip: { x: 0, y: 0, ...A4 } })
  await sharp(png).webp({ quality: 82 }).toFile(`${DESTINO}/ficha-de-anamnese-${slug}.webp`)

  const ok = paginas >= 1 && paginas <= 2
  if (!ok) falhou = true
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${slug}: ${paginas} page(s), ${(pdf.length / 1024).toFixed(0)} KB`)
  await page.emulateMedia({ media: 'screen' })
}

await browser.close()
if (falhou) {
  console.error('A form does not fit one A4 sheet (front and back). Trim it or lower the print font size.')
  process.exit(1)
}
