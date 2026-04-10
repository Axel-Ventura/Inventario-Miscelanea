import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
export const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '24h';

/** JWT con id de sesión (sid) para validar en tabla `sessions`. */
export function generateToken(user, sessionId) {
  return jwt.sign(
    {
      sub: user.id,
      id: user.id,
      email: user.email,
      rol: user.rol,
      sid: sessionId,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
