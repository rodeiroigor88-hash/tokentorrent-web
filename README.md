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
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

Otros comandos:

```bash
pnpm build      # build de produccion
pnpm lint       # ESLint
pnpm typecheck  # solo comprobacion de tipos, sin emitir
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

## Estado público

La ruta `/estado` muestra las métricas públicas del enjambre y se actualiza automáticamente cada 15 segundos.
La portada enlaza a esta vista desde el diagrama de red.

El endpoint `GET /api/swarm` consulta `${TRACKER_API_URL}/status` con un timeout de 4 segundos y devuelve:

- `online` cuando hay nodos válidos visibles.
- `degraded` cuando el tracker responde sin nodos o incumple parcialmente el contrato.
- `offline` cuando no hay configuración local del tracker o no se puede consultar.

**`TRACKER_API_URL`** debe apuntar a la raíz del tracker que expone el inventario público del enjambre, sin barra final
(p. ej. `http://us-1.in.supercores.host:9007/ai-torrent`). La ruta la compone la propia app añadiendo `/status`, así
que **no incluyas `/status` ni `/health` en la variable**. Si `TRACKER_API_URL/status` responde 200 pero sin el array
`nodes` (por ejemplo porque apunta a un healthcheck), `/api/swarm` devuelve `degraded` con
`error: "El tracker no expone inventario en TRACKER_API_URL/status"`.

La web usa `/status` para monitorización. `/plan` queda reservado para negociar rutas de inferencia firmadas y necesita
un callback válido. Las respuestas inválidas no se convierten en cifras inventadas: los nodos malformados se descartan y los recursos sin
declarar cuentan como cero. El endpoint conserva una respuesta JSON estable para que la portada pueda mostrar un estado
degradado sin romperse durante una caída temporal.

Las respuestas con un enjambre válido permiten una caché compartida de 10 segundos y hasta 30 segundos de
revalidación en segundo plano. Las respuestas `offline` o de error se sirven con `no-store`, para no ocultar una caída
real detrás de una caché antigua.

## Contribuir

- El copy de la web describe el protocolo real (P2P, TLS/mTLS, Proof of Compute, enrutamiento firmado) — evita
  vocabulario de finanzas/cripto ("wallet", "custodia", "liquidacion", tickers de token) que no corresponde a lo que
  hace TokenTorrent.
- La app de escritorio es para **Windows**, no una app movil.
- Antes de abrir PR: `pnpm lint && pnpm typecheck && pnpm build` deben pasar limpios.

## Licencia

Apache 2.0, igual que el protocolo.
