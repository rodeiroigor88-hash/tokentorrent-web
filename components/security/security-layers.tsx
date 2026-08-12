import { Reveal } from '@/components/site/reveal'

const LAYERS = [
  {
    step: 'capa 1',
    title: 'TLS / mTLS',
    body: 'PKI propia del enjambre. Cada nodo presenta un certificado como identidad; la conexión se autentica en ambos sentidos, no solo hacia el servidor.',
  },
  {
    step: 'capa 2',
    title: 'Proof of Compute',
    body: 'Un reto firmado obliga al nodo a demostrar que ejecuta realmente las capas del modelo que dice alojar, comparando la salida contra una referencia.',
  },
  {
    step: 'capa 3',
    title: 'Enrutamiento firmado',
    body: 'El camino del pipeline viaja firmado dentro de cada petición. Un nodo no puede reenviar tráfico hacia un destino que no forma parte de la ruta autorizada.',
  },
  {
    step: 'capa 4',
    title: 'Límite de peticiones',
    body: 'Cada endpoint tiene su propio control de ritmo, más estricto en el que ejecuta inferencia real, para que un cliente ruidoso no pueda saturar al resto.',
  },
]

export function SecurityLayers() {
  return (
    <section aria-labelledby="layers-heading">
      <Reveal>
        <h2 id="layers-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
          Cuatro capas de defensa
        </h2>
      </Reveal>
      <div className="mt-10 flex flex-col">
        {LAYERS.map((layer, i) => (
          <Reveal key={layer.step} delay={i * 0.08}>
            <article className="group grid gap-3 border-t border-border py-8 transition-colors hover:bg-card/50 md:grid-cols-[140px_1fr_2fr] md:gap-8 md:px-4">
              <p className="font-mono text-xs uppercase tracking-widest text-primary">{layer.step}</p>
              <h3 className="text-lg font-semibold tracking-tight">{layer.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{layer.body}</p>
            </article>
          </Reveal>
        ))}
        <div className="border-t border-border" />
      </div>
    </section>
  )
}
