import pool from '../config/db.js';

function rowToMovement(row) {
  const tipo = row.tipo;
  return {
    id: String(row.id),
    productoId: String(row.producto_id),
    tipo,
    type: tipo,
    cantidad: Number(row.cantidad),
    motivo: row.motivo ?? '',
    usuarioId: row.usuario_id != null ? String(row.usuario_id) : '',
    createdAt: row.fecha ? new Date(row.fecha).toISOString() : new Date().toISOString(),
  };
}

export async function listMovements(req, res) {
  try {
    const type = req.query.type;
    let sql = `SELECT id, producto_id, tipo, cantidad, usuario_id, fecha
               FROM movimientos_inventario ORDER BY fecha DESC, id DESC`;
    const params = [];
    if (type === 'entrada' || type === 'salida') {
      sql = `SELECT id, producto_id, tipo, cantidad, usuario_id, fecha
             FROM movimientos_inventario WHERE tipo = ? ORDER BY fecha DESC, id DESC`;
      params.push(type);
    }
    const [rows] = await pool.query(sql, params);
    res.json(rows.map(rowToMovement));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al listar movimientos' });
  }
}

export async function createMovement(req, res) {
  const { productoId, tipo, cantidad, motivo } = req.body;
  const usuarioId = req.user?.id != null ? Number(req.user.id) : null;

  if (!productoId || !tipo || cantidad == null) {
    return res.status(400).json({ message: 'productoId, tipo y cantidad son requeridos' });
  }
  if (tipo !== 'entrada' && tipo !== 'salida') {
    return res.status(400).json({ message: 'tipo debe ser entrada o salida' });
  }
  const qty = Number(cantidad);
  if (!Number.isFinite(qty) || qty <= 0) {
    return res.status(400).json({ message: 'cantidad inválida' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [[product]] = await conn.query(
      'SELECT id, stock FROM productos WHERE id = ? FOR UPDATE',
      [productoId]
    );
    if (!product) {
      await conn.rollback();
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    let stock = Number(product.stock);
    if (tipo === 'entrada') stock += qty;
    else {
      if (stock < qty) {
        await conn.rollback();
        return res.status(400).json({ message: 'Stock insuficiente' });
      }
      stock -= qty;
    }

    const [ins] = await conn.query(
      `INSERT INTO movimientos_inventario (producto_id, tipo, cantidad, usuario_id)
       VALUES (?, ?, ?, ?)`,
      [productoId, tipo, qty, usuarioId]
    );

    await conn.query('UPDATE productos SET stock = ? WHERE id = ?', [stock, productoId]);
    await conn.commit();

    const [[row]] = await pool.query(
      `SELECT id, producto_id, tipo, cantidad, usuario_id, fecha
       FROM movimientos_inventario WHERE id = ?`,
      [ins.insertId]
    );

    return res.status(201).json({
      movimiento: rowToMovement(row),
      nuevoStock: stock,
    });
  } catch (e) {
    if (conn) await conn.rollback().catch(() => {});
    console.error(e);
    return res.status(500).json({ message: 'Error al registrar el movimiento' });
  } finally {
    if (conn) conn.release();
  }
}
