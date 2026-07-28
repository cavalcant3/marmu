import type { Request, Response } from "express";
import { register, login, refreshTokens } from "../services/authService.js";
import logger from "../utils/logger.js";

export async function registerHandler(req: Request, res: Response) {
  try {
    const { email, senha, nome, nome_marmoaria } = req.body;
    const result = await register({ email, senha, nome, nome_marmoaria });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    logger.warn({ error: (error as Error).message }, "Registration failed");
    res.status(400).json({
      success: false,
      error: {
        type: "https://api.marmu.app/errors/validation-failed",
        title: "Validation Failed",
        status: 400,
        detail: (error as Error).message,
      },
    });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;
    const result = await login({ email, senha });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    logger.warn({ error: (error as Error).message }, "Login failed");
    res.status(401).json({
      success: false,
      error: {
        type: "https://api.marmu.app/errors/unauthorized",
        title: "Unauthorized",
        status: 401,
        detail: "Email ou senha incorretos",
      },
    });
  }
}

export async function refreshHandler(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    const tokens = await refreshTokens(refreshToken);
    res.status(200).json({ success: true, data: tokens });
  } catch (error) {
    logger.warn({ error: (error as Error).message }, "Token refresh failed");
    res.status(401).json({
      success: false,
      error: {
        type: "https://api.marmu.app/errors/unauthorized",
        title: "Unauthorized",
        status: 401,
        detail: "Token inválido ou expirado",
      },
    });
  }
}
