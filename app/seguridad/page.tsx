import type { Metadata } from 'next'
import { Reveal } from '@/components/site/reveal'
import { CipherVisual } from '@/components/security/cipher-visual'
import { SecurityLayers } from '@/components/security/security-layers'
import { Breadcrumbs } from '@/components/site/breadcrumbs'

export const metadata: Metadata = {
  title: 'Seguridad',
  description:
    'La seguridad de TokenTorrent: TLS/mTLS, Proof of Compute, enrutamiento firmado y el modelo de amenazas actual del protocolo.',
  openGraph: {
    title: 'Seguridad · TokenTorrent',
    description: 'Cifrado primero, confianza después: TLS/mTLS, Proof of Compute y enrutamiento firmado.',
  },
}

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Breadcrumbs current="Seguridad" />

      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal className="flex flex-col gap-5">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Seguridad</p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
            Cifrado primero. Confianza después.
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
            Nada viaja en claro entre nodos. Cada uno demuestra su identidad con un certificado propio, y su cómputo
            con un reto firmado — no basta con decir que aloja las capas correctas.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <CipherVisual />
        </Reveal>
      </div>

      <div className="mt-24">
        <SecurityLayers />
      </div>

      <Reveal className="mt-24">
        <section aria-labelledby="threat-heading" className="rounded-2xl border border-border bg-card/60 p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Modelo de amenazas</p>
          <h2 id="threat-heading" className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Qué protege hoy, y qué no
          </h2>
          <div className="mt-6 grid gap-6 text-sm leading-relaxed text-muted-foreground md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-semibold text-foreground">Cubierto</h3>
              <ul className="flex flex-col gap-2">
                <li className="flex gap-2">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  Autenticidad: cada nodo se identifica con su certificado (mTLS), no con una dirección IP.
                </li>
                <li className="flex gap-2">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  Integridad del cómputo: Proof of Compute verifica que un nodo ejecuta las capas que aloja.
                </li>
                <li className="flex gap-2">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  Enrutamiento: la ruta viaja firmada, evitando que la red se use como puente hacia terceros.
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-semibold text-foreground">En desarrollo</h3>
              <ul className="flex flex-col gap-2">
                <li className="flex gap-2">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  Confidencialidad total: el tráfico va cifrado, pero la privacidad frente a un nodo malicioso aún no
                  está garantizada.
                </li>
                <li className="flex gap-2">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  Auditorías de seguridad externas: pendientes; el protocolo es auditable pero no ha pasado una revisión
                  independiente.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  )
}
