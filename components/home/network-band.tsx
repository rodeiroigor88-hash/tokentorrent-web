'use client'

import { useEffect, useState } from 'react'
import { Reveal } from '@/components/site/reveal'
import { NetworkScene } from '@/components/home/network-scene'
import type { SwarmStats } from '@/app/api/swarm/route'

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
          <div className="flex items-center justify-between gap-4 px-1 pb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Diagrama de red</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">tokentorrent</p>
          </div>

          <NetworkScene
            interactive
            nodes={stats?.nodes}
            route={stats?.route}
            label="Ruta del enjambre de TokenTorrent: los nodos del pipeline conectados en orden, con tokens viajando por la ruta"
            description="Visualización holográfica de la ruta real del enjambre. Cada nodo aparece como un punto con su rango de capas, unidos por una única línea continua en el orden del pipeline. Pulsos de color turquesa (tokens) viajan de nodo a nodo por esa ruta. Incluye controles para pausar, reiniciar y activar una vista guiada."
          />
        </Reveal>
      </div>
    </section>
  )
}
