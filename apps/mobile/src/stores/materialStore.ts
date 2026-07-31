import { create } from "zustand";
import { INITIAL_MATERIALS, listMaterials, createMaterial, updateMaterial, type Material } from "../services/materialService";

interface MaterialState {
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
  fetchMaterials: () => Promise<void>;
  addMaterial: (material: Omit<Material, "id">) => Promise<void>;
  updatePrice: (id: string, preco_por_m2: number) => Promise<void>;
}

export const useMaterialStore = create<MaterialState>((set) => ({
  materials: INITIAL_MATERIALS,
  setMaterials: (materials) => set({ materials }),
  fetchMaterials: async () => {
    const list = await listMaterials();
    set({ materials: list });
  },
  addMaterial: async (materialData) => {
    const created = await createMaterial(materialData);
    set((state) => ({ materials: [...state.materials, created] }));
  },
  updatePrice: async (id, preco_por_m2) => {
    const updatedList = await updateMaterial(id, preco_por_m2);
    set({ materials: updatedList });
  },
}));

