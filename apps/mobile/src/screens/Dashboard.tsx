import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function DashboardScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marmu</Text>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>18</Text>
          <Text>Orçamentos</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>12</Text>
          <Text>Pedidos</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>4</Text>
          <Text>Entregas</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>R$8.4k</Text>
          <Text>Receita</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("NovoOrcamento")}>
        <Text style={styles.fabText}>+ Novo Orçamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16, color: "#1976D2" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "48%", padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8, marginBottom: 12, alignItems: "center" },
  cardNumber: { fontSize: 24, fontWeight: "bold", color: "#1976D2" },
  fab: { backgroundColor: "#1976D2", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 16 },
  fabText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
