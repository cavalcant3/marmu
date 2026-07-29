import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import Badge from "../components/ui/Badge";

export default function ListaPedidosScreen({ navigation }: any) {
  const [filter, setFilter] = useState<"todos" | "producao" | "entregues">("todos");
  const [search, setSearch] = useState("");

  const [pedidos] = useState([
    {
      id: "PED-102",
      cliente: "Ed. Miramar - Apto 402",
      projeto: "Bancada Cozinha com Cuba",
      data: "12/10/2026",
      status: "No Prazo",
      etapa: "Acabamento de Bordas",
      material: "Granito Preto São Gabriel",
      valor: "R$ 1.850,00",
    },
    {
      id: "PED-101",
      cliente: "Casa Cond. Lagos",
      projeto: "Soleiras e Peitoris",
      data: "15/10/2026",
      status: "Atenção",
      etapa: "Processando na Serra",
      material: "Mármore Travertino",
      valor: "R$ 3.200,00",
    },
    {
      id: "PED-100",
      cliente: "Sede Administrativa X",
      projeto: "Piso Hall de Entrada",
      data: "16/10/2026",
      status: "Confirmada",
      etapa: "Pronto para Transporte",
      material: "Porcelanato Técnico",
      valor: "R$ 8.900,00",
    },
    {
      id: "PED-099",
      cliente: "Residencial Park - Apt 12",
      projeto: "Bancada Banheiro Suite",
      data: "05/10/2026",
      status: "Entregue",
      etapa: "Instalação Concluída",
      material: "Mármore Carrara",
      valor: "R$ 1.400,00",
    },
  ]);

  const filteredPedidos = pedidos.filter((p) => {
    const matchesSearch =
      p.cliente.toLowerCase().includes(search.toLowerCase()) ||
      p.projeto.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "producao") {
      return p.status !== "Entregue";
    }
    if (filter === "entregues") {
      return p.status === "Entregue";
    }
    return true;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Pedidos da Oficina</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={colors.outline} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar por cliente ou projeto..."
          placeholderTextColor={colors.onSurfaceVariant}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Interactive Filter Chips */}
      <View style={styles.filterRow}>
        {(["todos", "producao", "entregues"] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
              {f === "todos" ? "Todos os Pedidos" : f === "producao" ? "Em Produção" : "Entregues"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.list}>
        {filteredPedidos.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Nenhum pedido encontrado nesta categoria.</Text>
          </View>
        ) : (
          filteredPedidos.map((pedido) => (
            <TouchableOpacity
              key={pedido.id}
              style={styles.pedidoCard}
              onPress={() => navigation.navigate("detalhespedido", { pedido })}
            >
              <View style={styles.cardTop}>
                <Text style={styles.pedidoId}>{pedido.id}</Text>
                <Badge
                  label={pedido.status}
                  variant={
                    pedido.status === "Entregue"
                      ? "info"
                      : pedido.status === "Atenção"
                      ? "warning"
                      : "success"
                  }
                />
              </View>

              <Text style={styles.cliente}>{pedido.cliente}</Text>
              <Text style={styles.projeto}>{pedido.projeto}</Text>

              <View style={styles.progressBox}>
                <Text style={styles.etapaLabel}>Etapa Atual:</Text>
                <Text style={styles.etapaVal}>{pedido.etapa}</Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.dateText}>Entrega: {pedido.data}</Text>
                <Text style={styles.valorText}>{pedido.valor}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 110 },
  title: { fontSize: 24, fontWeight: "800", color: colors.primary, marginBottom: 16 },

  searchContainer: { position: "relative", marginBottom: 14 },
  searchIcon: { position: "absolute", left: 14, top: 15, zIndex: 1 },
  searchBar: {
    height: 48,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    paddingLeft: 42,
    paddingRight: 16,
    fontSize: 14,
    color: colors.onSurface,
  },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
  },
  filterChipActive: { backgroundColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.onSurfaceVariant },
  chipTextActive: { color: colors.onPrimary },

  list: { gap: 12 },
  pedidoCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 16,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pedidoId: { fontSize: 12, fontWeight: "700", color: colors.onSurfaceVariant },
  cliente: { fontSize: 18, fontWeight: "800", color: colors.primary, marginTop: 4 },
  projeto: { fontSize: 14, color: colors.onSurfaceVariant, marginTop: 2 },

  progressBox: {
    backgroundColor: colors.surfaceContainerLow,
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  etapaLabel: { fontSize: 11, color: colors.onSurfaceVariant },
  etapaVal: { fontSize: 13, fontWeight: "700", color: colors.primary, marginTop: 2 },

  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dateText: { fontSize: 12, color: colors.onSurfaceVariant },
  valorText: { fontSize: 15, fontWeight: "800", color: colors.secondary },

  emptyBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  emptyText: { fontSize: 14, color: colors.onSurfaceVariant },
});
