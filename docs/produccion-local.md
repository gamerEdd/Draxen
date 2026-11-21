# Ejecutar la tienda en producción local

## Inicio automático silencioso en Windows

Ejecutar `INICIAR_DRAXEN.bat` una vez y aceptar el permiso de administrador de Windows. Registra la tarea `Draxen-Produccion` como SYSTEM al encender el equipo, incluso antes de iniciar sesión; también la inicia de inmediato y habilita la regla de red local descrita abajo. Requiere Node instalado y `frontend/dist` ya compilado. No recompila en cada encendido.

El supervisor funciona sin ventanas, comprueba `/health` y la página principal cada 30 segundos y reinicia su propio servidor si falla. Si otro proceso ocupa el puerto y no responde correctamente, registra el conflicto sin terminarlo. Un servidor que ya responde correctamente se mantiene funcionando. No comprueba operaciones de MySQL ni conectividad desde otro dispositivo.

Estado: `backend/data/supervisor/estado.json` (`activo`, fecha de comprobación y puerto). Diagnóstico: `servidor.log` y `errores.log` en esa misma carpeta, sobrescritos al reiniciar el servidor. No hay notificaciones de funcionamiento.

Para detenerlo, desde PowerShell administrador: `Stop-ScheduledTask -TaskName Draxen-Produccion`. Para impedir siguientes arranques: `Unregister-ScheduledTask -TaskName Draxen-Produccion -Confirm:$false`. Al detener la tarea, comprobar también el proceso Node indicado en `estado.json`, porque Windows puede terminar el supervisor sin ejecutar su limpieza. Eliminar la tarea no elimina la regla de firewall.

Desde la carpeta principal, con Node.js y las dependencias instaladas:

```powershell
npm run prod
```

Compila React y sirve la tienda y la API con Express, sin Vite ni nodemon, en `0.0.0.0:8080`. Para arrancar una compilación existente: `npm start`. Detener: `Ctrl+C`. Después de cambiar código: detener y ejecutar `npm run prod` otra vez.

En este equipo: http://localhost:8080. Desde otro dispositivo del mismo Wi-Fi: http://192.168.1.23:8080 (IP detectada el 11 de noviembre de 2026; puede cambiar). Mantener el equipo encendido y el proceso en ejecución. Esta configuración no publica la tienda en Internet ni instala un servicio de arranque automático.

Si Windows bloquea la conexión, abrir PowerShell **como administrador** y ejecutar una vez:

```powershell
& 'C:\Users\eddgt\Documents\GitHub\Draxen\scripts\permitir-red-local.ps1'
```

La regla solo acepta conexiones desde la subred local al puerto TCP 8080. Incluye perfiles públicos porque el Wi-Fi actual está clasificado como público. Para quitarla: `Remove-NetFirewallRule -Name Draxen-LAN-8080` desde PowerShell administrador. No abrir puertos en el router. Una red de invitados con aislamiento entre clientes puede impedir el acceso.

La API usa `/api` en el mismo origen; no configurar `VITE_API_URL` con localhost para otros dispositivos. Desarrollo: `npm run dev`, puerto 3000, con proxy al backend 5000. Producción carga `backend/.env`; las cuentas y la administración requieren MySQL configurado. El catálogo, la personalización y las solicitudes locales no requieren MySQL. Respaldar `backend/data/solicitudes`, donde se guardan las solicitudes.

Comprobación realizada por la IP LAN: inicio, ruta de producto, PNG y health responden 200; API inexistente devuelve 404 JSON y la validación de solicitudes funciona. La regla de firewall no pudo aplicarse automáticamente porque Windows exige permisos de administrador. Falta verificar la conexión desde otro dispositivo después de habilitarla.
