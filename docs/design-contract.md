# DRAXEN — contrato de experiencia y diseño

Estado: análisis ECC completado; implementación y evidencia renderizada pendientes.

## Objetivo y evidencia del proyecto

La persona debe encontrar una camiseta o buzo por corte, talla y universo gráfico, ver el estampado aplicado y preparar una solicitud personalizada. La interfaz actual tiene una portada «FASE PENDIENTE», navegación sin adaptación móvil y URLs localhost en imágenes y API. Home depende de MySQL incluso para mostrar productos y no recupera errores de red. Las prendas del SQL solo se agrupan en ROCK/ANIME; no distinguen corte ni modelo. El carrito fusiona producto y talla sin distinguir diseño o color. Estas observaciones justifican el catálogo local inicial, la separación entre prenda y estampado y una navegación responsive.

## Dirección visual

Editorial streetwear: fondo crema #f3f1e9, texto tinta #171915, superficies blancas y acento lima #d5f261. Fotografías y mockups llevan el color de cada colección. Tipografía sans, titulares compactos de peso alto, etiquetas pequeñas con espaciado y precios legibles. Usar CSS variables y el stack React/Vite existente, sin dependencias decorativas nuevas. Evitar degradados genéricos y tarjetas excesivamente redondeadas. Detalle memorable: numeración de drops y una prenda grande con estampado aplicado, no imágenes de anime sueltas como sustituto del producto.

## Superficies y jerarquía

1. Cabecera: marca DRAXEN, Hombre, Mujer, Colecciones, Personaliza, buscar y bolsa. En móvil, menú accesible y bolsa siempre visibles.
2. Primer viewport: drop Gear 5 con prenda visible, texto breve y acciones «Explorar colección» y «Crear mi prenda». No bloquear el catálogo detrás de una portada de pantalla completa.
3. Accesos a hombre/mujer y camisetas/buzos; cápsulas Anime, Rock y Memes.
4. Catálogo con búsqueda, género/corte, tipo de prenda, colección, talla y orden de precio. Mostrar cantidad de resultados y limpiar filtros. Los filtros combinan condiciones; nunca son botones decorativos.
5. Producto: mockup grande, galería, diseño, precio, corte, color, tallas disponibles, guía de medidas y añadir a bolsa.
6. Personalizador: elegir prenda/corte, talla, color, diseño reutilizable y tamaño/posición del estampado si se implementan controles reales. Preview simultáneo. Resumen y precio actualizados. Guardar borrador, descargar propuesta y enviar solicitud mediante transporte real confirmado.
7. Bolsa: miniatura correspondiente a cada variante, datos de personalización, cantidad, eliminar, total y siguiente acción real.
8. Pie: cuidados, tallas y contacto solo si son datos configurados; no inventar testimonios, envíos gratuitos, stock ni garantías.

## Contrato de datos propuesto

```js
design = { id, name, collection, asset, tags: [], printRatio }
garment = { id, name, type: 'camiseta' | 'buzo', gender: 'hombre' | 'mujer', basePrice, colors: [], sizes: [], asset, printArea: { x, y, width, height } }
variant = { garmentId, designId, size, color, quantity, placement: 'frente', scale: 1 }
variantKey = [garmentId, designId, size, color, placement, scale].join(':')
request = { id, createdAt, variant, name, email, notes, status }
```

Guardar imágenes finales en frontend/public/assets, con nombres estables. El mismo design.asset debe usarse en cualquier modelo y en la preview. Usar capas de imagen sobre mockup o SVG compuesto exportable; mantener proporción y área imprimible por modelo. No duplicar cada estampado dentro de fotos independientes. Sembrar Luffy Gear 5/One Piece, Black Clover y Hunter x Hunter; sumar rock y memes con recursos reales disponibles. Nunca mostrar una miniatura que represente un diseño distinto al elegido.

LocalStorage sirve para borradores y bolsa; guardar versión de esquema, manejar JSON inválido y errores de cuota. Las imágenes se sirven desde archivos locales; no almacenar bitmaps completos innecesarios en localStorage. Persistir nombre de diseño, corte, color y talla para evitar perder contexto al recargar.

## Límites de integración

El backend actual solo acepta pedidos de productos y tallas de MySQL y recalcula el precio desde la tabla productos. Un catálogo local nuevo no puede enviarse a ese endpoint usando IDs ficticios. Las opciones válidas son extender y persistir catálogo/personalizaciones en backend, o tratar el flujo local como solicitud de cotización y enviarla a un endpoint dedicado. Descargar un archivo no equivale a enviar un pedido. Nunca confirmar recepción hasta obtener respuesta satisfactoria del transporte.

No existe pasarela de pago. No presentar «pago completado». El pedido actual carece de transacción y no comprueba resultado del decremento de stock; antes de vender debe corregirse validación de cantidades, asociación producto/talla y atomicidad. Las rutas de subida guardan en backend/fotos y devuelven /images, mientras server sirve /fotos: corregir si se usa esa subida. Configurar API por entorno y conservar login/admin existentes con errores recuperables.

## Estados verificables

| Estado | Disparador | Respuesta y recuperación |
| --- | --- | --- |
| Carga | Imagen o solicitud pendiente | Tamaño estable, indicador en acción y prevención de doble envío |
| Vacío | Filtros sin resultados o bolsa vacía | Mensaje útil con limpiar filtros o volver al catálogo |
| Error | Red, validación o persistencia fallida | Mensaje específico; conservar selección y permitir reintentar |
| Parcial | API no disponible, catálogo local presente | Mostrar productos locales y explicar el límite al tramitar; no spinner infinito |
| Éxito | Borrador guardado, bolsa actualizada o solicitud recibida | Confirmación aria-live y siguiente acción clara; recepción solo con respuesta real |
| Permiso | Ruta admin o cuenta requerida | Explicar acceso y enlazar inicio de sesión; catálogo y personalizador públicos |

## Criterios de aceptación y revisión

- Viewports objetivo: 390x844 y 1440x900. Capturar ambos con artefactos locales y observaciones reales.
- Sin scroll horizontal de página; texto, botones y precios no se solapan. Catálogo 2 columnas móvil y 4 escritorio si las etiquetas caben; filtros se apilan en móvil.
- Preview y controles del personalizador en dos columnas escritorio y una móvil. Acciones accesibles sin elementos fijos que cubran contenido.
- Navegar por teclado; foco visible, orden lógico, nombres accesibles en iconos, labels asociados y aria-pressed en selecciones. Color no es la única señal de talla/diseño activo.
- Objetivo táctil 44 px; mínimo 24 px. Contraste de texto normal 4.5:1. Respeto a prefers-reduced-motion.
- Cambiar género, prenda y talla; elegir el mismo diseño en camiseta y buzo; verificar preview y resumen correctos.
- Agregar dos colores o diseños de la misma talla; verificar líneas separadas y totales correctos.
- Guardar borrador, recargar, recuperar selección. Probar filtros vacíos, errores de red y envío fallido sin perder datos.
- Assets visibles sin acceder al backend. Ningún localhost hardcodeado en recursos nuevos.
- Compilación Vite satisfactoria y prueba de los flujos afectados. Registrar límites sin afirmar verificaciones no realizadas.

## Entrega de evidencia

El integrador debe registrar docs/design-evidence.json con contract, targetViewports, accessibility, responsive, contentStates y renderedEvidence, según ECC frontend-design-direction. El análisis de código no sustituye inspección renderizada. Este documento no declara aprobada la interfaz final.
