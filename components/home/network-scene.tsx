'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { SwarmNode } from '@/app/api/swarm/route'

/**
 * Escena holográfica de la ruta real del enjambre, dibujada en un <canvas> 2D
 * sin WebGL ni dependencias extra.
 *
 * Principios visuales:
 *  - La ÚNICA conexión principal es la ruta real del pipeline (nodos en el
 *    orden de `routeIndex`), trazada como una curva suave y orgánica.
 *  - No hay elipses orbitales, ni cables sueltos, ni polígonos cerrados.
 *  - Partículas/tokens viajan exactamente por la ruta; la decoración
 *    holográfica (retícula de puntos, polvo flotante) queda en un segundo
 *    plano y nunca compite con los nodos.
 *  - Profundidad por opacidad, escala, glow y partículas sutiles.
 *  - Respeta `prefers-reduced-motion` (fotograma estático) y solo anima
 *    cuando el bloque es visible (IntersectionObserver).
 */

type Pt = { x: number; y: number }
type BezierSeg = { p0: Pt; c1: Pt; c2: Pt; p1: Pt }
type SampledPath = { pts: Pt[]; cum: number[]; total: number }

const CYAN = (a: number) => `oklch(0.85 0.13 192 / ${a})`

// Ruta de demostración: se usa solo cuando no hay telemetría real (hero y
// estado offline). La sección "La red" la etiqueta explícitamente como demo.
const DEMO_ROUTE: SwarmNode[] = [
  { nodeId: 'demo-0', modelArch: 'llama/qwen', layers: '0-3', isLast: false, lastSeen: null },
  { nodeId: 'demo-1', modelArch: 'llama/qwen', layers: '4-7', isLast: false, lastSeen: null },
  { nodeId: 'demo-2', modelArch: 'llama/qwen', layers: '8-11', isLast: false, lastSeen: null },
  { nodeId: 'demo-3', modelArch: 'llama/qwen', layers: '12-15', isLast: false, lastSeen: null },
  { nodeId: 'demo-4', modelArch: 'llama/qwen', layers: '16-19', isLast: false, lastSeen: null },
  { nodeId: 'demo-5', modelArch: 'llama/qwen', layers: '20-23', isLast: true, lastSeen: null },
]

// --- Spline Catmull-Rom → Bézier -------------------------------------------------

function buildSpline(points: Pt[]): BezierSeg[] {
  const segs: BezierSeg[] = []
  const n = points.length
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(n - 1, i + 2)]
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    segs.push({ p0: p1, c1, c2, p1: p2 })
  }
  return segs
}

function bezierAt(seg: BezierSeg, t: number): Pt {
  const mt = 1 - t
  const a = mt * mt * mt
  const b = 3 * mt * mt * t
  const c = 3 * mt * t * t
  const d = t * t * t
  return {
    x: a * seg.p0.x + b * seg.c1.x + c * seg.c2.x + d * seg.p1.x,
    y: a * seg.p0.y + b * seg.c1.y + c * seg.c2.y + d * seg.p1.y,
  }
}

function sampleSpline(segs: BezierSeg[], perSeg = 18): SampledPath {
  const pts: Pt[] = []
  const cum: number[] = []
  let acc = 0
  pts.push(segs.length ? segs[0].p0 : { x: 0, y: 0 })
  cum.push(0)
  for (const seg of segs) {
    for (let i = 1; i <= perSeg; i++) {
      const p = bezierAt(seg, i / perSeg)
      const prev = pts[pts.length - 1]
      acc += Math.hypot(p.x - prev.x, p.y - prev.y)
      pts.push(p)
      cum.push(acc)
    }
  }
  return { pts, cum, total: acc }
}

function pointAt(s: SampledPath, dist: number): Pt {
  if (s.total <= 0) return s.pts[0] ?? { x: 0, y: 0 }
  const d = ((dist % s.total) + s.total) % s.total
  let lo = 0
  let hi = s.cum.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (s.cum[mid] < d) lo = mid + 1
    else hi = mid
  }
  if (lo === 0) return s.pts[0]
  const a = s.pts[lo - 1]
  const b = s.pts[lo]
  const span = s.cum[lo] - s.cum[lo - 1]
  const t = span <= 0 ? 0 : (d - s.cum[lo - 1]) / span
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

// --- Layout ------------------------------------------------------------------------

/**
 * Coloca los nodos de la ruta en una composición equilibrada: un flujo suave de
 * izquierda a derecha con una leve ondulación orgánica. No forma estrella, ni
 * telaraña, ni círculo; es una única corriente continua.
 */
function layoutRoute(route: SwarmNode[], w: number, h: number): Pt[] {
  const n = route.length
  if (n === 0) return []
  const mx = Math.min(w * 0.15, 96)
  const cy = h / 2
  const usableW = w - mx * 2
  return route.map((_, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1)
    const x = mx + t * usableW
    const s = Math.sin((t - 0.5) * Math.PI) // -1 → 1, subida suave
    const ripple = Math.sin(t * Math.PI * 3) * 0.5 // ondulación leve
    const y = cy + s * (h * 0.13) + ripple * (h * 0.016)
    return { x, y }
  })
}

function nodeDepth(i: number, n: number): number {
  if (n <= 1) return 1
  return 0.84 + 0.16 * (Math.sin(i * 2.399) * 0.5 + 0.5)
}

// --- Primitivas de dibujo ----------------------------------------------------------

function glowDot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(0.01, r))
  g.addColorStop(0, CYAN(alpha))
  g.addColorStop(1, CYAN(0))
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, Math.max(0.01, r), 0, Math.PI * 2)
  ctx.fill()
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  depth: number,
  time: number,
  label: string | null,
  emphasized: boolean,
  reduceMotion: boolean,
  showLabel: boolean,
) {
  const breathe = reduceMotion ? 0 : Math.sin(time / 1100 + x * 0.02) * 0.5 + 0.5
  const ring = r * (1 + breathe * 0.06)

  // Halo exterior suave.
  glowDot(ctx, x, y, r * 4.2, 0.16 * depth)
  // Anillo fino.
  ctx.strokeStyle = CYAN(0.55 * depth)
  ctx.lineWidth = emphasized ? 1.3 : 0.9
  ctx.beginPath()
  ctx.arc(x, y, ring, 0, Math.PI * 2)
  ctx.stroke()
  // Núcleo.
  ctx.fillStyle = CYAN(0.9 * depth)
  ctx.beginPath()
  ctx.arc(x, y, r * 0.42, 0, Math.PI * 2)
  ctx.fill()

  if (showLabel && label) {
    ctx.font = '10px "Geist Mono", ui-monospace, monospace'
    ctx.textAlign = 'center'
    ctx.fillStyle = CYAN(0.55 * depth)
    ctx.fillText(label, x, y + r + 12)
  }
}

function drawRouteLine(ctx: CanvasRenderingContext2D, segs: BezierSeg[], alpha: number, lineWidth: number) {
  if (!segs.length) return
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = CYAN(alpha)
  ctx.lineWidth = lineWidth
  ctx.beginPath()
  ctx.moveTo(segs[0].p0.x, segs[0].p0.y)
  for (const seg of segs) ctx.bezierCurveTo(seg.c1.x, seg.c1.y, seg.c2.x, seg.c2.y, seg.p1.x, seg.p1.y)
  ctx.stroke()
}

function drawPacket(
  ctx: CanvasRenderingContext2D,
  s: SampledPath,
  dist: number,
  r: number,
  alpha: number,
) {
  const p = pointAt(s, dist)
  // Estela: puntos cada vez más tenues detrás del pulso.
  for (let k = 3; k >= 1; k--) {
    const tp = pointAt(s, dist - k * (r * 2.6))
    glowDot(ctx, tp.x, tp.y, r * (1.1 - k * 0.2), alpha * (0.4 - k * 0.09))
  }
  // Pulso principal.
  glowDot(ctx, p.x, p.y, r * 2.6, alpha * 0.65)
  ctx.fillStyle = CYAN(alpha)
  ctx.beginPath()
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
  ctx.fill()
}

function drawBackdrop(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Retícula de puntos muy tenue, como mesa holográfica de fondo.
  const gap = 34
  ctx.fillStyle = CYAN(0.05)
  for (let x = gap / 2; x < w; x += gap) {
    for (let y = gap / 2; y < h; y += gap) {
      ctx.fillRect(x, y, 1, 1)
    }
  }
  // Esquinas tipo HUD, finas y discretas.
  const m = 14
  const L = 22
  ctx.strokeStyle = CYAN(0.28)
  ctx.lineWidth = 1
  const corner = (cx: number, cyy: number, dx: number, dy: number) => {
    ctx.beginPath()
    ctx.moveTo(cx + dx * L, cyy)
    ctx.lineTo(cx, cyy)
    ctx.lineTo(cx, cyy + dy * L)
    ctx.stroke()
  }
  corner(m, m, 1, 1)
  corner(w - m, m, -1, 1)
  corner(m, h - m, 1, -1)
  corner(w - m, h - m, -1, -1)
}

// Polvo flotante: partículas diminutas, sin conexiones, deriva lenta.
const DUST = Array.from({ length: 22 }, (_, i) => ({
  x: ((i * 37 + 11) % 100) / 100,
  y: ((i * 61 + 7) % 100) / 100,
  r: 0.5 + ((i * 13) % 10) / 10,
  vx: 0.008 + ((i * 5) % 7) * 0.0012,
  vy: 0.004 + ((i * 3) % 5) * 0.0008,
  a: 0.05 + ((i * 17) % 10) / 100,
}))

function drawDust(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  reduceMotion: boolean,
) {
  for (const d of DUST) {
    const x = ((d.x * w + (reduceMotion ? 0 : time * d.vx * 12)) % w + w) % w
    const y = ((d.y * h - (reduceMotion ? 0 : time * d.vy * 6)) % h + h) % h
    glowDot(ctx, x, y, d.r * 2.4, d.a)
  }
}

const GUIDED_STEPS = [
  { label: 'Solicitud', detail: 'Tu petición entra por el primer nodo de la ruta' },
  { label: 'Capas repartidas', detail: 'Cada nodo aloja un tramo de capas del modelo' },
  { label: 'Ejecución en cadena', detail: 'Los nodos se pasan el resultado en orden' },
  { label: 'Respuesta', detail: 'El último nodo devuelve la respuesta' },
]

type Props = {
  label: string
  description: string
  nodes?: SwarmNode[]
  route?: SwarmNode[]
  interactive?: boolean
  className?: string
}

export function NetworkScene({ label, description, nodes, route, interactive = false, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [paused, setPaused] = useState(false)
  const [guided, setGuided] = useState(false)
  const [step, setStep] = useState(0)

  const pausedRef = useRef(false)
  const guidedRef = useRef(false)
  const stepRef = useRef(0)
  const routeRef = useRef<SwarmNode[]>([])
  const nodesRef = useRef<SwarmNode[]>([])

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])
  useEffect(() => {
    guidedRef.current = guided
  }, [guided])
  useEffect(() => {
    stepRef.current = step
  }, [step])
  useEffect(() => {
    routeRef.current = route ?? []
    nodesRef.current = nodes ?? []
  }, [route, nodes])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let running = false
    let visible = false
    let lastT = 0
    let width = 0
    let height = 0
    let dpr = 1
    let layoutKey = ''
    let pts: Pt[] = []
    let segs: BezierSeg[] = []
    let samples: SampledPath = { pts: [], cum: [], total: 0 }
    let packets: { phase: number; speed: number; size: number }[] = []
    let nodeCount = 0
    let simTime = 0

    const resize = () => {
      const rect = container.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      layoutKey = '' // fuerza recalcular posiciones con el nuevo tamaño
    }

    const ensureLayout = () => {
      const r = routeRef.current.length ? routeRef.current : DEMO_ROUTE
      const key = `${r.map((n) => n.nodeId).join('|')}::${Math.round(width)}x${Math.round(height)}`
      if (key === layoutKey) return
      layoutKey = key
      nodeCount = r.length
      pts = layoutRoute(r, width, height)
      segs = buildSpline(pts)
      samples = sampleSpline(segs)
      const count = Math.max(2, Math.min(6, Math.round(r.length * 0.8)))
      packets = Array.from({ length: count }, (_, i) => ({
        phase: i / count + ((i * 7) % 5) * 0.006,
        speed: 0.05 + (i % 3) * 0.014,
        size: 0.8 + ((i * 3) % 5) * 0.12,
      }))
    }

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000)
      lastT = now
      if (!pausedRef.current) simTime += dt
      const time = simTime * 1000

      ensureLayout()
      ctx.clearRect(0, 0, width, height)

      // 1. Fondo holográfico (secundario) y polvo.
      drawBackdrop(ctx, width, height)
      drawDust(ctx, width, height, time / 1000, reduceMotion)

      // 2. Ruta real: halo ancho y tenue + línea fina continua encima.
      drawRouteLine(ctx, segs, 0.1, 5)
      drawRouteLine(ctx, segs, 0.46, 1.1)

      // 3. Paquetes/tokens viajando exactamente por la ruta.
      if (samples.total > 0) {
        for (const p of packets) {
          const u = reduceMotion ? p.phase : (p.phase + (time / 1000) * p.speed) % 1
          drawPacket(ctx, samples, u * samples.total, p.size * 1.7, 0.9)
        }
      }

      // 4. Nodos encima de la ruta.
      const baseR = Math.min(11, Math.max(3.4, Math.min(width, height) * 0.026))
      const showLabel = width >= 360 && baseR >= 4
      const n = nodeCount
      for (let i = 0; i < n; i++) {
        const p = pts[i]
        const depth = nodeDepth(i, n)
        const emphasized = i === 0 || i === n - 1
        const label = routeRef.current.length ? routeRef.current[i]?.layers : DEMO_ROUTE[i]?.layers
        drawNode(ctx, p.x, p.y, baseR * depth, depth, time, label ?? null, emphasized, reduceMotion, showLabel)
      }

      // 5. Vista guiada: resalta la fase actual de la ruta.
      if (guidedRef.current && n > 0) {
        const s = stepRef.current % GUIDED_STEPS.length
        let focusIdx: number | null = null
        let focusSeg: number | null = null
        if (s === 0) focusIdx = 0
        else if (s === 1) focusIdx = Math.max(0, Math.min(n - 1, Math.floor((n - 1) / 2)))
        else if (s === 2) focusSeg = Math.max(0, Math.min(segs.length - 1, Math.floor(segs.length / 2)))
        else focusIdx = n - 1

        if (focusIdx !== null && pts[focusIdx]) {
          const p = pts[focusIdx]
          const pulse = reduceMotion ? 1 : Math.sin(time / 500) * 0.5 + 0.5
          ctx.strokeStyle = CYAN(0.85)
          ctx.lineWidth = 1.2
          ctx.beginPath()
          ctx.arc(p.x, p.y, baseR * 2.4 + pulse * 3, 0, Math.PI * 2)
          ctx.stroke()
        }
        if (focusSeg !== null && segs[focusSeg]) {
          const seg = segs[focusSeg]
          ctx.strokeStyle = CYAN(0.85)
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(seg.p0.x, seg.p0.y)
          ctx.bezierCurveTo(seg.c1.x, seg.c1.y, seg.c2.x, seg.c2.y, seg.p1.x, seg.p1.y)
          ctx.stroke()
        }
      }

      if (running && visible && !reduceMotion) raf = requestAnimationFrame(draw)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting)
        if (visible && !running) {
          running = true
          lastT = performance.now()
          raf = requestAnimationFrame(draw)
        } else if (!visible && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0.15 },
    )

    resize()
    observer.observe(container)
    window.addEventListener('resize', resize)

    // Con reduced-motion pintamos un único fotograma estático.
    draw(reduceMotion ? 0 : performance.now())
    if (reduceMotion) running = false

    return () => {
      running = false
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    if (!guided) return
    const id = setInterval(() => setStep((s) => (s + 1) % GUIDED_STEPS.length), 2400)
    return () => clearInterval(id)
  }, [guided])

  const restart = useCallback(() => {
    setGuided(false)
    setStep(0)
    setPaused(false)
  }, [])

  return (
    <figure className={`flex flex-col gap-4 ${className}`}>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl border border-border bg-background"
        style={{ aspectRatio: '4 / 3' }}
      >
        <canvas ref={canvasRef} role="img" aria-label={label} className="h-full w-full" />
        <p className="sr-only">{description}</p>
      </div>

      <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" /> nodo de la ruta
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary/60" /> token en tránsito
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-px w-4 bg-primary/60" /> ruta del pipeline
        </span>

        {interactive && (
          <span className="ml-auto flex flex-wrap items-center gap-2">
            <SceneButton onClick={() => setPaused((v) => !v)}>{paused ? 'Reanudar' : 'Pausar'}</SceneButton>
            <SceneButton onClick={restart}>Reiniciar</SceneButton>
            <SceneButton onClick={() => setGuided((v) => !v)}>Vista guiada</SceneButton>
          </span>
        )}
      </figcaption>

      {interactive && guided && (
        <p role="status" className="font-mono text-xs text-primary" aria-live="polite">
          {step + 1} de {GUIDED_STEPS.length} · {GUIDED_STEPS[step].label}: {GUIDED_STEPS[step].detail}
        </p>
      )}
    </figure>
  )
}

function SceneButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-border/80 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </button>
  )
}
