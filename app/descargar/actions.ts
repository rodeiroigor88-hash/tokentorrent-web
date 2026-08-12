'use server'

export type WaitlistState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const CONTROL_CHARS_RE = /[\x00-\x1f]/g

/** Sanitiza el input: recorta, limita longitud y elimina caracteres de control/HTML. */
function sanitizeEmail(raw: string): string {
  return raw
    .trim()
    .slice(0, 254)
    .replace(CONTROL_CHARS_RE, '')
    .replace(/[<>"'`\\]/g, '')
    .toLowerCase()
}

/**
 * Persiste el email en Upstash Redis (integracion "Redis" de Vercel) via su
 * API REST, sin SDK y sin secretos en el codigo. Si las variables de entorno
 * no estan configuradas (desarrollo local sin la integracion), la alta no se
 * persiste y el formulario informa del fallo en vez de fingir exito.
 */
async function persistEmail(email: string): Promise<boolean> {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN

  if (!url || !token) {
    console.warn('[waitlist] KV_REST_API_URL / KV_REST_API_TOKEN no configuradas: alta no persistida.')
    return false
  }

  try {
    const response = await fetch(`${url}/sadd/waitlist:emails/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    return response.ok
  } catch (error) {
    console.error('[waitlist] Error al persistir el email:', error)
    return false
  }
}

export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const raw = formData.get('email')

  if (typeof raw !== 'string' || raw.length === 0) {
    return { status: 'error', message: 'Introduce tu correo electronico.' }
  }

  const email = sanitizeEmail(raw)

  if (!EMAIL_RE.test(email)) {
    return { status: 'error', message: 'Ese correo no parece valido. Revisalo e intentalo de nuevo.' }
  }

  // Honeypot anti-bots: si el campo oculto viene relleno, es un bot. Respondemos
  // exito sin persistir para no delatar la trampa.
  if (typeof formData.get('website') === 'string' && (formData.get('website') as string).length > 0) {
    return { status: 'success', message: 'Estas en la lista. Te avisaremos en el lanzamiento.' }
  }

  const persisted = await persistEmail(email)
  if (!persisted) {
    return {
      status: 'error',
      message: 'No se pudo guardar tu correo ahora mismo. Intentalo de nuevo en unos minutos.',
    }
  }

  return { status: 'success', message: 'Estas en la lista. Te avisaremos en el lanzamiento.' }
}
