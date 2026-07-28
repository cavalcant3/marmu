import api from "./api.js";

interface LoginInput {
  email: string;
  senha: string;
}

interface RegisterInput extends LoginInput {
  nome: string;
  nome_marmoaria: string;
}

export async function login(input: LoginInput) {
  const res = await api.post("/auth/login", input);
  return res.data.data;
}

export async function register(input: RegisterInput) {
  const res = await api.post("/auth/register", input);
  return res.data.data;
}
