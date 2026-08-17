import { Reveal } from '@/components/site/reveal'

/**
 * Glosario para visitantes no especializados: traduce los términos técnicos
 * (LLM, enjambre, Proof of Compute, TLS/mTLS, tracker) que antes aparecían sin
 * explicación. Usa una lista de definiciones (<dl>) para mantener semántica.
 */
const TERMS = [
  {
    term: 'LLM',
    body: 'Modelo de lenguaje grande (del inglés Large Language Model). Un modelo de IA entrenado para entender y generar texto. En TokenTorrent, sus «capas» son las piezas internas que se reparten entre los ordenadores de la red.',
  },
  {
    term: 'Capa del modelo',
    body: 'Cada una de las etapas por las que pasa un texto dentro del modelo. Un LLM moderno tiene muchas capas apiladas; repartirlas entre varios nodos es lo que permite ejecutar modelos que no cabrían en una sola máquina.',
  },
  {
    term: 'Token',
    body: 'La unidad mínima de texto con la que trabaja un LLM: una palabra o un fragmento de palabra. «Torrent de tokens» significa que esos fragmentos viajan entre nodos, igual que los bits en BitTorrent.',
  },
  {
    term: 'Enjambre',
    body: 'El conjunto de ordenadores (nodos) que colaboran de forma voluntaria en la red, como los pares (peers) de BitTorrent. No hay un dueño único del enjambre: cualquiera puede unirse aportando cómputo.',
  },
  {
    term: 'Proof of Compute',
    body: 'Prueba de cómputo. Un reto criptográfico que obliga a cada nodo a demostrar que ejecutó de verdad las capas que dice alojar, en lugar de limitarse a fingir la respuesta.',
  },
  {
    term: 'TLS / mTLS',
    body: 'Protocolos que cifran la conexión entre dos equipos. TLS cifra el tráfico; mTLS además verifica la identidad de ambos extremos mediante certificados, de modo que un nodo es su certificado, no su dirección IP.',
  },
  {
    term: 'Tracker',
    body: 'El servicio ligero que mantiene el inventario de nodos disponibles y calcula las rutas. Coordina quién participa, pero no ejecuta el modelo ni ve el contenido de tus peticiones.',
  },
]

export function Glossary() {
  return (
    <section aria-labelledby="glossary-heading" className="border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal className="flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Glosario</p>
          <h2 id="glossary-heading" className="max-w-2xl text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Términos, sin jerga
          </h2>
        </Reveal>

        <dl className="mt-12 grid gap-x-8 gap-y-6 md:grid-cols-2">
          {TERMS.map((t, i) => (
            <Reveal key={t.term} delay={i * 0.04} className="flex flex-col gap-2 border-t border-border pt-5">
              <dt className="font-mono text-sm font-semibold text-primary">{t.term}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground text-pretty">{t.body}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
