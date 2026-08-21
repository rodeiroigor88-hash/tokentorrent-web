import type { ReleaseInfo } from '@/lib/release'
import { REPO_URL } from '@/lib/site'

/** Formatea la fecha de publicación en es-ES; vacío si no viene. */
function formatDate(iso?: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

/**
 * Botón de descarga del instalador de Windows. Se renderiza solo cuando hay una
 * release publicada (`release.available`); si no, la página muestra la lista de
 * espera. El enlace apunta al asset de GitHub Releases, no a un binario servido
 * desde este repo.
 */
export function DownloadButton({ release }: { release: ReleaseInfo }) {
  if (!release.available || !release.url) return null

  const published = formatDate(release.publishedAt)
  const meta = [
    release.version,
    release.sizeMb ? `${release.sizeMb} MB` : null,
    published ? `publicado el ${published}` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="flex flex-col items-center gap-4">
      <a
        href={release.url}
        className="group inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        aria-label={`Descargar ${release.fileName ?? 'el instalador'} para Windows`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
        Descargar para Windows
      </a>

      {meta && <p className="font-mono text-[11px] text-muted-foreground">{meta}</p>}

      <a
        href={`${REPO_URL}/releases`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[11px] text-muted-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
      >
        Ver todas las versiones y notas de la release
      </a>
    </div>
  )
}
