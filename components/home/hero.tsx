'use client'

import { motion } from 'framer-motion'
import { Stagger, StaggerItem } from '@/components/site/reveal'
import { NetworkScene } from '@/components/home/network-scene'
import { WaitlistForm } from '@/components/download/waitlist-form'
import { MagneticButton } from '@/components/site/magnetic-button'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Corriente vertical de la marca: líneas que fluyen hacia abajo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {[12, 28, 46, 64, 82].map((left, i) => (
          <motion.span
            key={left}
            className="absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/25 to-transparent"
            style={{ left: `${left}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.4, 1] }}
            transition={{ duration: 4, delay: i * 0.4, repeat: Infinity, repeatType: 'mirror' }}
          />
        ))}
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 md:grid-cols-[1.05fr_0.95fr] md:pb-28 md:pt-24">
        <Stagger className="flex flex-col items-start gap-6">
          <StaggerItem>
            <p className="flex items-center gap-2 rounded-full border border-border px-4 py-1.5 font-mono text-xs text-muted-foreground">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
              protocolo p2p · v1 en desarrollo
            </p>
          </StaggerItem>

          <StaggerItem>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
              Un modelo de IA fluye como un <span className="text-primary">torrente</span>.
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
              Ejecuta modelos de lenguaje grandes repartiendo sus capas entre varios ordenadores, en cadena y sobre
              HTTP. Sin servidor central que corra el modelo por ti: tú aportas cómputo, otros lo aportan, y todos
              podéis ejecutar modelos que no cabrían en una sola máquina.
            </p>
          </StaggerItem>

          <StaggerItem className="w-full max-w-xl">
            <WaitlistForm />
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              Sin compromiso · acceso anticipado para Windows
            </p>
          </StaggerItem>

          <StaggerItem>
            <MagneticButton href="/caracteristicas" variant="ghost">
              Explorar características
            </MagneticButton>
          </StaggerItem>
        </Stagger>

        <StaggerItem className="hidden md:block">
          <NetworkScene
            label="Animación de la red TokenTorrent: capas del modelo viajando entre nodos"
            description="Varios ordenadores conectados entre sí. Bloques de color turquesa (capas del modelo) y puntos luminosos (tokens) viajan de un nodo a otro por las conexiones, mientras los nodos emiten pulsos de luz."
          />
        </StaggerItem>
      </div>
    </section>
  )
}
