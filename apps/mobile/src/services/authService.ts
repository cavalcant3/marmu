import api from "./api";
import { USE_LOCAL_DB } from "../utils/constants";
import { MMKV } from "../utils/storage";

const localAuthStorage = new MMKV({ id: "marmu-local-auth" });

interface LoginInput {
  email: string;
  senha: string;
}

interface RegisterInput extends LoginInput {
  nome: string;
  nome_marmoaria: string;
}

export async function login(input: LoginInput) {
  if (USE_LOCAL_DB) {
    const savedUserStr = localAuthStorage.getString(`user_${input.email}`);
    const savedUser = savedUserStr
      ? JSON.parse(savedUserStr)
      : { id: `user_${Date.now()}`, email: input.email, nome: input.email.split("@")[0] || "Usuário Demo" };
    return {
      userId: savedUser.id,
      tokens: {
        accessToken: "local-demo-access-token",
        refreshToken: "local-demo-refresh-token",
      },
    };
  }
  const res = await api.post("/auth/login", input);
  return res.data.data;
}

export async function register(input: RegisterInput) {
  if (USE_LOCAL_DB) {
    const user = { id: `user_${Date.now()}`, email: input.email, nome: input.nome };
    localAuthStorage.set(`user_${input.email}`, JSON.stringify(user));
    return {
      userId: user.id,
      tokens: {
        accessToken: "local-demo-access-token",
        refreshToken: "local-demo-refresh-token",
      },
    };
  }
  const res = await api.post("/auth/register", input);
  return res.data.data;
}

