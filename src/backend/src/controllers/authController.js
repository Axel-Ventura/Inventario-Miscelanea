import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { generateToken, verifyToken } from '../utils/jwt.js';
import { getRolId } from '../utils/roles.js';
import { getClientIp, getDeviceInfo } from '../utils/requestMeta.js';
import { setAuthCookie, clearAuthCookie, extractAccessToken } from '../utils/authCookie.js';
import {
  createSession,
  deactivateSession,
  deactivateAllSessionsForUser,
  listActiveSessionsForUser,
} from '../models/sessionModel.js';

function userRowToResponse(row) {
  return {
    id: String(row.id),
    email: row.email,
    nombre: row.nombre ?? row.email.split('@')[0],
    rol: row.rol,
    createdAt: row.creado_en
      ? new Date(row.creado_en).toISOString()
      : new Date().toISOString(),
  };
}

async function loginSuccess(req, res, userRow) {
  const ip = getClientIp(req);
  const device = getDeviceInfo(req);
  const sessionId = await createSession(userRow.id, device, ip, 24);
  const token = generateToken(
    { id: userRow.id, email: userRow.email, rol: userRow.rol },
    sessionId
  );
  setAuthCookie(res, token);
  return { token, user: userRowToResponse(userRow), sessionId };
}

export const register = async (req, res) => {
  const { email, password, nombre } = req.body;

  if (!email || !password || !nombre) {
    return res.status(400).json({ message: 'Email, contraseña y nombre son requeridos' });
  }

  try {
    const [[dup]] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (dup) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hash = await bcrypt.hash(password, 10);
    const rolId = await getRolId('usuario');
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol_id) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, rolId]
    );

    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.nombre, r.nombre AS rol, u.creado_en
       FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE u.id = ?`,
      [result.insertId]
    );
    const u = rows[0];
    const { token, user } = await loginSuccess(req, res, u);

    return res.status(201).json({ token, user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Error al registrar' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email requerido' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password requerido' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.password, u.nombre, r.nombre AS rol, u.creado_en
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       WHERE u.email = ?`,
      [email]
    );
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const { token, user: outUser } = await loginSuccess(req, res, user);

    res.status(200).json({
      token,
      user: outUser,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

export const logout = async (req, res) => {
  const token = extractAccessToken(req);
  if (token) {
    try {
      const p = verifyToken(token);
      const uid = p.sub ?? p.id;
      if (p.sid && uid) {
        await deactivateSession(p.sid, uid);
      }
    } catch {
      /* token ya expirado: solo limpiar cookie */
    }
  }
  clearAuthCookie(res);
  res.status(200).json({ ok: true });
};

export const logoutAll = async (req, res) => {
  const userId = req.user.id;
  try {
    await deactivateAllSessionsForUser(userId, null);
    clearAuthCookie(res);
    res.status(200).json({ ok: true, message: 'Todas las sesiones cerradas' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al cerrar sesiones' });
  }
};

export const listSessions = async (req, res) => {
  try {
    const rows = await listActiveSessionsForUser(req.user.id);
    const currentId = req.sessionId;
    const out = rows.map((r) => ({
      id: String(r.id),
      deviceInfo: r.device_info ?? '',
      ipAddress: r.ip_address ?? '',
      lastActivity: r.last_activity ? new Date(r.last_activity).toISOString() : null,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : null,
      expiresAt: r.expires_at ? new Date(r.expires_at).toISOString() : null,
      isCurrent: Number(r.id) === Number(currentId),
    }));
    res.json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al listar sesiones' });
  }
};

export const revokeSession = async (req, res) => {
  const sessionId = parseInt(req.params.id, 10);
  const userId = req.user.id;
  if (!Number.isFinite(sessionId)) {
    return res.status(400).json({ message: 'ID de sesión inválido' });
  }

  try {
    const ok = await deactivateSession(sessionId, userId);
    if (!ok) {
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }
    if (Number(sessionId) === Number(req.sessionId)) {
      clearAuthCookie(res);
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error al cerrar la sesión' });
  }
};
