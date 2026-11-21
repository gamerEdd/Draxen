# Metal Slug: reparación y nuevo drop

Se recrearon ocho archivos ausentes y se añadieron diez estampados nuevos mediante la herramienta integrada image_gen. Hay 30 diseños Metal Slug en Videojuegos y 181 estampados totales.

Galería pública: https://sigue-me.com/metal-slug/
ZIP de los diez nuevos PNG transparentes: https://sigue-me.com/downloads/metal-slug-nuevos.zip
Personalizador: https://sigue-me.com/personalizar?design=metal-slug-neo-marco

Fuentes PNG: frontend/public/assets/designs/. Los diez nuevos usan metal-slug-neo-*.png. Las ocho reparaciones se consumen como metal-slug-*-restored.png para evitar respuestas 404 anteriores en la caché de Cloudflare. Los originales generados también se conservan. El token de túnel no permite purgar caché; no se ampliaron sus permisos.

Se decodificaron los 181 diseños completos con sharp: cero errores, resolución mínima 512 px y transparencia real. Las 13 pruebas de catálogo, solicitudes y precios pasan. El backend público reconoce los diez diseños nuevos, verificado con una solicitud inválida por talla que no guarda datos.

Registro reproducible de la generación: neo-generation.json y prompts.md. Para volver a validar: node scripts/auditar-imagenes.mjs. Para regenerar la galería desde el catálogo: node scripts/preparar-metal-slug.mjs. La regeneración artística utiliza image_gen; estos scripts solo validan y preparan archivos.

