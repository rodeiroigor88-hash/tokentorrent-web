'use client'

import { useEffect, useState } from 'react'
import { Reveal } from '@/components/site/reveal'
import { NetworkScene } from '@/components/home/network-scene'
import type { SwarmStats } from '@/app/api/swarm/route'

/**
 * Telemetría en vivo del enjambre + escena de red interactiva. Cada dato se
 * contextualiza con su fecha/hora, fuente y significado, y se marca
 * explícitamente cuando el tracker no está disponible (datos no reales).
 */
function formatUpdated(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch {
    return iso
  }
}

export function NetworkBand() {
  const [stats, setStats] = useState<SwarmStats | null>(null)

  useEffect(() => {
    let mounted = true
    async function loadStats() {
      try {
        const res = await fetch('/api/swarm')
        // La ruta responde un cuerpo SwarmStats tanto en 200 como en 503
        // (offline), así que lo leemos igual para poder indicar que no hay
        // telemetría real en lugar de mostrar contadores inventados.
        const data = (await res.json()) as SwarmStats
        if (mounted) setStats(data)
      } catch {
        // Fallback silencioso: sin telemetría, la escena sigue siendo ilustrativa.
      }
    }
    loadStats()
    const interval = setInterval(loadStats, 15000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  const isLive = stats?.status === 'online'

  return (
    <section className="border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <Reveal className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">La red</p>
            {stats && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/60 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}
                />
                {isLive
                  ? `${stats.nodesCount} nodo${stats.nodesCount === 1 ? '' : 's'} activo${stats.nodesCount === 1 ? '' : 's'}`
                  : 'Sin telemetría en vivo'}
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

          {stats && (
            <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-border bg-background p-5 font-mono text-xs text-muted-foreground">
              <dl className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-4">
                  <dt>Nodos activos</dt>
                  <dd className="text-foreground">{stats.nodesCount}</dd>
                </div>
                {isLive && stats.totalCores > 0 && (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt>Núcleos donados</dt>
                    <dd className="text-foreground">{stats.totalCores}</dd>
                  </div>
                )}
                {isLive && stats.totalRamGb > 0 && (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt>RAM donada</dt>
                    <dd className="text-foreground">{stats.totalRamGb} GB</dd>
                  </div>
                )}
                {isLive && stats.latencyMs > 0 && (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt>Latencia del tracker</dt>
                    <dd className="text-foreground">{stats.latencyMs} ms</dd>
                  </div>
                )}
              </dl>

              <p className="border-t border-border/60 pt-3 leading-relaxed text-muted-foreground/80">
                {isLive ? (
                  <>
                    Fuente: tracker público del protocolo · actualizado a las {formatUpdated(stats.lastUpdated)}. La
                    «latencia» es el tiempo de respuesta del tracker, no la velocidad de la inferencia.
                  </>
                ) : (
                  <>
                    El tracker no está configurado o no responde en este entorno, así que los contadores están a cero.
                    La escena de la derecha es una <strong className="text-foreground">demostración</strong>, no
                    telemetría real.
                  </>
                )}
              </p>
            </div>
          )}
        </Reveal>

        <Reveal delay={0.15}>
          <NetworkScene
            interactive
            label="Red interactiva de TokenTorrent: nodos conectados con capas y tokens viajando entre ellos"
            description="Visualización en tres dimensiones de la red TokenTorrent. Los nodos (ordenadores) están conectados entre sí; bloques y puntos de color turquesa representan capas del modelo y tokens que viajan por las conexiones. Incluye controles para pausar, reiniciar y activar una vista guiada."
          />
        </Reveal>
      </div>
    </section>
  )
}
