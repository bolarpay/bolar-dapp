# Guía de trabajo y reportes de BOLAR

Repositorio: `bolarpay/bolar-dapp`. Revisión: 7 de octubre de 2026, rama `main`, commit base `436bd2a0d854359c7578d3fa67323e1394d4d459` (`add png banner`). Se confirmó mediante la API de GitHub que `main` remoto coincidía con esta base antes de publicar la documentación.

Esta guía conserva la forma de trabajo solicitada por Jerson: avanzar por etapas, explicar decisiones y acompañar cada resultado con evidencia. Se aplica al producto BOLAR y a su integración existente con Pollar. El laboratorio `bolar-pay-testnet-dapp` tiene su propio alcance y documentación.

## Formato de nuestras respuestas

Comenzar por el resultado principal y desarrollar los puntos que correspondan al trabajo realizado:

1. **Qué se hizo:** cambios concretos y enlaces a los archivos.
2. **Por qué:** problema que resuelve cada decisión y su relación con el MVP.
3. **Cómo se verificó:** comandos, pruebas manuales o evidencia observada; indicar explícitamente lo que no se ejecutó.
4. **Qué falta:** limitaciones, dependencias del proveedor y cuestiones sin confirmar.
5. **Siguiente paso:** una acción concreta y su resultado esperado.

Usar párrafos breves o listas cuando faciliten la lectura, sin forzar cinco apartados para una respuesta pequeña. Para compartir con el equipo o Notion, conservar las mismas distinciones. No convertir una propuesta en un avance realizado ni una prueba local en un despliegue confirmado. Mencionar rama, commit y push únicamente cuando sean relevantes y estén comprobados.

## Qué tenemos hoy según el código

| Parte | Evidencia local | Alcance comprobable por lectura |
|---|---|---|
| Stack web | `package.json` | Next.js 16.3.6, React 19.2.8, TypeScript, Tailwind CSS 4 y dependencia `@pollar/react` con rango `^0.11.3`. |
| Landing | `app/page.tsx`, `components/landing/`, `public/assets/landing/` | Componentes y recursos de la interfaz de BOLAR. |
| Autenticación | `app/providers.tsx`, `app/login-button.tsx`, `app/acceso/` | Integración con Pollar, verificación de sesión, reintentos y cierre de sesión. No equivale a aprobación KYC del proveedor. |
| Wallet | `components/landing/header-wallet.tsx`, `app/pollar-app.tsx` | Uso de `WalletButton` y presentación de la red reportada por Pollar en la página de acceso. |
| Calculadora | `lib/remittance-quote.ts` | Tasa ilustrativa de 1 BRL = 2,3 BOB; no es una cotización obtenida de un proveedor. |
| Recorrido de remesa | `components/remittance/remittance-steps.tsx` | Formulario, previsualización local de imagen, acceso y QR de demostración. No interpreta el QR ni verifica depósitos o entrega bancaria. |
| Pago de desarrollo | `app/pay-button.tsx` | Solicita un pago de 10 USDC mediante Pollar si hay sesión y configuración. Es independiente del recorrido de remesa; no se ejecutó en esta revisión. |
| Contratos propios | Árbol de archivos revisado | No se encontró un proyecto Rust/Soroban propio en este checkout. Los contratos del laboratorio no pertenecen a este repositorio. |

La prueba de Bridge/PIX comentada por Rafa y las pantallas del SDK son contexto del equipo. No bastan para declarar completo el envío Brasil → Bolivia ni para asegurar el estado actual de una transacción. No se revisaron secretos ni se hicieron pagos para elaborar esta guía.

## Estructura y evolución propuesta

Conservar `app/` para rutas y composición de Next.js, `components/landing/` para la presentación, `components/remittance/` para la experiencia del envío y `lib/` para utilidades. El proveedor compartido de Pollar ya está en `app/providers.tsx`; evitar duplicar instancias por pantalla.

Cuando integremos una operación real de remesa, separar sus reglas de los componentes visuales: cotización, destinatario, estado del depósito y estado del pago. Una interfaz pequeña para cada proveedor permitirá probar respuestas y cambiar una integración sin reescribir la landing. Esto es una evolución propuesta; todavía no afirmamos que exista una arquitectura completa de puertos y adaptadores aquí.

El motivo es mantener la identidad visual del producto y permitir que los estados de dinero sean verificables, en vez de depender de que el usuario pulse “finalizar”. No hace falta reorganizar todo el repositorio ni añadir microservicios para comenzar.

## Etapas del producto

| Etapa | Punto de partida | Resultado necesario para cerrarla |
|---|---|---|
| 1. Revisar la base | Landing, acceso y wallet implementados | Verificar versión acordada de main, navegación, sesión y diseño en escritorio/móvil; registrar resultados. |
| 2. Precisar la rampa de entrada | El equipo está probando Bridge mediante Pollar | Confirmar entorno, requisitos del remitente, estados y evidencia de la operación con el proveedor. |
| 3. Conectar la remesa | Recorrido propio actualmente demostrativo | Usar cotización e instrucciones reales de la integración acordada; diferenciar pendiente, confirmado, rechazado y resultado incierto. |
| 4. Registrar y conciliar | No hay persistencia propia de remesas en los archivos revisados | Conservar identificadores y estados, procesar reintentos sin duplicar operaciones y comprobar qué ocurrió cuando falla una respuesta. |
| 5. Completar la salida en Bolivia | No se encontró implementación propia en este checkout | Confirmar proveedor, datos requeridos, pago y comprobante de recepción del destinatario. |
| 6. Piloto y bootcamp | MVP en construcción | Documentar una operación completa autorizada, costos, tiempos y fallos; separar pruebas internas de clientes y métricas reales. |

Ninguna etapa se considera completada solo por tener una interfaz. Antes de probar operaciones con fondos, identificar el entorno y la acción concreta que el equipo autorizó.

## Prompts para continuar en este repositorio

**Revisión del estado:**

> Trabaja exclusivamente en bolar-dapp. Lee AGENTS.md y revisa rama, cambios locales y código relacionado. Explica qué está implementado, qué tiene evidencia de funcionamiento y qué falta para el siguiente tramo de remesa. No atribuyas resultados del repositorio testnet a este producto. No realices pagos durante la revisión.

**Implementación por etapa:**

> Implementa [resultado concreto] en bolar-dapp conservando la landing y la integración compartida de Pollar. Antes de editar Next.js lee las guías instaladas pertinentes. Explica el problema, la decisión y el criterio de aceptación. Separa estados de sesión, KYC, depósito y entrega. Si necesitas información del proveedor, identifica exactamente lo que falta; no inventes respuestas exitosas. Verifica el comportamiento y reporta pendientes.

**Reporte para el equipo o Notion:**

> Resume el avance de bolar-dapp con este formato: qué se hizo, por qué, cómo se verificó, qué falta y siguiente paso. Basa cada afirmación en código o evidencia de esta sesión. Distingue cambios locales, commits y despliegue. Explica términos nuevos con un ejemplo breve y no presentes la demostración visual como una remesa completada.

## Verificación de esta actualización documental

Se revisaron Git, dependencias declaradas y archivos de landing, autenticación, wallet y remesa. Solo se agregaron instrucciones y documentación, y se comprobó el diff. No se ejecutaron pruebas de aplicación, build, KYC ni transacciones. La base remota se verificó con el conector de GitHub porque el entorno no permitía escribir en `.git` para ejecutar fetch local. Los 16 tests reportados anteriormente pertenecían al laboratorio separado y no son evidencia de este repositorio.
