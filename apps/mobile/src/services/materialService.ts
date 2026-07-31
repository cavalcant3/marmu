import api from "./api";
import { USE_LOCAL_DB } from "../utils/constants";
import { MMKV } from "../utils/storage";

export interface Material {
  id: string;
  nome: string;
  tipo: string;
  preco_por_m2: number;
  observacoes?: string;
}

const materialStorage = new MMKV({ id: "marmu-local-materials" });

export const INITIAL_MATERIALS: Material[] = [
  { id: "1", nome: "Granito Preto São Gabriel", tipo: "Granito", preco_por_m2: 350 },
  { id: "2", nome: "Mármore Branco Carrara", tipo: "Mármore", preco_por_m2: 850 },
  { id: "3", nome: "Quartzo Branco Puríssimo", tipo: "Quartzo", preco_por_m2: 1200 },
  { id: "4", nome: "Granito Verde Ubatuba", tipo: "Granito", preco_por_m2: 280 },
  { id: "5", nome: "Mármore Travertino Romano", tipo: "Mármore", preco_por_m2: 650 },
];

export async function listMaterials(): Promise<Material[]> {
  if (USE_LOCAL_DB) {
    const dataStr = materialStorage.getString("materials");
    if (!dataStr) {
      materialStorage.set("materials", JSON.stringify(INITIAL_MATERIALS));
      return INITIAL_MATERIALS;
    }
    try {
      return JSON.parse(dataStr);
    } catch {
      return INITIAL_MATERIALS;
    }
  }
  const res = await api.get("/materiais");
  return res.data.data as Material[];
}

export async function createMaterial(data: Omit<Material, "id">): Promise<Material> {
  if (USE_LOCAL_DB) {
    const current = await listMaterials();
    const newMaterial: Material = { ...data, id: Date.now().toString() };
    const updated = [...current, newMaterial];
    materialStorage.set("materials", JSON.stringify(updated));
    return newMaterial;
  }
  const res = await api.post("/materiais", data);
  return res.data.data as Material;
}

export async function updateMaterial(id: string, preco_por_m2: number): Promise<Material[]> {
  if (USE_LOCAL_DB) {
    const current = await listMaterials();
    const updated = current.map((m) => (m.id === id ? { ...m, preco_por_m2 } : m));
    materialStorage.set("materials", JSON.stringify(updated));
    return updated;
  }
  const res = await api.patch(`/materiais/${id}`, { preco_por_m2 });
  return res.data.data;
}

