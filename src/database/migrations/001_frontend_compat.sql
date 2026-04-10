-- Ejecutar una vez sobre inventario_db (después de inventario.sql)
USE inventario_db;

ALTER TABLE productos
  ADD COLUMN stock_minimo INT NOT NULL DEFAULT 0,
  ADD COLUMN categoria VARCHAR(128) NOT NULL DEFAULT '',
  ADD COLUMN actualizado_en TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE movimientos_inventario ADD COLUMN motivo TEXT NULL;
ALTER TABLE proveedores ADD COLUMN creado_en TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;
