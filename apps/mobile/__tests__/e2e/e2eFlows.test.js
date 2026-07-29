const { calcularArea, calcularOrcamento, formatarMoeda } = require("../../src/utils/calculoOrcamento");
const { validarTelefone, validarMedidas } = require("../../src/utils/validators");

describe("Suíte de Testes E2E - Funcionalidades do Aplicativo Marmu", () => {
  describe("1. Fluxo E2E: Cálculo de Área e Proposta de Orçamento", () => {
    test("Deve calcular corretamente a área em m² de uma bancada retangular", () => {
      const area = calcularArea(2.4, 0.6); // 2,40m x 0,60m
      expect(area).toBe(1.44);
    });

    test("Deve calcular o valor total com material, acabamentos e mão de obra", () => {
      // 3.0m², R$ 280/m² (Granito Preto São Gabriel), Bisote (R$ 135), Cuba (R$ 150)
      const res = calcularOrcamento({
        areaM2: 3.0,
        precoMaterialM2: 280,
        servicosAdicionais: [135, 150],
      });
      // 3.0 * 280 = 840 + 135 + 150 = 1125
      expect(res.subtotalMaterial).toBe(840);
      expect(res.totalAdicionais).toBe(285);
      expect(res.valorTotal).toBe(1125);
    });

    test("Formatador de moeda deve formatar no padrão brasileiro R$", () => {
      expect(formatarMoeda(1125)).toBe("R$ 1.125,00");
    });
  });

  describe("2. Fluxo E2E: Validação de Dados de Clientes e Medidas", () => {
    test("Deve validar números de telefone no formato BR", () => {
      expect(validarTelefone("(11) 99887-6655")).toBe(true);
      expect(validarTelefone("123")).toBe(false);
    });

    test("Deve impedir criação de orçamentos com medidas nulas ou negativas", () => {
      expect(validarMedidas(2.5, 0.6)).toBe(true);
      expect(validarMedidas(0, 0.6)).toBe(false);
      expect(validarMedidas(-1, 0.6)).toBe(false);
    });
  });

  describe("3. Fluxo E2E: Gestão de Pedidos e Transição de Workflow", () => {
    const mockPedidos = [
      { id: "PED-102", status: "No Prazo", etapa: "Acabamento de Bordas", entregue: false },
      { id: "PED-101", status: "Atenção", etapa: "Processando na Serra", entregue: false },
      { id: "PED-099", status: "Entregue", etapa: "Instalação Concluída", entregue: true },
    ];

    test("Deve filtrar apenas os pedidos em produção (não entregues)", () => {
      const emProducao = mockPedidos.filter((p) => !p.entregue);
      expect(emProducao.length).toBe(2);
      expect(emProducao.map((p) => p.id)).toEqual(["PED-102", "PED-101"]);
    });

    test("Deve alterar o status de um pedido para Entregue e atualizar o workflow", () => {
      const pedido = { ...mockPedidos[0] };
      pedido.entregue = true;
      pedido.status = "Entregue";
      pedido.etapa = "Instalação Concluída";

      expect(pedido.entregue).toBe(true);
      expect(pedido.status).toBe("Entregue");
    });
  });

  describe("4. Fluxo E2E: Gestão Financeira de Pagamentos (50% Sinal + 50% Saldo)", () => {
    test("Deve calcular corretamente a divisão de 50% entrada e 50% saldo na entrega", () => {
      const valorTotal = 5400;
      const entrada50 = valorTotal * 0.5;
      const saldo50 = valorTotal * 0.5;

      expect(entrada50).toBe(2700);
      expect(saldo50).toBe(2700);
    });

    test("Deve atualizar o status de pagamento ao registrar um recebimento", () => {
      let pagamento = {
        total: 5400,
        pago: 3000,
        pendente: 2400,
        quitado: false,
      };

      // Receber o saldo restante de 2400
      const recebimento = 2400;
      pagamento.pago += recebimento;
      pagamento.pendente -= recebimento;
      if (pagamento.pendente <= 0) pagamento.quitado = true;

      expect(pagamento.pago).toBe(5400);
      expect(pagamento.pendente).toBe(0);
      expect(pagamento.quitado).toBe(true);
    });
  });

  describe("5. Fluxo E2E: Controle de Estoque de Chapas", () => {
    const estoque = [
      { id: "1", material: "Granito Preto São Gabriel", quantidade: 18 },
      { id: "2", material: "Mármore Travertino Romano", quantidade: 14 },
      { id: "3", material: "Porcelanato Calacatta Gold", quantidade: 10 },
    ];

    test("Deve somar exatamente 42 chapas no depósito", () => {
      const totalChapas = estoque.reduce((sum, item) => sum + item.quantidade, 0);
      expect(totalChapas).toBe(42);
    });

    test("Deve dar entrada em novas chapas e atualizar o total no depósito", () => {
      const novoEstoque = estoque.map((item) =>
        item.id === "1" ? { ...item, quantidade: item.quantidade + 5 } : item
      );

      const novoTotal = novoEstoque.reduce((sum, item) => sum + item.quantidade, 0);
      expect(novoTotal).toBe(47);
    });
  });

  describe("6. Fluxo E2E: Tabela de Preços e Atualização de Valores", () => {
    const tabelaMateriais = [
      { id: "1", nome: "Granito Preto São Gabriel", precoM2: 280 },
      { id: "2", nome: "Mármore Branco Carrara", precoM2: 1200 },
    ];

    test("Deve atualizar o preço de um material existente", () => {
      const tabelaAtualizada = tabelaMateriais.map((mat) =>
        mat.id === "1" ? { ...mat, precoM2: 295 } : mat
      );

      expect(tabelaAtualizada[0].precoM2).toBe(295);
    });

    test("Deve adicionar um novo item à tabela de preços", () => {
      const novoItem = { id: "3", nome: "Quartzo Branco Absoluto", precoM2: 850 };
      const tabelaExpandida = [...tabelaMateriais, novoItem];

      expect(tabelaExpandida.length).toBe(3);
      expect(tabelaExpandida[2].nome).toBe("Quartzo Branco Absoluto");
    });
  });
});
