import { findSession, updateActivity } from "../models/sessionModel.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const session = await findSession(token);

  if (!session) {
    return res.status(401).json({ message: "Sesión inválida" });
  }

  if (new Date(session.expira_en) < new Date()) {
    return res.status(401).json({ message: "Sesión expirada" });
  }

  await updateActivity(session.id);

  req.user = { id: session.usuario_id };

  next();
};