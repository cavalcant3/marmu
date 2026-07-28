describe("Cálculo de Orçamento", () => {
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
});
