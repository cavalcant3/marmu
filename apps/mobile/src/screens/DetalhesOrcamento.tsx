import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Share } from "react-native";

export default function DetalhesOrcamentoScreen({ route }: any) {
  const { orcamento } = route.params;

  const handleReenviar = async () => {
    await Share.share({
      message: `Orçamento ${orcamento.cliente} — R$ ${orcamento.valor}`,
      title: "Orçamento Marmu",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orçamento #{orcamento.id}</Text>
      <Text>Cliente: {orcamento.cliente}</Text>
      <Text>Descrição: {orcamento.descricao}</Text>
      <Text>Valor: R$ {orcamento.valor}</Text>
      <Text>Status: {orcamento.status}</Text>

      <TouchableOpacity style={styles.button} onPress={handleReenviar}>
        <Text style={styles.buttonText}>📱 Reenviar WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#FFA000" }]} onPress={() => Alert.alert("Editar", "Tela de edição")}>
        <Text style={styles.buttonText}>✏️ Editar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  button: { backgroundColor: "#1976D2", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 12 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
