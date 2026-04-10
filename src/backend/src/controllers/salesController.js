import pool from '../config/db.js';

async function fetchSaleById(ventaId) {
  const [[v]] = await pool.query(
    'SELECT id, usuario_id, total, fecha FROM ventas WHERE id = ?',
    [ventaId]
  );
  if (!v) return null;

  const [lineas] = await pool.query(
    `SELECT venta_id, producto_id, cantidad, precio AS precioUnitario
     FROM detalle_ventas WHERE venta_id = ?`,
    [ventaId]
  );

  const productos = lineas.map((l) => ({
    productoId: String(l.producto_id),
    cantidad: Number(l.cantidad),
    precioUnitario: Number(l.precioUnitario),
  }));

  return {
    id: String(v.id),
    productos,
    total: Number(v.total),
    usuarioId: v.usuario_id != null ? String(v.usuario_id) : '',
    createdAt: v.fecha ? new Date(v.fecha).toISOString() : new Date().toISOString(),
  };
}

export async function listSales(_req, res) {
  try {
    const [ventas] = await pool.query(
      'SELECT id, usuario_id, total, fecha FROM ventas ORDER BY fecha DESC, id DESC'
    );
    if (ventas.length === 0) return res.json([]);

    const ids = ventas.map((v) => v.id);
    const [lineas] = await pool.query(
      `SELECT venta_id, producto_id, cantidad, precio AS precioUnitario
       FROM detalle_ventas WHERE venta_id IN (${ids.map(() => '?').join(',')})`,
      ids
    );

    const byVenta = new Map();
    for (const l of lineas) {
      if (!byVenta.has(l.venta_id)) byVenta.set(l.venta_id, []);
      byVenta.get(l.venta_id).push({
        productoId: String(l.producto_id),
        cantidad: Number(l.cantidad),
        precioUnitario: Number(l.precioUnitario),
      });
    }

    const out = ventas.map((v) => ({
      id: String(v.id),
      productos: byVenta.get(v.id) ?? [],
      total: Number(v.total),
      usuarioId: v.usuario_id != null ? String(v.usuario_id) : '',
      createdAt: v.fecha ? new Date(v.fecha).toISOString() : new Date().toISOString(),
    }));

    res.json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al listar ventas' });
  }
}

export async function createSale(req, res) {
  const { productos } = req.body;
  const userId = req.user?.id != null ? Number(req.user.id) : null;

  if (!Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ message: 'Debe incluir al menos un producto' });
  }
  if (userId == null || !Number.isFinite(userId)) {
    return res.status(400).json({ message: 'Usuario no válido en el token' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    let total = 0;
    const normalized = [];

    for (const line of productos) {
      const pid = parseInt(String(line.productoId), 10);
      const qty = Number(line.cantidad);
      const pu = Number(line.precioUnitario);
      if (!Number.isFinite(pid) || pid <= 0) {
        await conn.rollback();
        return res.status(400).json({ message: 'productoId inválido' });
      }
      if (!Number.isFinite(qty) || qty <= 0) {
        await conn.rollback();
        return res.status(400).json({ message: 'cantidad inválida' });
      }
      if (!Number.isFinite(pu) || pu < 0) {
        await conn.rollback();
        return res.status(400).json({ message: 'precioUnitario inválido' });
      }

      const [[p]] = await conn.query(
        'SELECT id, stock FROM productos WHERE id = ? FOR UPDATE',
        [pid]
      );
      if (!p) {
        await conn.rollback();
        return res.status(404).json({ message: `Producto ${pid} no encontrado` });
      }
      const stock = Number(p.stock);
      if (stock < qty) {
        await conn.rollback();
        return res.status(400).json({ message: `Stock insuficiente para producto ${pid}` });
      }

      total += qty * pu;
      normalized.push({ pid, qty, pu });
    }

    const [insV] = await conn.query(
      'INSERT INTO ventas (usuario_id, total) VALUES (?, ?)',
      [userId, total]
    );
    const ventaId = insV.insertId;

    for (const l of normalized) {
      await conn.query(
        'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)',
        [ventaId, l.pid, l.qty, l.pu]
      );
      await conn.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [l.qty, l.pid]);
    }

    await conn.commit();

    const created = await fetchSaleById(ventaId);
    return res.status(201).json(created);
  } catch (e) {
    if (conn) await conn.rollback().catch(() => {});
    console.error(e);
    return res.status(500).json({ message: 'Error al registrar la venta' });
  } finally {
    if (conn) conn.release();
  }
}
