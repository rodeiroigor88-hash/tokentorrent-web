import { Reveal } from '@/components/site/reveal'

/**
 * Demostración del flujo completo de inferencia: solicitud → capas del modelo
 * → nodos → respuesta. El diagrama de red anterior comunicaba una malla, pero
 * no explicaba *cómo* se produce una inferencia; esta sección lo cuenta paso a
 * paso con una alternativa textual equivalente para lectores de pantalla.
 */
const STEPS = [
  {
    step: '1',
    title: 'Solicitud',
    body: 'Escribes un prompt. Tu petición entra a la red con una ruta firmada que indica qué nodos deben participar y en qué orden.',
    kind: 'usuario',
  },
  {
    step: '2',
    title: 'Capas repartidas',
    body: 'El modelo no está entero en un solo sitio: sus capas viven repartidas entre los nodos del enjambre. Cada nodo aloja y ejecuta solo su tramo.',
    kind: 'capas',
  },
  {
    step: '3',
    title: 'Nodos en cadena',
    body: 'Los nodos ejecutan sus capas en cadena y se pasan el resultado intermedio por HTTP cifrado, igual que BitTorrent reparte piezas de un archivo.',
    kind: 'nodos',
  },
  {
    step: '4',
    title: 'Respuesta',
    body: 'El último token generado vuelve a tu equipo. La salida se reconstruye aunque ningún nodo haya visto el modelo completo.',
    kind: 'respuesta',
  },
] as const

export function InferenceFlow() {
  return (
    <section aria-labelledby="inference-heading" className="border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal className="flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Cómo funciona</p>
          <h2 id="inference-heading" className="max-w-2xl text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            De tu prompt a la respuesta, en cuatro pasos
          </h2>
          <p className="max-w-2xl leading-relaxed text-muted-foreground text-pretty">
            Así viaja una inferencia por TokenTorrent. Ningún ordenador necesita tener el modelo entero: la red
            coordina quién ejecuta cada capa y devuelve la respuesta completa.
          </p>
        </Reveal>

        <ol className="mt-12 grid gap-4 md:grid-cols-4" aria-label="Flujo de una inferencia en TokenTorrent">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.step} delay={i * 0.08} className="flex">
              <article className="group relative flex w-full flex-col gap-3 rounded-2xl border border-border bg-background p-6 transition-colors hover:border-primary/40">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/12 font-mono text-sm text-primary"
                >
                  {s.step}
                </span>
                <h3 className="text-base font-semibold tracking-tight">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{s.body}</p>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-primary/60 md:block"
                  >
                    →
                  </span>
                )}
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
