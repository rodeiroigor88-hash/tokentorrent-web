'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

type Props = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'ghost'
  size?: 'sm' | 'lg'
  className?: string
}

/** Botón con efecto magnético: se desplaza sutilmente hacia el cursor. */
export function MagneticButton({ href, children, variant = 'primary', size = 'lg', className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 })
  const sy = useSpring(y, { stiffness: 200, damping: 15 })

  function onMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35)
  }

  function onLeave() {
    x.set(0)
    y.set(0)
  }

  const base =
    variant === 'primary'
      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
      : 'border border-border bg-transparent text-foreground hover:bg-secondary'
  const sizing = size === 'sm' ? 'h-9 px-4 text-sm' : 'h-12 px-7 text-sm'

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x: sx, y: sy }} className="inline-block">
      <Link
        href={href}
        className={`group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors ${base} ${sizing} ${className}`}
      >
        {children}
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </motion.div>
  )
}
