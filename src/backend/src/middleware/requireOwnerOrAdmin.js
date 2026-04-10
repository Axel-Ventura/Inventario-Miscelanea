export function requireOwnerOrAdmin(req, res, next) {
  const userId = req.user?.id;
  const targetId = req.params.id;

  if (!userId) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  const isAdmin = req.user?.rol === 'admin';
  const isOwner = String(userId) === String(targetId);

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ message: 'No tienes permiso para modificar este usuario' });
  }

  next();
}
