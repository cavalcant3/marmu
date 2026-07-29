import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { colors } from "../theme/colors";
import { useMaterialStore } from "../stores/materialStore";

export default function TabelaPrecosScreen() {
  const [activeTab, setActiveTab] = useState<"materiais" | "mao_obra" | "cubas">("materiais");
  const [search, setSearch] = useState("");

  const materials = useMaterialStore((state) => state.materials);
  const updatePrice = useMaterialStore((state) => state.updatePrice);
  const addMaterial = useMaterialStore((state) => state.addMaterial);

  // Initial State for Labor and Cubas
  const [laborList, setLaborList] = useState([
    { id: "1", nome: "Corte em 45º / Meia Esquadria", tipo: "Acabamento / Serviço", preco: 45, unidade: "m" },
    { id: "2", nome: "Acabamento Bisote Simples", tipo: "Polimento de Borda", preco: 25, unidade: "m" },
    { id: "3", nome: "Polimento de Borda Boleada", tipo: "Borda Arredondada", preco: 35, unidade: "m" },
  ]);

  const [cubasList, setCubasList] = useState([
    { id: "1", nome: "Cuba Inox N.01 (40x34)", tipo: "Inox Embutir", preco: 180, unidade: "unid" },
    { id: "2", nome: "Cuba Esculpida na Pedra", tipo: "Esculpida", preco: 450, unidade: "unid" },
    { id: "3", nome: "Cuba de Louça Apoio Oval", tipo: "Louça Sanitária", preco: 220, unidade: "unid" },
  ]);

  // Modal State for Editing / Adding
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [editPrice, setEditPrice] = useState("");

  // Open Edit Modal for existing item
  const openEditModal = (item: any) => {
    setEditingItem(item);
    setEditName(item.nome);
    setEditType(item.tipo || (activeTab === "materiais" ? "Granito / Mármore" : "Serviço"));
    setEditPrice((item.preco_por_m2 || item.preco || 0).toString());
    setModalVisible(true);
  };

  // Open Edit Modal for NEW item
  const openNewItemModal = () => {
    setEditingItem(null);
    setEditName("");
    setEditType(activeTab === "materiais" ? "Granito" : activeTab === "mao_obra" ? "Acabamento" : "Inox");
    setEditPrice("");
    setModalVisible(true);
  };

  // Save changes from Modal
  const handleSaveModal = () => {
    const priceNum = parseFloat(editPrice) || 0;
    if (!editName) {
      Alert.alert("Erro", "Insira o nome do item");
      return;
    }
    if (priceNum <= 0) {
      Alert.alert("Erro", "Insira um valor numérico válido maior que zero");
      return;
    }

    if (activeTab === "materiais") {
      if (editingItem) {
        // Update Material Store
        updatePrice(editingItem.id, priceNum);
      } else {
        // Add new Material Store
        addMaterial({
          nome: editName,
          tipo: editType,
          preco_por_m2: priceNum,
        });
      }
    } else if (activeTab === "mao_obra") {
      if (editingItem) {
        setLaborList((prev) =>
          prev.map((i) => (i.id === editingItem.id ? { ...i, nome: editName, tipo: editType, preco: priceNum } : i))
        );
      } else {
        setLaborList((prev) => [
          ...prev,
          { id: Date.now().toString(), nome: editName, tipo: editType, preco: priceNum, unidade: "m" },
        ]);
      }
    } else if (activeTab === "cubas") {
      if (editingItem) {
        setCubasList((prev) =>
          prev.map((i) => (i.id === editingItem.id ? { ...i, nome: editName, tipo: editType, preco: priceNum } : i))
        );
      } else {
        setCubasList((prev) => [
          ...prev,
          { id: Date.now().toString(), nome: editName, tipo: editType, preco: priceNum, unidade: "unid" },
        ]);
      }
    }

    setModalVisible(false);
    Alert.alert("Sucesso", "Preço salvo e atualizado com sucesso!");
  };

  const filteredMaterials = materials.filter((m) =>
    m.nome.toLowerCase().includes(search.toLowerCase())
  );
  const filteredLabor = laborList.filter((l) =>
    l.nome.toLowerCase().includes(search.toLowerCase())
  );
  const filteredCubas = cubasList.filter((c) =>
    c.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Tabela de Preços</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openNewItemModal}>
          <Text style={styles.addBtnText}>+ Novo Item</Text>
        </TouchableOpacity>
      </View>

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
            Mão de Obra (m)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabChip, activeTab === "cubas" && styles.tabChipActive]}
          onPress={() => setActiveTab("cubas")}
        >
          <Text style={[styles.tabChipText, activeTab === "cubas" && styles.tabChipTextActive]}>
            Cubas & Acessórios
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Buscar material ou serviço..."
        placeholderTextColor={colors.onSurfaceVariant}
        value={search}
        onChangeText={setSearch}
      />

      {/* TAB 1: MATERIAIS (m²) */}
      {activeTab === "materiais" && (
        <View style={styles.list}>
          {filteredMaterials.map((m) => (
            <TouchableOpacity key={m.id} style={styles.itemCard} onPress={() => openEditModal(m)}>
              <View style={styles.itemIcon}>
                <Text style={{ fontSize: 22 }}>🪨</Text>
              </View>

              <View style={styles.flex1}>
                <Text style={styles.itemName}>{m.nome}</Text>
                <Text style={styles.itemSub}>{m.tipo || "Granito/Mármore"}</Text>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.itemPrice}>R$ {m.preco_por_m2}/m²</Text>
                <View style={styles.editPill}>
                  <Text style={styles.editPillText}>✏️ Editar</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* TAB 2: MÃO DE OBRA (m) */}
      {activeTab === "mao_obra" && (
        <View style={styles.list}>
          {filteredLabor.map((item) => (
            <TouchableOpacity key={item.id} style={styles.itemCard} onPress={() => openEditModal(item)}>
              <View style={styles.itemIcon}>
                <Text style={{ fontSize: 22 }}>📐</Text>
              </View>
              <View style={styles.flex1}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemSub}>{item.tipo}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.itemPrice}>R$ {item.preco}/m</Text>
                <View style={styles.editPill}>
                  <Text style={styles.editPillText}>✏️ Editar</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* TAB 3: CUBAS & ACESSÓRIOS */}
      {activeTab === "cubas" && (
        <View style={styles.list}>
          {filteredCubas.map((item) => (
            <TouchableOpacity key={item.id} style={styles.itemCard} onPress={() => openEditModal(item)}>
              <View style={styles.itemIcon}>
                <Text style={{ fontSize: 22 }}>🥣</Text>
              </View>
              <View style={styles.flex1}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemSub}>{item.tipo}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.itemPrice}>R$ {item.preco}</Text>
                <View style={styles.editPill}>
                  <Text style={styles.editPillText}>✏️ Editar</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* EDIT & ADD MODAL (CROSS-PLATFORM REACT NATIVE MODAL) */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? "Editar Preço e Detalhes" : "Adicionar Novo Item"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ fontSize: 20 }}>❌</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Nome do Material / Serviço</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: Granito Preto São Gabriel"
              placeholderTextColor={colors.onSurfaceVariant}
              value={editName}
              onChangeText={setEditName}
            />

            <Text style={styles.modalLabel}>Categoria / Tipo</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: Granito, Mármore, Acabamento"
              placeholderTextColor={colors.onSurfaceVariant}
              value={editType}
              onChangeText={setEditType}
            />

            <Text style={styles.modalLabel}>
              Preço (R$) {activeTab === "materiais" ? "por m²" : activeTab === "mao_obra" ? "por metro" : "por unidade"}
            </Text>
            <TextInput
              style={styles.modalPriceInput}
              placeholder="0.00"
              placeholderTextColor={colors.onSurfaceVariant}
              keyboardType="decimal-pad"
              value={editPrice}
              onChangeText={setEditPrice}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveModal}>
                <Text style={styles.saveBtnText}>💾 Salvar Preço</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 120 },

  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "800", color: colors.primary },
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  addBtnText: { color: colors.onPrimary, fontSize: 13, fontWeight: "700" },

  tabRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tabChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
  },
  tabChipActive: { backgroundColor: colors.primary },
  tabChipText: { fontSize: 12, fontWeight: "600", color: colors.onSurfaceVariant },
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
  editPill: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 4,
  },
  editPillText: { fontSize: 11, fontWeight: "700", color: colors.onSecondaryContainer },

  /* MODAL STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(9, 20, 38, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: colors.primary },
  modalLabel: { fontSize: 13, fontWeight: "700", color: colors.primary, marginTop: 12, marginBottom: 4 },
  modalInput: {
    height: 46,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.onSurface,
  },
  modalPriceInput: {
    height: 52,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 22,
    fontWeight: "800",
    color: colors.secondary,
  },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 24 },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtnText: { fontSize: 14, fontWeight: "600", color: colors.onSurfaceVariant },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.secondaryFixed,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveBtnText: { fontSize: 15, fontWeight: "800", color: colors.onSecondaryFixed },
});
