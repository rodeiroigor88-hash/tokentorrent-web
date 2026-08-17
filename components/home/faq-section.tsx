import { Reveal } from '@/components/site/reveal'

const FAQS = [
  {
    q: '¿Qué datos atraviesan los nodos?',
    a: 'Tu petición (el texto que escribes) y los estados intermedios del modelo, cifrados entre un nodo y el siguiente. Cada nodo solo ve el tramo que le toca ejecutar, no el texto completo ni la conversación entera.',
  },
  {
    q: '¿Es privado?',
    a: 'El tráfico viaja cifrado y el tracker no ve el contenido de tus peticiones. Aun así, la privacidad frente a un nodo malicioso es un área en desarrollo: hoy la red prioriza integridad y autenticidad, no confidencialidad total. No envíes datos sensibles a una red en fase temprana.',
  },
  {
    q: '¿Es seguro?',
    a: 'Cada nodo se identifica con su propio certificado (mTLS) y demuestra con Proof of Compute que ejecuta de verdad las capas que aloja. El enrutamiento firmado impide que un nodo reenvíe tráfico fuera de la ruta autorizada. Como todo software en desarrollo, no está exento de riesgo.',
  },
  {
    q: '¿Es fiable?',
    a: 'Depende de que haya nodos disponibles con las capas necesarias. Si un nodo cae, el tracker recalcula la ruta con el resto del enjambre; pero si la red es pequeña y no hay alternativa, la inferencia puede fallar. Cuantos más nodos, más resistente.',
  },
  {
    q: '¿Cuánto cuesta?',
    a: 'Unirse, aportar cómputo y ejecutar inferencias es gratis: el software es de código abierto. Quien aporta asume el consumo eléctrico de su equipo, y decide cuánta CPU y RAM cede.',
  },
]

const LIMITATIONS = [
  'Versión en desarrollo (v1): la API y el protocolo pueden cambiar, y no está pensado para producción crítica.',
  'Modelos compatibles: el pipeline se prueba con modelos de referencia pequeños; la compatibilidad con modelos grandes está en desarrollo.',
  'Requisitos de hardware: para aportar basta un equipo con Python y recursos libres de CPU/RAM; no se exige GPU, aunque el modelo determine lo que cabe en cada nodo.',
  'Sistema operativo: el nodo por terminal funciona en cualquier sistema con Python; la aplicación de escritorio es solo para Windows.',
  'Latencia esperada: depende del número y la calidad de los nodos y de tu conexión. En una red pequeña será más lenta que un servidor dedicado.',
  'Dependencia de nodos: si no hay nodos disponibles con las capas que necesita tu petición, la inferencia no podrá completarse.',
]

export function FaqSection() {
  return (
    <section aria-labelledby="faq-heading" className="border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[0.9fr_1.1fr] md:py-24">
        <Reveal className="flex flex-col gap-5">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Preguntas frecuentes</p>
          <h2 id="faq-heading" className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Lo que conviene saber antes de entrar
          </h2>
          <p className="max-w-md leading-relaxed text-muted-foreground text-pretty">
            Privacidad, seguridad, fiabilidad, costes y qué datos circulan por los nodos — respondido de forma directa,
            sin esconder las limitaciones actuales.
          </p>

          <div className="mt-4 rounded-2xl border border-border bg-card/60 p-6">
            <h3 className="text-base font-semibold tracking-tight">¿Qué significa «sin servidor central»?</h3>
            <dl className="mt-4 flex flex-col gap-4 text-sm">
              <div>
                <dt className="font-medium text-foreground">Coordinación</dt>
                <dd className="mt-1 leading-relaxed text-muted-foreground">
                  Un servicio ligero (el tracker) mantiene el inventario de nodos y calcula rutas. No ejecuta ni
                  almacena el modelo.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Descubrimiento de nodos</dt>
                <dd className="mt-1 leading-relaxed text-muted-foreground">
                  Los nodos se anuncian al tracker y se encuentran entre sí para pasarse las capas.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Ejecución del modelo</dt>
                <dd className="mt-1 leading-relaxed text-muted-foreground">
                  Ocurre en los propios nodos, en cadena. Ningún servidor central tiene el modelo completo.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Privacidad de los datos</dt>
                <dd className="mt-1 leading-relaxed text-muted-foreground">
                  El tráfico va cifrado entre nodos; el tracker ve quién está disponible, no el contenido de tus
                  peticiones.
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>

        <div className="flex flex-col gap-8">
          <Reveal>
            <h3 className="text-lg font-semibold tracking-tight">Preguntas frecuentes</h3>
            <div className="mt-4 flex flex-col gap-2">
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-border bg-card/60 open:border-primary/40"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="text-muted-foreground transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground text-pretty">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h3 className="text-lg font-semibold tracking-tight">Limitaciones actuales</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {LIMITATIONS.map((l) => (
                <li
                  key={l}
                  className="flex items-start gap-3 rounded-xl border border-border bg-background px-5 py-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  {l}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
