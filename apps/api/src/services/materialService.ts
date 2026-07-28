import prisma from "../config/database.js";

export interface CreateMaterialInput {
  nome: string;
  tipo: "GRANITO" | "MARMORE" | "PORCELANATO" | "OUTRO";
  preco_por_m2: number;
  observacoes?: string;
  usuario_id: string;
}

export async function createMaterial(input: CreateMaterialInput) {
  return prisma.material.create({ data: input });
}

export async function listMaterials(usuarioId: string) {
  return prisma.material.findMany({
    where: { usuario_id: usuarioId },
    orderBy: { nome: "asc" },
  });
}

export async function getMaterial(id: string, usuarioId: string) {
  return prisma.material.findFirst({
    where: { id, usuario_id: usuarioId },
  });
}

export async function updateMaterial(id: string, usuarioId: string, data: Partial<CreateMaterialInput>) {
  return prisma.material.updateMany({
    where: { id, usuario_id: usuarioId },
    data,
  });
}

export async function deleteMaterial(id: string, usuarioId: string) {
  return prisma.material.deleteMany({
    where: { id, usuario_id: usuarioId },
  });
}
