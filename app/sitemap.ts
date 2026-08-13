import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.tokentorrent.es'

/**
 * Sitemap generado en build. Refleja las rutas estaticas que hoy tiene la
 * app; anade una entrada por cada nueva pagina que se sume bajo `app/`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const paths: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency']; priority: number }> = [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/caracteristicas', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/seguridad', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/descargar', changeFrequency: 'weekly', priority: 0.9 },
  ]
  return paths.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
