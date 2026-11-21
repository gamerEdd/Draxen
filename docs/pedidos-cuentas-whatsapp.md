# Cuentas, pedidos personalizados y WhatsApp

## Flujo

Se puede explorar el catálogo y editar sin sesión. Guardar o descargar una edición pide iniciar sesión y conserva el borrador para volver al editor. La bolsa conserva las prendas durante el acceso a la cuenta.

El cliente puede registrarse con nombre, correo y contraseña, o usar Google cuando esté configurado. Crear un pedido exige una sesión válida. El servidor toma nombre y correo de la cuenta y recalcula los importes con el catálogo y las promociones; no acepta precios enviados por el navegador.

La bolsa genera una imagen JPEG con todas las prendas y las dos caras cuando corresponda, y la guarda junto con la configuración en MySQL. El número de pedido es único. Los reintentos con el mismo identificador no crean otro pedido. Las imágenes solo están disponibles para el propietario y administradores autenticados.

En **Mi cuenta → Mis pedidos**, el cliente puede consultar la imagen y el historial, y editar prenda, estampado, talla, color, caras, tamaño, posición, cantidad, teléfono y notas mientras el pedido esté PENDIENTE. Cada edición recalcula el total y sustituye la imagen. Una revisión evita sobrescribir cambios desde otra pestaña. Los pedidos antiguos se conservan y pueden consultarse, pero no tienen automáticamente una imagen o configuración personalizable.

En **Admin → Gestionar pedidos** se cambia el estado y la guía de envío. Los estados son PENDIENTE, CONFIRMADO, ENVIADO, ENTREGADO y CANCELADO. El seguimiento es actualizado por Draxen; no consulta automáticamente una transportadora.

## Base de datos y ejecución

1. Instalar dependencias: `npm install --prefix backend` y `npm install --prefix frontend`.
2. Para una instalación nueva, importar `database/draxen_db.sql`. Para una existente, conservar su esquema y datos.
3. Configurar `backend/.env` usando `backend/.env.example`. No versionar credenciales.
4. Ejecutar `npm run migrate --prefix backend`. La migración aditiva se puede repetir: crea `usuario_google`, `pedido_diseno` y `pedido_historial` sin borrar tablas ni pedidos previos.
5. En desarrollo: `npm run dev`. Frontend en puerto 3000 y API en 5000. La API carga su `.env` independientemente del directorio desde el que se inicia.
6. Producción: `npm run build` y `npm start`. Mantener MySQL, HTTPS y copias de seguridad tanto de pedidos como de imágenes. El despliegue de Pages necesita una API externa con `VITE_API_ENABLED=true` y `VITE_API_URL` apuntando a esa API.

Las tablas usan InnoDB. Creación, edición y cambios de seguimiento se guardan en transacciones. Las imágenes se validan, decodifican y vuelven a codificar antes de almacenarlas. El límite de imagen enviada es 2 MB; JSON del pedido, 3 MB. Se limitan los intentos de acceso y escritura de pedidos. Los registros de errores omiten cuerpos, tokens y datos de contacto.

## Activar Google

1. En Google Cloud crear un cliente OAuth de tipo **Aplicación web** y configurar la pantalla de consentimiento.
2. Añadir los orígenes JavaScript reales: por ejemplo `http://localhost:3000`, `http://127.0.0.1:3000` para desarrollo y el dominio HTTPS definitivo para producción.
3. Poner el identificador público en `GOOGLE_CLIENT_ID` en `backend/.env` y reiniciar el servidor. No hace falta incluir un secreto OAuth en el frontend.
4. El botón oficial de Google aparece al consultar `/api/auth/google/config`. El servidor verifica firma, audiencia, emisor y expiración del ID token con `google-auth-library`, exige un correo verificado y asocia la identidad por `sub`.
5. Si ya existe una cuenta con el mismo correo, se exige su contraseña. No se enlazan automáticamente identidades diferentes por coincidencia de correo.

Sin cliente OAuth, el registro y acceso con correo funcionan y se informa que Google todavía no está disponible. La prueba real del proveedor queda pendiente hasta configurarlo.

Referencia: [verificación de ID tokens de Google](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).

## WhatsApp manual

Destino fijo: **0960665245**, Ecuador; enlace internacional **593960665245**.

El botón abre WhatsApp con nombre, correo, teléfono, número de pedido, prendas, total y notas. El cliente confirma el envío. Un enlace `wa.me` no adjunta el archivo automáticamente: **Compartir imagen y mensaje** utiliza el menú de compartir del dispositivo y el cliente selecciona el contacto. Si el dispositivo no admite compartir archivos, puede descargar la imagen y adjuntarla en el chat.

El pedido se guarda antes de abrir WhatsApp. Cancelar el envío no borra el pedido. Abrir o compartir no marca el pedido como enviado ni acredita la entrega del mensaje. Después de una edición se debe volver a compartir la imagen actualizada. No se integra WhatsApp Business API ni se envían mensajes automáticos.

Referencia: [Click to chat de WhatsApp](https://faq.whatsapp.com/5913398998672934).

## Verificación

- `npm test --prefix backend`: pruebas de validación y permisos; la prueba de integración se omite por defecto.
- En PowerShell, para una base local de pruebas configurada: `$env:RUN_DB_TESTS='1'; npm test --prefix backend`. Esta prueba crea usuarios y pedidos temporales y elimina exclusivamente esos registros al terminar. No ejecutar contra una base ajena o de producción sin autorización.
- `npm run build`: compilación completa y empaquetado de recursos.
- Google y el envío final a un contacto de WhatsApp requieren comprobación manual con sus cuentas reales. Las pruebas locales no envían mensajes a terceros.
