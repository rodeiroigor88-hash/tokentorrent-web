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
    title: 'Pipeline en enjambre',
    body: 'Las capas del modelo se reparten entre los nodos y se ejecutan en cadena. Si un nodo cae, el tracker recalcula la ruta con el resto del enjambre.',
    tag: 'core',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    title: 'TLS / mTLS',
    body: 'PKI propia del enjambre: la identidad de un nodo es su certificado, no su dirección IP.',
    tag: 'seguridad',
    span: '',
  },
  {
    title: 'Proof of Compute',
    body: 'Un reto firmado verifica que un nodo ejecuta realmente las capas que dice alojar, no que simula la respuesta.',
    tag: 'verificación',
    span: '',
  },
  {
    title: 'Código abierto',
    body: 'Protocolo completo en Python, auditable en GitHub. Licencia Apache 2.0.',
    tag: 'dev',
    span: 'md:col-span-2',
  },
  {
    title: 'Control de recursos',
    body: 'Decide cuánta CPU y RAM donas al enjambre, y a partir de qué carga tu nodo se pausa automáticamente.',
    tag: 'QoS',
    span: '',
  },
  {
    title: 'Enrutamiento firmado',
    body: 'El camino del pipeline viaja firmado dentro de cada petición, para evitar que el enjambre se use como puente hacia terceros.',
    tag: 'red',
    span: '',
  },
]

export function BentoGrid() {
  return (
    <ul className="grid gap-4 md:grid-cols-3" role="list">
      {CELLS.map((cell, i) => (
        <motion.li
          key={cell.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
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
