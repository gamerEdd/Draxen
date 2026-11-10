# 🖼️ SISTEMA DE IMÁGENES LOCALES - DRAXEN

## ✅ Configurado

El sistema ya está configurado para servir imágenes locales desde:
```
http://localhost:5000/images/
```

---

## 📂 Dónde guardar imágenes

Coloca tus imágenes en:
```
backend/public/images/
```

**Ejemplo:**
- Archivo: `e:\proyectos\draxen\backend\public\images\chompa-rock.jpg`
- URL en BD: `/images/chompa-rock.jpg`
- URL completa: `http://localhost:5000/images/chompa-rock.jpg`

---

## 🔧 Dos formas de agregar imágenes

### Opción 1: URL al guardar en BD (Manual)
En la base de datos, guarda:
```sql
INSERT INTO imagenes (producto_id, url) VALUES (1, '/images/mi-imagen.jpg');
```

### Opción 2: Subir archivo por API (Automático)
```bash
curl -X POST http://localhost:5000/api/productos/1/imagenes/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "imagen=@/ruta/a/imagen.jpg"
```

**Respuesta:**
```json
{
  "success": true,
  "url": "/images/imagen-1712800000000.jpg",
  "fullUrl": "http://localhost:5000/images/imagen-1712800000000.jpg"
}
```

---

## 🚀 Instalar multer

Si aún no lo has hecho, instala en backend:
```powershell
cd backend
npm install multer
```

---

## 💾 Ejemplo en la BD actual

Las imágenes ya están configuradas como rutas locales:
```sql
/images/chompa-rock.jpg
/images/tshirt-skull.jpg
/images/chompa-samurai.jpg
```

Solo necesitas colocar los archivos JPG en `backend/public/images/`

---

## 📋 Tipos de archivo permitidos
- ✅ JPG/JPEG
- ✅ PNG
- ✅ WebP

**Máximo:** 5MB por archivo

---

## 🎨 Pasos para agregar tu primer producto con imagen

### 1. Crear archivo JPG
```
e:\proyectos\draxen\backend\public\images\mi-chompa.jpg
```

### 2. Agregar en BD manualmente
```sql
INSERT INTO productos (nombre, descripcion, precio, categoria_id, creado_por, activo)
VALUES ('Mi Chompa', 'Descripción', 49.99, 1, 1, TRUE);

INSERT INTO imagenes (producto_id, url, orden)
VALUES (9, '/images/mi-chompa.jpg', 1);
```

### 3. O subir por API (Admin Panel)
Se agregará soporte en el panel admin para subir imágenes directamente.

---

**¡Tus imágenes se servirán localmente sin depender de URLs externas! 🎉**
