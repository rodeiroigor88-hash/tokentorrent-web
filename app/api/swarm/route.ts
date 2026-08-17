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
  /** Ruta del pipeline en orden; el índice de cada elemento es su routeIndex. */
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
}

function toSwarmNode(n: TrackerNode): SwarmNode {
  return {
    nodeId: String(n.node_id ?? ''),
    modelArch: n.model_arch ?? n.model_name ?? null,
    layers: n.layers ?? null,
    isLast: n.is_last === 1 || n.is_last === true,
    lastSeen: typeof n.last_seen === 'number' ? n.last_seen : null,
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
    return NextResponse.json<SwarmStats>(
      emptyStats({ error: 'TRACKER_API_URL no está configurado' }),
      { status: 503 },
    )
  }

  const base = trackerUrl.replace(/\/$/, '')
  const startTime = Date.now()

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)

    // /plan es el inventario del tracker: devuelve `nodes` (inventario) y
    // `route` (la ruta del pipeline ya ordenada). El anterior /status estaba
    // reescrito por vercel.json hacia /health, que no trae la clave `nodes`.
    const res = await fetch(`${base}/plan`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate: 10 },
    })
    clearTimeout(timeout)

    const latencyMs = Date.now() - startTime

    if (!res.ok) {
      throw new Error(`Tracker responded with status ${res.status}`)
    }

    const data = await res.json()

    // Un 200 sin array `nodes` es un fallo de contrato, no un enjambre vacio.
    if (!Array.isArray(data?.nodes)) {
      return NextResponse.json<SwarmStats>(
        emptyStats({
          status: 'degraded',
          error: 'El tracker no devolvió la lista de nodos',
          latencyMs,
        }),
      )
    }

    const rawNodes = data.nodes as TrackerNode[]
    const rawRoute = Array.isArray(data?.route) ? (data.route as TrackerNode[]) : []

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

    return NextResponse.json<SwarmStats>({
      status: 'online',
      nodesCount: rawNodes.length,
      models,
      totalCores,
      totalRamGb: Math.round((totalRamMb / 1024) * 10) / 10,
      latencyMs,
      lastUpdated: new Date().toISOString(),
      nodes,
      route,
    })
  } catch {
    // Si el tracker esta temporalmente fuera o en desarrollo local, responder
    // con fallback. Se mantiene el 200 para no romper la portada.
    return NextResponse.json<SwarmStats>(
      emptyStats({ error: 'No se pudo conectar con el tracker' }),
      { status: 200 },
    )
  }
}
