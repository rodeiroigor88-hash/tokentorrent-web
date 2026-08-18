import { Hero } from '@/components/home/hero'
import { ValueProps } from '@/components/home/value-props'
import { HomeOverview } from '@/components/home/home-overview'
import { NetworkBand } from '@/components/home/network-band'
import { CtaSection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <>
      <Hero />
      <NetworkBand />
      <ValueProps />
      <HomeOverview />
      <CtaSection />
    </>
  )
}
