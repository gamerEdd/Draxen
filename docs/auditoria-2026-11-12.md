# Auditoría de Draxen — 12 de noviembre de 2026

## Estado

Aplicación React 18 / Vite 4 con catálogo compartido y backend Express 4 / MySQL. La tienda local responde en el puerto 8080. La publicación solicitada es https://sigue-me.com mediante Cloudflare Tunnel, conservando el backend local.

La compilación de producción pasa. Genera aproximadamente 249 kB de JavaScript antes de compresión; convierte 171 imágenes PNG de 437 MB a unos 36 MB de WebP. Conserva también los PNG en dist, lo que aumenta el tamaño total de despliegue.

## Cambios aplicados

- Dependencias de producción del backend actualizadas con correcciones compatibles; override de qs a ^6.16.2 porque Express conserva una versión vulnerable. npm audit --omit=dev --prefix backend: cero vulnerabilidades.
- React Router actualizado dentro de la versión mayor 6. Persisten dos entradas moderadas del auditor que requieren una migración a la versión 7; no se forzó esa migración.
- Express confía en proxies de loopback para reconocer los clientes detrás del conector local. No se confía en cabeceras de clientes de la LAN.
- Cabeceras nosniff, DENY y Referrer-Policy; se oculta X-Powered-By.
- Los errores internos de producción devuelven un mensaje genérico, sin detalles internos.

Los cambios del backend requieren reiniciar el proceso activo para entrar en vigor.

## Hallazgos pendientes

1. **Alto: backend/.env está versionado.** .gitignore no elimina archivos ya incluidos en Git. Retirar el archivo del índice conservando la copia local, revisar el historial y rotar credenciales que hayan sido compartidas. No se imprimieron sus valores durante esta auditoría ni se modificó el índice del usuario.
2. **Alto: pedidos antiguos sin validación suficiente.** createPedido no exige cantidades enteras positivas y crea pedido, detalles y cambios de stock sin transacción. updateStock no verifica filas afectadas. Es posible producir pedidos parciales, stock inconsistente o importes incorrectos. El servicio nuevo de solicitudes es independiente y recalcula precios con validaciones.
3. **Medio: faltan ocho imágenes registradas.** metal-slug-drill, metal-slug-astro, metal-slug-marco-tank, metal-slug-fio-mechanic, metal-slug-prisoner, metal-slug-mars-people, metal-slug-supply y metal-slug-pixel-tank. La prueba de integridad del catálogo falla; compilación exitosa no garantiza imágenes completas.
4. **Medio: dependencias frontend.** Dos entradas moderadas de producción en React Router tras actualizar dentro de la versión 6. Las dependencias de desarrollo también presentan avisos y Vite 4 requiere un plan de actualización.
5. **Medio: autenticación y exposición.** JWT en localStorage, CORS abierto y ausencia de límite de intentos en login. Revisar credenciales de demostración documentadas antes de aceptar cuentas reales. No se verificó el estado de la cuenta de demostración en MySQL.
6. **Operación: repositorio voluminoso.** Más de 16.000 archivos de node_modules están versionados pese a .gitignore. Conviene retirarlos del índice en un cambio separado y usar npm ci.
7. **Disponibilidad.** El túnel depende de esta PC, MySQL cuando se usan cuentas y pedidos antiguos, conectividad y ausencia de suspensión. No hay una verificación completa de recuperación tras reinicio.

## Verificaciones

- node --test shared/pricing.test.mjs backend/src/services/solicitudService.test.js: 6/6 pasan.
- Suite compartida completa: 9/10 pasan; falla integridad por imágenes faltantes.
- npm run build: pasa también después de actualizar React Router; 171 imágenes convertidas a WebP.
- node --check backend/src/server.js: pasa.
- Servidor temporal corregido en loopback: /health, / y /personalizar devuelven 200; /api/no-existe devuelve 404; cabecera nosniff presente.
- No se realizaron pagos, pedidos reales ni pruebas con datos de clientes.

## Cloudflare

Dominio único del proyecto: https://sigue-me.com. Zona activa en Cloudflare, cuenta 8fd4ec6c65efcde0d7a75db29c083de6. Credencial activa exclusiva del dominio correcto. Túnel SIGUE-ME-PC (b352dc5c-49e2-4ae2-bdaf-26d9b51a99de). No usar comandos de DNS sin comprobar la zona autorizada.

Verificación pública completada: https://sigue-me.com/, /personalizar, /health y https://www.sigue-me.com/ responden con HTTP 200. Los registros web raíz y www son CNAME con proxy al túnel. Inicio automático de usuario instalado y verificado: supervisores de tienda y túnel activos. El supervisor marca activo=true. Se eliminó el túnel anterior del proyecto y su credencial local. Se corrigieron el bloqueo global de permisos y el uso de la variable reservada HOME en el supervisor. El acceso público depende de que la PC permanezca encendida y conectada.

Referencia técnica: https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/create-local-tunnel/



