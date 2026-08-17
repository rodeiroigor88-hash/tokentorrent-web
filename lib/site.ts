/**
 * Configuración compartida del sitio: URLs, enlaces de confianza y metadatos
 * de proyecto. Centralizarlos aquí evita que la URL del repositorio, la
 * versión del protocolo o la fecha de última actualización diverjan entre el
 * header, el footer, el sitemap y las páginas.
 */

export const SITE_URL = 'https://www.tokentorrent.es'
export const SITE_NAME = 'TokenTorrent'
export const SITE_DESCRIPTION =
  'TokenTorrent reparte las capas de un modelo de lenguaje entre varios ordenadores y las ejecuta en cadena sobre HTTP. Igual que BitTorrent mueve bits, TokenTorrent mueve tokens. Código abierto, sin servidor central.'

/** Repositorio del protocolo P2P (la web vive en otro repo, ver README). */
export const REPO_URL = 'https://github.com/rodeiroigor88-hash/AI-Torrent-Protocol'
export const DOCS_URL = `${REPO_URL}#readme`
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`
export const LICENSE_NAME = 'Apache 2.0'
export const ISSUES_URL = `${REPO_URL}/issues`

export const CONTACT_EMAIL = 'hola@tokentorrent.es'

/**
 * Estado público del proyecto. Cambiar aquí propaga la versión y la fecha por
 * toda la web (footer, roadmap, descargar, etc.).
 */
export const PROTOCOL_VERSION = 'v1 (en desarrollo)'
export const LAST_UPDATED = '2026-08-17'

/**
 * Componentes del proyecto y su estado actual. Se usa para señalar con
 * honestidad qué está publicado y qué sigue en desarrollo.
 */
export const PROJECT_COMPONENTS = [
  { name: 'Protocolo P2P (tracker + nodos worker)', repo: true, status: 'en desarrollo' },
  { name: 'Aplicación de escritorio para Windows', repo: false, status: 'en desarrollo' },
  { name: 'Sitio web público', repo: true, status: 'activo' },
] as const

/** Rutas internas del sitio, para que la navegación y el sitemap no diverjan. */
export const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/caracteristicas', label: 'Características' },
  { href: '/seguridad', label: 'Seguridad' },
  { href: '/roadmap', label: 'Roadmap' },
] as const
