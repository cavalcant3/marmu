import { create } from "zustand";
import { deleteProduto, listProdutos, saveProduto, type Produto } from "../services/produtoService";

interface ProdutoState {
  produtos: Produto[];
  fetchProdutos: () => Promise<void>;
  saveProduto: (data: Omit<Produto, "id" | "created_at">, id?: string) => Promise<Produto>;
  removeProduto: (id: string) => Promise<void>;
}

export const useProdutoStore = create<ProdutoState>((set) => ({
  produtos: [],
  fetchProdutos: async () => set({ produtos: await listProdutos() }),
  saveProduto: async (data, id) => {
    const saved = await saveProduto(data, id);
    set((state) => ({ produtos: id
      ? state.produtos.map((item) => item.id === id ? saved : item)
      : [saved, ...state.produtos] }));
    return saved;
  },
  removeProduto: async (id) => set({ produtos: await deleteProduto(id) }),
}));
