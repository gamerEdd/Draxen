# 📁 IMÁGENES LOCALES

## Cómo agregar imágenes locales

### 1. Coloca tus imágenes aquí
Copia tus archivos de imagen (JPG, PNG, etc) en esta carpeta:
```
e:\proyectos\draxen\backend\public\images\
```

### 2. La URL será accesible como:
Si tienes un archivo llamado `chompa-rock.jpg`, la URL será:
```
http://localhost:5000/images/chompa-rock.jpg
```

### 3. En la base de datos, guardarás:
```
/images/chompa-rock.jpg
```

El servidor automáticamente lo sirve desde `http://localhost:5000/images/...`

---

## Ejemplo

**Archivo:** `e:\proyectos\draxen\backend\public\images\mi-producto.jpg`

**URL en BD:** `/images/mi-producto.jpg`

**URL en navegador:** `http://localhost:5000/images/mi-producto.jpg`

**En el frontend:** Carga automáticamente desde esa URL

---

## Estructura

```
backend/
├── public/
│   └── images/
│       ├── chompa-rock.jpg
│       ├── tshirt-skull.jpg
│       ├── chompa-samurai.jpg
│       └── ... más imágenes
```

**¡Ahora todas las imágenes se sirven localmente! 🎉**
