<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Colaboración con el equipo BOLAR

- Este proyecto es `bolarpay/bolar-dapp`. Mantener el laboratorio `bolar-pay-testnet-dapp` separado; no trasladar aquí sus contratos, simulaciones ni resultados de pruebas como si fueran avances de este repositorio.
- Explicar en español, con lenguaje claro para un equipo que está aprendiendo. Al tomar decisiones, explicar qué problema resuelven y por qué encajan en el código existente.
- Organizar avances por etapas y conservar este formato para reportes: qué se hizo, por qué, cómo se verificó, qué falta y siguiente paso. Incluir enlaces a archivos relevantes y distinguir cambios locales, commits y publicación remota cuando corresponda.
- Usar `docs/guia-de-trabajo-bolar.md` como referencia del formato y la planificación. Su inventario es una fotografía fechada, no una garantía del estado futuro; revisar código y Git antes de actualizarlo.
- Separar evidencia del código, pruebas ejecutadas y relatos del equipo. No afirmar que una integración, KYC, depósito o remesa completa funciona solo porque existe un botón o una pantalla.
- No asumir mainnet o testnet por el nombre del repositorio o el dominio. Verificar la configuración pertinente antes de probar movimientos; no exponer credenciales en documentación o respuestas.
