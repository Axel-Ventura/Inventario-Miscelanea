export function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim().slice(0, 45);
  }
  const raw = req.socket?.remoteAddress || req.ip || '';
  return String(raw).slice(0, 45);
}

export function getDeviceInfo(req) {
  const ua = req.headers['user-agent'];
  return typeof ua === 'string' ? ua.slice(0, 512) : null;
}
