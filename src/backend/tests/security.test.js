import request from 'supertest';
import app from '../src/app.js';

describe('Seguridad API', () => {
  test('GET /api/products sin token → 401', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(401);
    expect(res.body.code).toBe('NO_TOKEN');
  });

  test('GET /api/products con Bearer inválido → 401', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', 'Bearer token-invalido');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/products con JWT sin sid (legado) → 401', async () => {
    const jwt = await import('jsonwebtoken');
    const legacy = jwt.default.sign(
      { id: 1, email: 'a@b.com', rol: 'admin' },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1h' }
    );
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${legacy}`);
    expect(res.statusCode).toBe(401);
    expect(res.body.code).toBe('SESSION_INVALID');
  });
});
