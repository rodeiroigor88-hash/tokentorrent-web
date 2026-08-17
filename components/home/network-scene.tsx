'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Escena de red ligera dibujada en un <canvas> con proyección en perspectiva,
 * sin WebGL ni dependencias extra: nodos (ordenadores) conectados entre sí y
 * paquetes/capas que viajan por las aristas, con pulsos de color turquesa.
 *
 * Pensada para reforzar "capas + nodos + tokens" sin competir con el titular:
 *  - Renderiza solo cuando el bloque es visible (IntersectionObserver).
 *  - Respeta `prefers-reduced-motion` dibujando un fotograma estático.
 *  - Ofrece leyenda y descripción textual para lectores de pantalla.
 *  - En modo interactivo añade controles: pausar, reiniciar, rotar (arrastre)
 *    y una vista guiada que explica el recorrido de la petición.
 */

type Vec3 = { x: number; y: number; z: number }
type Node3 = Vec3
type Edge = [number, number]
type Packet = { edge: number; speed: number; phase: number; kind: 'capa' | 'token' }

// PRNG determinista para que el grafo no cambie entre montajes ni hidrataciones.
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildGraph() {
  const rand = mulberry32(1337)
  const nodes: Node3[] = []
  const COUNT = 14
  for (let i = 0; i < COUNT; i++) {
    const theta = rand() * Math.PI * 2
    const phi = Math.acos(2 * rand() - 1)
    // Esfera ligeramente achatada en Y para que ocupe bien un marco apaisado.
    nodes.push({
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta) * 0.72,
      z: Math.cos(phi),
    })
  }

  const edges: Edge[] = []
  const seen = new Set<string>()
  for (let i = 0; i < COUNT; i++) {
    const dists = nodes
      .map((n, j) => ({ j, d: (n.x - nodes[i].x) ** 2 + (n.y - nodes[i].y) ** 2 + (n.z - nodes[i].z) ** 2 }))
      .filter((e) => e.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
    for (const { j } of dists) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (!seen.has(key)) {
        seen.add(key)
        edges.push(i < j ? [i, j] : [j, i])
      }
    }
  }

  const packets: Packet[] = edges.map((_, i) => ({
    edge: i,
    speed: 0.18 + rand() * 0.16,
    phase: rand(),
    kind: i % 3 === 0 ? 'capa' : 'token',
  }))

  return { nodes, edges, packets }
}

type Projected = { x: number; y: number; scale: number; z: number }

function rotateY(v: Vec3, cos: number, sin: number): Vec3 {
  return { x: v.x * cos + v.z * sin, y: v.y, z: -v.x * sin + v.z * cos }
}

function project(v: Vec3, w: number, h: number, scale: number): Projected {
  const perspective = 2.4
  const f = perspective / (perspective + v.z)
  return {
    x: w / 2 + v.x * scale * f,
    y: h / 2 + v.y * scale * f,
    scale: f,
    z: v.z,
  }
}

const GUIDED_STEPS = [
  { label: 'Solicitud', detail: 'Tu petición entra a la red' },
  { label: 'Capas repartidas', detail: 'Cada nodo aloja una parte del modelo' },
  { label: 'Ejecución en cadena', detail: 'Los nodos ejecutan y se pasan el resultado' },
  { label: 'Respuesta', detail: 'El último token vuelve a ti' },
]

type Props = {
  label: string
  description: string
  interactive?: boolean
  className?: string
}

export function NetworkScene({ label, description, interactive = false, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [paused, setPaused] = useState(false)
  const [guided, setGuided] = useState(false)
  const [step, setStep] = useState(0)

  const rotationRef = useRef(0)
  const pausedRef = useRef(false)
  const guidedRef = useRef(false)
  const stepRef = useRef(0)
  const dragRef = useRef<{ x: number; y: number; rotation: number } | null>(null)
  const resetFlagRef = useRef(false)

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
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const graph = buildGraph()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let running = false
    let visible = false
    let lastT = performance.now()
    let width = 0
    let height = 0
    let dpr = 1

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
    }

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000)
      lastT = now

      if (resetFlagRef.current) {
        rotationRef.current = 0
        resetFlagRef.current = false
      }
      if (!pausedRef.current && !reduceMotion && !dragRef.current) {
        rotationRef.current += dt * 0.22
      }

      const cos = Math.cos(rotationRef.current)
      const sin = Math.sin(rotationRef.current)
      const scale = Math.min(width, height) * 0.42

      ctx.clearRect(0, 0, width, height)

      const projected = graph.nodes.map((n) => project(rotateY(n, cos, sin), width, height, scale))

      // Aristas ordenadas por profundidad (lejanas primero, más tenues).
      const edgeDraw = graph.edges
        .map(([a, b], i) => {
          const pa = projected[a]
          const pb = projected[b]
          return { a: pa, b: pb, i, depth: (pa.z + pb.z) / 2 }
        })
        .sort((x, y) => x.depth - y.depth)

      ctx.lineCap = 'round'
      for (const e of edgeDraw) {
        const alpha = 0.16 + Math.max(0, (1 - e.depth) / 2) * 0.35
        ctx.strokeStyle = `oklch(0.63 0.01 245 / ${alpha.toFixed(3)})`
        ctx.lineWidth = Math.max(0.5, e.a.scale * 1.1)
        ctx.beginPath()
        ctx.moveTo(e.a.x, e.a.y)
        ctx.lineTo(e.b.x, e.b.y)
        ctx.stroke()
      }

      // Paquetes (capas/tokens) viajando por las aristas.
      const tBase = pausedRef.current ? 0 : now / 1000
      for (const p of graph.packets) {
        const [ia, ib] = graph.edges[p.edge]
        const t = (p.phase + tBase * p.speed) % 1
        const a = rotateY(graph.nodes[ia], cos, sin)
        const b = rotateY(graph.nodes[ib], cos, sin)
        const pos = project(
          { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t },
          width,
          height,
          scale,
        )
        const r = pos.scale * (p.kind === 'capa' ? 3.4 : 1.7)
        ctx.fillStyle = 'oklch(0.85 0.13 192)'
        ctx.globalAlpha = 0.55 + 0.45 * Math.sin(Math.PI * t)
        if (p.kind === 'capa') {
          roundRect(ctx, pos.x - r, pos.y - r * 0.7, r * 2, r * 1.4, r * 0.4)
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }

      // Nodos: esferas con anillo de pulso.
      for (let i = 0; i < graph.nodes.length; i++) {
        const n = projected[i]
        const r = n.scale * 3.2
        const pulse = reduceMotion ? 0 : (Math.sin(now / 900 + i * 1.7) + 1) / 2
        ctx.strokeStyle = `oklch(0.85 0.13 192 / ${(0.22 + pulse * 0.14).toFixed(3)})`
        ctx.lineWidth = Math.max(0.6, n.scale * 0.8)
        ctx.beginPath()
        ctx.arc(n.x, n.y, r + 3 + pulse * 3, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = 'oklch(0.17 0.013 250)'
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = 'oklch(0.85 0.13 192)'
        ctx.lineWidth = Math.max(0.8, n.scale * 1.1)
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Vista guiada: resalta el nodo que ilustra la fase actual.
      if (guidedRef.current) {
        const guidIndex = [0, 5, 9, 13][stepRef.current % GUIDED_STEPS.length] ?? 0
        const target = projected[guidIndex]
        ctx.strokeStyle = 'oklch(0.85 0.13 192 / 0.85)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(target.x, target.y, target.scale * 6.5, 0, Math.PI * 2)
        ctx.stroke()
      }

      if (running && visible) raf = requestAnimationFrame(draw)
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

    if (reduceMotion) {
      draw(0)
      running = false
    }

    return () => {
      running = false
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    if (!guided) return
    const id = setInterval(() => setStep((s) => (s + 1) % GUIDED_STEPS.length), 2200)
    return () => clearInterval(id)
  }, [guided])

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!interactive) return
      dragRef.current = { x: e.clientX, y: e.clientY, rotation: rotationRef.current }
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [interactive],
  )
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const drag = dragRef.current
      if (!drag) return
      const dx = e.clientX - drag.x
      rotationRef.current = drag.rotation + dx * 0.006
    },
    [],
  )
  const onPointerUp = useCallback(() => {
    dragRef.current = null
  }, [])

  const restart = useCallback(() => {
    resetFlagRef.current = true
    setGuided(false)
    setStep(0)
  }, [])

  return (
    <figure className={`flex flex-col gap-4 ${className}`}>
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden rounded-2xl border border-border bg-background ${
          interactive ? 'cursor-grab touch-none active:cursor-grabbing' : 'pointer-events-none'
        }`}
        style={{ aspectRatio: '4 / 3' }}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={label}
          className="h-full w-full"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        <p className="sr-only">{description}</p>
      </div>

      <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" /> nodo
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-1.5 rounded-[2px] bg-primary" /> capa del modelo
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary/60" /> token
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

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
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
