import api from "./api";
import { USE_LOCAL_DB } from "../utils/constants";
import { MMKV } from "../utils/storage";

export interface Material {
  id: string;
  nome: string;
  tipo: string;
  preco_por_m2: number;
  preco_por_metro_linear?: number;
  observacoes?: string;
}

const materialStorage = new MMKV({ id: "marmu-local-materials" });

export const INITIAL_MATERIALS: Material[] = [];

const LEGACY_SEED_MATERIALS = new Map([
  ["1", "Granito Preto São Gabriel"],
  ["2", "Mármore Branco Carrara"],
  ["3", "Quartzo Branco Puríssimo"],
  ["4", "Granito Verde Ubatuba"],
  ["5", "Mármore Travertino Romano"],
]);

function removeLegacySeeds(items: Material[]): Material[] {
  return items.filter(
    (item) => LEGACY_SEED_MATERIALS.get(item.id) !== item.nome
  );
}

export async function listMaterials(): Promise<Material[]> {
  if (USE_LOCAL_DB) {
    const dataStr = materialStorage.getString("materials");
    if (!dataStr) {
      return INITIAL_MATERIALS;
    }
    try {
      const parsed = JSON.parse(dataStr);
      if (!Array.isArray(parsed)) return [];

      const cleaned = removeLegacySeeds(parsed);
      if (cleaned.length !== parsed.length) {
        materialStorage.set("materials", JSON.stringify(cleaned));
      }
      return cleaned;
    } catch {
      return [];
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

export async function updateMaterial(id: string, updates: Partial<Omit<Material, "id">>): Promise<Material[]> {
  if (USE_LOCAL_DB) {
    const current = await listMaterials();
    const updated = current.map((m) => (m.id === id ? { ...m, ...updates } : m));
    materialStorage.set("materials", JSON.stringify(updated));
    return updated;
  }
  const res = await api.patch(`/materiais/${id}`, updates);
  return res.data.data;
}
