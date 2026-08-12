import { Reveal } from '@/components/site/reveal'
import { MagneticButton } from '@/components/site/magnetic-button'

export function CtaSection() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-24 text-center">
        <Reveal className="flex flex-col items-center gap-6">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance md:text-5xl">
            Sé de los primeros en entrar al torrente
          </h2>
          <p className="max-w-md leading-relaxed text-muted-foreground text-pretty">
            La aplicación nativa está en camino. Reserva tu lugar en la lista de espera y recibe acceso anticipado.
          </p>
          <MagneticButton href="/descargar">Reservar mi lugar</MagneticButton>
        </Reveal>
      </div>
    </section>
  )
}
