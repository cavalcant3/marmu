import { create } from "zustand";
import { changeCompromissoStatus, deleteCompromisso, listCompromissos, saveCompromisso, type CompromissoAgenda, type DadosCompromisso, type StatusCompromisso } from "../services/agendaService";
import { syncAllNotifications } from "../services/notificationService";

interface AgendaState {
  compromissos: CompromissoAgenda[];
  fetchCompromissos: () => Promise<void>;
  saveCompromisso: (data: DadosCompromisso, id?: string) => Promise<CompromissoAgenda>;
  changeStatus: (id: string, status: StatusCompromisso) => Promise<void>;
  removeCompromisso: (id: string) => Promise<void>;
}

export const useAgendaStore = create<AgendaState>((set) => ({
  compromissos: [],
  fetchCompromissos: async () => set({ compromissos: await listCompromissos() }),
  saveCompromisso: async (data, id) => {
    const saved = await saveCompromisso(data, id);
    set({ compromissos: await listCompromissos() });
    syncAllNotifications().catch(console.error);
    return saved;
  },
  changeStatus: async (id, status) => {
    set({ compromissos: await changeCompromissoStatus(id, status) });
    syncAllNotifications().catch(console.error);
  },
  removeCompromisso: async (id) => {
    set({ compromissos: await deleteCompromisso(id) });
    syncAllNotifications().catch(console.error);
  },
}));
