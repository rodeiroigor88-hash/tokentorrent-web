import type { Metadata } from 'next'
import { Reveal } from '@/components/site/reveal'
import { WaitlistForm } from '@/components/download/waitlist-form'
import { StoreBadges } from '@/components/download/store-badges'

export const metadata: Metadata = {
  title: 'Descargar',
  description:
    'La aplicación de escritorio de TokenTorrent para Windows llega pronto. Únete a la lista de espera para acceso anticipado.',
}

export default function DownloadPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center md:py-32">
      <Reveal className="flex flex-col items-center gap-6">
        <p className="flex items-center gap-2 rounded-full border border-border px-4 py-1.5 font-mono text-xs text-muted-foreground">
          <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          próximamente en Windows
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          El torrente, en tu escritorio
        </h1>
        <p className="max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
          Estamos ultimando la firma de código de los binarios de Windows. Apúntate a la lista de espera y sé de los
          primeros en probarla — o ejecuta el proyecto ya mismo desde el código fuente en GitHub.
        </p>
      </Reveal>

      <Reveal delay={0.15} className="mt-10 w-full max-w-md">
        <WaitlistForm />
      </Reveal>

      <Reveal delay={0.25} className="mt-16">
        <StoreBadges />
      </Reveal>
    </div>
  )
}
