import { Hero } from '@/components/home/hero'
import { InferenceFlow } from '@/components/home/inference-flow'
import { UseCases } from '@/components/home/use-cases'
import { FaqSection } from '@/components/home/faq-section'
import { Glossary } from '@/components/home/glossary'
import { TrustSignals } from '@/components/home/trust-signals'
import { BentoGrid } from '@/components/features/bento-grid'
import { CipherVisual } from '@/components/security/cipher-visual'
import { SecurityLayers } from '@/components/security/security-layers'
import { ValueProps } from '@/components/home/value-props'
import { NetworkBand } from '@/components/home/network-band'
import { CtaSection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <>
      <Hero />
      <nav aria-label="En esta página" className="border-y border-border/60 bg-card/30">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          <span className="text-primary">Explora</span>
          <a href="#como-funciona" className="transition-colors hover:text-foreground">Cómo funciona</a>
          <a href="#capacidades" className="transition-colors hover:text-foreground">Capacidades</a>
          <a href="#seguridad" className="transition-colors hover:text-foreground">Seguridad</a>
          <a href="#preguntas" className="transition-colors hover:text-foreground">Preguntas</a>
        </div>
      </nav>
      <NetworkBand />
      <ValueProps />
      <section id="como-funciona" className="scroll-mt-24">
        <InferenceFlow />
        <UseCases />
      </section>
      <section id="capacidades" aria-labelledby="capabilities-heading" className="border-t border-border/60 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="mb-12 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">Capacidades</p>
            <h2 id="capabilities-heading" className="mt-4 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              Todo lo que mueve el torrente
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
              Una vista rápida de las piezas que hacen posible repartir, verificar y proteger la inferencia.
            </p>
          </div>
          <BentoGrid />
        </div>
      </section>
      <section id="seguridad" aria-labelledby="security-heading" className="border-t border-border/60 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid items-start gap-12 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-primary">Seguridad</p>
              <h2 id="security-heading" className="mt-4 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                Cifrado primero. Confianza después.
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                Cada nodo presenta su identidad, demuestra su cómputo y solo puede reenviar dentro de una ruta autorizada.
              </p>
              <div className="mt-8">
                <CipherVisual />
              </div>
            </div>
            <SecurityLayers />
          </div>
        </div>
      </section>
      <TrustSignals />
      <section id="preguntas" className="scroll-mt-24">
        <FaqSection />
      </section>
      <Glossary />
      <CtaSection />
    </>
  )
}
