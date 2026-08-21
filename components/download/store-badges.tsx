import type { ReleaseInfo } from '@/lib/release'
import { REPO_URL } from '@/lib/site'

const WINDOWS_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 5.5L10 4.5V11.5H3V5.5ZM11 4.4L21 3V11.5H11V4.4ZM3 12.5H10V19.5L3 18.5V12.5ZM11 12.5H21V21L11 19.6V12.5Z" />
  </svg>
)

/** Contenedor estilizado para el badge de Windows y el enlace al código fuente. */
export function StoreBadges({ release }: { release?: ReleaseInfo }) {
  const available = release?.available && release.url
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {available ? 'Disponible en' : 'Disponible pronto en'}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {available ? (
          <a
            href={release!.url}
            aria-label="Descargar para Windows"
            className="flex h-14 w-44 items-center justify-center gap-3 rounded-xl border border-border bg-card/50 text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {WINDOWS_ICON}
            <span className="text-left text-xs leading-tight">
              <span className="block text-[10px] text-muted-foreground">Descargar</span>
              <span className="block font-semibold">Windows</span>
            </span>
          </a>
        ) : (
          <div
            aria-label="Windows, disponible próximamente"
            className="flex h-14 w-44 items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 text-muted-foreground"
          >
            {WINDOWS_ICON}
            <span className="text-left text-xs leading-tight">
              <span className="block text-[10px]">Próximamente</span>
              <span className="block font-semibold text-foreground/60">Windows</span>
            </span>
          </div>
        )}

        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Código fuente en GitHub, disponible ahora"
          className="flex h-14 w-44 items-center justify-center gap-3 rounded-xl border border-border bg-card/50 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.36-3.37-1.36-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.57 2.34 1.11 2.91.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .28.18.61.69.5A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
          </svg>
          <span className="text-left text-xs leading-tight">
            <span className="block text-[10px]">Disponible ahora</span>
            <span className="block font-semibold text-foreground/60">GitHub</span>
          </span>
        </a>
      </div>
    </div>
  )
}
