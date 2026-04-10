export const AUTH_COOKIE_NAME = 'access_token';

export function getCookieOptions() {
  const maxAgeMs = 24 * 60 * 60 * 1000;
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: maxAgeMs,
    path: '/',
  };
}

export function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions());
}

export function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
}

export function extractAccessToken(req) {
  const c = req.cookies?.[AUTH_COOKIE_NAME];
  if (c) return c;
  const h = req.headers.authorization;
  if (h?.startsWith('Bearer ')) return h.slice(7);
  return null;
}
