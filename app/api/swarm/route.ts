import { NextResponse } from 'next/server'

export const revalidate = 10 // Revalidar en edge cada 10 segundos

/** Un nodo del enjambre tal y como lo expone el tracker. */
export interface SwarmNode {
  nodeId: string
  modelArch: string | null
  /** Rango de capas que aloja este nodo, p. ej. "8-15". */
  layers: string | null
  isLast: boolean
  lastSeen: number | null
}

export interface SwarmStats {
  status: 'online' | 'degraded' | 'offline'
  error?: string
  nodesCount: number
  models: string[]
  totalCores: number
  totalRamGb: number
  latencyMs: number
  lastUpdated: string
  /** Inventario completo de nodos visibles. */
  nodes: SwarmNode[]
  /** Inventario ordenado para visualización; no es una ruta firmada de inferencia. */
  route: SwarmNode[]
}

interface TrackerNode {
  node_id?: string
  model_name?: string
  model_arch?: string
  layers?: string
  is_last?: number | boolean
  donated_cores?: number | null
  donated_ram_mb?: number | null
  last_seen?: number | null
  seen_ago?: number | null
}

function isTrackerNode(value: unknown): value is TrackerNode {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function layerStart(value: unknown) {
  const match = typeof value === 'string' ? value.match(/^\s*(\d+)/) : null
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

function toSwarmNode(n: TrackerNode): SwarmNode {
  return {
    nodeId: String(n.node_id ?? ''),
    modelArch: n.model_arch ?? n.model_name ?? null,
    layers: n.layers ?? null,
    isLast: n.is_last === 1 || n.is_last === true,
    lastSeen:
      typeof n.last_seen === 'number'
        ? n.last_seen
        : typeof n.seen_ago === 'number'
          ? Math.floor(Date.now() / 1000) - n.seen_ago
          : null,
  }
}

function emptyStats(partial: Partial<SwarmStats> = {}): SwarmStats {
  return {
    status: 'offline',
    nodesCount: 0,
    models: [],
    totalCores: 0,
    totalRamGb: 0,
    latencyMs: 0,
    lastUpdated: new Date().toISOString(),
    nodes: [],
    route: [],
    ...partial,
  }
}

export async function GET() {
  const trackerUrl = process.env.TRACKER_API_URL
  if (!trackerUrl) {
    return statsResponse(
      emptyStats({ error: 'TRACKER_API_URL no está configurado' }),
      { status: 503 },
    )
  }

  const base = trackerUrl.replace(/\/$/, '')
  const startTime = Date.now()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 4000)

  try {
    // /status es la vista pública del inventario. /plan requiere un callback
    // firmado y no es un endpoint de monitorización: no debe llamarse desde
    // esta página sin contexto de inferencia.
    const res = await fetch(`${base}/status`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate: 10 },
    })
    const latencyMs = Date.now() - startTime

    if (!res.ok) {
      throw new Error(`Tracker responded with status ${res.status}`)
    }

    const data = await res.json()

    // Un 200 sin array `nodes` es un fallo de contrato, no un enjambre vacio.
    if (!Array.isArray(data?.nodes)) {
      return statsResponse(
        emptyStats({
          status: 'degraded',
          error: 'El tracker no devolvió la lista de nodos',
          latencyMs,
        }),
      )
    }

    // El tracker puede devolver entradas nulas durante un refresh. Se
    // descartan aquí para que una respuesta parcial no rompa toda la página.
    const rawNodes: TrackerNode[] = data.nodes.filter(isTrackerNode)
    // El tracker de referencia no expone una ruta en /status. Ordenamos el
    // inventario por rango y lo usamos como vista aproximada, etiquetada como
    // inventario, sin presentarlo como una ruta firmada de inferencia.
    const rawRoute: TrackerNode[] = [...rawNodes].sort((a, b) => layerStart(a.layers) - layerStart(b.layers))

    const nodes = rawNodes.map(toSwarmNode)
    const route = rawRoute.map(toSwarmNode)

    const models = Array.from(
      new Set(rawNodes.map((n) => n.model_name || n.model_arch).filter(Boolean)),
    ) as string[]

    // Sin valores por defecto inventados: si un nodo no declara sus recursos,
    // no se cuenta. Antes se aplicaba `|| 2` nucleos y `|| 2048` MB, lo que
    // publicaba capacidad ficticia en cuanto hubiera nodos visibles.
    const totalCores = rawNodes.reduce((acc, n) => acc + (Number(n.donated_cores) || 0), 0)
    const totalRamMb = rawNodes.reduce((acc, n) => acc + (Number(n.donated_ram_mb) || 0), 0)

    return statsResponse({
      // Un tracker accesible pero sin nodos no representa un enjambre sano.
      status: rawNodes.length > 0 ? 'online' : 'degraded',
      nodesCount: rawNodes.length,
      models,
      totalCores,
      totalRamGb: Math.round((totalRamMb / 1024) * 10) / 10,
      latencyMs,
      lastUpdated: new Date().toISOString(),
      nodes,
      route,
    }, undefined, 'public, s-maxage=10, stale-while-revalidate=30')
  } catch {
    // Si el tracker esta temporalmente fuera o en desarrollo local, responder
    // con fallback. Se mantiene el 200 para no romper la portada.
    return statsResponse(
      emptyStats({ error: 'No se pudo conectar con el tracker' }),
      { status: 200 },
    )
  } finally {
    clearTimeout(timeout)
  }
}

function statsResponse(stats: SwarmStats, init?: ResponseInit, cacheControl = 'no-store') {
  const response = NextResponse.json<SwarmStats>(stats, init)
  response.headers.set('Cache-Control', cacheControl)
  return response
}
