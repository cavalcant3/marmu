import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { colors } from "../theme/colors";
import Badge from "../components/ui/Badge";

export default function ListaOrcamentosScreen({ navigation }: any) {
  const [search, setSearch] = useState("");

  const orcamentos = [
    {
      id: "ORC-2026-001",
      cliente: "João da Silva",
      projeto: "Bancada Cozinha",
      area: 1.44,
      material: "Granito Preto São Gabriel",
      valor: "R$ 403,20",
      status: "Pendente",
      data: "27/07/2026",
    },
    {
      id: "ORC-2026-002",
      cliente: "Maria Oliveira",
      projeto: "Lavatório Banheiro",
      area: 0.85,
      material: "Mármore Carrara",
      valor: "R$ 680,00",
      status: "Aprovado",
      data: "26/07/2026",
    },
    {
      id: "ORC-2026-003",
      cliente: "Carlos Eduardo",
      projeto: "Ilha Gourmet",
      area: 3.10,
      material: "Porcelanato Calacatta",
      valor: "R$ 1.550,00",
      status: "Vencido",
      data: "15/07/2026",
    },
  ];

  const filtered = orcamentos.filter((o) =>
    o.cliente.toLowerCase().includes(search.toLowerCase()) ||
    o.projeto.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Histórico de Orçamentos</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Buscar por cliente ou material..."
        placeholderTextColor={colors.onSurfaceVariant}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.list}>
        {filtered.map((orc) => (
          <TouchableOpacity
            key={orc.id}
            style={styles.orcCard}
            onPress={() => navigation.navigate("visualizarorcamento", { orcamento: orc })}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.orcId}>{orc.id}</Text>
              <Badge
                label={orc.status}
                variant={
                  orc.status === "Aprovado"
                    ? "success"
                    : orc.status === "Vencido"
                    ? "danger"
                    : "warning"
                }
              />
            </View>

            <Text style={styles.clienteName}>{orc.cliente}</Text>
            <Text style={styles.projetoSub}>{orc.projeto} • {orc.material}</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.dateText}>Criado em {orc.data}</Text>
              <Text style={styles.valorText}>{orc.valor}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 110 },
  title: { fontSize: 24, fontWeight: "800", color: colors.primary, marginBottom: 16 },

  searchBar: {
    height: 48,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.onSurface,
    marginBottom: 16,
  },

  list: { gap: 12 },
  orcCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 16,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orcId: { fontSize: 12, fontWeight: "700", color: colors.onSurfaceVariant },
  clienteName: { fontSize: 18, fontWeight: "800", color: colors.primary, marginTop: 4 },
  projetoSub: { fontSize: 14, color: colors.onSurfaceVariant, marginTop: 2, marginBottom: 12 },

  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dateText: { fontSize: 12, color: colors.onSurfaceVariant },
  valorText: { fontSize: 16, fontWeight: "800", color: colors.secondary },
});
