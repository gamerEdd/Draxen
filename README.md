# 🚀 INICIO RÁPIDO (5 MINUTOS)

## Tienda y Custom Lab

**Precios con estampado incluido:** camisetas USD14.99 y buzos USD19.99. Combos automáticos en la bolsa: dos camisetas USD27.99, camiseta + buzo USD32.99 y dos buzos USD37.99. El servidor recalcula descuentos y devuelve el detalle del comprobante. Reglas y pruebas en `docs/pricing-promotions.md`.

La tienda incluye un catálogo local de 160 combinaciones: camisetas y buzos para hombre y mujer con 40 estampados reutilizables. Los recursos están en `frontend/public/assets`; el catálogo se configura en `frontend/src/data/catalog.js`. No necesita MySQL para explorar, personalizar o enviar solicitudes.

En `/personalizar` se eligen modelo, talla XS–XXL, color, diseño y ubicación/escala del estampado. Los borradores y la bolsa se conservan en el navegador. Las imágenes de producto son mockups de referencia; precio final de producción, medidas y disponibilidad deben confirmarse.

La bolsa permite **enviar una solicitud al servidor local**. Cada recepción confirmada se guarda en `backend/data/solicitudes/<id>.json`, con contacto, variantes, precios calculados en servidor y fecha. Esta carpeta es privada y está excluida de Git. No se procesa ningún pago ni se envían correos o mensajes externos. Consulta `docs/request-api.md` para el contrato y los límites.

Para usar una API diferente, copia `frontend/.env.example` a `frontend/.env` y configura `VITE_API_URL`. Las cuentas, administración y pedidos anteriores siguen usando MySQL.

## Desarrollo con recarga automática

Con las dependencias instaladas y MySQL configurado, ejecuta desde la raíz:

```bash
npm run dev
```

Abre http://localhost:3000. Vite actualiza el frontend al guardar componentes o estilos; nodemon reinicia el backend al guardar cambios en `backend/src` o `backend/.env`. No hace falta detener y arrancar los servidores manualmente. El reinicio del backend puede interrumpir brevemente las peticiones en curso.

Para detener ambos servidores, presiona `Ctrl+C`.

## Paso 1: Base de Datos
```bash
mysql -u root < database/draxen_db.sql
```

## Paso 2: Backend
```bash
cd backend
npm install
npm run dev
```
Debe correr en: http://localhost:5000

## Paso 3: Frontend (otra terminal)
```bash
cd frontend
npm install
npm run dev
```
Debe correr en: http://localhost:3000

## Paso 4: Acceder
- Abre: http://localhost:3000
- Click en "Registrar" o usa:
  - Email: `admin@draxen.com`
  - Password: `admin123`

## ¡Listo! 🎉

---

## 📁 Archivos importantes:

**Base de Datos:** `database/draxen_db.sql`
**Backend Variables:** `backend/.env`

Para más detalles, ver: `GUIA_INSTALACION.md`
