/**
 * Datos iniciales: roles extra, usuario admin@test.com, proveedores y productos demo.
 * Ejecutar: npm run seed (desde src/backend)
 */
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { invalidateRolCache } from '../utils/roles.js';

async function ensureRoles() {
  for (const nombre of ['vendedor', 'almacenista']) {
    const [r] = await pool.query('SELECT id FROM roles WHERE nombre = ?', [nombre]);
    if (!r[0]) await pool.query('INSERT INTO roles (nombre) VALUES (?)', [nombre]);
  }
  invalidateRolCache();
}

async function ensureAdminUser() {
  const [existing] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [
    'admin@test.com',
  ]);
  if (existing[0]) return;

  const [roles] = await pool.query("SELECT id FROM roles WHERE nombre = 'admin' LIMIT 1");
  const rolId = roles[0]?.id;
  if (!rolId) {
    console.warn('No existe rol admin; crea roles antes (inventario.sql).');
    return;
  }

  const hash = await bcrypt.hash('123456', 10);
  await pool.query(
    'INSERT INTO usuarios (nombre, email, password, rol_id) VALUES (?, ?, ?, ?)',
    ['Admin', 'admin@test.com', hash, rolId]
  );
  console.log('Usuario admin@test.com creado (contraseña: 123456)');
}

async function seedCatalogIfEmpty() {
  const [pc] = await pool.query('SELECT COUNT(*) AS c FROM productos');
  if (pc[0].c > 0) return;

  const [p1] = await pool.query(
    "INSERT INTO proveedores (nombre, telefono, email, direccion) VALUES (?, ?, ?, ?)",
    [
      'Distribuidora Central',
      '+52 55 1234 5678',
      'contacto@distribuidoracentral.com',
      'Av. Principal 123',
    ]
  );
  const prov1 = p1.insertId;

  await pool.query(
    `INSERT INTO productos (nombre, descripcion, precio, stock, proveedor_id)
     VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)`,
    [
      'Laptop HP ProBook',
      'Laptop profesional 15.6"',
      15999,
      25,
      prov1,
      'Monitor Dell 24"',
      'Monitor Full HD',
      4599,
      3,
      prov1,
    ]
  );
  console.log('Catálogo demo (proveedores/productos) insertado.');
}

async function main() {
  try {
    await ensureRoles();
    await ensureAdminUser();
    await seedCatalogIfEmpty();
    console.log('Seed completado.');
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
