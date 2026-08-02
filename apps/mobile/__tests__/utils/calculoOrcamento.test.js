describe("Cálculo de Orçamento", () => {
  const { calcularAreaTotal, calcularComposicao } = require("../../src/utils/calculoOrcamento");
  const calcularArea = (comprimento, largura) => comprimento * largura;
  const calcularPreco = (area, precoPorM2) => area * precoPorM2;

  test("calcula área corretamente para medidas padrão", () => {
    expect(calcularArea(2.4, 0.6)).toBe(1.44);
  });

  test("calcula área para bancada grande", () => {
    expect(calcularArea(3.0, 0.7)).toBeCloseTo(2.1, 1);
  });

  test("calcula preço com material de granito", () => {
    const area = calcularArea(2.4, 0.6);
    const preco = calcularPreco(area, 280.0);
    expect(preco).toBe(403.2);
  });

  test("calcula preço com material de mármore", () => {
    const area = calcularArea(1.5, 0.6);
    const preco = calcularPreco(area, 450.0);
    expect(preco).toBeCloseTo(405.0, 1);
  });

  test("retorna 0 para medidas inválidas", () => {
    expect(calcularArea(0, 0.6)).toBe(0);
    expect(calcularArea(2.4, 0)).toBe(0);
    expect(calcularArea(0, 0)).toBe(0);
  });

  test("retorna valor negativo para medidas negativas", () => {
    expect(calcularArea(-2.4, 0.6)).toBe(-1.44);
  });

  test("soma várias medições respeitando quantidade", () => {
    expect(calcularAreaTotal([
      { comprimento: 2.4, largura: 0.6, quantidade: 2 },
      { comprimento: 1.2, largura: 0.5, quantidade: 1 },
    ])).toBe(3.48);
  });

  test("compõe material, mão de obra e acabamento", () => {
    expect(calcularComposicao({
      medicoes: [{ comprimento: 2, largura: 1, quantidade: 1 }],
      precoMaterialM2: 300,
      custosAdicionais: [{ valor: 250 }, { valor: 100 }],
    })).toEqual({ areaTotal: 2, metrosLinearesTotal: 2, metragemCalculada: 2, subtotalMaterial: 600, totalAdicionais: 350, totalProdutos: 0, valorTotal: 950 });
  });

  test("inclui produtos e quantidades na composição", () => {
    expect(calcularComposicao({
      medicoes: [{ comprimento: 1, largura: 1, quantidade: 1 }],
      precoMaterialM2: 200,
      produtos: [
        { preco_unitario: 180, quantidade: 2 },
        { subtotal: 45 },
      ],
    })).toEqual({ areaTotal: 1, metrosLinearesTotal: 1, metragemCalculada: 1, subtotalMaterial: 200, totalAdicionais: 0, totalProdutos: 405, valorTotal: 605 });
  });

  test("calcula orçamento por metro linear respeitando quantidades", () => {
    expect(calcularComposicao({
      tipoCalculo: "ML",
      precoMaterial: 150,
      medicoes: [
        { comprimento: 2.5, largura: 0.6, quantidade: 2 },
        { comprimento: 1, largura: 0.4, quantidade: 1 },
      ],
    })).toEqual({ areaTotal: 3.4, metrosLinearesTotal: 6, metragemCalculada: 6, subtotalMaterial: 900, totalAdicionais: 0, totalProdutos: 0, valorTotal: 900 });
  });
});
