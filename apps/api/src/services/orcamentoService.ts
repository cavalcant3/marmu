import prisma from "../config/database.js";

export interface CreateOrcamentoInput {
  cliente_nome: string;
  comprimento: number;
  largura: number;
  area: number;
  material_id: string;
  preco_sugerido: number;
  preco_final: number;
  observacoes?: string;
  usuario_id: string;
}

export async function createOrcamento(input: CreateOrcamentoInput) {
  return prisma.orcamento.create({
    data: {
      ...input,
      status: "PENDENTE",
    },
    include: { material: true },
  });
}

export async function listOrcamentos(usuarioId: string) {
  return prisma.orcamento.findMany({
    where: { usuario_id: usuarioId },
    include: { material: true },
    orderBy: { created_at: "desc" },
  });
}

export async function getOrcamento(id: string, usuarioId: string) {
  return prisma.orcamento.findFirst({
    where: { id, usuario_id: usuarioId },
    include: { material: true },
  });
}

export async function updateOrcamento(id: string, usuarioId: string, data: Partial<CreateOrcamentoInput>) {
  return prisma.orcamento.updateMany({
    where: { id, usuario_id: usuarioId },
    data,
  });
}
