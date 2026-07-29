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

function formatarMoeda(valor) {
  return `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

module.exports = {
  calcularArea,
  calcularOrcamento,
  formatarMoeda,
};
