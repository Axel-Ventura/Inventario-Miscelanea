import pool from '../config/db.js';

/** Compatible con inventario.sql base (sin stock_minimo/categoria/actualizado_en). */
function rowToProduct(row) {
  const creado = row.creado_en ? new Date(row.creado_en).toISOString() : new Date().toISOString();
  return {
    id: String(row.id),
    nombre: row.nombre,
    descripcion: row.descripcion ?? '',
    precio: Number(row.precio),
    stock: Number(row.stock),
    stockMinimo: Number(row.stock_minimo ?? 0),
    categoria: row.categoria ?? '',
    proveedorId: row.proveedor_id != null ? String(row.proveedor_id) : '',
    createdAt: creado,
    updatedAt: row.actualizado_en
      ? new Date(row.actualizado_en).toISOString()
      : creado,
  };
}

const SELECT_BASE = `SELECT id, nombre, descripcion, precio, stock, proveedor_id, creado_en FROM productos`;

export async function listProducts(_req, res) {
  try {
    const [rows] = await pool.query(`${SELECT_BASE} ORDER BY id`);
    res.json(rows.map(rowToProduct));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al listar productos' });
  }
}

export async function getProduct(req, res) {
  try {
    const [rows] = await pool.query(`${SELECT_BASE} WHERE id = ?`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(rowToProduct(rows[0]));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al obtener producto' });
  }
}

export async function createProduct(req, res) {
  try {
    const { nombre, descripcion, precio, stock, proveedorId } = req.body;
    if (!nombre) return res.status(400).json({ message: 'El nombre es requerido' });

    const pid = proveedorId ? parseInt(String(proveedorId), 10) : null;
    const [result] = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock, proveedor_id)
       VALUES (?, ?, ?, ?, ?)`,
      [
        nombre,
        descripcion ?? '',
        precio ?? 0,
        stock ?? 0,
        Number.isFinite(pid) && pid > 0 ? pid : null,
      ]
    );
    const [rows] = await pool.query(`${SELECT_BASE} WHERE id = ?`, [result.insertId]);
    res.status(201).json(rowToProduct(rows[0]));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al crear el producto' });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const [existRows] = await pool.query(`${SELECT_BASE} WHERE id = ?`, [id]);
    const existing = existRows[0];
    if (!existing) return res.status(404).json({ message: 'Producto no encontrado' });

    const nombre = req.body.nombre ?? existing.nombre;
    const descripcion = req.body.descripcion ?? existing.descripcion;
    const precio = req.body.precio ?? existing.precio;
    const stock = req.body.stock ?? existing.stock;
    let proveedorId = existing.proveedor_id;
    if (req.body.proveedorId !== undefined) {
      const pid = parseInt(String(req.body.proveedorId), 10);
      proveedorId = Number.isFinite(pid) && pid > 0 ? pid : null;
    }

    await pool.query(
      `UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, proveedor_id = ? WHERE id = ?`,
      [nombre, descripcion, precio, stock, proveedorId, id]
    );

    const [rows] = await pool.query(`${SELECT_BASE} WHERE id = ?`, [id]);
    res.json(rowToProduct(rows[0]));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const [r] = await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
}
