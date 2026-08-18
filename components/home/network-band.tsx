'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Reveal } from '@/components/site/reveal'
import { NetworkScene } from '@/components/home/network-scene'
import type { SwarmStats } from '@/app/api/swarm/route'

export function NetworkBand() {
  const [stats, setStats] = useState<SwarmStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadStats() {
      try {
        const res = await fetch('/api/swarm')
        // El endpoint devuelve un JSON estable también con 503. Mostrar ese
        // estado en portada es más útil que ocultar el indicador por no ser 2xx.
        const data = (await res.json()) as SwarmStats
        if (mounted) setStats(data)
      } catch {
        // Se queda en modo visual si el endpoint no responde.
      } finally {
        if (mounted) setLoading(false)
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
            {(loading || stats) && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/70 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${loading ? 'bg-muted-foreground animate-pulse' : stats?.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}
                />
                {loading
                  ? 'Comprobando estado…'
                  : stats?.status === 'online'
                  ? `${stats.nodesCount} nodo${stats.nodesCount === 1 ? '' : 's'} activo${
                      stats.nodesCount === 1 ? '' : 's'
                    }`
                  : stats?.status === 'degraded'
                    ? 'Estado degradado'
                    : 'Tracker no disponible'}
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

          <Link
            href="/estado"
            className="w-fit font-mono text-xs text-muted-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
          >
            Ver métricas y estado completo →
          </Link>
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
            label="Inventario visible del enjambre de TokenTorrent, ordenado por rangos de capas"
            description="Visualización del inventario público del enjambre. Cada nodo aparece como un punto con su rango de capas y se ordena para facilitar la lectura. No representa la ruta firmada de una inferencia concreta. Incluye controles para pausar, reiniciar y activar una vista guiada."
          />
        </Reveal>
      </div>
    </section>
  )
}
