import api from "./api";

export interface Material {
  id: string;
  nome: string;
  tipo: string;
  preco_por_m2: number;
  observacoes?: string;
}

export async function listMaterials() {
  const res = await api.get("/materiais");
  return res.data.data as Material[];
}

export async function createMaterial(data: Omit<Material, "id">) {
  const res = await api.post("/materiais", data);
  return res.data.data as Material;
}
