# Colección Futurama

Diez diseños nuevos creados con la herramienta integrada image_gen, guardados como PNG con transparencia en `frontend/public/assets/designs/futurama-*.png`. Prompts finales y nombres en `docs/futurama-prompts.json`.

Bender, Fry, Leela, Zoidberg, Nibbler, el Profesor, Planet Express, Hypnotoad, Fry con Bender y Calculon. Cada diseño se puede utilizar en camisetas y buzos de hombre y mujer: 40 combinaciones nuevas. El catálogo completo contiene 50 diseños y 200 combinaciones.

Metadatos en `shared/designs.mjs`, compartidos por frontend y validación del servidor. Nueva pestaña Futurama en el catálogo y el personalizador; también se encuentran buscando Futurama o el nombre del personaje. Precios y promociones existentes conservados.

Para ejecutar la versión actualizada: `npm run prod` desde la raíz.

Verificación: compilación correcta y 11 pruebas aprobadas, incluidos archivos PNG únicos, canal alfa y validación de todos los diseños sobre los cuatro modelos. Los diez PNG y la ruta de producto respondieron HTTP 200 en producción; la API reconoce el diseño y rechaza una cantidad inválida. El navegador local no estuvo disponible en este chat, por lo que no se realizó revisión visual del sitio. El servidor temporal de comprobación se detuvo al finalizar.
