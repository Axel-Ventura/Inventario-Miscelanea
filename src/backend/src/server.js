import app from './app.js';
import { cleanExpiredSessions } from "./models/sessionModel.js";

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

setInterval(async () => {
  try {
    await cleanExpiredSessions();
    console.log("Sesiones expiradas eliminadas");
  } catch (e) {
    console.warn("Limpieza de sesiones omitida (¿MySQL disponible?):", e.message);
  }
}, 3600000);