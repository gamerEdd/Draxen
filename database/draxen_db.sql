-- DRAXEN E-COMMERCE DATABASE
-- Base de datos para tienda de streetwear

CREATE DATABASE IF NOT EXISTS draxen_db;
USE draxen_db;

-- ===========================
-- TABLA: USUARIOS
-- ===========================
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('ADMIN', 'CLIENTE') DEFAULT 'CLIENTE',
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(50),
  pais VARCHAR(50),
  codigo_postal VARCHAR(10),
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================
-- TABLA: CATEGORIAS
-- ===========================
CREATE TABLE categorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================
-- TABLA: TALLAS
-- ===========================
CREATE TABLE tallas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  talla VARCHAR(10) NOT NULL UNIQUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================
-- TABLA: PRODUCTOS
-- ===========================
CREATE TABLE productos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  categoria_id INT NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  creado_por INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
  FOREIGN KEY (creado_por) REFERENCES usuarios(id),
  INDEX idx_categoria (categoria_id),
  INDEX idx_nombre (nombre),
  INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================
-- TABLA: IMAGENES
-- ===========================
CREATE TABLE imagenes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  producto_id INT NOT NULL,
  url VARCHAR(500) NOT NULL,
  orden INT DEFAULT 1,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  INDEX idx_producto (producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================
-- TABLA: PRODUCTO_TALLAS (Stock)
-- ===========================
CREATE TABLE producto_tallas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  producto_id INT NOT NULL,
  talla_id INT NOT NULL,
  stock INT DEFAULT 0,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  FOREIGN KEY (talla_id) REFERENCES tallas(id) ON DELETE CASCADE,
  UNIQUE KEY unique_producto_talla (producto_id, talla_id),
  INDEX idx_stock (stock)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================
-- TABLA: PEDIDOS
-- ===========================
CREATE TABLE pedidos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  numero_pedido VARCHAR(20) UNIQUE NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  impuestos DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  estado ENUM('PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO') DEFAULT 'PENDIENTE',
  direccion_envio TEXT,
  numero_seguimiento VARCHAR(100),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
  INDEX idx_usuario (usuario_id),
  INDEX idx_estado (estado),
  INDEX idx_numero_pedido (numero_pedido),
  INDEX idx_fecha (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================
-- TABLA: DETALLE_PEDIDO
-- ===========================
CREATE TABLE detalle_pedido (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  talla_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id),
  FOREIGN KEY (talla_id) REFERENCES tallas(id),
  INDEX idx_pedido (pedido_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================
-- INSERTAR DATOS INICIALES
-- ===========================

-- Insertar tallas
INSERT INTO tallas (talla) VALUES ('XS'), ('S'), ('M'), ('L'), ('XL'), ('XXL');

-- Insertar categorías
INSERT INTO categorias (nombre, descripcion) VALUES
('ROCK', 'Camisetas y chompas temática rock'),
('ANIME', 'Camisetas y chompas temática anime');

-- Insertar usuario admin
INSERT INTO usuarios (nombre, email, password_hash, rol, ciudad, pais, activo) VALUES
('Admin Draxen', 'admin@draxen.com', '$2b$10$YourHashedPasswordHere', 'ADMIN', 'Madrid', 'España', TRUE);

-- Insertar productos ROCK
INSERT INTO productos (nombre, descripcion, precio, categoria_id, creado_por, activo) VALUES
('Chompa Rock Clásico', 'Hoodie negro con logo rock estilo vintage', 89.99, 1, 1, TRUE),
('Camiseta Skull Rock', 'T-shirt oversize con calavera rock', 39.99, 1, 1, TRUE),
('Chompa Motociclista', 'Hoodie inspirado en motociclismo', 84.99, 1, 1, TRUE),
('Camiseta Heavy Metal', 'T-shirt con letras de bandas metal', 34.99, 1, 1, TRUE);

-- Insertar productos ANIME
INSERT INTO productos (nombre, descripcion, precio, categoria_id, creado_por, activo) VALUES
('Chompa Anime Samurai', 'Hoodie con diseño samurai japonés', 89.99, 2, 1, TRUE),
('Camiseta Manga Pop', 'T-shirt con arte de anime popular', 39.99, 2, 1, TRUE),
('Chompa Cyberpunk', 'Hoodie con tema futurista anime', 84.99, 2, 1, TRUE),
('Camiseta Dragon Power', 'T-shirt con temática de poder oriental', 34.99, 2, 1, TRUE);

-- Insertar imágenes para productos ROCK
INSERT INTO imagenes (producto_id, url, orden) VALUES
(1, '/fotos/imagen.jpg', 1),
(1, '/fotos/imagen.jpg', 2),
(2, '/fotos/imagen.jpg', 1),
(3, '/fotos/imagen.jpg', 1),
(4, '/fotos/imagen.jpg', 1);

-- Insertar imágenes para productos ANIME
INSERT INTO imagenes (producto_id, url, orden) VALUES
(5, '/fotos/imagen.jpg', 1),
(5, '/fotos/imagen.jpg', 2),
(6, '/fotos/imagen.jpg', 1),
(7, '/fotos/imagen.jpg', 1),
(8, '/fotos/imagen.jpg', 1);

-- Insertar stock para producto-talla (ROCK)
INSERT INTO producto_tallas (producto_id, talla_id, stock) VALUES
(1, 2, 20), (1, 3, 25), (1, 4, 22), (1, 5, 18), (1, 6, 15),
(2, 2, 30), (2, 3, 35), (2, 4, 28), (2, 5, 25), (2, 6, 20),
(3, 2, 18), (3, 3, 22), (3, 4, 20), (3, 5, 16), (3, 6, 14),
(4, 2, 35), (4, 3, 40), (4, 4, 32), (4, 5, 28), (4, 6, 24);

-- Insertar stock para producto-talla (ANIME)
INSERT INTO producto_tallas (producto_id, talla_id, stock) VALUES
(5, 2, 20), (5, 3, 25), (5, 4, 22), (5, 5, 18), (5, 6, 15),
(6, 2, 30), (6, 3, 35), (6, 4, 28), (6, 5, 25), (6, 6, 20),
(7, 2, 18), (7, 3, 22), (7, 4, 20), (7, 5, 16), (7, 6, 14),
(8, 2, 35), (8, 3, 40), (8, 4, 32), (8, 5, 28), (8, 6, 24);

-- ===========================
-- FIN DEL SCRIPT
-- ===========================
