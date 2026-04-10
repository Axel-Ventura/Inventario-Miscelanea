import pool from '../config/db.js';

let cache = null;

export async function getRolId(nombre) {
  if (!cache) {
    const [rows] = await pool.query('SELECT id, nombre FROM roles');
    cache = Object.fromEntries(rows.map((r) => [r.nombre, r.id]));
  }
  if (cache[nombre] != null) return cache[nombre];

  const [rows] = await pool.query('SELECT id FROM roles WHERE nombre = ?', [nombre]);
  if (rows[0]) {
    cache[nombre] = rows[0].id;
    return rows[0].id;
  }

  const [r2] = await pool.query("SELECT id FROM roles WHERE nombre = 'usuario' LIMIT 1");
  return r2[0]?.id ?? 2;
}

export function invalidateRolCache() {
  cache = null;
}
