import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article'
}

/**
 * Entrada fluida con fade + elevacion sutil.
 *
 * La animacion es CSS pura (`.tt-reveal` en app/globals.css) y arranca en el
 * primer pintado, sin depender de que React hidrate.
 *
 * La version anterior guardaba un estado `mounted` que empezaba en false, asi
 * que el HTML del servidor salia con `opacity-0` y el contenido solo se
 * revelaba desde un useEffect. Si el JS tardaba, se ejecutaba en una pestana
 * en segundo plano o fallaba, el contenido quedaba invisible de forma
 * permanente: se midio opacidad 0 en /descargar y 0.179 en la portada.
 *
 * Al ser CSS, `prefers-reduced-motion` se resuelve en la hoja de estilos y ya
 * no hace falta el hook de framer-motion aqui.
 */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }: RevealProps) {
  return (
    <Tag className={`tt-reveal ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </Tag>
  )
}

/** Contenedor de stagger para secuencias de entrada. */
export function Stagger({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export function StaggerItem({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <Reveal delay={delay} className={className}>
      {children}
    </Reveal>
  )
}
