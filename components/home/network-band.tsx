'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal } from '@/components/site/reveal'
import type { SwarmStats } from '@/app/api/swarm/route'

/** Visualización abstracta del enjambre: paquetes viajando entre nodos y telemetría en vivo. */
export function NetworkBand() {
  const [stats, setStats] = useState<SwarmStats | null>(null)

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
        // Fallback silencioso
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
          <div className="flex items-center gap-2">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">La red</p>
            {stats && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/60 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    stats.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                {stats.status === 'online'
                  ? `${stats.nodesCount} nodo${stats.nodesCount === 1 ? '' : 's'} activo${
                      stats.nodesCount === 1 ? '' : 's'
                    }`
                  : 'Modo P2P local'}
              </span>
            )}
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Un enjambre que nunca duerme
          </h2>
          <p className="max-w-md leading-relaxed text-muted-foreground text-pretty">
            Cada nodo replica, verifica y retransmite. Cuantos más participantes, más rápida y resistente se vuelve la
            red. Así funciona un torrente: la escala es la fortaleza.
          </p>
          {stats && stats.status === 'online' && (
            <div className="mt-2 flex flex-wrap gap-4 font-mono text-xs text-muted-foreground">
              {stats.totalCores > 0 && <div>Núcleos: <span className="text-foreground">{stats.totalCores}</span></div>}
              {stats.totalRamGb > 0 && <div>RAM: <span className="text-foreground">{stats.totalRamGb} GB</span></div>}
              {stats.latencyMs > 0 && <div>Latencia tracker: <span className="text-foreground">{stats.latencyMs} ms</span></div>}
            </div>
          )}
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
