import { Reveal } from '@/components/site/reveal'

const LAYERS = [
  {
    step: 'capa 1',
    title: 'Cifrado en el dispositivo',
    body: 'AES-256-GCM con intercambio de claves X25519. El contenido se cifra antes de salir de tu hardware; la red solo ve ruido.',
  },
  {
    step: 'capa 2',
    title: 'Fragmentación y dispersión',
    body: 'Cada activo se divide en fragmentos firmados que viajan por rutas independientes. Interceptar uno no revela nada.',
  },
  {
    step: 'capa 3',
    title: 'Verificación distribuida',
    body: 'Los nodos validan firmas y hashes de forma redundante. Un fragmento alterado se descarta y se re-solicita automáticamente.',
  },
  {
    step: 'capa 4',
    title: 'Custodia propia',
    body: 'Las claves privadas nunca se transmiten ni se respaldan en servidores. Recuperación mediante frases de respaldo cifradas localmente.',
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
