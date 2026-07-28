import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import type { TokenPayload } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: {
        type: "https://api.marmu.app/errors/unauthorized",
        title: "Unauthorized",
        status: 401,
        detail: "Token de acesso não fornecido",
      },
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: {
        type: "https://api.marmu.app/errors/unauthorized",
        title: "Unauthorized",
        status: 401,
        detail: "Token inválido ou expirado",
      },
    });
    return;
  }
}
