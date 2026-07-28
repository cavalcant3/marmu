import prisma from "../config/database.js";

export interface CreatePedidoInput {
  orcamento_id: string;
  data_prometida_entrega: Date;
  observacoes?: string;
}

export async function createPedido(input: CreatePedidoInput) {
  return prisma.pedido.create({
    data: input,
    include: { orcamento: { include: { material: true } } },
  });
}

export async function listPedidos(usuarioId: string, status?: string) {
  return prisma.pedido.findMany({
    where: {
      orcamento: { usuario_id: usuarioId },
      ...(status && { status: status as any }),
    },
    include: { orcamento: { include: { material: true } } },
    orderBy: { data_prometida_entrega: "asc" },
  });
}

export async function getPedido(id: string, usuarioId: string) {
  return prisma.pedido.findFirst({
    where: { id, orcamento: { usuario_id: usuarioId } },
    include: { orcamento: { include: { material: true } } },
  });
}

export async function marcarEntregue(id: string, usuarioId: string) {
  return prisma.pedido.updateMany({
    where: { id, orcamento: { usuario_id: usuarioId } },
    data: { status: "ENTREGUE", data_entrega_real: new Date() },
  });
}
