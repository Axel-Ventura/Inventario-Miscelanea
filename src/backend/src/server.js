import app from './app.js';
import { cleanExpiredSessions, ensureSessionsTable } from './models/sessionModel.js';

const PORT = Number(process.env.PORT) || 4000;

async function startServer() {
  try {
    await ensureSessionsTable();
    console.log('Tabla sessions verificada/creada.');
  } catch (e) {
    console.error('No se pudo asegurar la tabla sessions:', e.message);
    process.exit(1);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

startServer();

setInterval(async () => {
  try {
    await cleanExpiredSessions();
    console.log("Sesiones expiradas eliminadas");
  } catch (e) {
    console.warn("Limpieza de sesiones omitida (¿MySQL disponible?):", e.message);
  }
}, 3600000);