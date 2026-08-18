'use client'

import { motion } from 'framer-motion'
import { MagneticButton } from '@/components/site/magnetic-button'
import { Stagger, StaggerItem } from '@/components/site/reveal'
import { NetworkScene } from '@/components/home/network-scene'

const quickFacts = ['P2P real', 'Proof of Compute', 'Código abierto']

export function Hero() {
  return (
    <section className="grid-surface relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        {[14, 32, 50, 68, 86].map((left, i) => (
          <motion.span
            key={left}
            className="absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"
            style={{ left: `${left}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.25, 0.7, 0] }}
            transition={{ duration: 5, delay: i * 0.35, repeat: Infinity, repeatType: 'mirror' }}
          />
        ))}
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-20 md:grid-cols-[1.05fr_0.95fr] md:items-center md:pb-28 md:pt-28">
        <Stagger className="flex flex-col items-start gap-7">
          <StaggerItem>
            <p className="flex items-center gap-2 rounded-full border border-border/80 bg-background/60 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
              protocolo p2p · v1 en desarrollo
            </p>
          </StaggerItem>

          <StaggerItem>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.96] tracking-tight text-balance text-foreground md:text-7xl">
              Un modelo de IA fluye como un <span className="text-primary">torrente</span>.
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              TokenTorrent reparte las capas de un LLM entre varios ordenadores y las ejecuta en cadena sobre HTTP. El
              resultado: menos dependencia de un único servidor y una red donde el cómputo se comparte.
            </p>
          </StaggerItem>

          <StaggerItem className="flex flex-wrap items-center gap-4">
            <MagneticButton href="/descargar">Unirme a la lista</MagneticButton>
            <MagneticButton href="/caracteristicas" variant="ghost">
              Ver cómo funciona
            </MagneticButton>
          </StaggerItem>

          <StaggerItem>
            <div className="flex flex-wrap gap-2 pt-1">
              {quickFacts.map((fact) => (
                <span
                  key={fact}
                  className="rounded-full border border-border/70 bg-card/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {fact}
                </span>
              ))}
            </div>
          </StaggerItem>
        </Stagger>

        <StaggerItem>
          <div className="flex items-center justify-between gap-4 px-1 pb-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Visual de red</p>
              <p className="mt-1 text-sm text-muted-foreground">Nodos, capas y tokens moviéndose en cadena.</p>
            </div>
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 font-mono text-[11px] text-muted-foreground">
              live
            </span>
          </div>

          <NetworkScene
            label="Animación de la red TokenTorrent: la ruta del modelo fluyendo entre los nodos"
            description="Visualización holográfica de la ruta del modelo. Los nodos del enjambre aparecen como puntos con su rango de capas, unidos por una línea continua; pulsos de color turquesa (tokens) viajan de un nodo al siguiente por esa ruta."
          />
        </StaggerItem>
      </div>
    </section>
  )
}
