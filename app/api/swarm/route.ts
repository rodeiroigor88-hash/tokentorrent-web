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
  const startTime = Date.now()

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)

    const res = await fetch(`${trackerUrl.replace(/\/$/, '')}/status`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate: 10 },
    })
    clearTimeout(timeout)

    const latencyMs = Date.now() - startTime

    if (!res.ok) {
      // Fallback a endpoint /health
      const healthRes = await fetch(`${trackerUrl.replace(/\/$/, '')}/health`, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 10 },
      })
      if (healthRes.ok) {
        const healthData = await healthRes.json()
        const count = typeof healthData.nodes === 'number' ? healthData.nodes : 0
        return NextResponse.json<SwarmStats>({
          status: 'online',
          nodesCount: count,
          models: [],
          totalCores: 0,
          totalRamGb: 0,
          latencyMs,
          lastUpdated: new Date().toISOString(),
        })
      }
      throw new Error(`Tracker responded with status ${res.status}`)
    }

    const data = await res.json()
    const rawNodes = Array.isArray(data?.nodes) ? data.nodes : []
    const models = Array.from(
      new Set(
        rawNodes
          .map((n: { model_name?: string; model_arch?: string }) => n.model_name || n.model_arch)
          .filter(Boolean),
      ),
    ) as string[]

    const totalCores = rawNodes.reduce(
      (acc: number, n: { donated_cores?: number }) => acc + (Number(n.donated_cores) || 2),
      0,
    )
    const totalRamMb = rawNodes.reduce(
      (acc: number, n: { donated_ram_mb?: number }) => acc + (Number(n.donated_ram_mb) || 2048),
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
    // Si el tracker está temporalmente fuera o en desarrollo local, responder con fallback
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
