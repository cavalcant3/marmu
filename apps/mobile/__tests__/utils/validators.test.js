describe("Validadores", () => {
  const isEmailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isMedidaValida = (valor) => valor > 0;
  const isSenhaValida = (senha) => senha.length >= 6;

  test("valida email correto", () => {
    expect(isEmailValido("joao@cncmarmores.com")).toBe(true);
    expect(isEmailValido("teste@email.com.br")).toBe(true);
  });

  test("rejeita email inválido", () => {
    expect(isEmailValido("joao")).toBe(false);
    expect(isEmailValido("joao@")).toBe(false);
    expect(isEmailValido("@email.com")).toBe(false);
    expect(isEmailValido("")).toBe(false);
  });

  test("valida medida positiva", () => {
    expect(isMedidaValida(2.4)).toBe(true);
    expect(isMedidaValida(0.1)).toBe(true);
  });

  test("rejeita medida zero ou negativa", () => {
    expect(isMedidaValida(0)).toBe(false);
    expect(isMedidaValida(-1.5)).toBe(false);
  });

  test("valida senha com mínimo 6 caracteres", () => {
    expect(isSenhaValida("123456")).toBe(true);
    expect(isSenhaValida("senha123")).toBe(true);
  });

  test("rejeita senha curta", () => {
    expect(isSenhaValida("12345")).toBe(false);
    expect(isSenhaValida("abc")).toBe(false);
  });
});
