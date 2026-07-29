import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import Badge from "../components/ui/Badge";

export default function EstoqueChapasScreen({ navigation }: any) {
  const [search, setSearch] = useState("");

  const [chapas, setChapas] = useState([
    {
      id: "1",
      material: "Granito Preto São Gabriel",
      tipo: "Granito Natural",
      quantidade: 18,
      dimensoes: "2,80m × 1,80m",
      espessura: "2.0 cm",
      localizacao: "Estaleiro A - Prateleira 03",
    },
    {
      id: "2",
      material: "Mármore Travertino Romano",
      tipo: "Mármore Importado",
      quantidade: 14,
      dimensoes: "3,00m × 1,60m",
      espessura: "2.0 cm",
      localizacao: "Estaleiro B - Prateleira 01",
    },
    {
      id: "3",
      material: "Porcelanato Calacatta Gold",
      tipo: "Porcelanato Técnico",
      quantidade: 10,
      dimensoes: "3,20m × 1,60m",
      espessura: "1.2 cm",
      localizacao: "Estaleiro C - Prateleira 05",
    },
  ]);

  const totalChapas = chapas.reduce((acc, curr) => acc + curr.quantidade, 0);

  const filteredChapas = chapas.filter(
    (c) =>
      c.material.toLowerCase().includes(search.toLowerCase()) ||
      c.tipo.toLowerCase().includes(search.toLowerCase())
  );

  const handleNovaChapa = () => {
    Alert.prompt(
      "Entrada de Chapas",
      "Digite a quantidade de novas chapas recebidas:",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Adicionar ao Estoque",
          onPress: (val) => {
            const num = parseInt(val || "0", 10);
            if (num > 0) {
              setChapas((prev) =>
                prev.map((item, idx) => (idx === 0 ? { ...item, quantidade: item.quantidade + num } : item))
              );
              Alert.alert("Sucesso", `${num} chapas adicionadas ao estoque com sucesso!`);
            }
          },
        },
      ],
      "plain-text"
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Back & Title */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
        </TouchableOpacity>

        <Text style={styles.title}>Estoque de Chapas</Text>

        <TouchableOpacity style={styles.addBtn} onPress={handleNovaChapa}>
          <Ionicons name="add" size={16} color={colors.onPrimary} style={{ marginRight: 2 }} />
          <Text style={styles.addBtnText}>Entrada</Text>
        </TouchableOpacity>
      </View>

      {/* Metric Banner Card */}
      <View style={styles.metricCard}>
        <View style={styles.metricLeft}>
          <Text style={styles.metricLabel}>TOTAL NO DEPÓSITO</Text>
          <Text style={styles.metricNum}>{totalChapas} Chapas</Text>
          <Text style={styles.metricSub}>Prontas para medição e corte na serra</Text>
        </View>
        <View style={styles.metricIconBox}>
          <Ionicons name="layers" size={32} color={colors.secondaryFixed} />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={colors.outline} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Filtrar por material ou tipo..."
          placeholderTextColor={colors.onSurfaceVariant}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Chapas List */}
      <View style={styles.list}>
        {filteredChapas.map((chapa) => (
          <View key={chapa.id} style={styles.chapaCard}>
            <View style={styles.cardHeader}>
              <View style={styles.matIcon}>
                <Ionicons name="grid-outline" size={22} color={colors.primary} />
              </View>
              <View style={styles.flex1}>
                <Text style={styles.matTitle}>{chapa.material}</Text>
                <Text style={styles.matSub}>{chapa.tipo}</Text>
              </View>
              <Badge label={`${chapa.quantidade} Chapas`} variant="success" />
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>DIMENSÕES</Text>
                <Text style={styles.detailVal}>{chapa.dimensoes}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>ESPESSURA</Text>
                <Text style={styles.detailVal}>{chapa.espessura}</Text>
              </View>
            </View>

            <View style={styles.locRow}>
              <Ionicons name="location-outline" size={14} color={colors.onSurfaceVariant} style={{ marginRight: 4 }} />
              <Text style={styles.locText}>{chapa.localizacao}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 110 },

  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 20, fontWeight: "800", color: colors.primary },
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  addBtnText: { color: colors.onPrimary, fontSize: 13, fontWeight: "700" },

  metricCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  metricLeft: { flex: 1 },
  metricLabel: { fontSize: 11, fontWeight: "700", color: colors.onPrimaryContainer, letterSpacing: 0.5 },
  metricNum: { fontSize: 32, fontWeight: "800", color: colors.onPrimary, marginTop: 4 },
  metricSub: { fontSize: 13, color: colors.onPrimaryContainer, marginTop: 2 },
  metricIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },

  searchContainer: { position: "relative", marginBottom: 16 },
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

  list: { gap: 12 },
  chapaCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  matIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
  },
  flex1: { flex: 1 },
  matTitle: { fontSize: 16, fontWeight: "700", color: colors.primary },
  matSub: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 },

  detailRow: {
    flexDirection: "row",
    backgroundColor: colors.surfaceContainerLow,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailItem: { flex: 1 },
  detailLabel: { fontSize: 10, fontWeight: "700", color: colors.onSurfaceVariant, letterSpacing: 0.5 },
  detailVal: { fontSize: 14, fontWeight: "700", color: colors.primary, marginTop: 2 },

  locRow: { flexDirection: "row", alignItems: "center" },
  locText: { fontSize: 12, color: colors.onSurfaceVariant },
});
