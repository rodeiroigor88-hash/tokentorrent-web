import Link from 'next/link'
import { Reveal } from '@/components/site/reveal'

const STEPS = [
  {
    number: '01',
    title: 'Reparte',
    body: 'Las capas de un modelo se distribuyen entre varios ordenadores para que el trabajo no dependa de una sola máquina.',
  },
  {
    number: '02',
    title: 'Coordina',
    body: 'Un tracker ligero mantiene el inventario y calcula por dónde debe pasar cada inferencia.',
  },
  {
    number: '03',
    title: 'Verifica',
    body: 'TLS/mTLS, rutas firmadas y Proof of Compute aportan identidad e integridad al enjambre.',
  },
] as const

export function HomeOverview() {
  return (
    <section aria-labelledby="overview-heading" className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal className="flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">La idea en corto</p>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <h2 id="overview-heading" className="max-w-2xl text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              Una red que convierte muchos equipos en una sola capacidad.
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
              Si quieres profundizar, cada bloque enlaza a la página correspondiente.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.06} className="flex">
              <article className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-background/70 p-6 transition-colors hover:border-primary/35">
                <span className="font-mono text-xs text-primary">{step.number}</span>
                <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{step.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12} className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/caracteristicas" className="text-muted-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary">
            Ver capacidades →
          </Link>
          <Link href="/seguridad" className="text-muted-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary">
            Ver seguridad →
          </Link>
          <Link href="/estado" className="text-muted-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary">
            Ver estado de la red →
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
