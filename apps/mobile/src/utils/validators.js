function validarTelefone(telefone) {
  const limpo = telefone.replace(/\D/g, "");
  return limpo.length >= 10 && limpo.length <= 11;
}

function validarMedidas(comprimento, largura) {
  return comprimento > 0 && largura > 0;
}

function validarCPF(cpf) {
  const limpo = cpf.replace(/\D/g, "");
  return limpo.length === 11;
}

module.exports = {
  validarTelefone,
  validarMedidas,
  validarCPF,
};
