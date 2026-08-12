'use client'

import { motion } from 'framer-motion'
import { MagneticButton } from '@/components/site/magnetic-button'
import { Stagger, StaggerItem } from '@/components/site/reveal'

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

      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 pb-28 pt-24 md:pt-36">
        <Stagger className="flex flex-col items-start gap-8">
          <StaggerItem>
            <p className="flex items-center gap-2 rounded-full border border-border px-4 py-1.5 font-mono text-xs text-muted-foreground">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
              protocolo p2p · v1 en desarrollo
            </p>
          </StaggerItem>

          <StaggerItem>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-7xl">
              Un modelo de IA fluye como un <span className="text-primary">torrente</span>.
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              TokenTorrent reparte las capas de un LLM entre varios ordenadores y las ejecuta en cadena sobre HTTP.
              Igual que BitTorrent mueve bits, TokenTorrent mueve tokens — sin servidor central que corra el modelo
              por ti.
            </p>
          </StaggerItem>

          <StaggerItem className="flex flex-wrap items-center gap-4">
            <MagneticButton href="/descargar">Únete a la lista de espera</MagneticButton>
            <MagneticButton href="/caracteristicas" variant="ghost">
              Explorar características
            </MagneticButton>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}
