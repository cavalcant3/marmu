const {
  currencyToNumber,
  formatCurrency,
  formatDecimal,
  maskCurrency,
  maskDate,
  maskDecimal,
  maskPhone,
  maskTime,
  parseDecimal,
} = require("../../src/utils/formatters");

describe("máscaras brasileiras", () => {
  test("formata telefone fixo e celular", () => {
    expect(maskPhone("11987654321")).toBe("(11) 98765-4321");
    expect(maskPhone("1133334444")).toBe("(11) 3333-4444");
  });

  test("aceita somente um separador decimal", () => {
    expect(maskDecimal("2.40")).toBe("2,40");
    expect(maskDecimal("2,4,9")).toBe("2,49");
    expect(parseDecimal("2.40")).toBe(2.4);
    expect(parseDecimal("2,40")).toBe(2.4);
  });

  test("formata e converte moeda sem perder centavos", () => {
    expect(maskCurrency("123456")).toBe("R$ 1.234,56");
    expect(currencyToNumber("R$ 1.234,56")).toBe(1234.56);
    expect(formatCurrency(1234.56)).toBe("R$ 1.234,56");
  });

  test("formata decimal e data em pt-BR", () => {
    expect(formatDecimal(1.44)).toBe("1,44");
    expect(maskDate("15082026")).toBe("15/08/2026");
    expect(maskTime("0930")).toBe("09:30");
  });
});
