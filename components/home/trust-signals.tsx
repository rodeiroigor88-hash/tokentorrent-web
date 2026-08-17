import { Reveal } from '@/components/site/reveal'
import { DOCS_URL, REPO_URL, LICENSE_URL, LICENSE_NAME, ISSUES_URL, PROTOCOL_VERSION, LAST_UPDATED } from '@/lib/site'

/**
 * Señales de confianza: enlaces visibles a documentación, repositorio,
 * roadmap, estado del proyecto y una explicación verificable de Proof of
 * Compute, para que el visitante pueda comprobar lo que la web afirma.
 */
const LINKS = [
  { href: DOCS_URL, label: 'Documentación técnica', external: true },
  { href: REPO_URL, label: 'Repositorio', external: true },
  { href: '/roadmap', label: 'Roadmap', external: false },
  { href: ISSUES_URL, label: 'Estado del proyecto', external: true },
] as const

export function TrustSignals() {
  return (
    <section aria-labelledby="trust-heading" className="border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:py-24">
        <Reveal className="flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Confianza</p>
          <h2 id="trust-heading" className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Nada que no puedas verificar
          </h2>
          <p className="max-w-md leading-relaxed text-muted-foreground text-pretty">
            El protocolo es de código abierto (licencia {LICENSE_NAME}). Puedes leer cómo funciona, revisar qué se ha
            implementado y seguir el avance del proyecto en público.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {l.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-card/60 p-7">
            <h3 className="text-lg font-semibold tracking-tight">Proof of Compute, en una frase</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
              Un nodo que dice alojar ciertas capas recibe un reto: ejecutarlas sobre una entrada de referencia y
              devolver un resultado firmado. Si la salida coincide con lo esperado, se verifica que realmente computó
              lo que afirma, en lugar de fingir la respuesta. La verificación es criptográfica y reproducible por
              cualquier participante.
            </p>
            <p className="mt-4 font-mono text-[11px] text-muted-foreground">
              Protocolo {PROTOCOL_VERSION} · última actualización de esta página: {LAST_UPDATED}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
