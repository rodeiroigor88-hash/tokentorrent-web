import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  // `metadataBase` es el que Next.js usa para resolver URLs relativas en
  // `openGraph.images`, `twitter.images`, etc. Sin esto, las imagenes de
  // share salen sin dominio y algunos crawlers las descartan.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Inferencia de IA distribuida en enjambre`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  keywords: [
    'TokenTorrent',
    'IA distribuida',
    'inferencia P2P',
    'LLM',
    'peer-to-peer',
    'pipeline parallelism',
    'código abierto',
    'BitTorrent',
  ],
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Inferencia de IA distribuida en enjambre`,
    description: SITE_DESCRIPTION,
    images: [
      {
        // Next.js sirve `apple-icon.png` en `public/` como asset. Si mas
        // adelante generamos un OG dedicado (1200x630), sustituye aqui.
        url: '/apple-icon.png',
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Inferencia de IA distribuida en enjambre`,
    description: SITE_DESCRIPTION,
    images: ['/apple-icon.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0e1118',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`bg-background ${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased grain min-h-dvh flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}
