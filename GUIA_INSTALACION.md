# 🚀 DRAXEN E-COMMERCE - GUÍA COMPLETA DE INSTALACIÓN

## 📋 Pre-requisitos

Antes de empezar, asegúrate de tener instalado:
- **Node.js** (v16 o superior) - https://nodejs.org/
- **MySQL** (v5.7 o superior) - https://www.mysql.com/
- **npm** o **yarn** - Viene con Node.js

---

## 🗄️ PARTE 1: CONFIGURAR BASE DE DATOS

### 1. Abrir MySQL
```bash
mysql -u root -p
```
(Presiona Enter si no tiene contraseña)

### 2. Crear Base de Datos
Copia y pega TODO el contenido de `database/draxen_db.sql`:

```sql
-- Ver el archivo completo en database/draxen_db.sql
```

O ejecuta directamente:
```bash
mysql -u root < database/draxen_db.sql
```

### 3. Verificar que se creó correctamente
```bash
mysql -u root
mysql> USE draxen_db;
mysql> SHOW TABLES;
```

Debes ver estas tablas:
- usuarios
- productos
- categorias
- tallas
- producto_tallas
- imagenes
- pedidos
- detalle_pedido

---

## 🔧 PARTE 2: BACKEND (Node.js + Express)

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar variables de entorno
Edita el archivo `.env`:

```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=draxen_db
DB_PORT=3306

JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
```

**Importante:** Cambiar `DB_PASSWORD` si tu MySQL tiene contraseña

### 3. Ejecutar servidor
```bash
npm run dev
```

El servidor debe correr en: `http://localhost:5000`

Verás:
```
🚀 Servidor corriendo en puerto 5000
Ambiente: development
```

---

## 🎨 PARTE 3: FRONTEND (React + Vite + TailwindCSS)

### 1. Instalar dependencias
```bash
cd frontend
npm install
```

### 2. Ejecutar servidor de desarrollo
```bash
npm run dev
```

El frontend debe correr en: `http://localhost:3000`

---

## ✅ VERIFICAR QUE TODO FUNCIONA

### 1. Health Check Backend
Abre en el navegador:
```
http://localhost:5000/health
```

Debe mostrar:
```json
{
  "status": "OK",
  "message": "Servidor funcionando"
}
```

### 2. Acceder Frontend
```
http://localhost:3000
```

Debes ver la página principal de DRAXEN

### 3. Crear usuario administrador
```bash
# En MySQL:
mysql -u root draxen_db

# Cambiar la contraseña hasheada (usa bcrypt online para generar)
# O usa esta contraseña hasheada de ejemplo:
# Password: admin123
# Hash: $2b$10$YourHashedPasswordHere

UPDATE usuarios SET password_hash = '$2b$10$8h5.0Hp1h8GJKq0bv.LzKuKw5/MqxQzQj5A2U0K9VVcL8b8v6PYYO' WHERE id = 1;
```

**Crear la contraseña hasheada:**
- Usa: https://bcrypt.online/
- Ingresa: `admin123`
- Copia el hash y pégalo

### 4. Probar Login
1. Ve a http://localhost:3000/login
2. Email: `admin@draxen.com`
3. Password: `admin123`

---

## 📊 ESTRUCTURA DEL PROYECTO

```
draxen/
├── database/
│   └── draxen_db.sql          # Script SQL
│
├── backend/
│   ├── src/
│   │   ├── config/            # Configuraciones (JWT, BD)
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── models/            # Modelos de datos
│   │   ├── routes/            # Rutas API
│   │   ├── middleware/        # Autenticación
│   │   ├── utils/             # Utilidades
│   │   └── server.js          # Entrada principal
│   ├── .env                   # Variables de entorno
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/        # Componentes React
    │   ├── pages/            # Páginas
    │   ├── context/          # Context (Auth, Carrito)
    │   ├── utils/            # Llamadas API
    │   ├── App.jsx           # App principal
    │   ├── main.jsx          # Entrada
    │   └── index.css         # Estilos Tailwind
    ├── index.html
    └── package.json
```

---

## 🔌 ENDPOINTS API DISPONIBLES

### Auth
- POST `/api/auth/register` - Registrar usuario
- POST `/api/auth/login` - Login
- GET `/api/auth/perfil` - Obtener perfil (autenticado)
- PUT `/api/auth/perfil` - Actualizar perfil (autenticado)

### Productos
- GET `/api/productos` - Listar productos
- GET `/api/productos/:id` - Obtener producto
- POST `/api/productos` - Crear producto (admin)
- PUT `/api/productos/:id` - Actualizar producto (admin)
- DELETE `/api/productos/:id` - Eliminar producto (admin)

### Categorías
- GET `/api/categorias` - Listar categorías
- GET `/api/categorias/:id` - Obtener categoría
- POST `/api/categorias` - Crear categoría (admin)
- PUT `/api/categorias/:id` - Actualizar categoría (admin)
- DELETE `/api/categorias/:id` - Eliminar categoría (admin)

### Pedidos
- POST `/api/pedidos` - Crear pedido (autenticado)
- GET `/api/pedidos/usuario/mis-pedidos` - Mis pedidos (autenticado)
- GET `/api/pedidos/:id` - Obtener pedido (autenticado)
- GET `/api/pedidos` - Listar todos (admin)
- PUT `/api/pedidos/:id/estado` - Cambiar estado (admin)

---

## 🐛 TROUBLESHOOTING

### Error: "Cannot find module 'mysql2'"
```bash
cd backend
npm install mysql2
```

### Error de conexión a BD
- Verifica que MySQL está corriendo
- Verifica las credenciales en `.env`
- Verifica que la BD se creó: `mysql> SHOW DATABASES;`

### Puerto 5000 ya está en uso
```bash
# En Windows
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# En Mac/Linux
lsof -i :5000
kill -9 [PID]
```

### CORS error
- Verifica que el backend está corriendo en Puerto 5000
- Verifica que el frontend está en Puerto 3000
- Revisa el middleware CORS en `backend/src/server.js`

---

## 🚀 BUILD PARA PRODUCCIÓN

### Backend
```bash
cd backend
npm run start
# O con PM2:
npm install -g pm2
pm2 start src/server.js --name draxen-backend
```

### Frontend
```bash
cd frontend
npm run build
# Genera carpeta 'dist/' lista para desplegar
```

---

## 📝 EJEMPLO DE USO

### 1. Registrarse
```javascript
POST /api/auth/register
Body: {
  "nombre": "Juan",
  "email": "juan@example.com",
  "password": "123456"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "usuario": {...}
}
```

### 2. Agregar al carrito (en frontend)
```javascript
- Seleccionar producto en Home
- Click en "Ver" para ver detalles
- Seleccionar talla
- Click en "AGREGAR AL CARRITO"
```

### 3. Procesar compra
```javascript
- Ir a /carrito
- Completar dirección
- Click en "PROCESAR COMPRA"
- Se crea el pedido automáticamente
```

### 4. Ver pedidos
```javascript
- Click en "Mis Pedidos" (debe estar autenticado)
- Ve todos tus pedidos con estado
```

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

✅ Autenticación con JWT
✅ Registro y Login
✅ Carrito de compras (localStorage)
✅ Crear pedidos
✅ Ver historial de pedidos
✅ Panel admin (crear productos)
✅ Gestión de categorías
✅ Gestión de tallas
✅ Stock management
✅ Búsqueda y filtros
✅ Responsive design
✅ Diseño moderno oscuro

---

## 📧 CONTACTO Y SOPORTE

Si tienes problemas:
1. Verifica el archivo `.env`
2. Revisa que MySQL está corriendo
3. Verifica la consola del navegador (F12)
4. Checked los logs del backend (terminal)

---

**¡DRAXEN está listo para usar! 🚀**
