import type { Metadata } from 'next'
import { Reveal } from '@/components/site/reveal'
import { CipherVisual } from '@/components/security/cipher-visual'
import { SecurityLayers } from '@/components/security/security-layers'

export const metadata: Metadata = {
  title: 'Seguridad',
  description:
    'La infraestructura de seguridad de TokenTorrent: TLS/mTLS, Proof of Compute y enrutamiento firmado.',
}

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
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
    </div>
  )
}
