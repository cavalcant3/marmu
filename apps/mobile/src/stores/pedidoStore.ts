import { create } from "zustand";
import { listPedidos, createPedido, updatePedidoStatus, type Pedido } from "../services/pedidoService";
import { syncAllNotifications } from "../services/notificationService";

interface PedidoState {
  pedidos: Pedido[];
  loading: boolean;
  setPedidos: (pedidos: Pedido[]) => void;
  fetchPedidos: () => Promise<void>;
  addPedido: (pedidoData: Omit<Pedido, "id" | "created_at">) => Promise<Pedido>;
  markAsEntregue: (id: string) => Promise<void>;
}

export const usePedidoStore = create<PedidoState>((set) => ({
  pedidos: [],
  loading: false,
  setPedidos: (pedidos) => set({ pedidos }),
  fetchPedidos: async () => {
    set({ loading: true });
    try {
      const list = await listPedidos();
      set({ pedidos: list });
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      set({ loading: false });
    }
  },
  addPedido: async (pedidoData) => {
    const created = await createPedido(pedidoData);
    set((state) => ({
      pedidos: state.pedidos.some((pedido) => pedido.id === created.id)
        ? state.pedidos
        : [created, ...state.pedidos],
    }));
    syncAllNotifications().catch(console.error);
    return created;
  },
  markAsEntregue: async (id) => {
    const updatedList = await updatePedidoStatus(id, "ENTREGUE");
    set({ pedidos: updatedList });
    syncAllNotifications().catch(console.error);
  },
}));
