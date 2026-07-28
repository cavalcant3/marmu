import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "marmu-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "marmu-refresh-secret";
const ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION || "24h";
const REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || "7d";

export interface TokenPayload {
  userId: string;
  email: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRATION });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRATION });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
}
