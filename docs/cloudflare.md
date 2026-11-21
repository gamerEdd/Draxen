# Publicar esta PC en sigue-me.com

El dominio permanece registrado y se renueva en Squarespace. Cloudflare gestiona DNS y el tunel; Draxen y MySQL siguen en la PC, puerto HTTP 8080. No abrir puertos del router ni publicar MySQL.

1. En Cloudflare agrega sigue-me.com como dominio y selecciona el plan Free. Revisa los registros importados; conserva MX y TXT de correo y otros servicios.
2. Copia los dos servidores de nombres asignados a este dominio. En Squarespace > Dominios > sigue-me.com > DNS / configuracion avanzada > Servidores de nombres, selecciona servidores personalizados y sustituye los actuales por los dos de Cloudflare. Si DNSSEC esta habilitado, desactivalo antes del cambio. No transfieras el registro del dominio.
3. Espera a que Cloudflare indique Activo.
4. Abre Redes / Networking > Tuneles, o Cloudflare One > Redes > Conectores > Cloudflare Tunnels. Crea un tunel cloudflared llamado DRAXEN-PC y selecciona Windows, 64 bits.
5. Ejecuta CONECTAR_CLOUDFLARE.bat y acepta el aviso de administrador. Pega SOLO el token que aparece al final del comando cloudflared.exe service install TOKEN. La entrada es oculta. No compartas el token ni lo guardes en Git.
6. Espera que el tunel aparezca Healthy / En buen estado. Agrega una ruta de aplicacion publicada: subdominio vacio, dominio sigue-me.com, ruta vacia, servicio HTTP y URL 127.0.0.1:8080. No uses HTTPS hacia el servidor local.
7. Agrega otra ruta con subdominio www y los mismos ajustes si deseas www.sigue-me.com.
8. Si hay un conflicto DNS, sustituye solo los registros web A/AAAA/CNAME del nombre exacto que usaras para el tunel; conserva los MX y TXT.
9. Verifica https://sigue-me.com y https://sigue-me.com/health desde datos moviles, ademas del catalogo y personalizador.

El instalador configura cloudflared como servicio automatico de Windows, sin ventana y con recuperacion al fallar. No reemplaza servicios existentes ni cambia DNS. Draxen y MySQL deben arrancar tambien; PC encendida, conectada y sin suspension para disponibilidad continua.

Cuando el nuevo dominio funcione, se puede detener y deshabilitar Draxen-Ngrok en el Programador de tareas. Mantener ngrok hasta verificar Cloudflare evita perder el acceso durante la migracion.

Fuentes:
- https://developers.cloudflare.com/tunnel/get-started/
- https://developers.cloudflare.com/dns/nameservers/update-nameservers/
- https://support.squarespace.com/hc/en-us/articles/4404183898125-Review-change-or-reset-your-domain-s-nameservers

## Conexión activa

Dominio: https://sigue-me.com y https://www.sigue-me.com.
Túnel exclusivo: SIGUE-ME-PC. La configuración local privada está en tools/cloudflared/draxen.yml y utiliza sigue-me-credentials.json. El conector se conecta a HTTP 127.0.0.1:8080. Los dos registros web usan CNAME con proxy al túnel. Se verificaron portada, personalizador y salud del backend por HTTPS público.

Para iniciar la tienda y el conector con supervisión: powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/iniciar-sigue-me.ps1. La tienda debe permanecer encendida y conectada; el inicio automático de usuario funciona al iniciar sesión, no antes.
