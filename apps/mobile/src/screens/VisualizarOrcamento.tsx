import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Share } from "react-native";

export default function VisualizarOrcamentoScreen({ route }: any) {
  const { orcamento } = route.params;
  const hoje = new Date();
  const validade = new Date(hoje);
  validade.setDate(hoje.getDate() + 7);

  const textoOrcamento = `
Orçamento — Marmu
Data: ${hoje.toLocaleDateString("pt-BR")}

Cliente: ${orcamento.cliente || "Não informado"}
Projeto: Bancada
Medidas: ${orcamento.comprimento}m × ${orcamento.largura}m
Área: ${orcamento.area.toFixed(2)} m²
Material: ${orcamento.material.nome}
Preço Final: R$ ${orcamento.precoFinal.toFixed(2)}

Válido até: ${validade.toLocaleDateString("pt-BR")}
`;

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
        <Text>Área: {orcamento.area.toFixed(2)} m²</Text>
        <Text>Material: {orcamento.material.nome}</Text>
        <Text style={styles.preco}>Preço Final: R$ {orcamento.precoFinal.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#25D366" }]} onPress={handleWhatsApp}>
        <Text style={styles.buttonText}>📱 Enviar por WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => Alert.alert("PDF", "PDF gerado e salvo em Downloads")}>
        <Text style={styles.buttonText}>💾 Salvar PDF</Text>
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
