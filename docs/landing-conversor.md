# Conversor, acceso y atención al cliente

## Cambios

La calculadora está disponible antes de iniciar sesión. El usuario elige importes y métodos, y pulsa **Continuar con Gmail** para abrir el acceso de Google mediante Pollar. Cuando la sesión está autenticada y verificada, se abre **Motivo de envío**. Para quien ya tiene sesión, el botón dice **Continuar**.

Se reutiliza el proveedor compartido de Pollar. El estado observado por React es el paso primitivo de autenticación, para conservar snapshots estables y evitar el bucle de renders que ocurría al observar objetos nuevos. Si Google no está habilitado o falla la configuración, se informa y se impide avanzar; no se simula una sesión exitosa.

Los métodos de pago son Pix/Efectivo y los de entrega QR/Efectivo. Las selecciones se conservan hasta el resumen. Entrega en efectivo no solicita una imagen QR; pago en efectivo no muestra un QR Pix. Esta selección todavía pertenece al recorrido demostrativo: no implementa sucursales, reservas, cobros ni desembolsos en efectivo.

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
5. Probar Pix/QR y las combinaciones mixtas. Cancelar el acceso, probar un error y volver a intentar.
6. Revisar escritorio, móvil, navegación con teclado y el destino del enlace WhatsApp. No es necesario enviar un mensaje para comprobar el enlace.

Rama preparada: `codex/landing-remittance-improvements`. El push requiere la confirmación de Jerson. No se modificó la lógica de ejecución de pagos del MVP.
