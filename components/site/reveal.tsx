'use client'

import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

type RevealProps = {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article'
}

/** Entrada fluida con fade + elevación sutil garantizada en carga y scroll. */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(timer)
  }, [])

  if (shouldReduceMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Tag
      style={{
        transitionDelay: `${delay}s`,
      }}
      className={`transition-all duration-700 ease-[cubic-bezier(0.21,0.47,0.32,0.98)] ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${className}`}
    >
      {children}
    </Tag>
  )
}

/** Contenedor de stagger para secuencias de entrada. */
export function Stagger({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export function StaggerItem({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <Reveal delay={delay} className={className}>
      {children}
    </Reveal>
  )
}
