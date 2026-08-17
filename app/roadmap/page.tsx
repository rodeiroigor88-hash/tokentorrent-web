import type { Metadata } from 'next'
import { Reveal } from '@/components/site/reveal'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { PROTOCOL_VERSION, LAST_UPDATED, PROJECT_COMPONENTS, REPO_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Roadmap y estado del proyecto',
  description:
    'Estado actual de TokenTorrent: versión del protocolo, componentes publicados y próximos hitos. Un proyecto de código abierto en desarrollo.',
  openGraph: {
    title: 'Roadmap y estado del proyecto · TokenTorrent',
    description: 'Sigue el estado actual y los próximos hitos de TokenTorrent.',
  },
}

const MILESTONES = [
  {
    phase: 'Ahora',
    title: 'Núcleo del protocolo',
    body: 'Tracker, nodos worker y pipeline por capas en cadena sobre HTTP, con identidad mTLS y Proof of Compute. Publicado y en iteración continua.',
  },
  {
    phase: 'Próximo',
    title: 'Aplicación de escritorio para Windows',
    body: 'Instalador firmado para levantar un nodo sin tocar la terminal, con control visual de CPU y RAM donadas.',
  },
  {
    phase: 'Más adelante',
    title: 'Modelos grandes y más plataformas',
    body: 'Compatibilidad con modelos de mayor tamaño, más sistemas operativos y mejoras de privacidad frente a nodos maliciosos.',
  },
]

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Breadcrumbs current="Roadmap" />

      <Reveal className="flex flex-col gap-5">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Roadmap</p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          Estado del proyecto
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          TokenTorrent es un protocolo de código abierto en desarrollo. Aquí puedes ver qué está publicado, qué está en
          construcción y hacia dónde vamos — sin promesas de descarga que todavía no existen.
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          Protocolo {PROTOCOL_VERSION} · última actualización: {LAST_UPDATED}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {PROJECT_COMPONENTS.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.06} className="flex">
            <article className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-card/60 p-6">
              <span
                className={`w-fit rounded-full border px-3 py-1 font-mono text-[11px] ${
                  c.status === 'activo' ? 'border-primary/40 text-primary' : 'border-border text-muted-foreground'
                }`}
              >
                {c.status}
              </span>
              <h2 className="text-base font-semibold tracking-tight">{c.name}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {c.repo ? 'Publicado en el repositorio de código abierto.' : 'Aún no publicado.'}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-16">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Próximos hitos</h2>
        </Reveal>
        <div className="mt-8 flex flex-col">
          {MILESTONES.map((m, i) => (
            <Reveal key={m.phase} delay={i * 0.06}>
              <article className="grid gap-3 border-t border-border py-8 md:grid-cols-[140px_220px_1fr] md:gap-8 md:px-4">
                <p className="font-mono text-xs uppercase tracking-widest text-primary">{m.phase}</p>
                <h3 className="text-lg font-semibold tracking-tight">{m.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{m.body}</p>
              </article>
            </Reveal>
          ))}
          <div className="border-t border-border" />
        </div>
      </div>

      <Reveal className="mt-12">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
          ¿Quieres seguir el avance en detalle? El trabajo se planifica en público en el{' '}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary"
          >
            repositorio
          </a>
          .
        </p>
      </Reveal>
    </div>
  )
}
