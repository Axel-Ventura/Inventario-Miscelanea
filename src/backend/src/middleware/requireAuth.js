import { verifyToken } from '../utils/jwt.js';
import { extractAccessToken } from '../utils/authCookie.js';
import { findActiveSession, touchSession } from '../models/sessionModel.js';

export async function requireAuth(req, res, next) {
  const token = extractAccessToken(req);
  if (!token) {
    return res.status(401).json({ message: 'No autorizado', code: 'NO_TOKEN' });
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado', code: 'INVALID_TOKEN' });
  }

  const userId = payload.sub ?? payload.id;
  const sessionId = payload.sid;

  if (!userId || !sessionId) {
    return res.status(401).json({
      message: 'Sesión no válida. Vuelve a iniciar sesión.',
      code: 'SESSION_INVALID',
    });
  }

  try {
    const session = await findActiveSession(sessionId, userId);
    if (!session) {
      return res.status(401).json({
        message: 'Tu sesión expiró o fue cerrada.',
        code: 'SESSION_REVOKED',
      });
    }

    await touchSession(sessionId);

    req.user = {
      id: userId,
      sub: userId,
      email: payload.email,
      rol: payload.rol,
    };
    req.sessionId = sessionId;
    next();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Error al validar sesión' });
  }
}
