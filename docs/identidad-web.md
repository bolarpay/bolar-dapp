# Identidad de BOLAR en la web

Actualización: 28 de octubre de 2026. Repositorio: `bolarpay/bolar-dapp`.

## Qué se corrigió y por qué

- `app/favicon.ico`: sustituye el icono inicial de Next.js por el avión original de BOLAR, con versiones de 16, 32, 48 y 256 píxeles.
- `app/icon.svg`: versión vectorial para navegadores compatibles. Conserva la forma del símbolo y los colores originales (`#00C544` y `#011E24`).
- `app/apple-icon.png`: versión de 180 × 180 para dispositivos Apple.
- `app/opengraph-image.png` y su texto alternativo: imagen de 1200 × 630 para compartir enlaces. Se compuso a partir del logo vectorial existente, sin añadir promesas sobre pagos o tiempos.
- `app/layout.tsx`: nombre BOLAR, títulos coherentes, URL base `https://bolar.lat`, Open Graph y tarjeta social grande. Next.js genera las etiquetas de iconos e imagen a partir de sus convenciones de archivos; no se duplican manualmente.
- El pie de página reemplaza Routeflow y los teléfonos, direcciones y correo de ejemplo por BOLAR, enlaces a la calculadora, acceso y repositorio. WhatsApp reutiliza `NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER`; si no existe un número válido, se informa que el canal estará disponible pronto.

## Alcance

Cambios de identidad y presentación. No se modificaron autenticación, KYC, operaciones de Bridge ni movimientos de fondos. El número de soporte sigue dependiendo de la configuración del equipo; no se inventaron datos de contacto.

## Verificación

Se inspeccionaron visualmente el icono móvil y la tarjeta social. TypeScript y ESLint se ejecutaron sin errores; ESLint conserva una advertencia previa por `name` sin uso en `qr-image.tsx`. La compilación de producción (`npm run build`) y las siete pruebas existentes pasaron. Se inspeccionó el HTML generado de `/` y `/acceso`: títulos BOLAR, iconos ICO/SVG/Apple, Open Graph y Twitter con URL absoluta e imagen 1200 × 630. Se verificaron las cuatro resoluciones internas del ICO y la ausencia de los datos de Routeflow en ambas páginas. La compilación dentro del sandbox no avanzó y se interrumpió; la ejecución autorizada fuera del sandbox terminó correctamente.

Los navegadores y aplicaciones de mensajería pueden conservar en caché el icono o la vista previa anterior incluso después del despliegue. La versión SVG y la imagen social reciben URLs generadas por Next.js; el favicon clásico también se reemplazó para quienes consultan directamente `/favicon.ico`.
