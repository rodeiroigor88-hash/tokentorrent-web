import { Hero } from '@/components/home/hero'
import { ValueProps } from '@/components/home/value-props'
import { InferenceFlow } from '@/components/home/inference-flow'
import { UseCases } from '@/components/home/use-cases'
import { NetworkBand } from '@/components/home/network-band'
import { TrustSignals } from '@/components/home/trust-signals'
import { Glossary } from '@/components/home/glossary'
import { FaqSection } from '@/components/home/faq-section'
import { CtaSection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <InferenceFlow />
      <UseCases />
      <NetworkBand />
      <TrustSignals />
      <Glossary />
      <FaqSection />
      <CtaSection />
    </>
  )
}
