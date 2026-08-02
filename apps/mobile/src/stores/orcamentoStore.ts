import { create } from "zustand";
import { listOrcamentos, createOrcamento, updateOrcamentoStatus, type Orcamento } from "../services/orcamentoService";

interface OrcamentoState {
  orcamentos: Orcamento[];
  loading: boolean;
  setOrcamentos: (orcamentos: Orcamento[]) => void;
  fetchOrcamentos: () => Promise<void>;
  addOrcamento: (orcamentoData: Omit<Orcamento, "id" | "created_at">) => Promise<Orcamento>;
  updateStatus: (id: string, status: Orcamento["status"]) => Promise<void>;
}

export const useOrcamentoStore = create<OrcamentoState>((set) => ({
  orcamentos: [],
  loading: false,
  setOrcamentos: (orcamentos) => set({ orcamentos }),
  fetchOrcamentos: async () => {
    set({ loading: true });
    try {
      const list = await listOrcamentos();
      set({ orcamentos: list });
    } catch (err) {
      console.error("Failed to fetch budgets", err);
    } finally {
      set({ loading: false });
    }
  },
  addOrcamento: async (orcamentoData) => {
    const created = await createOrcamento(orcamentoData);
    set((state) => ({ orcamentos: [created, ...state.orcamentos] }));
    return created;
  },
  updateStatus: async (id, status) => {
    const updatedList = await updateOrcamentoStatus(id, status);
    set({ orcamentos: updatedList });
  },
}));
