import pool from '../config/db.js';

function rowToProvider(row) {
  return {
    id: String(row.id),
    nombre: row.nombre,
    email: row.email ?? '',
    telefono: row.telefono ?? '',
    direccion: row.direccion ?? '',
    createdAt:
      row.creado_en != null
        ? new Date(row.creado_en).toISOString()
        : '1970-01-01T00:00:00.000Z',
  };
}

export async function listProviders(_req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, telefono, direccion FROM proveedores ORDER BY id'
    );
    res.json(rows.map(rowToProvider));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al listar proveedores' });
  }
}

export async function getProvider(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, telefono, direccion FROM proveedores WHERE id = ?',
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json(rowToProvider(rows[0]));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al obtener proveedor' });
  }
}

export async function createProvider(req, res) {
  try {
    const { nombre, email, telefono, direccion } = req.body;
    if (!nombre) return res.status(400).json({ message: 'El nombre es requerido' });
    const [result] = await pool.query(
      'INSERT INTO proveedores (nombre, telefono, email, direccion) VALUES (?, ?, ?, ?)',
      [nombre, telefono ?? '', email ?? '', direccion ?? '']
    );
    const [rows] = await pool.query(
      'SELECT id, nombre, email, telefono, direccion FROM proveedores WHERE id = ?',
      [result.insertId]
    );
    const created = rowToProvider(rows[0]);
    created.createdAt = new Date().toISOString();
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al crear el proveedor' });
  }
}

export async function updateProvider(req, res) {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, direccion } = req.body;
    const [[existing]] = await pool.query('SELECT id FROM proveedores WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ message: 'Proveedor no encontrado' });

    const [curRows] = await pool.query(
      'SELECT nombre, email, telefono, direccion FROM proveedores WHERE id = ?',
      [id]
    );
    const cur = curRows[0];
    await pool.query(
      `UPDATE proveedores SET nombre = ?, email = ?, telefono = ?, direccion = ? WHERE id = ?`,
      [
        nombre ?? cur.nombre,
        email ?? cur.email,
        telefono ?? cur.telefono,
        direccion ?? cur.direccion,
        id,
      ]
    );
    const [rows] = await pool.query(
      'SELECT id, nombre, email, telefono, direccion FROM proveedores WHERE id = ?',
      [id]
    );
    res.json(rowToProvider(rows[0]));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al actualizar el proveedor' });
  }
}

export async function deleteProvider(req, res) {
  try {
    const [r] = await pool.query('DELETE FROM proveedores WHERE id = ?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al eliminar el proveedor' });
  }
}
