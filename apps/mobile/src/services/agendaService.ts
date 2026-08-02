import { MMKV } from "../utils/storage";
import { sortAgendaItems } from "../utils/agenda";

export type TipoCompromisso = "MEDICAO" | "VISITA" | "INSTALACAO";
export type StatusCompromisso = "PENDENTE" | "CONCLUIDO" | "CANCELADO";

export interface CompromissoAgenda {
  id: string;
  tipo: TipoCompromisso;
  cliente_nome: string;
  telefone?: string;
  endereco: string;
  data: string;
  hora: string;
  observacoes?: string;
  status: StatusCompromisso;
  created_at: string;
}

export type DadosCompromisso = Omit<CompromissoAgenda, "id" | "created_at">;

const agendaStorage = new MMKV({ id: "marmu-local-agenda" });
const STORAGE_KEY = "appointments";

export async function listCompromissos(): Promise<CompromissoAgenda[]> {
  const raw = agendaStorage.getString(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? sortAgendaItems(parsed) : [];
  } catch {
    return [];
  }
}

export async function saveCompromisso(data: DadosCompromisso, id?: string): Promise<CompromissoAgenda> {
  const current = await listCompromissos();
  const previous = id ? current.find((item) => item.id === id) : undefined;
  const saved: CompromissoAgenda = {
    ...data,
    cliente_nome: data.cliente_nome.trim(),
    telefone: data.telefone?.trim() || undefined,
    endereco: data.endereco.trim(),
    observacoes: data.observacoes?.trim() || undefined,
    id: id || `AGENDA-${Date.now()}`,
    created_at: previous?.created_at || new Date().toISOString(),
  };
  const updated = id ? current.map((item) => item.id === id ? saved : item) : [...current, saved];
  agendaStorage.set(STORAGE_KEY, JSON.stringify(sortAgendaItems(updated)));
  return saved;
}

export async function changeCompromissoStatus(id: string, status: StatusCompromisso): Promise<CompromissoAgenda[]> {
  const updated = (await listCompromissos()).map((item) => item.id === id ? { ...item, status } : item);
  agendaStorage.set(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function deleteCompromisso(id: string): Promise<CompromissoAgenda[]> {
  const updated = (await listCompromissos()).filter((item) => item.id !== id);
  agendaStorage.set(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
