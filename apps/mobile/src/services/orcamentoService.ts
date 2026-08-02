import api from "./api";
import { USE_LOCAL_DB } from "../utils/constants";
import { MMKV } from "../utils/storage";

export interface Medicao {
  id: string;
  descricao: string;
  comprimento: number;
  largura: number;
  quantidade: number;
  area: number;
  metros_lineares?: number;
}

export interface CustoAdicional {
  id: string;
  tipo: "MAO_DE_OBRA" | "ACABAMENTO";
  descricao: string;
  valor: number;
}

export interface ProdutoOrcamento {
  produto_id: string;
  nome: string;
  descricao?: string;
  preco_unitario: number;
  quantidade: number;
  subtotal: number;
}

export interface Orcamento {
  id: string;
  cliente_nome: string;
  telefone?: string;
  projeto: string;
  comprimento: number;
  largura: number;
  area: number;
  tipo_calculo?: "M2" | "ML";
  metragem_calculada?: number;
  medicoes?: Medicao[];
  material_id: string;
  material_nome: string;
  material_preco: number;
  preco_sugerido: number;
  preco_final: number;
  subtotal_material?: number;
  total_adicionais?: number;
  custos_adicionais?: CustoAdicional[];
  produtos?: ProdutoOrcamento[];
  total_produtos?: number;
  observacoes?: string;
  status: "PENDENTE" | "APROVADO" | "REJEITADO" | "VENCIDO";
  created_at: string;
}

export function getOrcamentoMedicoes(orcamento: Orcamento): Medicao[] {
  if (Array.isArray(orcamento.medicoes) && orcamento.medicoes.length > 0) {
    return orcamento.medicoes;
  }
  return [{
    id: "medicao-1",
    descricao: orcamento.projeto || "Peça 1",
    comprimento: Number(orcamento.comprimento || 0),
    largura: Number(orcamento.largura || 0),
    quantidade: 1,
    area: Number(orcamento.area || 0),
    metros_lineares: Number(orcamento.comprimento || 0),
  }];
}

const orcamentoStorage = new MMKV({ id: "marmu-local-orcamentos" });

export const INITIAL_ORCAMENTOS: Orcamento[] = [];

const LEGACY_SEED_ORCAMENTOS = new Map([
  ["ORC-2026-001", "João da Silva"],
  ["ORC-2026-002", "Maria Oliveira"],
  ["ORC-2026-003", "Carlos Eduardo"],
]);

function removeLegacySeeds(items: Orcamento[]): Orcamento[] {
  return items.filter(
    (item) => LEGACY_SEED_ORCAMENTOS.get(item.id) !== item.cliente_nome
  );
}

export async function listOrcamentos(): Promise<Orcamento[]> {
  if (USE_LOCAL_DB) {
    const dataStr = orcamentoStorage.getString("orcamentos");
    if (!dataStr) {
      return INITIAL_ORCAMENTOS;
    }
    try {
      const parsed = JSON.parse(dataStr);
      if (!Array.isArray(parsed)) return [];

      const cleaned = removeLegacySeeds(parsed);
      if (cleaned.length !== parsed.length) {
        orcamentoStorage.set("orcamentos", JSON.stringify(cleaned));
      }
      return cleaned;
    } catch {
      return [];
    }
  }
  const res = await api.get("/orcamentos");
  const backendData = res.data.data || [];
  return backendData.map((o: any) => ({
    id: o.id,
    cliente_nome: o.cliente_nome,
    projeto: o.projeto || "Projeto",
    comprimento: Number(o.comprimento),
    largura: Number(o.largura),
    area: Number(o.area),
    tipo_calculo: o.tipo_calculo || "M2",
    metragem_calculada: Number(o.metragem_calculada || o.area),
    material_id: o.material_id,
    material_nome: o.material?.nome || "Material",
    material_preco: Number(o.material?.preco_por_m2 || 0),
    preco_sugerido: Number(o.preco_sugerido),
    preco_final: Number(o.preco_final),
    observacoes: o.observacoes,
    status: o.status,
    created_at: o.created_at,
  }));
}

export async function createOrcamento(data: Omit<Orcamento, "id" | "created_at">): Promise<Orcamento> {
  if (USE_LOCAL_DB) {
    const current = await listOrcamentos();
    const newOrcamento: Orcamento = {
      ...data,
      id: `ORC-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newOrcamento, ...current];
    orcamentoStorage.set("orcamentos", JSON.stringify(updated));
    return newOrcamento;
  }

  const apiBody = {
    cliente_nome: data.cliente_nome,
    comprimento: data.comprimento,
    largura: data.largura,
    area: data.area,
    tipo_calculo: data.tipo_calculo,
    metragem_calculada: data.metragem_calculada,
    material_id: data.material_id,
    preco_sugerido: data.preco_sugerido,
    preco_final: data.preco_final,
    observacoes: data.observacoes,
  };

  const res = await api.post("/orcamentos", apiBody);
  const o = res.data.data;
  return {
    id: o.id,
    cliente_nome: o.cliente_nome,
    projeto: o.projeto || data.projeto,
    comprimento: Number(o.comprimento),
    largura: Number(o.largura),
    area: Number(o.area),
    tipo_calculo: o.tipo_calculo || data.tipo_calculo || "M2",
    metragem_calculada: Number(o.metragem_calculada || data.metragem_calculada || o.area),
    material_id: o.material_id,
    material_nome: o.material?.nome || data.material_nome,
    material_preco: Number(o.material?.preco_por_m2 || data.material_preco),
    preco_sugerido: Number(o.preco_sugerido),
    preco_final: Number(o.preco_final),
    observacoes: o.observacoes,
    status: o.status,
    created_at: o.created_at,
  };
}

export async function updateOrcamentoStatus(id: string, status: Orcamento["status"]): Promise<Orcamento[]> {
  if (USE_LOCAL_DB) {
    const current = await listOrcamentos();
    const updated = current.map((o) => (o.id === id ? { ...o, status } : o));
    orcamentoStorage.set("orcamentos", JSON.stringify(updated));
    return updated;
  }

  try {
    await api.patch(`/orcamentos/${id}`, { status });
  } catch (err) {
    console.error("Failed to update status on API", err);
  }
  return listOrcamentos();
}
