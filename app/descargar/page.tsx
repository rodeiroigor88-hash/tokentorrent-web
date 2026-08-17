import type { Metadata } from 'next'
import { Reveal } from '@/components/site/reveal'
import { WaitlistForm } from '@/components/download/waitlist-form'
import { StoreBadges } from '@/components/download/store-badges'
import { CliQuickstart } from '@/components/download/cli-quickstart'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { REPO_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Lista de espera y nodo por terminal',
  description:
    'La aplicación de escritorio de TokenTorrent para Windows llega pronto. Únete a la lista de espera o levanta un nodo ahora mismo desde la terminal.',
  openGraph: {
    title: 'Lista de espera · TokenTorrent',
    description: 'Acceso anticipado para Windows o levanta un nodo desde la terminal hoy mismo.',
  },
}

const REQUIREMENTS = [
  'Python 3.10 o superior para el nodo por terminal.',
  'Conexión a internet y recursos libres de CPU/RAM que tú decidas donar.',
  'Para la app de escritorio: Windows (próximamente, con instalador firmado).',
  'No se requiere GPU: el modelo determina qué cabe en cada nodo.',
]

export default function DownloadPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-16 text-center md:py-24">
      <Breadcrumbs current="Lista de espera" />

      <Reveal className="flex flex-col items-center gap-6">
        <p className="flex items-center gap-2 rounded-full border border-border px-4 py-1.5 font-mono text-xs text-muted-foreground">
          <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          próximamente en Windows · disponible por terminal
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          Apúntate a la lista de espera
        </h1>
        <p className="max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
          Todavía no hay instalador que descargar: estamos ultimando la firma de código para Windows. Deja tu correo
          para acceder antes o levanta un nodo ahora mismo desde tu terminal.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 w-full max-w-md">
        <WaitlistForm />
        <p className="mt-3 font-mono text-[11px] text-muted-foreground">Sin compromiso · acceso anticipado para Windows</p>
      </Reveal>

      <Reveal delay={0.2} className="mt-12">
        <StoreBadges />
      </Reveal>

      <Reveal delay={0.25} className="mt-16 w-full max-w-2xl text-left">
        <CliQuickstart />
      </Reveal>

      <div className="mt-16 grid w-full max-w-4xl gap-6 text-left md:grid-cols-2">
        <Reveal>
          <section aria-labelledby="req-heading" className="h-full rounded-2xl border border-border bg-card/60 p-7">
            <h2 id="req-heading" className="text-lg font-semibold tracking-tight">
              Requisitos
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {REQUIREMENTS.map((r) => (
                <li key={r} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  {r}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal delay={0.08}>
          <section aria-labelledby="verify-heading" className="h-full rounded-2xl border border-border bg-card/60 p-7">
            <h2 id="verify-heading" className="text-lg font-semibold tracking-tight">
              Verificación del instalador
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">
              Cuando publiquemos el instalador de Windows, lo firmaremos con un certificado de firma de código y
              publicaremos su hash (SHA-256) en el{' '}
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
              >
                repositorio
              </a>{' '}
              para que puedas comprobar que el archivo que descargas es el que nosotros publicamos. Hasta entonces, no
              hay descarga oficial: desconfía de cualquier enlace que afirme lo contrario.
            </p>
          </section>
        </Reveal>
      </div>
    </div>
  )
}
