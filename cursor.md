# bolar-dapp

Dapp Next.js que autentica usuarios y mueve USDC en Stellar a través de [Pollar](https://docs.pollar.xyz) (`@pollar/react` 0.11.x). Hoy es el quickstart de Pollar montado sobre el scaffold de `create-next-app`. No hay rutas, API routes ni estado propio.

## Stack

- Next.js 16.3 (App Router), React 19, TypeScript estricto
- Tailwind CSS 4 (`@import "tailwindcss"` en `app/globals.css`, tokens en `@theme`)
- ESLint 9 con `eslint-config-next` (flat config en `eslint.config.mjs`)
- Alias `@/*` → raíz del repo
- Gestor previsto: pnpm (`pnpm-lock.yaml`, `pnpm-workspace.yaml`). Existe también `package-lock.json`; no mezclar instaladores.

Scripts: `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`.

## Layout

```
app/layout.tsx    # root layout, fuentes Geist, metadata
app/page.tsx      # carga pollar-app con next/dynamic { ssr: false }
app/pollar-app.tsx # PollarProvider + UI: login Google y pago USDC (solo cliente)
app/pollar-login-modal.css # marco CSS del modal de login (openLoginModal), sobre @pollar/react/styles.css
app/globals.css   # Tailwind 4 y colores claro/oscuro
next.config.ts    # vacío
```

`PollarProvider` vive en `app/pollar-app.tsx`, cargado con `ssr: false` porque `PollarClient` usa APIs del navegador. No va en el layout.

## Estado actual

El flujo está cableado y los valores de red están vacíos a propósito:

- `PollarProvider` recibe `client={{ apiKey: process.env.NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY ?? '' }}`
- `runTx('payment', …)` toma `destination` de `NEXT_PUBLIC_PAYMENT_DESTINATION` e `issuer` de `NEXT_PUBLIC_USDC_ISSUER` (ver `.env.example`); el botón se deshabilita si falta alguna
- La metadata del layout sigue siendo la de create-next-app
- `body` usa Arial; Geist ya está cargada como `--font-geist-sans` / `--font-geist-mono`

No commitear claves. Publishable key en `NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY` (`pub_testnet_` o `pub_mainnet_`). Las `sec_*` no van al cliente. `.env*` ya está en `.gitignore` (salvo `.env.example`). Solo las variables `NEXT_PUBLIC_` llegan al navegador; reiniciar `pnpm dev` tras editar `.env`. Registrar `http://localhost:3000` en el dashboard (Build > Domains) o la API rechaza el origen antes del login.

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
