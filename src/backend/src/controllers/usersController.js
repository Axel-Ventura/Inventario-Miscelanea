import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { getRolId } from '../utils/roles.js';

function rowToUser(row) {
  return {
    id: String(row.id),
    email: row.email,
    nombre: row.nombre,
    rol: row.rol,
    createdAt: row.creado_en
      ? new Date(row.creado_en).toISOString()
      : new Date().toISOString(),
  };
}

export async function listUsers(_req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.nombre, r.nombre AS rol, u.creado_en
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       ORDER BY u.id`
    );
    res.json(rows.map(rowToUser));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al listar usuarios' });
  }
}

export async function getUser(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.nombre, r.nombre AS rol, u.creado_en
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       WHERE u.id = ?`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(rowToUser(rows[0]));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
}

export async function createUser(req, res) {
  try {
    const { email, password, nombre, rol } = req.body;
    if (!email || !password || !nombre) {
      return res.status(400).json({ message: 'Email, contraseña y nombre son requeridos' });
    }
    const [[dup]] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (dup) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }
    const rolNombre = rol && ['admin', 'usuario', 'vendedor', 'almacenista'].includes(rol) ? rol : 'usuario';
    const rolId = await getRolId(rolNombre);
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol_id) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, rolId]
    );
    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.nombre, r.nombre AS rol, u.creado_en
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       WHERE u.id = ?`,
      [result.insertId]
    );
    res.status(201).json(rowToUser(rows[0]));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { email, nombre, rol, password } = req.body;
    const [[existing]] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (email) {
      const [[other]] = await pool.query('SELECT id FROM usuarios WHERE email = ? AND id != ?', [email, id]);
      if (other) return res.status(400).json({ message: 'El correo ya está en uso' });
    }

    const fields = [];
    const vals = [];
    if (nombre != null) {
      fields.push('nombre = ?');
      vals.push(nombre);
    }
    if (email != null) {
      fields.push('email = ?');
      vals.push(email);
    }
    if (rol != null) {
      const rolId = await getRolId(rol);
      fields.push('rol_id = ?');
      vals.push(rolId);
    }
    if (password) {
      fields.push('password = ?');
      vals.push(await bcrypt.hash(password, 10));
    }
    if (fields.length) {
      vals.push(id);
      await pool.query(`UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`, vals);
    }

    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.nombre, r.nombre AS rol, u.creado_en
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       WHERE u.id = ?`,
      [id]
    );
    res.json(rowToUser(rows[0]));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
}

export async function deleteUser(req, res) {
  try {
    const [r] = await pool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
}
