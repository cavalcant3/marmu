const {
  escapeHtml,
  formatCurrency,
  buildOrcamentoHtml,
} = require("../../src/utils/pdfTemplate");

describe("template do PDF de orçamento", () => {
  const orcamento = {
    id: "ORC-2026-123456",
    cliente: "Cliente & Filhos",
    projeto: "Bancada <cozinha>",
    comprimento: 2.4,
    largura: 0.6,
    area: 1.44,
    material: "Granito Preto",
    precoFinal: 403.2,
    observacoes: "Corte de cuba",
    data: "01/08/2026",
    validadeDias: 7,
  };

  test("inclui todos os dados obrigatórios da proposta", () => {
    const html = buildOrcamentoHtml(orcamento, "Marmoaria Teste");

    expect(html).toContain("Marmoaria Teste");
    expect(html).toContain("ORC-2026-123456");
    expect(html).toContain("Cliente &amp; Filhos");
    expect(html).toContain("Bancada &lt;cozinha&gt;");
    expect(html).toContain("2.40 m × 0.60 m");
    expect(html).toContain("1.44 m²");
    expect(html).toContain("Granito Preto");
    expect(html).toContain("R$ 403,20");
    expect(html).toContain("Proposta válida por 7 dias");
  });

  test("escapa conteúdo inserido pelo usuário", () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    );
  });

  test("formata moeda no padrão brasileiro", () => {
    expect(formatCurrency(1125)).toBe("R$ 1.125,00");
  });

  test("discrimina produtos, especificações e quantidade", () => {
    const html = buildOrcamentoHtml({
      ...orcamento,
      produtos: [
        { produto_id: "1", nome: "Cuba Tramontina", descricao: "40 × 34 cm · Nº 1", quantidade: 2, subtotal: 360 },
        { produto_id: "2", nome: "Válvula Docol", descricao: "Inox", quantidade: 1, subtotal: 75 },
      ],
    }, "Marmoaria Teste");

    expect(html).toContain("Cuba Tramontina · 40 × 34 cm · Nº 1 · Qtd. 2");
    expect(html).toContain("Válvula Docol · Inox · Qtd. 1");
    expect(html).toContain("R$ 360,00");
  });

  test("identifica orçamento por metro linear", () => {
    const html = buildOrcamentoHtml({
      ...orcamento,
      tipoCalculo: "ML",
      metragemCalculada: 4.8,
      medicoes: [{ id: "1", descricao: "Soleira", comprimento: 2.4, largura: 0, quantidade: 2, area: 0, metros_lineares: 4.8 }],
    }, "Marmoaria Teste");
    expect(html).toContain("Metro linear");
    expect(html).toContain("4.80 m cobrados");
    expect(html).toContain("4.80 m");
  });
});
