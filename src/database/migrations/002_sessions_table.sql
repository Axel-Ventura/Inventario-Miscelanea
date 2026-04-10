-- Tabla de sesiones de aplicación (múltiples dispositivos por usuario)
USE inventario_db;

CREATE TABLE IF NOT EXISTS sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  device_info VARCHAR(512) NULL,
  ip_address VARCHAR(45) NULL,
  last_activity DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_sessions_user_active (user_id, is_active),
  INDEX idx_sessions_expires (expires_at)
);
