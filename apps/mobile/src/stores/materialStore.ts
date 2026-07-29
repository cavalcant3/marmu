import { create } from "zustand";
import type { Material } from "../services/materialService";

interface MaterialState {
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
  addMaterial: (material: Material) => void;
}

export const useMaterialStore = create<MaterialState>((set) => ({
  materials: [],
  setMaterials: (materials) => set({ materials }),
  addMaterial: (material) =>
    set((state) => ({ materials: [...state.materials, material] })),
}));
