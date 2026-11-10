# Integración ECC — frontend Draxen

Estado: integración terminada. Root realiza QA renderizada y evidencia.

## Entregado
- Dirección editorial crema/tinta/lima, navegación desktop y menú móvil, hero fotografía local, cápsulas de colección, footer y catálogo de 32 variantes.
- Filtros por género, grupo Anime/Rock/Memes, prenda, talla y texto; orden de precio/nombre y paginación incremental; estado vacío recuperable.
- Personalizador con cuatro cortes de prendas, ocho diseños reutilizables, XS–XXL, tres colores con fotos locales reales, frente/espalda y escala70–130. Precio camiseta29.90/buzo49.90 incluye estampado.
- Borrador persistido validado, fichaJSON y export PNG con utilidad mockup de root.
- Bolsa por variantKey (prenda/diseño/talla/color/posición/escala). Cantidad1–20 y máximo30 combinaciones; schema localStorage validado y precio recalculado desde catálogo. Error de almacenamiento visible sin perder selección de sesión.
- Envío real POST /api/solicitudes con contacto y notas. Error de red conserva bolsa. Receipt solo después respuesta exitosa real. Snapshot retira únicamente cantidades enviadas. No pagos ficticios ni stock inventado.
- Página de producto local reaprovecha personalizador. Login/register/admin/pedidos se conservan. Root actualizó auth.

## Scope modificado
frontend/src/App.jsx, components/Navbar.jsx, Icon.jsx, Footer.jsx, GarmentPreview.jsx, ProductCard.jsx, pages/Home.jsx, ProductoDetalle.jsx, Personalizador.jsx, Carrito.jsx, context/CarritoContext.jsx, utils/download.js, index.css.

## Verificación
npm run build --prefix frontend PASS (Vite4.5.14,56módulos). Node requiere ejecución fuera del sandbox por EPERM de realpath sobre perfil Windows. Root inspecciona screenshots1440x900/390x844 y flujo real solicitud.

## Límites
Mockups y tabla de tallas orientativos, producción/envío/disponibilidad requieren confirmación. Assets de color/front/back generados por root. Solicitudes se guardan en servidor local; no envían correo/WhatsApp, ni procesan pagos. Panel legacy conserva backendMySQL original y no administra catálogo local de muestra.
