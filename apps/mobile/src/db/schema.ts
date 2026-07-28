export const ORCAMENTOS_TABLE = `
CREATE TABLE IF NOT EXISTS orcamentos (
  id TEXT PRIMARY KEY,
  cliente_nome TEXT,
  comprimento REAL,
  largura REAL,
  area REAL,
  material_id TEXT,
  material_nome TEXT,
  material_preco REAL,
  preco_sugerido REAL,
  preco_final REAL,
  observacoes TEXT,
  status TEXT DEFAULT 'PENDENTE',
  created_at TEXT,
  synced INTEGER DEFAULT 0
);
`;

export const PEDIDOS_TABLE = `
CREATE TABLE IF NOT EXISTS pedidos (
  id TEXT PRIMARY KEY,
  orcamento_id TEXT,
  cliente_nome TEXT,
  data_prometida_entrega TEXT,
  status TEXT DEFAULT 'PENDENTE',
  observacoes TEXT,
  synced INTEGER DEFAULT 0
);
`;

export const MATERIAIS_TABLE = `
CREATE TABLE IF NOT EXISTS materiais (
  id TEXT PRIMARY KEY,
  nome TEXT,
  tipo TEXT,
  preco_por_m2 REAL,
  observacoes TEXT,
  usuario_id TEXT,
  synced INTEGER DEFAULT 0
);
`;
