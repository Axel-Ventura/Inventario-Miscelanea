import pool from '../config/db.js';

const TOUCH_INTERVAL_MS = 60_000;
const lastTouch = new Map();

export async function createSession(userId, deviceInfo, ipAddress, ttlHours = 24) {
  const [result] = await pool.query(
    `INSERT INTO sessions (user_id, device_info, ip_address, expires_at, is_active)
     VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? HOUR), 1)`,
    [
      userId,
      deviceInfo ? String(deviceInfo).slice(0, 512) : null,
      ipAddress ? String(ipAddress).slice(0, 45) : null,
      ttlHours,
    ]
  );
  return result.insertId;
}

export async function findActiveSession(sessionId, userId) {
  const [rows] = await pool.query(
    `SELECT id, user_id, device_info, ip_address, last_activity, created_at, expires_at, is_active
     FROM sessions
     WHERE id = ? AND user_id = ? AND is_active = 1 AND expires_at > NOW()`,
    [sessionId, userId]
  );
  return rows[0] ?? null;
}

export async function deactivateSession(sessionId, userId) {
  const [r] = await pool.query(
    'UPDATE sessions SET is_active = 0 WHERE id = ? AND user_id = ?',
    [sessionId, userId]
  );
  return r.affectedRows > 0;
}

export async function deactivateAllSessionsForUser(userId, exceptSessionId = null) {
  if (exceptSessionId != null) {
    await pool.query(
      'UPDATE sessions SET is_active = 0 WHERE user_id = ? AND id != ?',
      [userId, exceptSessionId]
    );
  } else {
    await pool.query('UPDATE sessions SET is_active = 0 WHERE user_id = ?', [userId]);
  }
}

export async function listActiveSessionsForUser(userId) {
  const [rows] = await pool.query(
    `SELECT id, device_info, ip_address, last_activity, created_at, expires_at, is_active
     FROM sessions
     WHERE user_id = ? AND is_active = 1 AND expires_at > NOW()
     ORDER BY last_activity DESC`,
    [userId]
  );
  return rows;
}

export async function touchSession(sessionId) {
  const now = Date.now();
  const prev = lastTouch.get(sessionId);
  if (prev && now - prev < TOUCH_INTERVAL_MS) return;
  lastTouch.set(sessionId, now);
  await pool.query('UPDATE sessions SET last_activity = NOW() WHERE id = ?', [sessionId]);
}

export async function cleanExpiredSessions() {
  await pool.query('DELETE FROM sessions WHERE expires_at < NOW()');
}

export async function ensureSessionsTable() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      device_info VARCHAR(512) NULL,
      ip_address VARCHAR(45) NULL,
      last_activity DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      INDEX idx_sessions_user_active (user_id, is_active),
      INDEX idx_sessions_expires (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `
  );
}

export function clearTouchCache() {
  lastTouch.clear();
}
