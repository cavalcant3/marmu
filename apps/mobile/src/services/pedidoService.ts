import api from "./api";
import { USE_LOCAL_DB } from "../utils/constants";
import { MMKV } from "../utils/storage";
import type { CustoAdicional, Medicao, ProdutoOrcamento } from "./orcamentoService";
import { consumeProdutosForPedido } from "./produtoService";

export interface Pedido {
  id: string;
  orcamento_id: string;
  cliente_nome: string;
  projeto: string;
  material_nome: string;
  acabamento: string;
  tipo_calculo?: "M2" | "ML";
  metragem_calculada?: number;
  medicoes?: Medicao[];
  custos_adicionais?: CustoAdicional[];
  subtotal_material?: number;
  total_adicionais?: number;
  produtos?: ProdutoOrcamento[];
  total_produtos?: number;
  data_prometida_entrega: string;
  valor: number;
  pendente: number;
  status: "PENDENTE" | "ENTREGUE";
  etapa: string;
  observacoes?: string;
  created_at: string;
  estoque_baixado?: boolean;
}

const pedidoStorage = new MMKV({ id: "marmu-local-pedidos" });

export const INITIAL_PEDIDOS: Pedido[] = [];

const LEGACY_SEED_PEDIDOS = new Set(["PED-102", "PED-101", "PED-100", "PED-099"]);

function removeLegacySeeds(items: Pedido[]): Pedido[] {
  return items.filter((item) => !LEGACY_SEED_PEDIDOS.has(item.id));
}

export async function listPedidos(): Promise<Pedido[]> {
  if (USE_LOCAL_DB) {
    const dataStr = pedidoStorage.getString("pedidos");
    if (!dataStr) {
      return INITIAL_PEDIDOS;
    }
    try {
      const parsed = JSON.parse(dataStr);
      if (!Array.isArray(parsed)) return [];

      const cleaned = removeLegacySeeds(parsed);
      if (cleaned.length !== parsed.length) {
        pedidoStorage.set("pedidos", JSON.stringify(cleaned));
      }
      return cleaned;
    } catch {
      return [];
    }
  }
  const res = await api.get("/pedidos");
  const backendData = res.data.data || [];
  return backendData.map((p: any) => ({
    id: p.id,
    orcamento_id: p.orcamento_id,
    cliente_nome: p.orcamento?.cliente_nome || "Cliente",
    projeto: p.orcamento?.projeto || "Projeto",
    material_nome: p.orcamento?.material?.nome || "Material",
    acabamento: p.observacoes || "Processando",
    data_prometida_entrega: new Date(p.data_prometida_entrega).toLocaleDateString("pt-BR"),
    valor: Number(p.orcamento?.preco_final || 0),
    pendente: p.status === "ENTREGUE" ? 0 : Number(p.orcamento?.preco_final || 0) * 0.5,
    status: p.status,
    etapa: p.status === "ENTREGUE" ? "Instalação Concluída" : "Produção",
    observacoes: p.observacoes,
    created_at: p.created_at,
  }));
}

const pedidoCreationLocks = new Map<string, Promise<Pedido>>();

export function createPedido(data: Omit<Pedido, "id" | "created_at">): Promise<Pedido> {
  const inFlight = pedidoCreationLocks.get(data.orcamento_id);
  if (inFlight) return inFlight;

  const creation = createPedidoOnce(data).finally(() => {
    pedidoCreationLocks.delete(data.orcamento_id);
  });
  pedidoCreationLocks.set(data.orcamento_id, creation);
  return creation;
}

async function createPedidoOnce(data: Omit<Pedido, "id" | "created_at">): Promise<Pedido> {
  const current = await listPedidos();
  const existing = current.find((pedido) => pedido.orcamento_id === data.orcamento_id);
  if (existing) return existing;

  if (USE_LOCAL_DB) {
    const newPedido: Pedido = {
      ...data,
      id: `PED-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newPedido, ...current];
    pedidoStorage.set("pedidos", JSON.stringify(updated));
    return newPedido;
  }

  const [day, month, year] = data.data_prometida_entrega.split("/").map(Number);
  const promisedDate = new Date(year, month - 1, day, 12);

  const apiBody = {
    orcamento_id: data.orcamento_id,
    data_prometida_entrega: promisedDate.toISOString(),
    observacoes: data.observacoes,
  };

  const res = await api.post("/pedidos", apiBody);
  const p = res.data.data;
  return {
    id: p.id,
    orcamento_id: p.orcamento_id,
    cliente_nome: p.orcamento?.cliente_nome || data.cliente_nome,
    projeto: p.orcamento?.projeto || data.projeto,
    material_nome: p.orcamento?.material?.nome || data.material_nome,
    acabamento: p.observacoes || data.acabamento,
    data_prometida_entrega: new Date(p.data_prometida_entrega).toLocaleDateString("pt-BR"),
    valor: Number(p.orcamento?.preco_final || data.valor),
    pendente: p.status === "ENTREGUE" ? 0 : Number(p.orcamento?.preco_final || data.valor) * 0.5,
    status: p.status,
    etapa: p.status === "ENTREGUE" ? "Instalação Concluída" : "Produção",
    observacoes: p.observacoes,
    created_at: p.created_at,
  };
}

export async function updatePedidoStatus(id: string, status: Pedido["status"]): Promise<Pedido[]> {
  if (USE_LOCAL_DB) {
    const current = await listPedidos();
    const target = current.find((pedido) => pedido.id === id);
    const produtosComEstoque = target?.produtos?.filter((item) => item.produto_id && item.nome) || [];
    if (status === "ENTREGUE" && target?.status !== "ENTREGUE" && produtosComEstoque.length) {
      await consumeProdutosForPedido(id, produtosComEstoque.map((item) => ({
        produto_id: item.produto_id,
        nome: item.nome,
        quantidade: item.quantidade,
      })));
    }
    const updated = current.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status,
          pendente: status === "ENTREGUE" ? 0 : p.pendente,
          etapa: status === "ENTREGUE" ? "Instalação Concluída" : p.etapa,
          estoque_baixado: status === "ENTREGUE" ? true : p.estoque_baixado,
        };
      }
      return p;
    });
    pedidoStorage.set("pedidos", JSON.stringify(updated));
    return updated;
  }

  try {
    if (status === "ENTREGUE") {
      await api.put(`/pedidos/${id}/entregue`);
    }
  } catch (err) {
    console.error("Failed to mark order as delivered in API", err);
  }
  return listPedidos();
}
