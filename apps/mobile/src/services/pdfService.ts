import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { buildOrcamentoHtml, formatCurrency } from "../utils/pdfTemplate";

export { buildOrcamentoHtml, formatCurrency } from "../utils/pdfTemplate";

export interface PdfOrcamento {
  id: string;
  cliente: string;
  projeto: string;
  comprimento: number;
  largura: number;
  area: number;
  tipoCalculo?: "M2" | "ML";
  metragemCalculada?: number;
  medicoes?: Array<{ id: string; descricao: string; comprimento: number; largura: number; quantidade: number; area: number; metros_lineares?: number }>;
  material: string;
  subtotalMaterial?: number;
  custosAdicionais?: Array<{ id: string; tipo: string; descricao: string; valor: number }>;
  produtos?: Array<{ produto_id: string; nome: string; descricao?: string; preco_unitario: number; quantidade: number; subtotal: number }>;
  precoFinal: number;
  observacoes?: string;
  data: string;
  validadeDias?: number;
}

export async function generateOrcamentoPdf(
  orcamento: PdfOrcamento,
  nomeMarmoaria: string
): Promise<string> {
  const html = buildOrcamentoHtml(orcamento, nomeMarmoaria);
  const result = await Print.printToFileAsync({ html });
  return result.uri;
}

export async function shareOrcamentoPdf(uri: string, id: string): Promise<void> {
  const sharingAvailable = await Sharing.isAvailableAsync();
  if (!sharingAvailable) {
    throw new Error("SHARING_UNAVAILABLE");
  }

  await Sharing.shareAsync(uri, {
    mimeType: "application/pdf",
    UTI: "com.adobe.pdf",
    dialogTitle: `Compartilhar orçamento ${id}`,
  });
}
