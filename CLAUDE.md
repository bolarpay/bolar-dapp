@AGENTS.md

# bolar-dapp

Dapp Next.js que autentica usuarios y mueve USDC en Stellar a través de [Pollar](https://docs.pollar.xyz) (`@pollar/react` 0.11.x). Hoy es el quickstart de Pollar montado sobre el scaffold de `create-next-app`. No hay rutas extra, API routes ni estado propio.

## Stack

- Next.js 16.3 (App Router), React 19, TypeScript estricto
- Tailwind CSS 4 (`@import "tailwindcss"` en `app/globals.css`, tokens en `@theme`)
- ESLint 9 con `eslint-config-next` (flat config en `eslint.config.mjs`)
- Alias `@/*` → raíz del repo
- Gestor: pnpm (`pnpm-lock.yaml`, `pnpm-workspace.yaml`). Existe también `package-lock.json` heredado; no mezclar instaladores.

Scripts: `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`. Chequeo de tipos: `pnpm exec tsc --noEmit`.

## Layout

```
app/layout.tsx    # root layout (Server Component), fuentes Geist, metadata
app/page.tsx      # carga pollar-app con next/dynamic { ssr: false }
app/pollar-app.tsx # PollarProvider + UI: login Google y pago USDC (solo cliente)
app/globals.css   # Tailwind 4 y colores claro/oscuro
next.config.ts    # vacío
.env.example      # plantilla de variables; copiar a .env
cursor.md         # misma guía para Cursor; mantener en sincronía
```

`PollarProvider` vive en `app/pollar-app.tsx`, no en el layout. Se carga con `ssr: false` porque `PollarClient` usa APIs del navegador y avisa si se construye en el servidor. Cualquier componente nuevo que cree el cliente debe cargarse igual.

## Variables de entorno

| Variable | Dónde se usa | Notas |
|---|---|---|
| `NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY` | `app/pollar-app.tsx` → `PollarProvider client.apiKey` | `pub_testnet_…` o `pub_mainnet_…`. Se inlinea en el bundle del cliente en build. |
| `NEXT_PUBLIC_USDC_ISSUER` | `app/pollar-app.tsx` → `asset.issuer` del pago | Emisor USDC de Circle. Testnet `GBBD47IF…FLA5`, mainnet `GA5ZSEJY…KZVN` (valores completos en `.env.example`). Debe coincidir con la red de la key. |
| `NEXT_PUBLIC_PAYMENT_DESTINATION` | `app/pollar-app.tsx` → `destination` del pago | Cuenta `G…` receptora. Debe existir y tener trustline a USDC con ese issuer. |
| `BACKEND_POLLAR_KEY` | nada todavía | Clave `sec_…`. Solo servidor (Route Handlers / Server Actions). Nunca con prefijo `NEXT_PUBLIC_`. |

- Solo las variables con prefijo `NEXT_PUBLIC_` llegan al navegador. En un Client Component, `process.env.OTRA_COSA` es `undefined`.
- Los valores `NEXT_PUBLIC_` se congelan al hacer `next build` / al arrancar `next dev`. Tras editar `.env`, reiniciar el servidor.
- `.env*` está en `.gitignore` salvo `.env.example`. No commitear claves.
- Registrar `http://localhost:3000` en el dashboard de Pollar (Build > Domains) o la API rechaza el origen antes del login.

## Estado actual

- `runTx('payment', …)` toma `destination` e `issuer` de las variables de entorno; el botón de pago se deshabilita si falta alguna.
- La metadata del layout sigue siendo la de create-next-app.
- `body` usa Arial; Geist ya está cargada como `--font-geist-sans` / `--font-geist-mono`.

## Cómo extenderlo

- Next.js 16 no coincide con APIs antiguas. Antes de escribir código de framework, leer la guía en `node_modules/next/dist/docs/`. `AGENTS.md` lo regenera `next dev`; no borrarlo.
- Dejar `app/layout.tsx` como Server Component. `PollarProvider` ya es client; puede vivir en un wrapper cliente. Quien llame `usePollar()` necesita `'use client'`.
- Instanciar el cliente una sola vez. La prop `client` queda fijada en el primer render; cambiarla después no hace nada.
- `login()` devuelve `void`. La UI sale de `isAuthenticated`, `wallet` y el estado de auth, no del valor de retorno.
- Para un pago nativo usar `asset: { type: 'native' }`. USDC es `credit_alphanum4` con `code` e `issuer` reales. Importes en string (`'10.00'`).
- `runTx` es el atajo de construir, firmar y enviar. Para el modal paso a paso: `buildTx` y luego `signAndSubmitTx`.
- Un balance `null` significa que la cadena no respondió. No pintarlo como `0`.
- En funding `DEFERRED`, la dirección existe antes que la cuenta on-chain. Comprobar `wallet.existsOnStellar` antes de operar.
- El patrocinio de fees lo decide el dashboard. El cliente solo puede excluirse con `skipSponsorship: true`.
- Importar `@pollar/react/styles.css` si se usan los modales o `WalletButton`.
- Mantener `stellarNetwork` alineado con el prefijo de la key. Por defecto el SDK usa `testnet`.

## Convenciones

- Componentes funcionales y hooks. Lógica de Pollar en componentes cliente pequeños; el layout y la metadata se quedan en el servidor.
- Estilos con utilidades de Tailwind 4 y los tokens de `globals.css`. No añadir otro sistema de CSS.
- TypeScript estricto. Tipos de Pollar salen de `@pollar/react` y `@pollar/core`; no hace falta `@types`.
- No inventar endpoints de Horizon ni firmar con un keypair local. Firma, custodia y sponsorship pasan por el SDK.
