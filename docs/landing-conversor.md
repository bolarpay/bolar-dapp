# Conversor, acceso y atención al cliente

## Cambios

La calculadora está disponible antes de iniciar sesión. El usuario elige importes y métodos, y pulsa **Continuar con Gmail** para abrir el acceso de Google mediante Pollar. Cuando la sesión está autenticada y verificada, se abre **Motivo de envío**. Para quien ya tiene sesión, el botón dice **Continuar**.

Se reutiliza el proveedor compartido de Pollar. El estado observado por React es el paso primitivo de autenticación, para conservar snapshots estables y evitar el bucle de renders que ocurría al observar objetos nuevos. Si Google no está habilitado o falla la configuración, se informa y se impide avanzar; no se simula una sesión exitosa.

Los métodos de pago son Pix/Efectivo y los de entrega QR/Efectivo. Las selecciones se conservan hasta el resumen. En el paso Motivo de envío, el QR del destinatario es opcional: se requieren nombre, CI, motivo y banco para continuar con entrega por QR. Si se adjunta una imagen, se conserva la validación de formato y tamaño. Entrega en efectivo requiere nombre, CI y motivo, sin banco ni imagen QR; pago en efectivo no muestra un QR Pix. Esta selección todavía pertenece al recorrido demostrativo: no implementa sucursales, reservas, cobros ni desembolsos en efectivo.

## Tipo de cambio

Se consume `https://open.er-api.com/v6/latest/BRL` desde el navegador y se toma `rates.BOB`. El servicio de acceso abierto no requiere API key, actualiza sus datos diariamente y exige atribución. La calculadora muestra fuente, fecha y la aclaración de que es una referencia sin comisiones. [Documentación oficial](https://www.exchangerate-api.com/docs/free).

La respuesta se valida antes de usarla: moneda base BRL, resultado exitoso, tasa positiva y finita, y fecha aceptable. No se utiliza un valor fijo como respaldo si falla el servicio. La respuesta pública se guarda durante una hora en el navegador, con consultas simultáneas agrupadas y rechazo de datos con más de 48 horas. Se vuelve a consultar al regresar a la pestaña y cada hora. La caché no contiene información de usuario, importes ni destinatarios.

Los importes se calculan en centavos y se redondean al centavo más cercano. Al pulsar continuar, se conserva una copia de importes y métodos para que una actualización de tasa durante el login no cambie el envío mostrado. La tasa no es una oferta de Bridge/Pollar, no garantiza un pago final y no se usa para ejecutar el pago independiente de 10 USDC de desarrollo.

## WhatsApp

Configurar `NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER` en el entorno de la web con el código de país y el número del equipo. El ejemplo está en `.env.example`. Reiniciar desarrollo o reconstruir el despliegue después de cambiar una variable pública de Next.js.

Hasta tener un número válido, el botón aparece deshabilitado. El enlace abre `wa.me` con un saludo genérico; no adjunta datos del destinatario ni envía mensajes automáticamente. El número definitivo sigue pendiente de Jerson.

## Verificación

- `npm run lint`: aprobado.
- `npx next typegen` y `npx tsc --noEmit`: aprobados.
- `npm test`: siete pruebas aprobadas. Cubren conversión en ambas direcciones, límites, respuesta inválida, antigüedad de la tasa, caché/reintentos, almacenamiento bloqueado y URL de WhatsApp.
- Endpoint consultado con herramienta web: devolvió una respuesta BRL con tasa BOB. No equivale a una prueba de CORS o de funcionamiento en el navegador de la aplicación.
- Build estándar pendiente: `npm run build -- --webpack` no pudo descargar Inter/Open Sans por `ENOTFOUND fonts.googleapis.com` en el entorno de ejecución.
- Revisión visual y login real pendientes: el servidor local no pudo abrir el puerto por `EPERM`. No se ingresó a Google ni se realizaron pagos.

## Revisión manual antes del push

1. Iniciar la web con las variables de Pollar y WhatsApp del entorno que el equipo vaya a revisar.
2. Sin sesión: comprobar que la calculadora se muestra, carga una referencia con fecha y convierte al editar cualquiera de los importes.
3. Simular fallo de la petición de cambio: debe mostrar error y reintento sin inventar una tasa ni permitir continuar con ella.
4. Seleccionar Efectivo en ambos métodos, iniciar sesión con Gmail y comprobar que abre Motivo de envío sin solicitar QR. Revisar selecciones e importes en el resumen.
5. Probar Pix/QR y las combinaciones mixtas. En Motivo de envío, comprobar que nombre, CI, motivo y banco permiten avanzar sin adjuntar QR y que esos campos siguen siendo obligatorios. Repetir con una imagen válida y con una inválida. Cancelar el acceso, probar un error y volver a intentar.
6. Revisar escritorio, móvil, navegación con teclado y el destino del enlace WhatsApp. No es necesario enviar un mensaje para comprobar el enlace.

Rama preparada: `codex/landing-remittance-improvements`. El push requiere la confirmación de Jerson. No se modificó la lógica de ejecución de pagos del MVP.


## Ajustes de formulario y animaciones (8 de octubre de 2026)

Cambios locales en `codex/remittance-form-improvements`:

- Flechas verticales en los selectores Pix/QR y hover de botones en `#011E24`, el color de las letras del logo.
- Transición de 800 ms después de confirmar la sesión, antes de mostrar el paso 2. El acceso de Google conserva su duración real y no se omite su verificación. Cerrar la ventana cancela el temporizador.
- Ocho motivos de envío y trece bancos definidos en el componente `remittance-steps.tsx`. CI del destinatario requerido como texto, para admitir complementos; esta validación solo comprueba presencia, no identidad ni KYC. Banco obligatorio para entrega por QR, oculto para efectivo. El QR sigue siendo opcional.
- CI y banco se mantienen en memoria durante el formulario y se muestran en el resumen. No se envían a proveedores ni se guardan en almacenamiento del navegador.
- Loader adaptado del archivo `BOLAR-loader.html` del equipo, con su vector y animaciones CSS. En «Verificar y finalizar» se muestra un ciclo de 2,4 segundos antes del resumen demostrativo. Respeta movimiento reducido y no afirma que el dinero esté en camino. No hay nueva consulta bancaria ni verificación de depósitos.

Revisión manual de estos ajustes: avanzar con sesión y mediante Google, cerrar durante la transición y reabrir, comprobar los campos obligatorios sin QR, regresar al paso 2 conservando los datos, probar entrega en efectivo y finalizar la demostración. Revisar el modal con teclado y en móvil.

Verificación de esta etapa: ESLint, TypeScript y las siete pruebas existentes aprobadas. En navegador local se comprobó una vista temporal de los componentes con datos ficticios: transición antes del paso 2, validación de nombre vacío, avance sin QR con los nuevos campos, conservación de datos al regresar, animación final y resumen con CI/banco. También se comprobó efectivo sin banco/QR y el formulario a 390 px sin desbordamiento horizontal. La vista temporal se retiró. Estas pruebas no validan el login real de Google, KYC ni una remesa; el acceso real y la integración con proveedores siguen fuera de esta comprobación.


### Revisión de hover (9 de octubre de 2026)

Se conserva `--color-bolar-dark: #011E24`, tomado de las letras del SVG BOLAR (el avión usa otro verde, `#00C544`). Los botones principales ya lo utilizaban. Se completó el hover de Pollar —acceso, wallet, menú y controles de ventanas—, menú móvil, navegación del formulario, acciones de texto y botones del pie. Los controles deshabilitados conservan su estado; las acciones de peligro de Pollar conservan su señalización roja. Los estilos se aplican en la app sin modificar el paquete instalado. Solo se usa `!important` para superar los colores inline que Pollar asigna a su botón de wallet y al texto de su menú.

Verificación de hover: ESLint, TypeScript y diff sin errores. En navegador local se comprobó el hover real de «Login with Pollar», Google y Wallet: fondo `rgb(1, 30, 36)` y texto blanco. No se inició sesión ni se ejecutó ninguna operación de wallet. Los demás controles de Pollar se revisaron por sus selectores en la versión instalada; no se recorrieron todas las ventanas autenticadas. Cambios locales, pendientes de commit y push.
