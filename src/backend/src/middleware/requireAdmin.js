export function requireAdmin(req, res, next) {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ message: 'Se requiere rol administrador', code: 'FORBIDDEN_ROLE' });
  }
  next();
}
