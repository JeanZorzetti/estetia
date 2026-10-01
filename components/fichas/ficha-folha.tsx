import type { AnamnesisField } from '@/lib/domain/anamnesis'
import type { FichaAnamnese, FichaTabela } from '@/config/fichas-anamnese'

/**
 * The printable sheet. It is the only part of the page that prints (see the "Fichas de anamnese"
 * block in app/globals.css), and scripts/gerar-fichas.mjs turns it into the PDF and the preview
 * image, so screen, paper and PDF never drift apart.
 *
 * It is a document, not a form: blanks and boxes are decorative (aria-hidden) and the labels
 * carry the meaning. Do not use <header>/<nav>/<aside> in here: the global print rule hides them.
 */

const Linha = ({ className = '' }: { className?: string }) => (
  <span aria-hidden className={`inline-block min-w-12 flex-1 border-b border-[#0A1F3D]/50 ${className}`} />
)

const Caixa = () => (
  <span aria-hidden className="mr-1.5 inline-block size-3 shrink-0 rounded-[2px] border border-[#0A1F3D]/70 align-[-1px]" />
)

const Opcoes = ({ opcoes }: { opcoes: string[] }) => (
  <span className="flex flex-wrap gap-x-4 gap-y-1">
    {opcoes.map((op) => (
      <span key={op} className="whitespace-nowrap">
        <Caixa />
        {op}
      </span>
    ))}
  </span>
)

const INTEIRA = 'sm:col-span-2 print:col-span-2'

function Campo({ campo }: { campo: AnamnesisField }) {
  switch (campo.type) {
    case 'boolean':
      return (
        <li className={`${INTEIRA} flex flex-wrap items-end gap-x-3 gap-y-1`}>
          <span>{campo.label}</span>
          <span className="flex min-w-48 flex-1 items-end gap-x-3">
            <span className="whitespace-nowrap">
              <Caixa />
              Não
            </span>
            <span className="whitespace-nowrap">
              <Caixa />
              Sim:
            </span>
            <Linha />
          </span>
        </li>
      )
    case 'select':
    case 'multiselect':
      return (
        <li className={`${INTEIRA} flex flex-wrap gap-x-3 gap-y-1`}>
          <span className="font-medium">{campo.label}:</span>
          <Opcoes opcoes={campo.options ?? []} />
        </li>
      )
    case 'scale':
      return (
        <li className={`${INTEIRA} flex flex-wrap items-center gap-x-3 gap-y-1`}>
          <span>{campo.label}:</span>
          <span className="flex flex-wrap gap-1.5">
            {Array.from({ length: 11 }, (_, n) => (
              <span key={n} className="inline-flex size-6 items-center justify-center rounded-full border border-[#0A1F3D]/50 text-[0.85em]">
                {n}
              </span>
            ))}
          </span>
        </li>
      )
    case 'textarea':
      return (
        <li className={INTEIRA}>
          <span>{campo.label}</span>
          <span aria-hidden className="mt-5 block border-b border-[#0A1F3D]/50" />
          <span aria-hidden className="mt-6 block border-b border-[#0A1F3D]/50" />
        </li>
      )
    case 'signature':
      return (
        <li className="pt-8 text-center">
          <span aria-hidden className="block border-b border-[#0A1F3D]/70" />
          <span className="mt-1 block text-[0.9em]">{campo.label}</span>
        </li>
      )
    case 'date':
      return (
        <li className="flex items-end gap-x-2">
          <span>{campo.label}:</span>
          <span aria-hidden className="whitespace-nowrap tracking-tight">____ / ____ / ______</span>
        </li>
      )
    default:
      return (
        <li className={`flex items-end gap-x-2 ${campo.label.length > 32 ? INTEIRA : ''}`}>
          <span>{campo.label}:</span>
          <Linha />
        </li>
      )
  }
}

function Tabela({ tabela }: { tabela: FichaTabela }) {
  const linhas = typeof tabela.linhas === 'number' ? Array<string | null>(tabela.linhas).fill(null) : tabela.linhas
  const celula = 'border border-[#0A1F3D]/40 px-2'
  return (
    <section className="ficha-secao mt-5">
      <h3 className="ficha-titulo-secao">{tabela.titulo}</h3>
      {/* Scrolls sideways on a phone instead of shrinking the columns; keyboard users can focus it. */}
      <div className="overflow-x-auto print:overflow-visible" role="region" aria-label={tabela.titulo} tabIndex={0}>
        <table className="w-full min-w-[34rem] border-collapse text-left print:min-w-0">
          <thead>
            <tr>
              {tabela.colunas.map((c) => (
                <th key={c} scope="col" className={`${celula} py-1 font-semibold`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((rotulo, i) => (
              <tr key={i}>
                {tabela.colunas.map((c, j) =>
                  j === 0 && rotulo ? (
                    <th key={c} scope="row" className={`${celula} h-9 whitespace-nowrap font-normal`}>
                      {rotulo}
                    </th>
                  ) : (
                    <td key={c} className={`${celula} h-9`} />
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function FichaFolha({ ficha }: { ficha: FichaAnamnese }) {
  const secoes: { nome: string; campos: AnamnesisField[] }[] = []
  for (const campo of ficha.template.fields) {
    const nome = campo.section ?? ''
    const ultima = secoes[secoes.length - 1]
    if (ultima?.nome === nome) ultima.campos.push(campo)
    else secoes.push({ nome, campos: [campo] })
  }
  const assinaturas = secoes.pop()

  return (
    <article className="ficha-folha mx-auto max-w-[794px] rounded-sm border border-[#0A1F3D]/15 bg-white p-5 text-sm leading-snug text-[#0A1F3D] shadow-xl shadow-[#0A1F3D]/10 sm:p-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-2 border-[#0A1F3D] pb-3">
        <h2 className="font-serif text-xl font-bold leading-tight sm:text-2xl">{ficha.nome}</h2>
        <p className="flex min-w-56 flex-1 items-end gap-x-2 sm:max-w-80">
          <span>Estabelecimento:</span>
          <Linha />
        </p>
      </div>

      {secoes.map(({ nome, campos }) => (
        <section key={nome} className="ficha-secao mt-4">
          <h3 className="ficha-titulo-secao">{nome}</h3>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2 print:grid-cols-2">
            {campos.map((campo) => (
              <Campo key={campo.id} campo={campo} />
            ))}
          </ul>
        </section>
      ))}

      {ficha.tabelas.map((tabela) => (
        <Tabela key={tabela.titulo} tabela={tabela} />
      ))}

      <section className="ficha-secao mt-5">
        <h3 className="ficha-titulo-secao">Declaração</h3>
        <p>{ficha.declaracao}</p>
        <ul className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 print:grid-cols-2">
          {assinaturas?.campos.map((campo) => (
            <Campo key={campo.id} campo={campo} />
          ))}
        </ul>
      </section>

      <p className="mt-5 text-[0.8em] text-[#0A1F3D]/70">
        Modelo gratuito para adaptar ao seu atendimento. Não é protocolo clínico nem termo de consentimento. estetiacrm.com.br/ferramentas/fichas-de-anamnese
      </p>
    </article>
  )
}
