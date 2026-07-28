import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const mockPedidos = [
  { id: "1", cliente: "João Silva", entrega: "15/08", status: "PENDENTE", cor: "🔴" },
  { id: "2", cliente: "Maria Souza", entrega: "23/08", status: "PENDENTE", cor: "🟡" },
];

export default function ListaPedidosScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos</Text>
      <FlatList
        data={mockPedidos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("DetalhesPedido", { pedido: item })}
          >
            <Text>{item.cor} {item.cliente}</Text>
            <Text>Entrega: {item.entrega}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  item: { padding: 14, borderBottomWidth: 1, borderBottomColor: "#eee" },
});
