import { NextResponse } from 'next/server'

export const revalidate = 10 // Revalidar en edge cada 10 segundos

export interface SwarmStats {
  status: 'online' | 'degraded' | 'offline'
  error?: string
  nodesCount: number
  models: string[]
  totalCores: number
  totalRamGb: number
  latencyMs: number
  lastUpdated: string
}

interface TrackerNode {
  model_name?: string
  model_arch?: string
  donated_cores?: number
  donated_ram_mb?: number
}

export async function GET() {
  const trackerUrl = process.env.TRACKER_API_URL
  if (!trackerUrl) {
    return NextResponse.json<SwarmStats>({
      status: 'offline',
      error: 'TRACKER_API_URL no está configurado',
      nodesCount: 0,
      models: [],
      totalCores: 0,
      totalRamGb: 0,
      latencyMs: 0,
      lastUpdated: new Date().toISOString(),
    }, { status: 503 })
  }

  const base = trackerUrl.replace(/\/$/, '')
  const startTime = Date.now()

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)

    // /plan es el inventario del tracker y es el unico endpoint que devuelve
    // la lista de nodos. El anterior /status esta reescrito por vercel.json
    // hacia el /health del backend, que responde 200 pero sin clave `nodes`:
    // por eso el contador se quedaba permanentemente a cero.
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
    // Distinguirlo evita que un cambio de endpoint vuelva a pasar inadvertido.
    if (!Array.isArray(data?.nodes)) {
      return NextResponse.json<SwarmStats>({
        status: 'degraded',
        error: 'El tracker no devolvió la lista de nodos',
        nodesCount: 0,
        models: [],
        totalCores: 0,
        totalRamGb: 0,
        latencyMs,
        lastUpdated: new Date().toISOString(),
      })
    }

    const rawNodes = data.nodes as TrackerNode[]

    const models = Array.from(
      new Set(
        rawNodes
          .map((n) => n.model_name || n.model_arch)
          .filter(Boolean),
      ),
    ) as string[]

    // Sin valores por defecto inventados: si un nodo no declara sus recursos,
    // no se cuenta. Antes se aplicaba `|| 2` nucleos y `|| 2048` MB, lo que
    // publicaba capacidad ficticia en cuanto hubiera nodos visibles.
    const totalCores = rawNodes.reduce(
      (acc, n) => acc + (Number(n.donated_cores) || 0),
      0,
    )
    const totalRamMb = rawNodes.reduce(
      (acc, n) => acc + (Number(n.donated_ram_mb) || 0),
      0,
    )

    return NextResponse.json<SwarmStats>({
      status: 'online',
      nodesCount: rawNodes.length,
      models,
      totalCores,
      totalRamGb: Math.round((totalRamMb / 1024) * 10) / 10,
      latencyMs,
      lastUpdated: new Date().toISOString(),
    })
  } catch {
    // Si el tracker esta temporalmente fuera o en desarrollo local, responder
    // con fallback. Se mantiene el 200 para no romper la portada.
    return NextResponse.json<SwarmStats>(
      {
        status: 'offline',
        error: 'No se pudo conectar con el tracker',
        nodesCount: 0,
        models: [],
        totalCores: 0,
        totalRamGb: 0,
        latencyMs: 0,
        lastUpdated: new Date().toISOString(),
      },
      { status: 200 },
    )
  }
}
