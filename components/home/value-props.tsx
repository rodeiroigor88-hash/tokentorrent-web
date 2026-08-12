import { Reveal } from '@/components/site/reveal'

const PROPS = [
  {
    title: 'Peer-to-peer real',
    body: 'Las capas del modelo viajan directamente entre los nodos del enjambre. Sin servidor central que las ejecute por ti ni pueda caerse.',
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
    body: 'Cada nodo del enjambre tiene un certificado propio (TLS/mTLS) y demuestra con Proof of Compute que realmente ejecuta las capas que dice alojar.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M11 2L4 11h5l-1 7 7-9h-5l1-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Código abierto',
    body: 'Todo el protocolo es auditable en GitHub. Se ejecuta en tu propio hardware, con licencia Apache 2.0.',
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
      <div className="mx-auto grid max-w-6xl gap-px overflow-hidden px-6 py-20 md:grid-cols-3 md:gap-10">
        {PROPS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.12} className="flex flex-col gap-4 py-6 md:py-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
              {p.icon}
            </span>
            <h2 className="text-lg font-semibold tracking-tight">{p.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{p.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
