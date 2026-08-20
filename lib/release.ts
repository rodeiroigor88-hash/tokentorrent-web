/**
 * Descarga dinámica: consulta la última *release* publicada en el repositorio
 * del protocolo y devuelve el instalador listo para enlazar.
 *
 * El binario NO vive en este repo (pesa cientos de MB y Vercel no es su sitio):
 * se aloja en GitHub Releases. Esta función lo resuelve en tiempo de servidor y
 * se revalida periódicamente, así que **publicar una nueva release enciende el
 * botón de descarga sin necesidad de redesplegar la web**.
 *
 * Mientras no haya release (o si GitHub falla), devuelve `available: false` y la
 * página cae con elegancia al estado de lista de espera.
 */

import { REPO_URL } from '@/lib/site'

/** `owner/repo` extraído de REPO_URL para construir la URL de la API. */
const REPO_SLUG = REPO_URL.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '')
const LATEST_RELEASE_API = `https://api.github.com/repos/${REPO_SLUG}/releases/latest`

/** Extensiones que consideramos "el instalador" descargable. */
const INSTALLER_RE = /\.(exe|msi|zip)$/i
/** Asset con los hashes de verificación. */
const CHECKSUMS_RE = /sha256|checksums/i

/** Cada cuánto se revalida la consulta a GitHub (segundos). */
const REVALIDATE_SECONDS = 600

export interface ReleaseInfo {
  available: boolean
  version?: string
  fileName?: string
  url?: string
  sizeMb?: number
  publishedAt?: string
  htmlUrl?: string
  /** SHA-256 del instalador, si la release publica un fichero de checksums. */
  sha256?: string | null
}

interface GithubAsset {
  name: string
  size: number
  browser_download_url: string
}

/** Cabeceras de la API de GitHub; usa un token opcional para subir el límite. */
function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  // 60 req/hora sin token es de sobra con revalidación de 10 min, pero si se
  // define GITHUB_TOKEN en Vercel se usa para no chocar con el límite por IP.
  const token = process.env.GITHUB_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

/** Busca el SHA-256 del instalador en el asset de checksums, si existe. */
async function resolveChecksum(
  assets: GithubAsset[],
  installerName: string,
): Promise<string | null> {
  const sums = assets.find((asset) => CHECKSUMS_RE.test(asset.name))
  if (!sums) return null
  try {
    const res = await fetch(sums.browser_download_url, {
      headers: { Accept: 'text/plain' },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return null
    const text = await res.text()
    // Formato estándar de `sha256sum`: "<hash>  <fichero>" (una línea por asset).
    for (const line of text.split('\n')) {
      const match = line.match(/([a-fA-F0-9]{64})\s+\*?(.+)/)
      if (match && match[2].trim() === installerName) return match[1].toLowerCase()
    }
    // Si el fichero de checksums cubre un único binario, aceptamos su hash.
    const single = text.trim().match(/^([a-fA-F0-9]{64})/)
    return single ? single[1].toLowerCase() : null
  } catch {
    return null
  }
}

export async function getLatestRelease(): Promise<ReleaseInfo> {
  try {
    const res = await fetch(LATEST_RELEASE_API, {
      headers: githubHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(4000),
    })
    // 404 = todavía no hay ninguna release publicada: estado normal, no un error.
    if (!res.ok) return { available: false }

    const data = await res.json()
    if (data?.draft) return { available: false }

    const assets: GithubAsset[] = Array.isArray(data.assets) ? data.assets : []
    const installer = assets.find((asset) => INSTALLER_RE.test(asset.name))
    if (!installer) return { available: false }

    return {
      available: true,
      version: typeof data.tag_name === 'string' ? data.tag_name : undefined,
      fileName: installer.name,
      url: installer.browser_download_url,
      sizeMb: Math.round((installer.size / 1_048_576) * 10) / 10,
      publishedAt: typeof data.published_at === 'string' ? data.published_at : undefined,
      htmlUrl: typeof data.html_url === 'string' ? data.html_url : undefined,
      sha256: await resolveChecksum(assets, installer.name),
    }
  } catch {
    // Fallo de red o de GitHub: degradar a "sin descarga", nunca romper la página.
    return { available: false }
  }
}
