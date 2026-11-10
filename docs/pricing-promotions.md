# Precios y promociones

La fuente única es `shared/pricing.mjs`, usada por la tienda y el servidor. Los precios incluyen el estampado: camiseta USD14.99, buzo USD19.99; no se añade el recargo anterior de USD5.

| Combo | Precio | Ahorro frente a unidades sueltas |
| --- | ---: | ---: |
| Camiseta + buzo | USD32.99 | USD1.99 |
| 2 camisetas | USD27.99 | USD1.99 |
| 2 buzos | USD37.99 | USD1.99 |

Se aplican automáticamente por parejas a cualquier combinación de cortes, diseños, tallas y colores. Cada unidad participa en un solo combo. Se forman primero los mixtos y después parejas del mismo tipo; como los tres combos ahorran USD1.99, esto siempre maximiza el ahorro. Las unidades impares restantes mantienen su precio individual. No se acumulan otros descuentos. El envío se confirma aparte.

Ejemplos: tres camisetas USD42.98; dos camisetas y un buzo USD47.98; dos camisetas y dos buzos USD65.98. Se trabaja en centavos enteros para evitar errores de redondeo.

El servidor ignora precios y descuentos recibidos del navegador. Guarda subtotal, descuentos, combos aplicados y total; devuelve ese cálculo en `request.pricing` para el comprobante. Los registros anteriores conservan sus importes históricos. La bolsa almacenada se recalcula con los precios actuales al recuperarse.

Comprobaciones: `node --test shared/pricing.test.mjs backend/src/services/solicitudService.test.js` y `npm run build --prefix frontend`.
