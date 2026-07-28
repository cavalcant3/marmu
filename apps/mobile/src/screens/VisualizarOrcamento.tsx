import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
  ActivityIndicator,
} from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";

export default function VisualizarOrcamentoScreen({ route }: any) {
  const { orcamento } = route.params;
  const [gerando, setGerando] = useState(false);
  const hoje = new Date();
  const validade = new Date(hoje);
  validade.setDate(hoje.getDate() + 7);

  const textoOrcamento = `Orçamento — Marmu
Data: ${hoje.toLocaleDateString("pt-BR")}

Cliente: ${orcamento.cliente || "Não informado"}
Projeto: Bancada
Medidas: ${orcamento.comprimento}m × ${orcamento.largura}m
Área: ${orcamento.area.toFixed(2)} m²
Material: ${orcamento.material?.nome || "Não informado"}
Preço Final: R$ ${orcamento.precoFinal?.toFixed(2) || "0.00"}

Válido até: ${validade.toLocaleDateString("pt-BR")}`;

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #1976D2; text-align: center; }
          .header { text-align: center; margin-bottom: 30px; }
          .info { margin: 10px 0; font-size: 16px; }
          .preco { font-size: 24px; font-weight: bold; color: #1976D2; margin-top: 20px; }
          .footer { margin-top: 40px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Marmu</h1>
          <p>Orçamento de Serviços</p>
        </div>
        <div class="info"><strong>Data:</strong> ${hoje.toLocaleDateString("pt-BR")}</div>
        <div class="info"><strong>Cliente:</strong> ${orcamento.cliente || "Não informado"}</div>
        <div class="info"><strong>Projeto:</strong> Bancada</div>
        <div class="info"><strong>Medidas:</strong> ${orcamento.comprimento}m × ${orcamento.largura}m</div>
        <div class="info"><strong>Área:</strong> ${orcamento.area.toFixed(2)} m²</div>
        <div class="info"><strong>Material:</strong> ${orcamento.material?.nome || "Não informado"}</div>
        <div class="preco">Preço Final: R$ ${orcamento.precoFinal?.toFixed(2) || "0.00"}</div>
        <div class="footer">
          Válido até: ${validade.toLocaleDateString("pt-BR")} |
          Este orçamento é válido por 7 dias.
        </div>
      </body>
    </html>
  `;

  const handleGerarPDF = async () => {
    setGerando(true);
    try {
      const pdf = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: `Orcamento_${orcamento.cliente || "cliente"}_${hoje.getTime()}`,
        directory: "Documents",
      });
      Alert.alert("Sucesso", `PDF salvo em: ${pdf.filePath}`);
    } catch {
      Alert.alert("Erro", "Não foi possível gerar o PDF");
    } finally {
      setGerando(false);
    }
  };

  const handleWhatsApp = async () => {
    try {
      await Share.share({
        message: textoOrcamento,
        title: "Orçamento Marmu",
      });
    } catch {
      Alert.alert("Erro", "Não foi possível compartilhar");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orçamento</Text>

      <View style={styles.card}>
        <Text>Cliente: {orcamento.cliente || "Não informado"}</Text>
        <Text>Medidas: {orcamento.comprimento}m × {orcamento.largura}m</Text>
        <Text>Área: {orcamento.area?.toFixed(2)} m²</Text>
        <Text>Material: {orcamento.material?.nome || "Não informado"}</Text>
        <Text style={styles.preco}>Preço Final: R$ {orcamento.precoFinal?.toFixed(2) || "0.00"}</Text>
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#25D366" }]} onPress={handleWhatsApp}>
        <Text style={styles.buttonText}>📱 Enviar por WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleGerarPDF} disabled={gerando}>
        {gerando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>💾 Salvar PDF</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  card: { padding: 16, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 16 },
  preco: { fontSize: 20, fontWeight: "bold", color: "#1976D2", marginTop: 8 },
  button: { backgroundColor: "#1976D2", padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 12 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
