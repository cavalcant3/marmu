import { MMKV } from "../utils/storage";
import { applyStockMovement } from "../utils/inventory";

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  created_at: string;
}

interface ProdutoStorageState {
  products: Produto[];
  movements: string[];
}

const produtoStorage = new MMKV({ id: "marmu-local-products-v2" });
const STORAGE_KEY = "inventory";

function readState(): ProdutoStorageState {
  const raw = produtoStorage.getString(STORAGE_KEY);
  if (!raw) return { products: [], movements: [] };
  try {
    const parsed = JSON.parse(raw);
    return {
      products: Array.isArray(parsed?.products) ? parsed.products : [],
      movements: Array.isArray(parsed?.movements) ? parsed.movements : [],
    };
  } catch {
    return { products: [], movements: [] };
  }
}

function writeState(state: ProdutoStorageState): void {
  produtoStorage.set(STORAGE_KEY, JSON.stringify(state));
}

export async function listProdutos(): Promise<Produto[]> {
  return readState().products;
}

export async function saveProduto(data: Omit<Produto, "id" | "created_at">, id?: string): Promise<Produto> {
  const state = readState();
  const previous = id ? state.products.find((item) => item.id === id) : undefined;
  const produto: Produto = {
    nome: data.nome.trim(),
    descricao: data.descricao.trim(),
    preco: Number(data.preco),
    quantidade: Math.max(0, Math.floor(Number(data.quantidade) || 0)),
    id: id || `PROD-${Date.now()}`,
    created_at: previous?.created_at || new Date().toISOString(),
  };
  state.products = id
    ? state.products.map((item) => item.id === id ? produto : item)
    : [produto, ...state.products];
  writeState(state);
  return produto;
}

export async function deleteProduto(id: string): Promise<Produto[]> {
  const state = readState();
  state.products = state.products.filter((item) => item.id !== id);
  writeState(state);
  return state.products;
}

export async function consumeProdutosForPedido(
  pedidoId: string,
  itens: Array<{ produto_id: string; nome: string; quantidade: number }>
): Promise<Produto[]> {
  const state = readState();
  const updated = applyStockMovement(state, pedidoId, itens);
  if (updated !== state) writeState(updated);
  return updated.products;
}
