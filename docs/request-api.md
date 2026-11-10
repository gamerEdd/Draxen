# Solicitudes de prendas

`POST /api/solicitudes` guarda una solicitud local; no cobra ni confirma disponibilidad, pago o envío. No depende de MySQL. Requiere backend encendido en puerto 5000.

```json
{
  "contact": {"name": "Ana", "email": "ana@example.com", "phone": ""},
  "items": [{"garmentId": "tee-women", "designId": "luffy", "size": "M", "color": "negro", "quantity": 1, "placement": "front", "printScale": 100}],
  "notes": "Consultar disponibilidad"
}
```

Nombre obligatorio (100 caracteres), correo o teléfono obligatorio. `items`: 1–30. Modelos: `tee-men`, `tee-women`, `hoodie-men`, `hoodie-women`. Diseños: los 40 identificadores registrados en `shared/designs.mjs`, incluidos los treinta nuevos descritos en `docs/design-expansion/manifest.json`. Tallas: XS–XXL. Colores: `negro`, `hueso`, `lavanda`. Cantidad entera 1–20 por línea. Ubicación `front` o `back` (predeterminada `front`); escala 70–130 (predeterminada 100). Notas hasta 1000 caracteres. JSON máximo 32 KB. Hasta 10 intentos por IP cada 15 minutos, en memoria del proceso.

El servidor ignora precios y descuentos del cliente. Camiseta USD14.99 y buzo USD19.99, estampado incluido. Aplica automáticamente combos por parejas: 2 camisetas USD27.99; camiseta + buzo USD32.99; 2 buzos USD37.99. Cada unidad participa en un solo combo; las sobrantes mantienen precio individual. Guarda subtotalCents, discountCents, totalCents y appliedPromotions. No se procesa ningún pago. Ver docs/pricing-promotions.md.

Respuesta 201: `{ "success": true, "request": { "id": "uuid", "createdAt": "ISO-8601", "status": "RECIBIDA", "pricing": { "subtotalCents": 1499, "discountCents": 0, "totalCents": 1499, "appliedPromotions": [], "currency": "USD" } } }`.

Errores: 400 validación/JSON; 413 tamaño; 429 límite de intentos (`Retry-After` en segundos); 503 almacenamiento no disponible. El frontend debe conservar carrito/borrador ante error. No hay endpoint público para consultar datos de contacto.

Cada solicitud vive en `backend/data/solicitudes/<uuid>.json`. Escritura temporal seguida de renombrado; archivos fuera de las carpetas estáticas. No publicar este directorio: contiene contacto del cliente. El administrador revisa los JSON localmente. No se envían correos ni mensajes externos. Para producción se requiere almacenamiento duradero con controles de acceso y una gestión de solicitudes.

Pruebas: `node --test backend/src/services/solicitudService.test.js` desde la raíz.
