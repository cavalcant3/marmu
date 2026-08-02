function applyStockMovement(state, pedidoId, itens) {
  const movementId = `ENTREGA:${pedidoId}`;
  if (state.movements.includes(movementId)) return state;

  for (const item of itens) {
    const produto = state.products.find((current) => current.id === item.produto_id);
    if (!produto) throw new Error(`PRODUTO_NAO_ENCONTRADO:${item.nome}`);
    if (produto.quantidade < item.quantidade) {
      throw new Error(`ESTOQUE_INSUFICIENTE:${item.nome}:${produto.quantidade}`);
    }
  }

  return {
    products: state.products.map((produto) => {
      const item = itens.find((current) => current.produto_id === produto.id);
      return item ? { ...produto, quantidade: produto.quantidade - item.quantidade } : produto;
    }),
    movements: [...state.movements, movementId].slice(-1000),
  };
}

module.exports = { applyStockMovement };
