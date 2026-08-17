import { Reveal } from '@/components/site/reveal'
import { MagneticButton } from '@/components/site/magnetic-button'

export function CtaSection() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-24 text-center">
        <Reveal className="flex flex-col items-center gap-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">Lista de espera</p>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance md:text-5xl">
            Reserva tu sitio antes de que llegue la app de escritorio
          </h2>
          <p className="max-w-md leading-relaxed text-muted-foreground text-pretty">
            La versión para Windows está en camino. Déjanos tu correo y te avisamos cuando abramos acceso anticipado.
          </p>
          <MagneticButton href="/descargar">Quiero entrar antes</MagneticButton>
        </Reveal>
      </div>
    </section>
  )
}
