import prisma from "../src/config/database.js";

async function main() {
  const usuario = await prisma.usuario.create({
    data: {
      email: "joao@cncmarmores.com",
      senha_hash: "$2b$12$33Gt.L3oJi.NnzZRVRZRueNLLwpePdswvxmHSIlyrobLjtprOoqIa",
      nome: "João da Silva",
      nome_marmoaria: "CNC Mármores e Granitos",
    },
  });

  const materiais = [
    { nome: "Preto São Gabriel", tipo: "GRANITO" as const, preco_por_m2: 280.0, observacoes: "Mais vendido" },
    { nome: "Verde Ubatuba", tipo: "GRANITO" as const, preco_por_m2: 320.0 },
    { nome: "Carrara", tipo: "MARMORE" as const, preco_por_m2: 450.0 },
    { nome: "Branco Prime", tipo: "PORCELANATO" as const, preco_por_m2: 180.0 },
    { nome: "Castor", tipo: "GRANITO" as const, preco_por_m2: 350.0 },
  ];

  for (const m of materiais) {
    await prisma.material.create({
      data: { ...m, usuario_id: usuario.id },
    });
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
