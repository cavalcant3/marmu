export const calcularArea = (comprimento: number, largura: number): number => {
  if (comprimento <= 0 || largura <= 0) return 0;
  return Number((comprimento * largura).toFixed(2));
};

export const calcularOrcamento = ({
  areaM2,
  precoMaterialM2,
  servicosAdicionais = [],
}: {
  areaM2: number;
  precoMaterialM2: number;
  servicosAdicionais?: number[];
}) => {
  const subtotalMaterial = Number((areaM2 * precoMaterialM2).toFixed(2));
  const totalAdicionais = servicosAdicionais.reduce((sum, item) => sum + item, 0);
  const valorTotal = Number((subtotalMaterial + totalAdicionais).toFixed(2));

  return {
    subtotalMaterial,
    totalAdicionais,
    valorTotal,
  };
};

export const formatarMoeda = (valor: number): string => {
  return `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
