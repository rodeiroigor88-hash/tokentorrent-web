'use client'

import { motion, useReducedMotion } from 'framer-motion'

type RevealProps = {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li'
}

/** Entrada con fade + desplazamiento sutil, activada al entrar en viewport con soporte para accesibilidad. */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()
  const Comp = motion[as]

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <Comp
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </Comp>
  )
}

/** Contenedor de stagger para secuencias de entrada. */
export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
