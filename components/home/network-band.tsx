'use client'

import { motion } from 'framer-motion'
import { Reveal } from '@/components/site/reveal'

/** Visualización abstracta del enjambre: paquetes viajando entre nodos. */
export function NetworkBand() {
  const nodes = [
    { x: 8, y: 30 },
    { x: 30, y: 70 },
    { x: 52, y: 25 },
    { x: 72, y: 65 },
    { x: 92, y: 35 },
  ]
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [0, 2],
    [2, 4],
  ]

  return (
    <section className="border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <Reveal className="flex flex-col gap-5">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">La red</p>
          <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Un enjambre que nunca duerme
          </h2>
          <p className="max-w-md leading-relaxed text-muted-foreground text-pretty">
            Cada nodo replica, verifica y retransmite. Cuantos más participantes, más rápida y resistente se vuelve la
            red. Así funciona un torrente: la escala es la fortaleza.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-background">
            <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Diagrama animado de nodos conectados en red">
              {edges.map(([a, b], i) => (
                <g key={i}>
                  <line
                    x1={nodes[a].x}
                    y1={nodes[a].y}
                    x2={nodes[b].x}
                    y2={nodes[b].y}
                    stroke="currentColor"
                    className="text-border"
                    strokeWidth="0.4"
                  />
                  <motion.circle
                    r="1.1"
                    className="fill-primary"
                    initial={{ cx: nodes[a].x, cy: nodes[a].y, opacity: 0 }}
                    animate={{
                      cx: [nodes[a].x, nodes[b].x],
                      cy: [nodes[a].y, nodes[b].y],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{ duration: 2.4, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </g>
              ))}
              {nodes.map((n, i) => (
                <g key={i}>
                  <circle cx={n.x} cy={n.y} r="2.6" className="fill-background stroke-primary" strokeWidth="0.6" />
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    r="2.6"
                    className="fill-none stroke-primary/40"
                    initial={{ r: 2.6, opacity: 0.6 }}
                    animate={{ r: 6, opacity: 0 }}
                    transition={{ duration: 2, delay: i * 0.35, repeat: Infinity }}
                    strokeWidth="0.4"
                  />
                </g>
              ))}
            </svg>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
