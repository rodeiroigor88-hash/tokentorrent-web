import type { MetadataRoute } from 'next'

// URL absoluta para poder construir `sitemap` de forma correcta desde build.
// Si en algun momento cambias el dominio principal, ajusta esta constante o
// pasa la URL por `NEXT_PUBLIC_SITE_URL` y leela desde aqui.
const SITE_URL = 'https://www.tokentorrent.es'

/**
 * `app/robots.ts` es una convencion de Next.js App Router: al build, Next
 * genera `/robots.txt` a partir de este export. Nada de fichero estatico
 * paralelo que se olvida de actualizar.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // No exponemos server actions por si en algun momento se sirven en
        // rutas propias; el resto de la web es publica por diseno.
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
