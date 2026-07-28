import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("Auth API", () => {
  it("POST /api/v1/auth/register — should register a new user", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "test@marmu.com",
      senha: "senha123",
      nome: "Test User",
      nome_marmoaria: "Test Marmoaria",
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens.accessToken).toBeDefined();
    expect(res.body.data.tokens.refreshToken).toBeDefined();
  });

  it("POST /api/v1/auth/login — should login with valid credentials", async () => {
    await request(app).post("/api/v1/auth/register").send({
      email: "login@test.com",
      senha: "senha123",
      nome: "Login Test",
      nome_marmoaria: "Test",
    });

    const res = await request(app).post("/api/v1/auth/login").send({
      email: "login@test.com",
      senha: "senha123",
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens.accessToken).toBeDefined();
  });

  it("POST /api/v1/auth/login — should fail with wrong password", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "login@test.com",
      senha: "wrongpassword",
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
