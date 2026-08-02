import { create } from "zustand";
import { listMaterials, createMaterial, updateMaterial, type Material } from "../services/materialService";

interface MaterialState {
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
  fetchMaterials: () => Promise<void>;
  addMaterial: (material: Omit<Material, "id">) => Promise<void>;
  updatePrice: (id: string, updates: Partial<Omit<Material, "id">>) => Promise<void>;
}

export const useMaterialStore = create<MaterialState>((set) => ({
  materials: [],
  setMaterials: (materials) => set({ materials }),
  fetchMaterials: async () => {
    const list = await listMaterials();
    set({ materials: list });
  },
  addMaterial: async (materialData) => {
    const created = await createMaterial(materialData);
    set((state) => ({ materials: [...state.materials, created] }));
  },
  updatePrice: async (id, updates) => {
    const updatedList = await updateMaterial(id, updates);
    set({ materials: updatedList });
  },
}));
