import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-sm font-semibold tracking-tight">
            token<span className="text-primary">torrent</span>
          </span>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
            Distribución de valor peer-to-peer. Construido para la próxima generación de redes tokenizadas.
          </p>
        </div>
        <nav aria-label="Pie de página" className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">Inicio</Link>
          <Link href="/caracteristicas" className="transition-colors hover:text-foreground">Características</Link>
          <Link href="/seguridad" className="transition-colors hover:text-foreground">Seguridad</Link>
          <Link href="/descargar" className="transition-colors hover:text-foreground">Descarga la App</Link>
        </nav>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <p className="font-mono text-xs text-muted-foreground">© {new Date().getFullYear()} TokenTorrent</p>
          <p className="font-mono text-xs text-muted-foreground">nodo: activo</p>
        </div>
      </div>
    </footer>
  )
}
