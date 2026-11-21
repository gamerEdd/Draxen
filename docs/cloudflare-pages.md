# Publicar Draxen en Cloudflare Pages

Esta versión publica el catálogo, el detalle de productos, el personalizador, la bolsa guardada en el navegador y la descarga de selecciones. No requiere MySQL ni mantener tu computadora encendida.

## Conectar GitHub

1. Sube los cambios del proyecto a tu repositorio, incluyendo frontend/public/assets y shared.
2. En Cloudflare abre Workers & Pages > Create application > Pages > Connect to Git.
3. Selecciona el repositorio y la rama que quieras publicar.
4. Usa esta configuración:

| Campo | Valor |
| --- | --- |
| Directorio raíz | dejar vacío (raíz del repositorio) |
| Comando de compilación | npm ci --prefix frontend && npm run build:pages |
| Directorio de salida | frontend/dist |
| Variable NODE_VERSION | 22 |

La raíz del repositorio es necesaria porque el frontend importa módulos de shared. No publiques backend, archivos .env ni la raíz completa mediante carga manual.

5. Guarda y despliega. Cloudflare asignará una dirección como draxen.pages.dev, según disponibilidad.

## Compilar para carga manual

Desde la raíz ejecuta:

~~~sh
npm ci --prefix frontend
npm run build:pages
~~~

Sube únicamente el contenido de frontend/dist a un proyecto Pages de carga directa. Para este catálogo con muchas imágenes es preferible la integración con Git. No subas el código fuente como si fuera el sitio compilado.

## Funciones disponibles

El modo pages oculta los enlaces de cuenta y reemplaza el formulario de solicitudes por la descarga de selección. Las rutas de login y registro explican la disponibilidad; las rutas privadas siguen protegidas. Nunca se muestra una confirmación ficticia de pedido.

El servidor Express, MySQL y el almacenamiento de solicitudes en archivos no se ejecutan en Pages. Para habilitarlos con una API alojada por separado, configura VITE_API_ENABLED=true y VITE_API_URL=https://tu-api.example/api en Cloudflare y vuelve a desplegar. La API debe permitir el origen HTTPS del sitio mediante CORS y conservar los datos en almacenamiento persistente. Ninguna variable VITE_ puede contener secretos.

El comando npm run build habitual mantiene el despliegue con servidor local; npm run build:pages genera la versión pública. VITE_API_ENABLED=false también permite desactivar la API en otros modos.

frontend/public/_redirects conserva las rutas de React al entrar directamente o recargar /personalizar, /carrito y /producto/:id. Los archivos estáticos se sirven desde frontend/dist.

Documentación oficial:
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/configuration/serving-pages/
- https://developers.cloudflare.com/pages/platform/limits/
