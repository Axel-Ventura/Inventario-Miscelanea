import pool from '../config/db.js';

const KNOWN_ROLES = ['admin', 'usuario', 'vendedor', 'almacenista'];
const DEFAULT_ROLE = 'usuario';

let cache = null;

async function loadRoleCache() {
  const [rows] = await pool.query('SELECT id, nombre FROM roles');
  cache = Object.fromEntries(rows.map((r) => [r.nombre, r.id]));
}

export async function getRolId(nombre) {
  if (!cache) {
    await loadRoleCache();
  }

  const requestedRole = KNOWN_ROLES.includes(nombre) ? nombre : DEFAULT_ROLE;
  if (cache[requestedRole] != null) return cache[requestedRole];

  const [rows] = await pool.query('SELECT id FROM roles WHERE nombre = ?', [requestedRole]);
  if (rows[0]) {
    cache[requestedRole] = rows[0].id;
    return rows[0].id;
  }

  const [result] = await pool.query('INSERT INTO roles (nombre) VALUES (?)', [requestedRole]);
  const newId = result.insertId;
  cache[requestedRole] = newId;
  return newId;
}

export function invalidateRolCache() {
  cache = null;
}
