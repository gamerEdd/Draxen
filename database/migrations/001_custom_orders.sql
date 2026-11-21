CREATE TABLE IF NOT EXISTS usuario_google (
  google_sub VARCHAR(255) PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pedido_diseno (
  pedido_id INT PRIMARY KEY,
  usuario_id INT NOT NULL,
  request_id CHAR(36) NOT NULL,
  configuracion JSON NOT NULL,
  imagen MEDIUMBLOB NOT NULL,
  revision INT NOT NULL DEFAULT 1,
  UNIQUE KEY uq_request (usuario_id, request_id),
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pedido_historial (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pedido_id INT NOT NULL,
  estado VARCHAR(30) NOT NULL,
  nota VARCHAR(255) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  INDEX idx_historial (pedido_id, id)
) ENGINE=InnoDB;
