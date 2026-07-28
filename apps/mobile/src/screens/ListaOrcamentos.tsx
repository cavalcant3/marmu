import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const mockOrcamentos = [
  { id: "1", cliente: "Carlos Lima", descricao: "Bancada", valor: 1200, status: "PENDENTE" },
  { id: "2", cliente: "Ana Costa", descricao: "Pia banheiro", valor: 890, status: "APROVADO" },
  { id: "3", cliente: "João da Silva", descricao: "Bancada", valor: 420, status: "REJEITADO" },
];

export default function ListaOrcamentosScreen({ navigation }: any) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("TODOS");

  const filtrados = mockOrcamentos
    .filter((o) => {
      if (filtro !== "TODOS" && o.status !== filtro) return false;
      return (
        o.cliente.toLowerCase().includes(busca.toLowerCase()) ||
        o.descricao.toLowerCase().includes(busca.toLowerCase())
      );
    });

  const statusColor: any = {
    PENDENTE: "#FFA000",
    APROVADO: "#2E7D32",
    REJEITADO: "#C62828",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orçamentos</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar por cliente..."
        value={busca}
        onChangeText={setBusca}
      />
      <View style={styles.filtros}>
        {["TODOS", "PENDENTE", "APROVADO", "REJEITADO"].map((f) => (
          <TouchableOpacity key={f} onPress={() => setFiltro(f)}>
            <Text style={filtro === f ? styles.filtroAtivo : styles.filtro}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("DetalhesOrcamento", { orcamento: item })}
          >
            <Text style={styles.cliente}>{item.cliente}</Text>
            <Text>{item.descricao} — R$ {item.valor}</Text>
            <Text style={{ color: statusColor[item.status] }}>{item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  input: { height: 48, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 16, marginBottom: 12 },
  filtros: { flexDirection: "row", marginBottom: 12 },
  filtro: { marginRight: 12, color: "#666" },
  filtroAtivo: { marginRight: 12, color: "#1976D2", fontWeight: "bold" },
  item: { padding: 14, borderBottomWidth: 1, borderBottomColor: "#eee" },
  cliente: { fontSize: 16, fontWeight: "600" },
});
