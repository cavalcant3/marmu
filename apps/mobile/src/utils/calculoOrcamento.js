function calcularArea(comprimento, largura) {
  if (comprimento <= 0 || largura <= 0) return 0;
  return Number((comprimento * largura).toFixed(2));
}

function calcularOrcamento({ areaM2, precoMaterialM2, servicosAdicionais = [] }) {
  const subtotalMaterial = Number((areaM2 * precoMaterialM2).toFixed(2));
  const totalAdicionais = servicosAdicionais.reduce((sum, item) => sum + item, 0);
  const valorTotal = Number((subtotalMaterial + totalAdicionais).toFixed(2));

  return {
    subtotalMaterial,
    totalAdicionais,
    valorTotal,
  };
}

function calcularAreaTotal(medicoes) {
  return Number(medicoes.reduce((total, item) => {
    const quantidade = Math.max(1, Number(item.quantidade) || 1);
    return total + calcularArea(Number(item.comprimento), Number(item.largura)) * quantidade;
  }, 0).toFixed(2));
}

function calcularMetrosLinearesTotal(medicoes) {
  return Number(medicoes.reduce((total, item) => {
    const quantidade = Math.max(1, Number(item.quantidade) || 1);
    return total + Math.max(0, Number(item.comprimento) || 0) * quantidade;
  }, 0).toFixed(2));
}

function calcularComposicao({ medicoes, tipoCalculo = "M2", precoMaterial, precoMaterialM2, custosAdicionais = [], produtos = [] }) {
  const areaTotal = calcularAreaTotal(medicoes);
  const metrosLinearesTotal = calcularMetrosLinearesTotal(medicoes);
  const metragemCalculada = tipoCalculo === "ML" ? metrosLinearesTotal : areaTotal;
  const unitPrice = Number(precoMaterial ?? precoMaterialM2 ?? 0);
  const subtotalMaterial = Number((metragemCalculada * unitPrice).toFixed(2));
  const totalAdicionais = Number(custosAdicionais.reduce((sum, item) => sum + Number(item.valor || 0), 0).toFixed(2));
  const totalProdutos = Number(produtos.reduce((sum, item) => sum + Number(item.subtotal ?? Number(item.preco_unitario || 0) * Number(item.quantidade || 1)), 0).toFixed(2));
  return { areaTotal, metrosLinearesTotal, metragemCalculada, subtotalMaterial, totalAdicionais, totalProdutos, valorTotal: Number((subtotalMaterial + totalAdicionais + totalProdutos).toFixed(2)) };
}

function formatarMoeda(valor) {
  return `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

module.exports = {
  calcularArea,
  calcularOrcamento,
  calcularAreaTotal,
  calcularMetrosLinearesTotal,
  calcularComposicao,
  formatarMoeda,
};
