# tokentorrent-web

Sitio de marketing de [TokenTorrent](https://github.com/rodeiroigor88-hash/AI-Torrent-Protocol), un protocolo P2P de
código abierto que reparte las capas de un modelo de lenguaje entre varios ordenadores y las ejecuta en cadena sobre
HTTP. Igual que BitTorrent mueve bits, TokenTorrent mueve tokens.

Este repositorio **no contiene el protocolo P2P** (eso vive en
[AI-Torrent-Protocol](https://github.com/rodeiroigor88-hash/AI-Torrent-Protocol)) — es solo la web pública que lo
presenta y gestiona la lista de espera de la aplicación de escritorio para Windows.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- TypeScript, Tailwind CSS
- [Framer Motion](https://www.framer.com/motion/) para las animaciones
- Desplegado en [Vercel](https://vercel.com/)

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Otros comandos:

```bash
npm run build      # build de produccion
npm run lint       # ESLint
npm run typecheck  # solo comprobacion de tipos, sin emitir
```

## Variables de entorno

Copia `.env.local.example` a `.env.local`. La integracion actual es Redis (Upstash), usada por el
formulario de lista de espera en `app/descargar/actions.ts` y por el rate limit por IP en
`lib/rate-limit.ts` (INCR + EXPIRE NX, fail-open si Upstash cae). En Vercel se configuran desde
**Settings -> Environment Variables**, nunca committeadas al repo.

## Estructura

```
app/              paginas (App Router): inicio, caracteristicas, seguridad, descargar
components/       componentes por seccion (home, features, security, download, site, ui)
lib/              utilidades compartidas
public/           iconos y assets estaticos
```

## Contribuir

- El copy de la web describe el protocolo real (P2P, TLS/mTLS, Proof of Compute, enrutamiento firmado) — evita
  vocabulario de finanzas/cripto ("wallet", "custodia", "liquidacion", tickers de token) que no corresponde a lo que
  hace TokenTorrent.
- La app de escritorio es para **Windows**, no una app movil.
- Antes de abrir PR: `npm run lint && npm run typecheck && npm run build` deben pasar limpios.

## Licencia

Apache 2.0, igual que el protocolo.
