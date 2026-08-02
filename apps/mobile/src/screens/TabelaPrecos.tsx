import React, { useEffect, useMemo, useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { useMaterialStore } from "../stores/materialStore";
import { useProdutoStore } from "../stores/produtoStore";
import type { Produto } from "../services/produtoService";
import { currencyToNumber, formatCurrency, maskCurrency } from "../utils/formatters";

export default function TabelaPrecosScreen({ navigation: _navigation }: { navigation?: any } = {}) {
  const { width } = useWindowDimensions();
  const compact = width < 390;
  const [tab, setTab] = useState<"materiais" | "produtos">("materiais");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [materialModal, setMaterialModal] = useState(false);
  const [produtoModal, setProdutoModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [materialName, setMaterialName] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [materialPriceM2, setMaterialPriceM2] = useState("");
  const [materialPriceMl, setMaterialPriceMl] = useState("");
  const [produtoNome, setProdutoNome] = useState("");
  const [produtoDescricao, setProdutoDescricao] = useState("");
  const [produtoPrice, setProdutoPrice] = useState("");
  const [produtoQuantidade, setProdutoQuantidade] = useState("");

  const materials = useMaterialStore((state) => state.materials);
  const fetchMaterials = useMaterialStore((state) => state.fetchMaterials);
  const addMaterial = useMaterialStore((state) => state.addMaterial);
  const updatePrice = useMaterialStore((state) => state.updatePrice);
  const produtos = useProdutoStore((state) => state.produtos);
  const fetchProdutos = useProdutoStore((state) => state.fetchProdutos);
  const saveProduto = useProdutoStore((state) => state.saveProduto);
  const removeProduto = useProdutoStore((state) => state.removeProduto);

  useEffect(() => { fetchMaterials(); fetchProdutos(); }, [fetchMaterials, fetchProdutos]);

  const filteredMaterials = useMemo(() => materials.filter((item) => `${item.nome} ${item.tipo}`.toLowerCase().includes(search.toLowerCase())), [materials, search]);
  const filteredProdutos = useMemo(() => produtos.filter((item) => `${item.nome} ${item.descricao}`.toLowerCase().includes(search.toLowerCase())), [produtos, search]);

  const openMaterial = (item?: any) => {
    setEditingMaterial(item || null);
    setMaterialName(item?.nome || "");
    setMaterialType(item?.tipo || "");
    setMaterialPriceM2(item?.preco_por_m2 ? formatCurrency(item.preco_por_m2) : "");
    setMaterialPriceMl(item?.preco_por_metro_linear ? formatCurrency(item.preco_por_metro_linear) : "");
    setMaterialModal(true);
  };

  const openProduto = (item?: Produto) => {
    setEditingProduto(item || null);
    setProdutoNome(item?.nome || "");
    setProdutoDescricao(item?.descricao || "");
    setProdutoPrice(item ? formatCurrency(item.preco) : "");
    setProdutoQuantidade(item ? String(item.quantidade) : "");
    setProdutoModal(true);
  };

  const handleSaveMaterial = async () => {
    const priceM2 = currencyToNumber(materialPriceM2);
    const priceMl = currencyToNumber(materialPriceMl);
    if (!materialName.trim() || !materialType.trim() || (priceM2 <= 0 && priceMl <= 0)) {
      return Alert.alert("Dados incompletos", "Informe nome, tipo e pelo menos um preço do material.");
    }
    try {
      setSaving(true);
      const data = { nome: materialName.trim(), tipo: materialType.trim(), preco_por_m2: priceM2, preco_por_metro_linear: priceMl };
      if (editingMaterial) await updatePrice(editingMaterial.id, data);
      else await addMaterial(data);
      await fetchMaterials();
      setMaterialModal(false);
      Alert.alert("Material salvo", "Os valores por m² e metro linear já podem ser usados.");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar o material.");
    } finally { setSaving(false); }
  };

  const handleSaveProduto = async () => {
    const price = currencyToNumber(produtoPrice);
    const quantidade = Math.floor(Number(produtoQuantidade));
    if (!produtoNome.trim() || !produtoDescricao.trim() || price <= 0 || !Number.isFinite(quantidade) || quantidade < 0) {
      return Alert.alert("Dados incompletos", "Informe nome, descrição, valor e quantidade em estoque.");
    }
    try {
      setSaving(true);
      await saveProduto({ nome: produtoNome.trim(), descricao: produtoDescricao.trim(), preco: price, quantidade }, editingProduto?.id);
      await fetchProdutos();
      setProdutoModal(false);
      Alert.alert("Produto salvo", "O item já está disponível para os próximos orçamentos.");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar o produto.");
    } finally { setSaving(false); }
  };

  const confirmDelete = (produto: Produto) => Alert.alert("Excluir produto", `Deseja excluir ${produto.nome}?`, [
    { text: "Cancelar", style: "cancel" },
    { text: "Excluir", style: "destructive", onPress: async () => { await removeProduto(produto.id); setProdutoModal(false); } },
  ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, compact && styles.contentCompact]} keyboardShouldPersistTaps="handled">
      <View style={[styles.headerRow, compact && styles.headerCompact]}>
        <View style={styles.headerText}><Text style={styles.title}>Tabela de Preços</Text><Text style={styles.subtitle}>Materiais, valores e estoque de produtos</Text></View>
        <TouchableOpacity style={styles.addBtn} onPress={() => tab === "materiais" ? openMaterial() : openProduto()}><Ionicons name="add" size={17} color={colors.onPrimary} /><Text style={styles.addBtnText}>{tab === "materiais" ? "Material" : "Produto"}</Text></TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        <Tab active={tab === "materiais"} label="Materiais" onPress={() => { setTab("materiais"); setSearch(""); }} />
        <Tab active={tab === "produtos"} label="Produtos e estoque" onPress={() => { setTab("produtos"); setSearch(""); }} />
      </View>

      <View style={styles.searchContainer}><Ionicons name="search-outline" size={18} color={colors.outline} style={styles.searchIcon} /><TextInput style={styles.searchBar} placeholder={tab === "materiais" ? "Buscar material..." : "Buscar produto..."} placeholderTextColor={colors.onSurfaceVariant} value={search} onChangeText={setSearch} /></View>

      {tab === "materiais" ? <View style={styles.list}>
        {filteredMaterials.length === 0 && <Empty icon="layers-outline" title="Nenhum material cadastrado" text="Cadastre seus próprios materiais e valores." />}
        {filteredMaterials.map((item) => <TouchableOpacity key={item.id} style={[styles.itemCard, compact && styles.itemCardCompact]} onPress={() => openMaterial(item)}><IconBox icon="layers-outline" /><View style={styles.flex1}><Text style={styles.itemName}>{item.nome}</Text><Text style={styles.itemSub}>{item.tipo}</Text><View style={styles.priceTags}>{item.preco_por_m2 > 0 && <Text style={styles.priceTag}>{formatCurrency(item.preco_por_m2)}/m²</Text>}{Number(item.preco_por_metro_linear) > 0 && <Text style={styles.priceTag}>{formatCurrency(item.preco_por_metro_linear)}/m linear</Text>}</View></View><Ionicons name="create-outline" size={20} color={colors.onSurfaceVariant} /></TouchableOpacity>)}
      </View> : <View style={styles.list}>
        {filteredProdutos.length === 0 && <Empty icon="cube-outline" title="Nenhum produto cadastrado" text="O catálogo começa vazio. Cadastre somente os produtos que você trabalha." />}
        {filteredProdutos.map((item) => <TouchableOpacity key={item.id} style={[styles.itemCard, compact && styles.itemCardCompact]} onPress={() => openProduto(item)}><IconBox icon="cube-outline" /><View style={styles.flex1}><Text style={styles.itemName}>{item.nome}</Text><Text style={styles.itemSub} numberOfLines={2}>{item.descricao}</Text><Text style={[styles.stockText, item.quantidade === 0 && styles.stockEmpty]}>Estoque: {item.quantidade} un.</Text></View><View style={styles.priceBox}><Text style={styles.itemPrice}>{formatCurrency(item.preco)}</Text><Text style={styles.editText}>Editar</Text></View></TouchableOpacity>)}
      </View>}

      <Modal visible={materialModal} transparent animationType="slide" onRequestClose={() => setMaterialModal(false)}>
        <View style={[styles.modalOverlay, compact && styles.modalOverlayCompact]}><ScrollView style={styles.modalScroll} contentContainerStyle={[styles.modalCard, compact && styles.modalCardCompact]} keyboardShouldPersistTaps="handled">
          <ModalHeader title={editingMaterial ? "Editar material" : "Novo material"} close={() => setMaterialModal(false)} />
          <Label text="Nome do material" /><TextInput style={styles.input} value={materialName} onChangeText={setMaterialName} placeholder="Ex: Granito Preto São Gabriel" placeholderTextColor={colors.onSurfaceVariant} />
          <Label text="Categoria / tipo" /><TextInput style={styles.input} value={materialType} onChangeText={setMaterialType} placeholder="Ex: Granito" placeholderTextColor={colors.onSurfaceVariant} />
          <Label text="Preço por metro quadrado" /><TextInput style={styles.priceInput} value={materialPriceM2} onChangeText={(value) => setMaterialPriceM2(maskCurrency(value))} keyboardType="number-pad" placeholder="R$ 0,00 por m²" placeholderTextColor={colors.onSurfaceVariant} />
          <Label text="Preço por metro linear" /><TextInput style={styles.priceInput} value={materialPriceMl} onChangeText={(value) => setMaterialPriceMl(maskCurrency(value))} keyboardType="number-pad" placeholder="R$ 0,00 por metro" placeholderTextColor={colors.onSurfaceVariant} />
          <Text style={styles.helper}>Você pode preencher apenas a modalidade que utiliza ou cadastrar as duas.</Text>
          <ModalActions saving={saving} cancel={() => setMaterialModal(false)} save={handleSaveMaterial} compact={compact} />
        </ScrollView></View>
      </Modal>

      <Modal visible={produtoModal} transparent animationType="slide" onRequestClose={() => setProdutoModal(false)}>
        <View style={[styles.modalOverlay, compact && styles.modalOverlayCompact]}><ScrollView style={styles.modalScroll} contentContainerStyle={[styles.modalCard, compact && styles.modalCardCompact]} keyboardShouldPersistTaps="handled">
          <ModalHeader title={editingProduto ? "Editar produto" : "Novo produto"} close={() => setProdutoModal(false)} />
          <Label text="Nome" /><TextInput style={styles.input} value={produtoNome} onChangeText={setProdutoNome} placeholder="Ex: Cuba Tramontina 40 × 34" placeholderTextColor={colors.onSurfaceVariant} />
          <Label text="Descrição" /><TextInput style={[styles.input, styles.textArea]} value={produtoDescricao} onChangeText={setProdutoDescricao} placeholder="Marca, medida, acabamento ou detalhes" placeholderTextColor={colors.onSurfaceVariant} multiline textAlignVertical="top" />
          <Label text="Valor unitário" /><TextInput style={styles.priceInput} value={produtoPrice} onChangeText={(value) => setProdutoPrice(maskCurrency(value))} keyboardType="number-pad" placeholder="R$ 0,00" placeholderTextColor={colors.onSurfaceVariant} />
          <Label text="Quantidade em estoque" /><TextInput style={styles.input} value={produtoQuantidade} onChangeText={(value) => setProdutoQuantidade(value.replace(/\D/g, "").slice(0, 6))} keyboardType="number-pad" placeholder="0" placeholderTextColor={colors.onSurfaceVariant} />
          <Text style={styles.helper}>A quantidade será abatida quando um pedido com este produto for marcado como entregue.</Text>
          {editingProduto && <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(editingProduto)}><Ionicons name="trash-outline" size={18} color={colors.error} /><Text style={styles.deleteText}>Excluir produto</Text></TouchableOpacity>}
          <ModalActions saving={saving} cancel={() => setProdutoModal(false)} save={handleSaveProduto} compact={compact} />
        </ScrollView></View>
      </Modal>
    </ScrollView>
  );
}

function Tab({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) { return <TouchableOpacity style={[styles.tab, active && styles.tabActive]} onPress={onPress}><Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text></TouchableOpacity>; }
function IconBox({ icon }: { icon: any }) { return <View style={styles.iconBox}><Ionicons name={icon} size={21} color={colors.primary} /></View>; }
function Empty({ icon, title, text }: { icon: any; title: string; text: string }) { return <View style={styles.emptyBox}><Ionicons name={icon} size={32} color={colors.onSurfaceVariant} /><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyText}>{text}</Text></View>; }
function Label({ text }: { text: string }) { return <Text style={styles.label}>{text}</Text>; }
function ModalHeader({ title, close }: { title: string; close: () => void }) { return <View style={styles.modalHeader}><Text style={styles.modalTitle}>{title}</Text><TouchableOpacity onPress={close}><Ionicons name="close" size={22} color={colors.primary} /></TouchableOpacity></View>; }
function ModalActions({ saving, cancel, save, compact }: { saving: boolean; cancel: () => void; save: () => void; compact: boolean }) { return <View style={[styles.actions, compact && styles.actionsCompact]}><TouchableOpacity style={[styles.cancelBtn, compact && styles.fullButton]} onPress={cancel} disabled={saving}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity><TouchableOpacity style={[styles.saveBtn, compact && styles.fullButton, saving && styles.disabled]} onPress={save} disabled={saving}><Text style={styles.saveText}>{saving ? "Salvando..." : "Salvar"}</Text></TouchableOpacity></View>; }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, content: { width: "100%", maxWidth: 720, alignSelf: "center", padding: 20, paddingBottom: 120 }, contentCompact: { paddingHorizontal: 12 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }, headerCompact: { alignItems: "flex-start" }, headerText: { flex: 1 }, title: { fontSize: 24, fontWeight: "800", color: colors.primary, flexShrink: 1 }, subtitle: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 3 },
  addBtn: { minHeight: 40, backgroundColor: colors.primary, paddingHorizontal: 12, borderRadius: 20, flexDirection: "row", alignItems: "center", gap: 4 }, addBtnText: { color: colors.onPrimary, fontSize: 12, fontWeight: "700" },
  tabRow: { flexDirection: "row", gap: 8, marginBottom: 14 }, tab: { flex: 1, minHeight: 44, paddingHorizontal: 5, backgroundColor: colors.surfaceContainerHigh, borderRadius: 22, alignItems: "center", justifyContent: "center" }, tabActive: { backgroundColor: colors.primary }, tabText: { color: colors.onSurfaceVariant, fontSize: 12, fontWeight: "700", textAlign: "center" }, tabTextActive: { color: colors.onPrimary },
  searchContainer: { position: "relative", marginBottom: 16 }, searchIcon: { position: "absolute", left: 14, top: 15, zIndex: 1 }, searchBar: { height: 48, backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingLeft: 42, paddingRight: 14, color: colors.onSurface },
  list: { gap: 10 }, itemCard: { minHeight: 82, backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 14, padding: 13, flexDirection: "row", alignItems: "center", gap: 11 }, itemCardCompact: { paddingHorizontal: 10, gap: 8 }, iconBox: { width: 42, height: 42, borderRadius: 10, backgroundColor: colors.surfaceContainerLow, alignItems: "center", justifyContent: "center" }, flex1: { flex: 1, minWidth: 0 }, itemName: { fontSize: 15, fontWeight: "800", color: colors.primary }, itemSub: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 3 }, priceTags: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 7 }, priceTag: { fontSize: 11, fontWeight: "800", color: colors.onSecondaryContainer, backgroundColor: colors.secondaryContainer, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 }, priceBox: { alignItems: "flex-end", maxWidth: "32%" }, itemPrice: { fontSize: 13, fontWeight: "800", color: colors.secondary, textAlign: "right" }, editText: { fontSize: 11, fontWeight: "700", color: colors.onSecondaryContainer, marginTop: 4 }, stockText: { fontSize: 12, fontWeight: "700", color: colors.secondary, marginTop: 6 }, stockEmpty: { color: colors.error },
  emptyBox: { alignItems: "center", padding: 28, backgroundColor: colors.surfaceContainerLow, borderRadius: 14 }, emptyTitle: { fontSize: 16, fontWeight: "700", color: colors.primary, marginTop: 8, textAlign: "center" }, emptyText: { fontSize: 13, color: colors.onSurfaceVariant, textAlign: "center", marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(9, 20, 38, 0.6)", justifyContent: "center", padding: 20 }, modalOverlayCompact: { padding: 8 }, modalScroll: { maxHeight: "94%", borderRadius: 20 }, modalCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: 20, padding: 20 }, modalCardCompact: { padding: 14 }, modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }, modalTitle: { flex: 1, fontSize: 20, fontWeight: "800", color: colors.primary },
  label: { fontSize: 13, fontWeight: "700", color: colors.primary, marginTop: 12, marginBottom: 5 }, input: { minHeight: 46, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 10, paddingHorizontal: 13, color: colors.onSurface }, textArea: { height: 78, paddingTop: 12 }, priceInput: { height: 52, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.secondary, borderRadius: 12, paddingHorizontal: 14, fontSize: 19, fontWeight: "800", color: colors.secondary }, helper: { fontSize: 11, lineHeight: 16, color: colors.onSurfaceVariant, marginTop: 7 },
  deleteButton: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12 }, deleteText: { color: colors.error, fontWeight: "700" },
  actions: { flexDirection: "row", gap: 10, marginTop: 20 }, actionsCompact: { flexDirection: "column-reverse" }, cancelBtn: { minHeight: 48, paddingHorizontal: 18, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, alignItems: "center", justifyContent: "center" }, cancelText: { color: colors.onSurfaceVariant, fontWeight: "700" }, saveBtn: { flex: 1, minHeight: 48, backgroundColor: colors.secondaryFixed, borderRadius: 12, alignItems: "center", justifyContent: "center" }, fullButton: { flex: 0, width: "100%" }, saveText: { color: colors.onSecondaryFixed, fontWeight: "800" }, disabled: { opacity: 0.55 },
});
