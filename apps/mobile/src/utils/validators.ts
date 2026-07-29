export const validarTelefone = (telefone: string): boolean => {
  const limpo = telefone.replace(/\D/g, "");
  return limpo.length >= 10 && limpo.length <= 11;
};

export const validarMedidas = (comprimento: number, largura: number): boolean => {
  return comprimento > 0 && largura > 0;
};

export const validarCPF = (cpf: string): boolean => {
  const limpo = cpf.replace(/\D/g, "");
  return limpo.length === 11;
};
