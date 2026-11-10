# Ampliación de estampados

Se añaden treinta ilustraciones individuales a los ocho diseños originales: diez Anime, diez Rock y diez Memes. Los PNG se guardan en `frontend/public/assets/designs/`. `manifest.json` registra los treinta recursos nuevos y su categoría.

Los diseños finales se registran en `shared/designs.mjs`, compartido por la tienda y la validación del servidor. Cada ilustración puede combinarse con los cuatro modelos existentes (camiseta/buzo, hombre/mujer): treinta diseños nuevos equivalen a 120 combinaciones adicionales, para 152 productos y 38 diseños en total.

El personalizador incluye búsqueda por nombre/serie, filtros por grupo, contador y biblioteca con desplazamiento y carga diferida. No se modifican los precios ni las promociones.

Comprobaciones: `node --test shared/designs.test.mjs shared/pricing.test.mjs backend/src/services/solicitudService.test.js` verifica archivos PNG locales, canal alfa, tamaño, duplicados, reparto diez por categoría y aceptación de cada diseño en los cuatro modelos.
