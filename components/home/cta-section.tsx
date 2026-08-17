import { Reveal } from '@/components/site/reveal'
import { WaitlistForm } from '@/components/download/waitlist-form'

export function CtaSection() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-24 text-center">
        <Reveal className="flex w-full flex-col items-center gap-6">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance md:text-5xl">
            Apúntate a la lista de espera
          </h2>
          <p className="max-w-md leading-relaxed text-muted-foreground text-pretty">
            La aplicación de escritorio para Windows está en camino. Deja tu correo para acceder antes y te avisamos en
            el lanzamiento.
          </p>
          <div className="w-full max-w-md">
            <WaitlistForm />
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              Sin compromiso · acceso anticipado para Windows
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
