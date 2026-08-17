import type { Metadata } from 'next'
import { Reveal } from '@/components/site/reveal'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacidad, términos y contacto',
  description:
    'Información legal de TokenTorrent: política de privacidad, términos de uso, política de cookies y datos de contacto.',
}

const SECTIONS = [
  {
    id: 'privacidad',
    title: 'Privacidad',
    body: (
      <>
        <p>
          Si te apuntas a la lista de espera, guardamos únicamente tu dirección de correo electrónico para avisarte del
          lanzamiento. No la vendemos ni la compartimos con terceros, y no la usamos para enviarte nada que no sea lo
          que pediste.
        </p>
        <p>
          El sitio puede registrar métricas agregadas de uso (visitas y rendimiento) mediante analítica web. No
          vinculamos esas métricas con tu correo.
        </p>
      </>
    ),
  },
  {
    id: 'terminos',
    title: 'Términos de uso',
    body: (
      <>
        <p>
          {SITE_NAME} es un proyecto de código abierto en desarrollo y se ofrece «tal cual», sin garantías de
          disponibilidad, rendimiento o adecuación a un fin concreto. El software se distribuye bajo la licencia Apache
          2.0; consulta el repositorio para los términos exactos.
        </p>
        <p>
          No utilices la red para enviar datos sensibles, personales o ilegales. Como proyecto en fase temprana, sus
          garantías de privacidad y seguridad son limitadas.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Política de cookies',
    body: (
      <>
        <p>
          Esta web no usa cookies de seguimiento propias. La analítica web puede emplear mecanismos equivalentes para
          medir visitas agregadas y rendimiento; no se usan para identificarte personalmente ni para publicidad.
        </p>
      </>
    ),
  },
  {
    id: 'contacto',
    title: 'Contacto',
    body: (
      <>
        <p>
          Para dudas, incidencias o colaboración, escríbenos a{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline-offset-4 hover:underline">
            {CONTACT_EMAIL}
          </a>
          . Las incidencias técnicas se gestionan mejor en el repositorio de código abierto.
        </p>
      </>
    ),
  },
]

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Breadcrumbs current="Legal" />

      <Reveal className="flex flex-col gap-4">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Legal</p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          Privacidad, términos y contacto
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
          Información clara sobre cómo tratamos tu correo, qué condiciones aplican y cómo ponerte en contacto con el
          proyecto.
        </p>
      </Reveal>

      <div className="mt-12 flex flex-col gap-10">
        {SECTIONS.map((s) => (
          <Reveal key={s.id}>
            <section id={s.id} aria-labelledby={`${s.id}-heading`} className="scroll-mt-24 border-t border-border pt-8">
              <h2 id={`${s.id}-heading`} className="text-xl font-semibold tracking-tight md:text-2xl">
                {s.title}
              </h2>
              <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                {s.body}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
