'use client'

import { useActionState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { joinWaitlist, type WaitlistState } from '@/app/descargar/actions'

const initialState: WaitlistState = { status: 'idle', message: '' }

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="waitlist-email" className="sr-only">
          Correo electrónico
        </label>
        <input
          id="waitlist-email"
          type="email"
          name="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="tu@correo.com"
          className="h-12 flex-1 rounded-full border border-input bg-card px-5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {/* Honeypot invisible para bots */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-medium tracking-tight text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {pending ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
              />
              Enviando…
            </>
          ) : (
            'Unirme a la lista'
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {state.status !== 'idle' && (
          <motion.p
            key={state.message}
            role="status"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-sm ${state.status === 'success' ? 'text-primary' : 'text-destructive'}`}
          >
            {state.message}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}
