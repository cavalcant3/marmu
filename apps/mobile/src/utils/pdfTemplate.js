function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
    .format(Number.isFinite(value) ? value : 0)
    .replace(/\u00a0/g, " ");
}

function buildOrcamentoHtml(orcamento, nomeMarmoaria) {
  const validadeDias = orcamento.validadeDias ?? 7;
  const medicoes = Array.isArray(orcamento.medicoes) && orcamento.medicoes.length
    ? orcamento.medicoes
    : [{ id: "legacy", descricao: "Peça 1", comprimento: orcamento.comprimento, largura: orcamento.largura, quantidade: 1, area: orcamento.area }];
  const custos = Array.isArray(orcamento.custosAdicionais) ? orcamento.custosAdicionais : [];
  const produtos = Array.isArray(orcamento.produtos) ? orcamento.produtos : [];
  const tipoCalculo = orcamento.tipoCalculo === "ML" ? "ML" : "M2";
  const metragemCalculada = Number(orcamento.metragemCalculada ?? orcamento.area ?? 0);
  const measurementRows = medicoes.map((item) => {
    const dimensions = tipoCalculo === "ML"
      ? `${Number(item.comprimento || 0).toFixed(2)} m lineares · ${Number(item.metros_lineares ?? Number(item.comprimento || 0) * Number(item.quantidade || 1)).toFixed(2)} m cobrados`
      : `${Number(item.comprimento || 0).toFixed(2)} m × ${Number(item.largura || 0).toFixed(2)} m · ${Number(item.area || 0).toFixed(2)} m²`;
    return `<div class="row"><span class="label">${escapeHtml(item.descricao)} (Qtd. ${Number(item.quantidade || 1)})</span><span class="value">${dimensions}</span></div>`;
  }).join("");
  const costRows = custos.map((item) => `<div class="row"><span class="label">${escapeHtml(item.descricao)}</span><span class="value">${escapeHtml(formatCurrency(Number(item.valor || 0)))}</span></div>`).join("");
  const productRows = produtos.map((item) => `<div class="row"><span class="label">${escapeHtml(item.nome)}${item.descricao ? ` · ${escapeHtml(item.descricao)}` : ""} · Qtd. ${Number(item.quantidade || 1)}</span><span class="value">${escapeHtml(formatCurrency(Number(item.subtotal || 0)))}</span></div>`).join("");

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <style>
      @page { margin: 28px; }
      body { font-family: Arial, sans-serif; color: #0b1c30; margin: 0; }
      .header { border-bottom: 3px solid #091426; padding-bottom: 18px; margin-bottom: 24px; }
      .brand { font-size: 26px; font-weight: 800; color: #091426; }
      .meta { color: #58606b; margin-top: 6px; font-size: 13px; }
      .section { border: 1px solid #d7dce5; border-radius: 12px; padding: 18px; margin-bottom: 18px; }
      .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
      .row { display: flex; justify-content: space-between; gap: 20px; padding: 9px 0; border-bottom: 1px solid #edf0f4; }
      .row:last-child { border-bottom: 0; }
      .label { color: #58606b; }
      .value { font-weight: 700; text-align: right; }
      .total { background: #091426; color: white; border-radius: 12px; padding: 22px; text-align: center; }
      .total-label { color: #d8e3fb; font-size: 12px; font-weight: 700; text-transform: uppercase; }
      .total-value { color: #6bff8f; font-size: 34px; font-weight: 800; margin-top: 6px; }
      .footer { color: #58606b; font-size: 11px; text-align: center; margin-top: 24px; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="brand">${escapeHtml(nomeMarmoaria)}</div>
      <div class="meta">Orçamento ${escapeHtml(orcamento.id)} · ${escapeHtml(orcamento.data)}</div>
    </div>
    <div class="section">
      <div class="section-title">Dados da proposta</div>
      <div class="row"><span class="label">Cliente</span><span class="value">${escapeHtml(orcamento.cliente)}</span></div>
      <div class="row"><span class="label">Projeto</span><span class="value">${escapeHtml(orcamento.projeto)}</span></div>
      ${measurementRows}
      <div class="row"><span class="label">Forma de cálculo</span><span class="value">${tipoCalculo === "ML" ? "Metro linear" : "Metro quadrado"}</span></div>
      <div class="row"><span class="label">${tipoCalculo === "ML" ? "Total linear" : "Área total"}</span><span class="value">${metragemCalculada.toFixed(2)} ${tipoCalculo === "ML" ? "m" : "m²"}</span></div>
      <div class="row"><span class="label">Material</span><span class="value">${escapeHtml(orcamento.material)}</span></div>
      <div class="row"><span class="label">Observações</span><span class="value">${escapeHtml(orcamento.observacoes || "Nenhuma")}</span></div>
    </div>
    <div class="section">
      <div class="section-title">Composição do valor</div>
      <div class="row"><span class="label">Material</span><span class="value">${escapeHtml(formatCurrency(Number(orcamento.subtotalMaterial ?? orcamento.precoFinal)))}</span></div>
      ${costRows || '<div class="row"><span class="label">Mão de obra e acabamentos</span><span class="value">Não informados</span></div>'}
      ${productRows}
    </div>
    <div class="total">
      <div class="total-label">Valor total</div>
      <div class="total-value">${escapeHtml(formatCurrency(orcamento.precoFinal))}</div>
    </div>
    <div class="footer">Proposta válida por ${validadeDias} dias. Documento gerado pelo Marmu.</div>
  </body>
</html>`;
}

module.exports = { escapeHtml, formatCurrency, buildOrcamentoHtml };
