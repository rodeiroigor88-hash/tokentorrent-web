'use client'

import { motion } from 'framer-motion'

type Cell = {
  title: string
  body: string
  tag: string
  span: string
}

const CELLS: Cell[] = [
  {
    title: 'Transferencias en enjambre',
    body: 'Los activos se fragmentan y viajan por múltiples rutas simultáneas. Si un nodo cae, el resto completa la entrega sin que lo notes.',
    tag: 'core',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    title: 'Custodia propia',
    body: 'Claves generadas y almacenadas localmente con cifrado de hardware cuando está disponible.',
    tag: 'seguridad',
    span: '',
  },
  {
    title: 'Micropagos por streaming',
    body: 'Paga por segundo, por byte o por evento. Canales de pago que se abren y cierran al instante.',
    tag: 'pagos',
    span: '',
  },
  {
    title: 'API para desarrolladores',
    body: 'SDK en TypeScript, Rust y Python. Integra el enjambre en tu producto con tres líneas de código.',
    tag: 'dev',
    span: 'md:col-span-2',
  },
  {
    title: 'Historial verificable',
    body: 'Cada movimiento queda firmado y auditable. Exporta pruebas criptográficas cuando las necesites.',
    tag: 'auditoría',
    span: '',
  },
  {
    title: 'Multi-dispositivo',
    body: 'Sincroniza tu identidad entre móvil, escritorio y navegador sin exponer tus claves.',
    tag: 'sync',
    span: '',
  },
]

export function BentoGrid() {
  return (
    <ul className="grid gap-4 md:grid-cols-3" role="list">
      {CELLS.map((cell, i) => (
        <motion.li
          key={cell.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
          className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-colors duration-300 hover:border-primary/40 ${cell.span}`}
        >
          {/* Resplandor sutil al hacer hover */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: 'radial-gradient(420px circle at 30% 0%, oklch(0.85 0.13 192 / 8%), transparent 60%)' }}
          />
          <div className="relative flex h-full flex-col gap-4">
            <span className="w-fit rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
              {cell.tag}
            </span>
            <h2 className="text-xl font-semibold tracking-tight">{cell.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{cell.body}</p>
            <span
              aria-hidden="true"
              className="mt-auto inline-block translate-x-0 pt-2 font-mono text-xs text-primary opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
            >
              →
            </span>
          </div>
        </motion.li>
      ))}
    </ul>
  )
}
