'use client'

import { useCallback, useEffect, useState } from 'react'
import type { SwarmNode, SwarmStats } from '@/app/api/swarm/route'

const POLL_MS = 15_000

function formatUpdated(value: string) {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(value))
}

function stateLabel(status: SwarmStats['status']) {
  if (status === 'online') return 'Operativo'
  if (status === 'degraded') return 'Degradado'
  return 'Sin conexión'
}

function stateClass(status: SwarmStats['status']) {
  if (status === 'online') return 'border-primary/40 bg-primary/10 text-primary'
  if (status === 'degraded') return 'border-amber-300/30 bg-amber-300/10 text-amber-200'
  return 'border-destructive/40 bg-destructive/10 text-red-200'
}

function declaredResource(value: number, suffix = '') {
  return value > 0 ? `${value}${suffix}` : 'No declarado'
}

function NodeRow({ node, index }: { node: SwarmNode; index: number }) {
  const lastSeen = node.lastSeen
    ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(node.lastSeen * 1000))
    : 'sin heartbeat'

  return (
    <li className="grid gap-2 border-t border-border py-4 text-sm md:grid-cols-[1fr_1fr_130px_130px] md:items-center">
      <div className="min-w-0"><p className="truncate font-mono text-xs text-foreground">{node.nodeId || `nodo-${index + 1}`}</p><p className="mt-1 text-muted-foreground">{node.modelArch || 'Arquitectura no declarada'}</p></div>
      <p className="text-muted-foreground">Capas {node.layers || 'no declaradas'}</p>
      <p className="font-mono text-xs text-muted-foreground">{node.isLast ? 'último nodo' : 'en ruta'}</p>
      <p className="font-mono text-xs text-muted-foreground">{lastSeen}</p>
    </li>
  )
}

export function SwarmStatus() {
  const [data, setData] = useState<SwarmStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    setRefreshing(true)
    try {
      const response = await fetch('/api/swarm', { cache: 'no-store' })
      const next = (await response.json()) as SwarmStats
      setData(next)
      setError(null)
    } catch {
      setError('No se pudo consultar el estado público.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const initial = window.setTimeout(() => void load(), 0)
    const timer = window.setInterval(() => void load(), POLL_MS)
    return () => {
      window.clearTimeout(initial)
      window.clearInterval(timer)
    }
  }, [load])

  if (loading && !data) return <div className="mt-12 rounded-2xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">Consultando el tracker…</div>
  if (!data) return <div className="mt-12 rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-red-200">{error}</div>

  return (
    <section className="mt-12" aria-label="Estado del enjambre">
      <div className="grid gap-4 md:grid-cols-4">
        {[[ 'Nodos visibles', data.nodesCount.toString() ], [ 'Núcleos donados', declaredResource(data.totalCores) ], [ 'RAM donada', declaredResource(data.totalRamGb, ' GB') ], [ 'Latencia tracker', declaredResource(data.latencyMs, ' ms') ]].map(([label, value]) => <article key={label} className="rounded-2xl border border-border bg-card/60 p-5"><p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p><p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p></article>)}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-2xl border border-border bg-card/60 p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold tracking-tight">Estado del tracker</h2><p className="mt-1 text-sm text-muted-foreground">Actualización automática cada 15 segundos.</p></div><span aria-live="polite" className={`rounded-full border px-3 py-1 font-mono text-xs ${stateClass(data.status)}`}>{stateLabel(data.status)}</span></div>{data.error && <p className="mt-5 rounded-lg border border-border bg-background/50 p-3 text-sm text-muted-foreground">{data.error}</p>}<div className="mt-6 flex flex-wrap items-center gap-4"><p className="font-mono text-xs text-muted-foreground">Última lectura: {formatUpdated(data.lastUpdated)}</p><button type="button" onClick={() => void load()} disabled={refreshing} className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:cursor-wait disabled:opacity-60">{refreshing ? 'Actualizando…' : 'Actualizar ahora'}</button></div></article>
        <article className="rounded-2xl border border-border bg-card/60 p-6"><h2 className="text-xl font-semibold tracking-tight">Modelos visibles</h2>{data.models.length > 0 ? <ul className="mt-5 flex flex-wrap gap-2">{data.models.map((model) => <li key={model} className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">{model}</li>)}</ul> : <p className="mt-5 text-sm text-muted-foreground">Todavía no hay modelos declarados por el enjambre.</p>}</article>
      </div>
      <article className="mt-4 rounded-2xl border border-border bg-card/60 p-6"><h2 className="text-xl font-semibold tracking-tight">Inventario del enjambre</h2><p className="mt-1 text-sm text-muted-foreground">Nodos ordenados por rango de capas. La ruta de inferencia se firma y se negocia aparte.</p>{data.route.length > 0 ? <ol className="mt-4">{data.route.map((node, index) => <NodeRow key={`${node.nodeId}-${index}`} node={node} index={index} />)}</ol> : <p className="mt-4 text-sm text-muted-foreground">No hay nodos visibles en este momento.</p>}</article>
    </section>
  )
}
