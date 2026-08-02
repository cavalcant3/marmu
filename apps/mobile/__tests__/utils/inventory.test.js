const { applyStockMovement } = require("../../src/utils/inventory");

describe("baixa de estoque por entrega", () => {
  const initial = { products: [{ id: "1", nome: "Cuba", quantidade: 5 }], movements: [] };

  test("abate a quantidade entregue", () => {
    const result = applyStockMovement(initial, "PED-1", [{ produto_id: "1", nome: "Cuba", quantidade: 2 }]);
    expect(result.products[0].quantidade).toBe(3);
    expect(result.movements).toContain("ENTREGA:PED-1");
  });

  test("não abate duas vezes o mesmo pedido", () => {
    const first = applyStockMovement(initial, "PED-1", [{ produto_id: "1", nome: "Cuba", quantidade: 2 }]);
    const second = applyStockMovement(first, "PED-1", [{ produto_id: "1", nome: "Cuba", quantidade: 2 }]);
    expect(second.products[0].quantidade).toBe(3);
  });

  test("bloqueia entrega sem estoque suficiente", () => {
    expect(() => applyStockMovement(initial, "PED-2", [{ produto_id: "1", nome: "Cuba", quantidade: 6 }])).toThrow("ESTOQUE_INSUFICIENTE:Cuba:5");
  });
});
