import type { Metadata } from 'next'
import { Reveal } from '@/components/site/reveal'
import { BentoGrid } from '@/components/features/bento-grid'
import { Breadcrumbs } from '@/components/site/breadcrumbs'

export const metadata: Metadata = {
  title: 'Características',
  description:
    'Explora las capacidades de TokenTorrent: pipeline en enjambre, Proof of Compute, TLS/mTLS, enrutamiento firmado y control de recursos.',
  openGraph: {
    title: 'Características · TokenTorrent',
    description:
      'Pipeline en enjambre, Proof of Compute, TLS/mTLS y control de recursos: todo lo que mueve el torrente.',
  },
}

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Breadcrumbs current="Características" />

      <Reveal className="flex flex-col gap-5">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Características</p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          Todo lo que mueve el torrente
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Un conjunto de capacidades diseñadas para que la inferencia circule sin fricción entre nodos. Pasa el
          cursor sobre cada módulo para explorarlo.
        </p>
      </Reveal>

      <div className="mt-16">
        <BentoGrid />
      </div>
    </div>
  )
}
