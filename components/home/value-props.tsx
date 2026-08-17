import { Reveal } from '@/components/site/reveal'

const PROPS = [
  {
    title: 'Peer-to-peer real',
    body: 'Las capas del modelo viajan directamente entre los nodos del enjambre. No hay un servidor central que lo ejecute todo ni un único punto de fallo.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="4" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="4" r="2.2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="2.2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 9l8-4M6 11l8 4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Identidad verificable',
    body: 'Cada nodo tiene un certificado propio (TLS/mTLS) y demuestra con Proof of Compute que ejecuta de verdad las capas que dice alojar.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M11 2L4 11h5l-1 7 7-9h-5l1-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Código abierto',
    body: 'El protocolo está publicado en GitHub bajo licencia Apache 2.0. La aplicación de escritorio sigue en desarrollo.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="4" y="9" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
]

export function ValueProps() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-4 px-6 py-20 md:grid-cols-3 md:gap-6">
        {PROPS.map((p, i) => (
          <Reveal
            key={p.title}
            delay={i * 0.08}
            className="rounded-[1.75rem] border border-border/70 bg-card/60 p-6 shadow-sm shadow-black/10"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              {p.icon}
            </div>
            <h2 className="mt-5 text-lg font-semibold tracking-tight">{p.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">{p.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
