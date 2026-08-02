import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useWindowDimensions } from "react-native";
import { colors } from "../theme/colors";
import Badge from "../components/ui/Badge";
import { useOrcamentoStore } from "../stores/orcamentoStore";
import { formatCurrency } from "../services/pdfService";

export default function ListaOrcamentosScreen({ navigation }: any) {
  const compact = useWindowDimensions().width < 390;
  const [search, setSearch] = useState("");

  const orcamentos = useOrcamentoStore((state) => state.orcamentos);
  const fetchOrcamentos = useOrcamentoStore((state) => state.fetchOrcamentos);

  useEffect(() => {
    fetchOrcamentos();
  }, []);

  const filtered = orcamentos.filter((o) =>
    (o.cliente_nome || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.projeto || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.material_nome || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, compact && styles.contentCompact]}>
      <Text style={styles.title}>Histórico de Orçamentos</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Buscar por cliente ou material..."
        placeholderTextColor={colors.onSurfaceVariant}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.list}>
        {filtered.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>{search ? "Nenhum orçamento encontrado" : "Nenhum orçamento criado"}</Text>
            <Text style={styles.emptyText}>{search ? "Tente buscar por outro nome ou material." : "Use “Novo Orçamento” para criar a primeira proposta."}</Text>
          </View>
        )}
        {filtered.map((orc) => (
          <TouchableOpacity
            key={orc.id}
            style={styles.orcCard}
            onPress={() => navigation.navigate("visualizarorcamento", { orcamento: orc })}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.orcId}>{orc.id}</Text>
              <Badge
                label={orc.status === "APROVADO" ? "Aprovado" : orc.status === "VENCIDO" ? "Vencido" : orc.status === "REJEITADO" ? "Rejeitado" : "Pendente"}
                variant={
                  orc.status === "APROVADO"
                    ? "success"
                    : orc.status === "VENCIDO"
                    ? "danger"
                    : "warning"
                }
              />
            </View>

            <Text style={styles.clienteName}>{orc.cliente_nome}</Text>
            <Text style={styles.projetoSub}>{orc.projeto} • {orc.material_nome}</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.dateText}>Criado em {new Date(orc.created_at).toLocaleDateString("pt-BR")}</Text>
              <Text style={styles.valorText}>{formatCurrency(orc.preco_final)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { width: "100%", maxWidth: 720, alignSelf: "center", padding: 20, paddingBottom: 110 },
  contentCompact: { paddingHorizontal: 12 },
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
  emptyBox: { backgroundColor: colors.surfaceContainerLow, borderRadius: 14, padding: 28, alignItems: "center" },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: colors.primary },
  emptyText: { fontSize: 13, color: colors.onSurfaceVariant, textAlign: "center", marginTop: 5 },
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
