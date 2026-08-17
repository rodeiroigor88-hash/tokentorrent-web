import Link from 'next/link'
import { DOCS_URL, REPO_URL, LICENSE_URL, LICENSE_NAME, CONTACT_EMAIL, PROTOCOL_VERSION, LAST_UPDATED } from '@/lib/site'

const SITE_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/caracteristicas', label: 'Características' },
  { href: '/seguridad', label: 'Seguridad' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/descargar', label: 'Lista de espera' },
] as const

const PROJECT_LINKS = [
  { href: REPO_URL, label: 'Repositorio', external: true },
  { href: DOCS_URL, label: 'Documentación', external: true },
  { href: LICENSE_URL, label: LICENSE_NAME, external: true },
] as const

const LEGAL_LINKS = [
  { href: '/legal#privacidad', label: 'Privacidad' },
  { href: '/legal#terminos', label: 'Términos de uso' },
  { href: '/legal#cookies', label: 'Política de cookies' },
  { href: `/legal#contacto`, label: 'Contacto' },
] as const

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-sm font-semibold tracking-tight">
            token<span className="text-primary">torrent</span>
          </span>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
            Inferencia de IA peer-to-peer. Reparte las capas de un modelo entre varios ordenadores, sin servidor
            central.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Protocolo {PROTOCOL_VERSION} · actualizado {LAST_UPDATED}
          </p>
        </div>

        <nav aria-label="Sitio" className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/60">Sitio</p>
          {SITE_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Proyecto" className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/60">Proyecto</p>
          {PROJECT_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <nav aria-label="Legal" className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p className="font-mono text-xs uppercase tracking-widest text-foreground/60">Legal</p>
          {LEGAL_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
          <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-foreground">
            {CONTACT_EMAIL}
          </a>
        </nav>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-5">
          <p className="font-mono text-xs text-muted-foreground">© {new Date().getFullYear()} TokenTorrent</p>
          <p className="font-mono text-xs text-muted-foreground">{LICENSE_NAME}</p>
        </div>
      </div>
    </footer>
  )
}
