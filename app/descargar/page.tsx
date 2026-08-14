import type { Metadata } from 'next'
import { Reveal } from '@/components/site/reveal'
import { WaitlistForm } from '@/components/download/waitlist-form'
import { StoreBadges } from '@/components/download/store-badges'
import { CliQuickstart } from '@/components/download/cli-quickstart'

export const metadata: Metadata = {
  title: 'Descargar',
  description:
    'La aplicación de escritorio de TokenTorrent para Windows llega pronto. Únete a la lista de espera o ejecuta el nodo directamente desde la terminal.',
}

export default function DownloadPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center md:py-28">
      <Reveal className="flex flex-col items-center gap-6">
        <p className="flex items-center gap-2 rounded-full border border-border px-4 py-1.5 font-mono text-xs text-muted-foreground">
          <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          próximamente en Windows · disponible por terminal
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          El torrente, en tu escritorio
        </h1>
        <p className="max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
          Estamos ultimando la firma de código del instalador para Windows. Apúntate a la lista de espera para acceso
          anticipado o levanta un nodo ahora mismo desde tu terminal.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 w-full max-w-md">
        <WaitlistForm />
      </Reveal>

      <Reveal delay={0.2} className="mt-12">
        <StoreBadges />
      </Reveal>

      <Reveal delay={0.25} className="mt-16 w-full max-w-2xl text-left">
        <CliQuickstart />
      </Reveal>
    </div>
  )
}
