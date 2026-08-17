'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal } from '@/components/site/reveal'
import type { SwarmStats } from '@/app/api/swarm/route'

export function NetworkBand() {
  const [stats, setStats] = useState<SwarmStats | null>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    let mounted = true

    async function loadStats() {
      try {
        const res = await fetch('/api/swarm')
        if (res.ok) {
          const data = (await res.json()) as SwarmStats
          if (mounted) setStats(data)
        }
      } catch {
        // Se queda en modo visual si el endpoint no responde.
      }
    }

    loadStats()
    const interval = setInterval(loadStats, 15000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  const nodes = [
    { x: 12, y: 30 },
    { x: 24, y: 54 },
    { x: 39, y: 20 },
    { x: 57, y: 38 },
    { x: 73, y: 66 },
    { x: 88, y: 44 },
  ]
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [0, 3],
    [1, 4],
  ]

  return (
    <section className="border-t border-border/60 bg-card/30">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-[0.9fr_1.1fr] md:py-24">
        <Reveal className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">La red</p>
            {stats && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/70 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${stats.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}
                />
                {stats.status === 'online'
                  ? `${stats.nodesCount} nodo${stats.nodesCount === 1 ? '' : 's'} activo${
                      stats.nodesCount === 1 ? '' : 's'
                    }`
                  : 'Modo P2P local'}
              </span>
            )}
          </div>

          <h2 className="max-w-md text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Un enjambre que reparte, verifica y responde
          </h2>

          <p className="max-w-md leading-relaxed text-muted-foreground text-pretty">
            La red ya no intenta contarlo todo de golpe. Primero te enseña la idea: nodos conectados, capas que
            circulan y tokens que avanzan. El resto se explica más abajo.
          </p>

          {stats && stats.status === 'online' && (
            <div className="flex flex-wrap gap-4 font-mono text-xs text-muted-foreground">
              {stats.totalCores > 0 && (
                <div>
                  Núcleos: <span className="text-foreground">{stats.totalCores}</span>
                </div>
              )}
              {stats.totalRamGb > 0 && (
                <div>
                  RAM: <span className="text-foreground">{stats.totalRamGb} GB</span>
                </div>
              )}
              {stats.latencyMs > 0 && (
                <div>
                  Latencia tracker: <span className="text-foreground">{stats.latencyMs} ms</span>
                </div>
              )}
            </div>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-background p-4 shadow-xl shadow-black/20">
            <div className="mb-4 flex items-center justify-between px-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Diagrama de red
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                tokentorrent
              </p>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-border/70 bg-[#091017]">
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(54,231,236,0.12),transparent_34%),radial-gradient(circle_at_20%_80%,rgba(54,231,236,0.08),transparent_22%),radial-gradient(circle_at_80%_18%,rgba(54,231,236,0.08),transparent_22%)]" />
              <svg viewBox="0 0 100 100" className="relative h-full w-full" role="img" aria-label="Diagrama abstracto de nodos conectados">
                <g stroke="currentColor" className="text-border/80" strokeWidth="0.35" fill="none">
                  {edges.map(([a, b], i) => (
                    <line
                      key={`${a}-${b}`}
                      x1={nodes[a].x}
                      y1={nodes[a].y}
                      x2={nodes[b].x}
                      y2={nodes[b].y}
                      opacity={0.6 + (i % 3) * 0.12}
                    />
                  ))}
                </g>

                {nodes.map((n, i) => (
                  <g key={`${n.x}-${n.y}`}>
                    <circle cx={n.x} cy={n.y} r="2.2" className="fill-[#091017] stroke-primary" strokeWidth="0.8" />
                    {!shouldReduceMotion && (
                      <motion.circle
                        cx={n.x}
                        cy={n.y}
                        r="2.2"
                        className="fill-none stroke-primary/30"
                        initial={{ r: 2.2, opacity: 0.5 }}
                        animate={{ r: 5.8, opacity: 0 }}
                        transition={{ duration: 2.4, delay: i * 0.18, repeat: Infinity }}
                        strokeWidth="0.35"
                      />
                    )}
                  </g>
                ))}

                {!shouldReduceMotion &&
                  [
                    [14, 28, 28, 42],
                    [25, 55, 39, 20],
                    [40, 20, 57, 38],
                    [57, 38, 73, 66],
                    [73, 66, 88, 44],
                  ].map(([x1, y1, x2, y2], i) => (
                    <motion.line
                      key={`${x1}-${y1}-${x2}-${y2}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(74,239,243,0.75)"
                      strokeWidth="0.65"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: [0, 1, 1], opacity: [0, 0.9, 0] }}
                      transition={{ duration: 2.2, delay: i * 0.4, repeat: Infinity }}
                    />
                  ))}
              </svg>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 px-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
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
        </Reveal>
      </div>
    </section>
  )
}
