import { Reveal } from '@/components/site/reveal'

/**
 * Aclara para quién es el producto y qué problema resuelve, con casos de uso
 * concretos. Antes el mensaje se centraba en el "qué" técnico sin decir a
 * quién le sirve ni por qué participar.
 */
const CASES = [
  {
    tag: 'para quienes ejecutan',
    title: 'Ejecuta modelos que no caben en tu equipo',
    body: 'Un LLM grande puede necesitar más memoria de la que tiene un solo ordenador. TokenTorrent reparte sus capas entre varios equipos, de modo que puedas ejecutar modelos mayores sin comprar una GPU de gama alta.',
  },
  {
    tag: 'para quienes aportan',
    title: 'Pon tu hardware a trabajar',
    body: 'Si tienes un equipo con recursos libres (CPU y RAM), únete como nodo y cede la capacidad que decidas. Tu máquina ejecuta solo las capas que elijas y se pausa cuando tú lo necesites.',
  },
  {
    tag: 'para quien no confía en la nube',
    title: 'Sin un servidor central que lo controle todo',
    body: 'No hay una empresa con un único centro de datos que corra el modelo, se caiga o decida por ti. La red coordina nodos independientes: tú conservas el control de dónde y cómo participas.',
  },
]

export function UseCases() {
  return (
    <section aria-labelledby="use-cases-heading" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal className="flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Para quién es</p>
          <h2 id="use-cases-heading" className="max-w-2xl text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Un torrente con sitio para todos
          </h2>
          <p className="max-w-2xl leading-relaxed text-muted-foreground text-pretty">
            TokenTorrent resuelve un problema concreto: ejecutar modelos grandes es caro y suele depender de un único
            proveedor. Al repartir el trabajo, bajan las barreras tanto para quien ejecuta como para quien aporta
            cómputo.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {CASES.map((c, i) => (
            <Reveal key={c.tag} delay={i * 0.08} className="flex">
              <article className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-card/60 p-7">
                <span className="w-fit rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground">
                  {c.tag}
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-balance">{c.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{c.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
