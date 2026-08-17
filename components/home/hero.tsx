'use client'

import { motion } from 'framer-motion'
import { MagneticButton } from '@/components/site/magnetic-button'
import { Stagger, StaggerItem } from '@/components/site/reveal'

const quickFacts = [
  'P2P real',
  'Proof of Compute',
  'Código abierto',
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
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
              Un modelo de IA fluye como un{' '}
              <span className="text-primary">torrente</span>.
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              TokenTorrent reparte las capas de un LLM entre varios ordenadores y las ejecuta en cadena sobre HTTP.
              El resultado: menos dependencia de un único servidor y una red donde el cómputo se comparte.
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
          <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card/60 p-4 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="mb-4 flex items-center justify-between px-2">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Visual de red</p>
                <p className="mt-1 text-sm text-muted-foreground">Nodos, capas y tokens moviéndose en cadena.</p>
              </div>
              <div className="rounded-full border border-border/70 bg-background/70 px-3 py-1 font-mono text-[11px] text-muted-foreground">
                live
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-border/70 bg-[#071118]">
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(54,231,236,0.16),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(54,231,236,0.08),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(54,231,236,0.08),transparent_24%)]" />
              <svg viewBox="0 0 100 100" className="relative h-full w-full" role="img" aria-label="Diagrama abstracto del enjambre TokenTorrent">
                <defs>
                  <linearGradient id="tt-line" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(74,239,243,0.18)" />
                    <stop offset="100%" stopColor="rgba(74,239,243,0.6)" />
                  </linearGradient>
                </defs>
                <g stroke="url(#tt-line)" strokeWidth="0.45" fill="none" opacity="0.85">
                  <path d="M12 73 L20 49 L31 53 L46 73 L58 77 L70 84" />
                  <path d="M20 49 L29 33 L43 30 L55 36 L62 42" />
                  <path d="M31 53 L43 30 L58 42 L70 32" />
                  <path d="M20 49 L14 57 L12 73" />
                  <path d="M29 33 L21 25 L13 32" />
                  <path d="M43 30 L41 20 L32 17" />
                  <path d="M58 42 L70 32 L81 38" />
                  <path d="M46 73 L58 77 L67 89" />
                </g>
                <g>
                  {[
                    [12, 73],
                    [20, 49],
                    [29, 33],
                    [43, 30],
                    [58, 42],
                    [70, 32],
                    [31, 53],
                    [46, 73],
                    [58, 77],
                    [67, 89],
                  ].map(([x, y], i) => (
                    <g key={`${x}-${y}`}>
                      <circle cx={x} cy={y} r="2.1" className="fill-[#071118] stroke-primary" strokeWidth="0.75" />
                      <circle cx={x} cy={y} r="4.4" className="fill-none stroke-primary/25" strokeWidth="0.35" />
                      {i % 3 === 0 && (
                        <circle cx={x + 0.8} cy={y - 0.6} r="0.55" className="fill-primary" />
                      )}
                    </g>
                  ))}
                </g>
                <g fill="currentColor" className="text-primary">
                  <circle cx="17" cy="58" r="1.1" />
                  <circle cx="35" cy="45" r="1.1" />
                  <circle cx="52" cy="52" r="1.1" />
                  <circle cx="63" cy="68" r="1.1" />
                  <circle cx="74" cy="84" r="1.1" />
                </g>
              </svg>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 px-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                nodo
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-[2px] bg-primary/80" />
                capa del modelo
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-300/80" />
                token
              </span>
            </div>
          </div>
        </StaggerItem>
      </div>
    </section>
  )
}
