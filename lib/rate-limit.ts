import { headers } from 'next/headers'

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

// Vercel antepone `x-vercel-forwarded-for` con la IP original del cliente y
// la deja intacta si el visitante ha manipulado `x-forwarded-for`. Fuera de
// Vercel caemos al estandar de proxies inversos.
const IP_HEADER_CANDIDATES = ['x-vercel-forwarded-for', 'x-forwarded-for'] as const

/** Extrae la IP del cliente de las cabeceras del edge/proxy. */
export async function clientIp(): Promise<string> {
  const h = await headers()
  for (const key of IP_HEADER_CANDIDATES) {
    const raw = h.get(key)
    if (!raw) continue
    // La cabecera puede llevar varias IPs separadas por comas; la primera es
    // la del cliente original, el resto son los saltos intermedios.
    const first = raw.split(',')[0]?.trim()
    if (first) return first
  }
  return 'unknown'
}

type PipelineEntry = { result?: number | string; error?: string }

/**
 * Rate limit por `bucket:ip` sobre Upstash Redis mediante su API REST
 * (`INCR` + `EXPIRE NX`). Sin secretos en el navegador: se llama desde
 * server actions y route handlers.
 *
 * Politica: **fail-open**. Si Upstash no responde, el formulario no debe
 * caerse por la ausencia de la telemetria de rate limit; el limite es una
 * proteccion adicional, no la unica linea de defensa (el honeypot y la
 * validacion de email siguen actuando).
 */
export async function checkRateLimit(
  bucket: string,
  ip: string,
  { limit, windowSeconds }: { limit: number; windowSeconds: number },
): Promise<RateLimitResult> {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token || !ip || ip === 'unknown') {
    return { allowed: true, remaining: limit, retryAfterSeconds: 0 }
  }

  const key = `rl:${bucket}:${ip}`
  try {
    const response = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // INCR incrementa el contador; EXPIRE NX fija el TTL solo si la clave es
      // nueva, asi la ventana empieza con la primera peticion y no se renueva
      // en cada llamada (lo que dejaria a la IP fuera indefinidamente).
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, String(windowSeconds), 'NX'],
      ]),
      cache: 'no-store',
    })
    if (!response.ok) {
      return { allowed: true, remaining: limit, retryAfterSeconds: 0 }
    }
    const payload = (await response.json()) as PipelineEntry[]
    const first = payload?.[0]
    const count = typeof first?.result === 'number' ? first.result : Number(first?.result ?? 0)
    if (!Number.isFinite(count) || count <= 0) {
      return { allowed: true, remaining: limit, retryAfterSeconds: 0 }
    }
    if (count > limit) {
      return { allowed: false, remaining: 0, retryAfterSeconds: windowSeconds }
    }
    return { allowed: true, remaining: Math.max(0, limit - count), retryAfterSeconds: 0 }
  } catch {
    return { allowed: true, remaining: limit, retryAfterSeconds: 0 }
  }
}
