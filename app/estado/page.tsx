import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { Reveal } from '@/components/site/reveal'
import { SwarmStatus } from '@/components/status/swarm-status'

export const metadata: Metadata = {
  title: 'Estado del enjambre',
  description: 'Consulta el estado público del enjambre de TokenTorrent y sus nodos visibles.',
  openGraph: {
    title: 'Estado del enjambre · TokenTorrent',
    description: 'Métricas públicas de nodos, capacidad y latencia de TokenTorrent.',
  },
}

export default function StatusPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Breadcrumbs current="Estado" />
      <Reveal className="flex flex-col gap-5">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Estado público</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">Qué está pasando en el enjambre</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Métricas del tracker y de la ruta de inferencia visibles ahora mismo. Si el tracker no responde, lo indicamos: no rellenamos la pantalla con cifras inventadas.
        </p>
      </Reveal>
      <SwarmStatus />
    </div>
  )
}
