import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function DetalhesPedidoScreen({ route }: any) {
  const { pedido } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedido #{pedido.id}</Text>
      <Text>Cliente: {pedido.cliente}</Text>
      <Text>Status: {pedido.status}</Text>
      <Text>Entrega: {pedido.entrega}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => Alert.alert("Sucesso", "Pedido marcado como entregue!")}
      >
        <Text style={styles.buttonText}>✓ Marcar como Entregue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  button: { backgroundColor: "#2E7D32", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 16 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
