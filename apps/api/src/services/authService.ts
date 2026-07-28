import prisma from "../config/database.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import type { TokenPayload } from "../utils/jwt.js";

export interface RegisterInput {
  email: string;
  senha: string;
  nome: string;
  nome_marmoaria: string;
}

export interface LoginInput {
  email: string;
  senha: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export async function register(input: RegisterInput): Promise<{ userId: string; tokens: AuthTokens }> {
  const existingUser = await prisma.usuario.findUnique({ where: { email: input.email } });
  if (existingUser) {
    throw new Error("Email já cadastrado");
  }

  const senha_hash = await hashPassword(input.senha);

  const user = await prisma.usuario.create({
    data: {
      email: input.email,
      senha_hash,
      nome: input.nome,
      nome_marmoaria: input.nome_marmoaria,
    },
  });

  const payload: TokenPayload = { userId: user.id, email: user.email };
  const tokens = {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };

  return { userId: user.id, tokens };
}

export async function login(input: LoginInput): Promise<{ userId: string; tokens: AuthTokens }> {
  const user = await prisma.usuario.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new Error("Email ou senha incorretos");
  }

  const isValid = await comparePassword(input.senha, user.senha_hash);
  if (!isValid) {
    throw new Error("Email ou senha incorretos");
  }

  const payload: TokenPayload = { userId: user.id, email: user.email };
  const tokens = {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };

  return { userId: user.id, tokens };
}

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  const payload = verifyRefreshToken(refreshToken);

  const user = await prisma.usuario.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const newPayload: TokenPayload = { userId: user.id, email: user.email };
  return {
    accessToken: generateAccessToken(newPayload),
    refreshToken: generateRefreshToken(newPayload),
  };
}
