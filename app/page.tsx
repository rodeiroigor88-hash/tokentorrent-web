import { Hero } from '@/components/home/hero'
import { ValueProps } from '@/components/home/value-props'
import { NetworkBand } from '@/components/home/network-band'
import { CtaSection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <NetworkBand />
      <CtaSection />
    </>
  )
}
