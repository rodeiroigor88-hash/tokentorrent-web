'use server'

export type WaitlistState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Sanitiza el input: recorta, limita longitud y elimina caracteres de control/HTML. */
function sanitizeEmail(raw: string): string {
  return raw
    .trim()
    .slice(0, 254)
    .replace(/[<>"'`\\\u0000-\u001f]/g, '')
    .toLowerCase()
}

export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const raw = formData.get('email')

  if (typeof raw !== 'string' || raw.length === 0) {
    return { status: 'error', message: 'Introduce tu correo electrónico.' }
  }

  const email = sanitizeEmail(raw)

  if (!EMAIL_RE.test(email)) {
    return { status: 'error', message: 'Ese correo no parece válido. Revísalo e inténtalo de nuevo.' }
  }

  // Honeypot anti-bots: si el campo oculto viene relleno, es un bot.
  if (typeof formData.get('website') === 'string' && (formData.get('website') as string).length > 0) {
    return { status: 'success', message: 'Estás en la lista. Te avisaremos en el lanzamiento.' }
  }

  // TODO: persistir en base de datos (p. ej. Neon) cuando se conecte la integración.
  console.log('[v0] Nueva alta en lista de espera:', email)

  return { status: 'success', message: 'Estás en la lista. Te avisaremos en el lanzamiento.' }
}
