import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { colors } from "../theme/colors";
import { useMaterialStore } from "../stores/materialStore";

export default function TabelaPrecosScreen() {
  const [activeTab, setActiveTab] = useState<"materiais" | "mao_obra" | "cubas">("materiais");
  const [search, setSearch] = useState("");
  const materials = useMaterialStore((state) => state.materials);
  const updatePrice = useMaterialStore((state) => state.updatePrice);

  const [laborList] = useState([
    { id: "1", nome: "Corte em 45º / Meia Esquadria", preco: "R$ 45,00/m" },
    { id: "2", nome: "Acabamento Bisote Simples", preco: "R$ 25,00/m" },
    { id: "3", nome: "Polimento de Borda Boleada", preco: "R$ 35,00/m" },
  ]);

  const [cubasList] = useState([
    { id: "1", nome: "Cuba Inox N.01 (40x34)", preco: "R$ 180,00" },
    { id: "2", nome: "Cuba Esculpida na Pedra", preco: "R$ 450,00" },
    { id: "3", nome: "Cuba de Louça Apoio Oval", preco: "R$ 220,00" },
  ]);

  const handleEditPrice = (material: any) => {
    Alert.prompt(
      "Editar Preço",
      `Novo preço por m² para ${material.nome}:`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salvar",
          onPress: (val) => {
            const num = parseFloat(val || "0");
            if (num > 0) {
              updatePrice(material.id, num);
            }
          },
        },
      ],
      "plain-text",
      material.preco_por_m2.toString()
    );
  };

  const filteredMaterials = materials.filter((m) =>
    m.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tabela de Preços</Text>

      {/* Tabs Bar */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabChip, activeTab === "materiais" && styles.tabChipActive]}
          onPress={() => setActiveTab("materiais")}
        >
          <Text style={[styles.tabChipText, activeTab === "materiais" && styles.tabChipTextActive]}>
            Materiais (m²)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabChip, activeTab === "mao_obra" && styles.tabChipActive]}
          onPress={() => setActiveTab("mao_obra")}
        >
          <Text style={[styles.tabChipText, activeTab === "mao_obra" && styles.tabChipTextActive]}>
            Mão de Obra
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabChip, activeTab === "cubas" && styles.tabChipActive]}
          onPress={() => setActiveTab("cubas")}
        >
          <Text style={[styles.tabChipText, activeTab === "cubas" && styles.tabChipTextActive]}>
            Cubas
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Buscar item..."
        placeholderTextColor={colors.onSurfaceVariant}
        value={search}
        onChangeText={setSearch}
      />

      {/* Tab: MATERIAIS */}
      {activeTab === "materiais" && (
        <View style={styles.list}>
          {filteredMaterials.map((m) => (
            <View key={m.id} style={styles.itemCard}>
              <View style={styles.itemIcon}>
                <Text style={{ fontSize: 22 }}>🪨</Text>
              </View>

              <View style={styles.flex1}>
                <Text style={styles.itemName}>{m.nome}</Text>
                <Text style={styles.itemSub}>{m.tipo || "Pedra Natural"}</Text>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.itemPrice}>R$ {m.preco_por_m2}/m²</Text>
                <TouchableOpacity onPress={() => handleEditPrice(m)}>
                  <Text style={styles.editLink}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Tab: MÃO DE OBRA */}
      {activeTab === "mao_obra" && (
        <View style={styles.list}>
          {laborList.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemIcon}>
                <Text style={{ fontSize: 22 }}>📐</Text>
              </View>
              <View style={styles.flex1}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemSub}>Acabamento / Serviço</Text>
              </View>
              <Text style={styles.itemPrice}>{item.preco}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Tab: CUBAS */}
      {activeTab === "cubas" && (
        <View style={styles.list}>
          {cubasList.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemIcon}>
                <Text style={{ fontSize: 22 }}>🥣</Text>
              </View>
              <View style={styles.flex1}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemSub}>Acessório</Text>
              </View>
              <Text style={styles.itemPrice}>{item.preco}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 110 },
  title: { fontSize: 24, fontWeight: "800", color: colors.primary, marginBottom: 16 },

  tabRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
  },
  tabChipActive: { backgroundColor: colors.primary },
  tabChipText: { fontSize: 13, fontWeight: "600", color: colors.onSurfaceVariant },
  tabChipTextActive: { color: colors.onPrimary },

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

  list: { gap: 10 },
  itemCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
  },
  flex1: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: "700", color: colors.primary },
  itemSub: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 },
  priceContainer: { alignItems: "flex-end" },
  itemPrice: { fontSize: 15, fontWeight: "800", color: colors.secondary },
  editLink: { fontSize: 12, color: colors.primary, textDecorationLine: "underline", marginTop: 2 },
});
