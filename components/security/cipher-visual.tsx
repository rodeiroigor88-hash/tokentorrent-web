'use client'

import { useEffect, useState } from 'react'

const CHARS = '0123456789abcdef'
const PLAIN = 'forward hidden_states -> nodo:7f3a'

function scramble(progress: number) {
  return PLAIN.split('')
    .map((ch, i) => {
      if (ch === ' ') return ' '
      if (i / PLAIN.length < progress) return CHARS[Math.floor(Math.random() * CHARS.length)]
      return ch
    })
    .join('')
}

/** Visualización de cifrado: texto plano que se convierte en hex progresivamente. */
export function CipherVisual() {
  const [text, setText] = useState(PLAIN)

  useEffect(() => {
    let progress = 0
    let direction = 1
    const id = setInterval(() => {
      progress += 0.04 * direction
      if (progress >= 1.3) direction = -1
      if (progress <= -0.3) direction = 1
      setText(scramble(Math.min(Math.max(progress, 0), 1)))
    }, 90)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-primary/60" />
        <p className="font-mono text-xs text-muted-foreground">worker.log</p>
      </div>
      <div className="flex flex-col gap-3 p-6 font-mono text-sm" aria-live="off">
        <p className="text-muted-foreground">{'>'} handshake mTLS con nodo:7f3a…</p>
        <p className="text-muted-foreground">{'>'} certificado verificado · canal establecido</p>
        <p className="text-primary" aria-label="Tensor cifrándose en tiempo real">
          {'>'} {text}
        </p>
        <p className="text-muted-foreground">{'>'} proof of compute: capas 8-15 [ok]</p>
      </div>
    </div>
  )
}
