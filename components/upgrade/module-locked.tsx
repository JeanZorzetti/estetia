import 'server-only'
import { prisma } from '@/lib/prisma'
import { ModuleLockedScreen } from './module-locked-screen'

/**
 * Server component: fetches the PricingModule and renders the locked screen.
 * Use it together with `requireModule()`:
 *
 *   const block = await requireModule('prontuario')
 *   if (block && !block.allowed) return <ModuleLocked slug={block.slug} />
 */
export async function ModuleLocked({ slug }: { slug: string }) {
  const module_ = await prisma.pricingModule.findUnique({ where: { slug } })
  if (!module_) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">
          Este recurso não está disponível na sua organização.
        </p>
      </div>
    )
  }

  return (
    <ModuleLockedScreen
      slug={module_.slug}
      nome={module_.nome}
      descricao={module_.descricao}
      features={module_.features as string[]}
      priceCents={module_.priceCents}
      iconLucide={module_.iconLucide}
      category={module_.category}
    />
  )
}
