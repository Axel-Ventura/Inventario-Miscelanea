-- Crear base de datos
CREATE DATABASE IF NOT EXISTS inventario_db;
USE inventario_db;
--SESIONES--
CREATE TABLE sesiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    token VARCHAR(255),
    user_agent TEXT,
    ip VARCHAR(45),
    ultima_actividad DATETIME,
    expira_en DATETIME,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- ROLES
-- =====================
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

INSERT INTO roles (nombre) VALUES ('admin'), ('usuario');

-- =====================
-- USUARIOS
-- =====================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    rol_id INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- =====================
-- PROVEEDORES
-- =====================
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT
);

-- =====================
-- PRODUCTOS
-- =====================
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    precio DECIMAL(10,2),
    stock INT DEFAULT 0,
    proveedor_id INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);

-- =====================
-- INVENTARIO (MOVIMIENTOS)
-- =====================
CREATE TABLE movimientos_inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    tipo ENUM('entrada', 'salida'),
    cantidad INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =====================
-- VENTAS
-- =====================
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    total DECIMAL(10,2),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =====================
-- DETALLE DE VENTAS
-- =====================
CREATE TABLE detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT,
    producto_id INT,
    cantidad INT,
    precio DECIMAL(10,2),
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);