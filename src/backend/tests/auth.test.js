import request from "supertest";
import app from "../src/app.js";

describe("POST /api/auth/login", () => {

  (process.env.RUN_LOGIN_INTEGRATION ? test : test.skip)(
    "credenciales correctas → 200 + token (requiere MySQL, usuario admin@test.com y tabla sessions)",
    async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "admin@test.com",
        password: "123456",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    }
  );

  test("email incorrecto → 401", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "fake@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(401);

  });

  test("contraseña incorrecta → 401", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test.com",
        password: "wrongpass"
      });

    expect(res.statusCode).toBe(401);

  });

  test("email vacío → 400", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        password: "123456"
      });

    expect(res.statusCode).toBe(400);

  });

  test("password vacío → 400", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test.com"
      });

    expect(res.statusCode).toBe(400);

  });

});