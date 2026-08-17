import Link from 'next/link'

/**
 * Migas de pan para páginas internas: indican claramente dónde se encuentra
 * el usuario y permiten volver a Inicio con un solo clic.
 */
export function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav aria-label="Migas de pan" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
        <li>
          <Link href="/" className="transition-colors hover:text-foreground">
            Inicio
          </Link>
        </li>
        <li aria-hidden="true" className="text-muted-foreground/60">
          /
        </li>
        <li aria-current="page" className="text-foreground">
          {current}
        </li>
      </ol>
    </nav>
  )
}
