import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { useMaterialStore } from "../stores/materialStore";
import { useOrcamentoStore } from "../stores/orcamentoStore";
import { useProdutoStore } from "../stores/produtoStore";
import type { CustoAdicional, Medicao, ProdutoOrcamento } from "../services/orcamentoService";
import type { Produto } from "../services/produtoService";
import {
  currencyToNumber,
  formatCurrency,
  formatDecimal,
  maskCurrency,
  maskDecimal,
  maskPhone,
  parseDecimal,
} from "../utils/formatters";

type MedicaoDraft = {
  id: string;
  descricao: string;
  comprimento: string;
  largura: string;
  quantidade: string;
};

type CustoDraft = {
  id: string;
  tipo: CustoAdicional["tipo"];
  descricao: string;
  valor: string;
};

const novaMedicao = (index: number): MedicaoDraft => ({
  id: `medicao-${Date.now()}-${index}`,
  descricao: `Peça ${index}`,
  comprimento: "",
  largura: "",
  quantidade: "1",
});

const novoCusto = (tipo: CustoAdicional["tipo"], index: number): CustoDraft => ({
  id: `custo-${Date.now()}-${index}`,
  tipo,
  descricao: tipo === "MAO_DE_OBRA" ? "Mão de obra" : "Acabamento",
  valor: "",
});

export default function NovoOrcamentoScreen({ navigation }: any) {
  const { width } = useWindowDimensions();
  const compact = width < 390;
  const [step, setStep] = useState(1);
  const [cliente, setCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [projeto, setProjeto] = useState("");
  const [tipoCalculo, setTipoCalculo] = useState<"M2" | "ML">("M2");
  const [medicoes, setMedicoes] = useState<MedicaoDraft[]>([novaMedicao(1)]);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [custos, setCustos] = useState<CustoDraft[]>([
    novoCusto("MAO_DE_OBRA", 1),
    novoCusto("ACABAMENTO", 2),
  ]);
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoOrcamento[]>([]);
  const [precoFinal, setPrecoFinal] = useState("");
  const [precoAjustado, setPrecoAjustado] = useState(false);
  const [observacoes, setObservacoes] = useState("");
  const [saving, setSaving] = useState(false);

  const materials = useMaterialStore((state) => state.materials);
  const fetchMaterials = useMaterialStore((state) => state.fetchMaterials);
  const addOrcamento = useOrcamentoStore((state) => state.addOrcamento);
  const produtos = useProdutoStore((state) => state.produtos);
  const fetchProdutos = useProdutoStore((state) => state.fetchProdutos);

  useEffect(() => { fetchMaterials(); fetchProdutos(); }, [fetchMaterials, fetchProdutos]);
  useEffect(() => {
    if (!selectedMaterial && materials.length > 0) setSelectedMaterial(materials[0]);
  }, [materials, selectedMaterial]);
  useEffect(() => {
    if (!materials.length) return;
    const selectedPrice = Number(tipoCalculo === "ML" ? selectedMaterial?.preco_por_metro_linear : selectedMaterial?.preco_por_m2) || 0;
    if (selectedPrice > 0) return;
    const compatible = materials.find((material) => Number(tipoCalculo === "ML" ? material.preco_por_metro_linear : material.preco_por_m2) > 0);
    if (compatible) setSelectedMaterial(compatible);
  }, [materials, selectedMaterial, tipoCalculo]);

  const medicoesCalculadas = useMemo<Medicao[]>(() => medicoes.map((item, index) => {
    const comprimento = parseDecimal(item.comprimento);
    const largura = parseDecimal(item.largura);
    const quantidade = Math.max(1, Number(item.quantidade) || 1);
    return {
      id: item.id,
      descricao: item.descricao.trim() || `Peça ${index + 1}`,
      comprimento,
      largura,
      quantidade,
      area: tipoCalculo === "M2" ? comprimento * largura * quantidade : 0,
      metros_lineares: comprimento * quantidade,
    };
  }), [medicoes, tipoCalculo]);

  const areaTotal = medicoesCalculadas.reduce((sum, item) => sum + item.area, 0);
  const metrosLinearesTotal = medicoesCalculadas.reduce((sum, item) => sum + Number(item.metros_lineares || 0), 0);
  const metragemCalculada = tipoCalculo === "ML" ? metrosLinearesTotal : areaTotal;
  const precoMaterialUnitario = selectedMaterial ? Number(tipoCalculo === "ML" ? selectedMaterial.preco_por_metro_linear : selectedMaterial.preco_por_m2) || 0 : 0;
  const subtotalMaterial = metragemCalculada * precoMaterialUnitario;
  const custosCalculados = useMemo<CustoAdicional[]>(() => custos
    .map((item) => ({ ...item, descricao: item.descricao.trim(), valor: currencyToNumber(item.valor) }))
    .filter((item) => item.descricao && item.valor > 0), [custos]);
  const totalAdicionais = custosCalculados.reduce((sum, item) => sum + item.valor, 0);
  const totalProdutos = produtosSelecionados.reduce((sum, item) => sum + item.subtotal, 0);
  const precoSugerido = subtotalMaterial + totalAdicionais + totalProdutos;

  useEffect(() => {
    if (!precoAjustado) setPrecoFinal(formatCurrency(precoSugerido));
  }, [precoSugerido, precoAjustado]);

  const updateMedicao = (id: string, updates: Partial<MedicaoDraft>) => {
    setMedicoes((current) => current.map((item) => item.id === id ? { ...item, ...updates } : item));
  };

  const updateCusto = (id: string, updates: Partial<CustoDraft>) => {
    setCustos((current) => current.map((item) => item.id === id ? { ...item, ...updates } : item));
  };

  const adicionarMedicao = () => setMedicoes((current) => [...current, novaMedicao(current.length + 1)]);
  const adicionarCusto = (tipo: CustoAdicional["tipo"]) => {
    setCustos((current) => [...current, novoCusto(tipo, current.length + 1)]);
  };

  const adicionarProduto = (produto: Produto) => {
    if (produto.quantidade <= 0) return Alert.alert("Sem estoque", `${produto.nome} está sem unidades disponíveis.`);
    setProdutosSelecionados((current) => current.some((item) => item.produto_id === produto.id) ? current : [...current, {
      produto_id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao,
      preco_unitario: produto.preco,
      quantidade: 1,
      subtotal: produto.preco,
    }]);
  };

  const alterarQuantidadeProduto = (produtoId: string, delta: number) => {
    const estoque = produtos.find((item) => item.id === produtoId)?.quantidade || 0;
    setProdutosSelecionados((current) => current
      .map((item) => item.produto_id === produtoId
        ? { ...item, quantidade: Math.min(estoque, Math.max(0, item.quantidade + delta)), subtotal: Math.min(estoque, Math.max(0, item.quantidade + delta)) * item.preco_unitario }
        : item)
      .filter((item) => item.quantidade > 0));
  };

  const handleGerar = async () => {
    if (!cliente.trim() || !projeto.trim()) {
      Alert.alert("Dados incompletos", "Informe o cliente e o projeto.");
      return;
    }
    if (!selectedMaterial) {
      Alert.alert("Material obrigatório", "Cadastre e selecione um material.");
      return;
    }
    if (medicoesCalculadas.some((item) => item.comprimento <= 0 || (tipoCalculo === "M2" && item.largura <= 0))) {
      Alert.alert("Medição inválida", tipoCalculo === "M2" ? "Revise comprimento e largura de todas as peças." : "Revise o comprimento de todas as peças.");
      setStep(2);
      return;
    }
    if (precoMaterialUnitario <= 0) {
      Alert.alert("Preço não cadastrado", `Este material não possui valor por ${tipoCalculo === "M2" ? "metro quadrado" : "metro linear"}.`);
      setStep(3);
      return;
    }
    const indisponivel = produtosSelecionados.find((item) => item.quantidade > (produtos.find((produto) => produto.id === item.produto_id)?.quantidade || 0));
    if (indisponivel) return Alert.alert("Estoque insuficiente", `Revise a quantidade de ${indisponivel.nome}.`);

    const first = medicoesCalculadas[0];
    try {
      setSaving(true);
      const saved = await addOrcamento({
        cliente_nome: cliente.trim(),
        telefone,
        projeto: projeto.trim(),
        comprimento: first.comprimento,
        largura: first.largura,
        area: areaTotal,
        tipo_calculo: tipoCalculo,
        metragem_calculada: metragemCalculada,
        medicoes: medicoesCalculadas,
        material_id: selectedMaterial.id,
        material_nome: selectedMaterial.nome,
        material_preco: precoMaterialUnitario,
        subtotal_material: subtotalMaterial,
        total_adicionais: totalAdicionais,
        custos_adicionais: custosCalculados,
        produtos: produtosSelecionados,
        total_produtos: totalProdutos,
        preco_sugerido: precoSugerido,
        preco_final: currencyToNumber(precoFinal) || precoSugerido,
        observacoes: observacoes.trim(),
        status: "PENDENTE",
      });
      navigation.navigate("visualizarorcamento", { orcamento: saved });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar o orçamento.");
    } finally {
      setSaving(false);
    }
  };

  const steps = ["Cliente", "Medições", "Custos", "Resumo"];

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, compact && styles.contentCompact]} keyboardShouldPersistTaps="handled">
      <View style={styles.stepperContainer}>
        {steps.map((label, index) => {
          const number = index + 1;
          const active = step === number;
          const done = step > number;
          return (
            <TouchableOpacity key={label} style={styles.stepItem} onPress={() => setStep(number)}>
              <View style={[styles.stepBadge, active && styles.stepBadgeActive, done && styles.stepBadgeDone]}>
                {done ? <Ionicons name="checkmark" size={14} color={colors.onPrimary} /> :
                  <Text style={[styles.stepNum, active && styles.stepNumActive]}>{number}</Text>}
              </View>
              <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {step === 1 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados do Cliente e Obra</Text>
          <FieldLabel text="Nome do Cliente *" />
          <TextInput style={styles.input} value={cliente} onChangeText={setCliente} placeholder="Ex: João da Silva" placeholderTextColor={colors.onSurfaceVariant} />
          <FieldLabel text="Telefone / WhatsApp" />
          <TextInput style={styles.input} value={telefone} onChangeText={(value) => setTelefone(maskPhone(value))} keyboardType="phone-pad" placeholder="(11) 99999-9999" placeholderTextColor={colors.onSurfaceVariant} maxLength={15} />
          <FieldLabel text="Nome do Projeto / Cômodo *" />
          <TextInput style={styles.input} value={projeto} onChangeText={setProjeto} placeholder="Ex: Bancada da cozinha" placeholderTextColor={colors.onSurfaceVariant} />
          <PrimaryNext label="Próximo: adicionar medições" onPress={() => setStep(2)} />
        </View>
      )}

      {step === 2 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Medições do Projeto</Text>
          <Text style={styles.cardSub}>Adicione todas as peças que fazem parte deste orçamento.</Text>
          <Text style={styles.sectionLabel}>FORMA DE CÁLCULO</Text>
          <View style={styles.calculationTypeRow}>
            <CalculationType active={tipoCalculo === "M2"} title="Metro quadrado" subtitle="Comprimento × largura" unit="m²" onPress={() => setTipoCalculo("M2")} />
            <CalculationType active={tipoCalculo === "ML"} title="Metro linear" subtitle="Somente comprimento" unit="m" onPress={() => setTipoCalculo("ML")} />
          </View>
          {medicoes.map((item, index) => {
            const calculated = medicoesCalculadas[index];
            return (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>Medição {index + 1}</Text>
                  {medicoes.length > 1 && <TouchableOpacity onPress={() => setMedicoes((current) => current.filter((m) => m.id !== item.id))}><Ionicons name="trash-outline" size={19} color={colors.error} /></TouchableOpacity>}
                </View>
                <TextInput style={styles.input} value={item.descricao} onChangeText={(descricao) => updateMedicao(item.id, { descricao })} placeholder="Ex: Bancada principal" placeholderTextColor={colors.onSurfaceVariant} />
                <View style={[styles.rowInputs, compact && styles.rowInputsCompact]}>
                  <View style={styles.flex1}><FieldLabel text="Comprimento (m)" /><TextInput style={styles.numberInput} value={item.comprimento} onChangeText={(value) => updateMedicao(item.id, { comprimento: maskDecimal(value, 3) })} keyboardType="decimal-pad" placeholder="0,00" placeholderTextColor={colors.onSurfaceVariant} /></View>
                  {tipoCalculo === "M2" && <View style={styles.flex1}><FieldLabel text="Largura (m)" /><TextInput style={styles.numberInput} value={item.largura} onChangeText={(value) => updateMedicao(item.id, { largura: maskDecimal(value, 3) })} keyboardType="decimal-pad" placeholder="0,00" placeholderTextColor={colors.onSurfaceVariant} /></View>}
                  <View style={styles.quantityBox}><FieldLabel text="Qtd." /><TextInput style={styles.numberInput} value={item.quantidade} onChangeText={(value) => updateMedicao(item.id, { quantidade: value.replace(/\D/g, "").slice(0, 2) })} keyboardType="number-pad" /></View>
                </View>
                <Text style={styles.calculatedText}>{tipoCalculo === "M2" ? `Área: ${formatDecimal(calculated?.area || 0)} m²` : `Comprimento cobrado: ${formatDecimal(calculated?.metros_lineares || 0)} m`}</Text>
              </View>
            );
          })}
          <TouchableOpacity style={styles.outlineButton} onPress={adicionarMedicao}><Ionicons name="add" size={18} color={colors.primary} /><Text style={styles.outlineButtonText}>Adicionar outra medição</Text></TouchableOpacity>
          <View style={styles.totalArea}><Text style={styles.totalAreaLabel}>{tipoCalculo === "M2" ? "Área total" : "Total linear"}</Text><Text style={styles.totalAreaValue}>{formatDecimal(metragemCalculada)} {tipoCalculo === "M2" ? "m²" : "m"}</Text></View>
          <NavigationRow back={() => setStep(1)} next={() => setStep(3)} nextLabel="Definir custos" />
        </View>
      )}

      {step === 3 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Material e Custos</Text>
          <Text style={styles.sectionLabel}>MATERIAL</Text>
          {materials.length === 0 ? (
            <TouchableOpacity style={styles.emptyBox} onPress={() => navigation.navigate("tabelaprecos")}><Ionicons name="layers-outline" size={28} color={colors.onSurfaceVariant} /><Text style={styles.emptyTitle}>Cadastre um material primeiro</Text></TouchableOpacity>
          ) : materials.map((material: any) => (
            <TouchableOpacity key={material.id} style={[styles.materialCard, selectedMaterial?.id === material.id && styles.materialSelected]} onPress={() => setSelectedMaterial(material)}>
              <View style={styles.flex1}><Text style={styles.materialName}>{material.nome}</Text><Text style={styles.materialType}>{material.tipo}</Text></View>
              <Text style={styles.materialPrice}>{formatCurrency(tipoCalculo === "M2" ? material.preco_por_m2 : material.preco_por_metro_linear || 0)}/{tipoCalculo === "M2" ? "m²" : "m"}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>Material ({formatDecimal(metragemCalculada)} {tipoCalculo === "M2" ? "m²" : "m"})</Text><Text style={styles.breakdownValue}>{formatCurrency(subtotalMaterial)}</Text></View>

          <Text style={styles.sectionLabel}>MÃO DE OBRA E ACABAMENTOS</Text>
          {custos.map((item) => (
            <View key={item.id} style={styles.costRow}>
              <View style={styles.costTypeIcon}><Ionicons name={item.tipo === "MAO_DE_OBRA" ? "construct-outline" : "color-wand-outline"} size={18} color={colors.primary} /></View>
              <View style={styles.flex1}><TextInput style={styles.compactInput} value={item.descricao} onChangeText={(descricao) => updateCusto(item.id, { descricao })} placeholder="Descrição" placeholderTextColor={colors.onSurfaceVariant} /><TextInput style={styles.compactInput} value={item.valor} onChangeText={(value) => updateCusto(item.id, { valor: maskCurrency(value) })} placeholder="R$ 0,00" placeholderTextColor={colors.onSurfaceVariant} keyboardType="number-pad" /></View>
              <TouchableOpacity onPress={() => setCustos((current) => current.filter((cost) => cost.id !== item.id))}><Ionicons name="close-circle-outline" size={21} color={colors.error} /></TouchableOpacity>
            </View>
          ))}
          <View style={styles.addCostRow}>
            <TouchableOpacity style={styles.smallOutlineButton} onPress={() => adicionarCusto("MAO_DE_OBRA")}><Text style={styles.smallOutlineText}>+ Mão de obra</Text></TouchableOpacity>
            <TouchableOpacity style={styles.smallOutlineButton} onPress={() => adicionarCusto("ACABAMENTO")}><Text style={styles.smallOutlineText}>+ Acabamento</Text></TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>PRODUTOS</Text>
          {produtos.length === 0 ? (
            <TouchableOpacity style={styles.emptyBox} onPress={() => navigation.navigate("tabelaprecos")}><Ionicons name="cube-outline" size={28} color={colors.onSurfaceVariant} /><Text style={styles.emptyTitle}>Cadastre seus produtos e estoque na Tabela de Preços</Text></TouchableOpacity>
          ) : produtos.map((produto) => {
            const selected = produtosSelecionados.some((item) => item.produto_id === produto.id);
            return <TouchableOpacity key={produto.id} style={[styles.productCatalogCard, selected && styles.productCatalogSelected, produto.quantidade === 0 && styles.outOfStock]} onPress={() => adicionarProduto(produto)} disabled={selected}><View style={styles.flex1}><Text style={styles.materialName}>{produto.nome}</Text><Text style={styles.materialType} numberOfLines={2}>{produto.descricao} · Estoque: {produto.quantidade}</Text></View><Text style={styles.materialPrice}>{selected ? "Adicionado" : produto.quantidade === 0 ? "Sem estoque" : formatCurrency(produto.preco)}</Text></TouchableOpacity>;
          })}
          {produtosSelecionados.map((produto) => {
            const estoque = produtos.find((item) => item.id === produto.produto_id)?.quantidade || 0;
            return <View key={produto.produto_id} style={[styles.selectedProductRow, compact && styles.selectedProductRowCompact]}><View style={styles.flex1}><Text style={styles.selectedProductName}>{produto.nome}</Text><Text style={styles.materialType}>{formatCurrency(produto.preco_unitario)} cada · {formatCurrency(produto.subtotal)} · disponível: {estoque}</Text></View><TouchableOpacity style={styles.quantityButton} onPress={() => alterarQuantidadeProduto(produto.produto_id, -1)}><Ionicons name="remove" size={17} color={colors.primary} /></TouchableOpacity><Text style={styles.quantityText}>{produto.quantidade}</Text><TouchableOpacity style={styles.quantityButton} onPress={() => alterarQuantidadeProduto(produto.produto_id, 1)} disabled={produto.quantidade >= estoque}><Ionicons name="add" size={17} color={produto.quantidade >= estoque ? colors.outline : colors.primary} /></TouchableOpacity></View>;
          })}
          <View style={styles.totalArea}><Text style={styles.totalAreaLabel}>Preço sugerido</Text><Text style={styles.totalAreaValue}>{formatCurrency(precoSugerido)}</Text></View>
          <FieldLabel text="Preço final ajustado" />
          <TextInput style={styles.currencyInput} value={precoFinal} onChangeText={(value) => { setPrecoAjustado(true); setPrecoFinal(maskCurrency(value)); }} keyboardType="number-pad" />
          <NavigationRow back={() => setStep(2)} next={() => setStep(4)} nextLabel="Revisar" />
        </View>
      )}

      {step === 4 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo da Proposta</Text>
          <Summary label="Cliente" value={cliente || "Não informado"} />
          <Summary label="Projeto" value={projeto || "Não informado"} />
          <Summary label="Cálculo" value={tipoCalculo === "M2" ? "Metro quadrado" : "Metro linear"} />
          <Summary label="Medições" value={`${medicoes.length} peça(s) · ${formatDecimal(metragemCalculada)} ${tipoCalculo === "M2" ? "m²" : "m"}`} />
          <Summary label="Material" value={selectedMaterial?.nome || "Não selecionado"} />
          <Summary label="Material" value={formatCurrency(subtotalMaterial)} />
          <Summary label="Mão de obra e acabamentos" value={formatCurrency(totalAdicionais)} />
          <Summary label={`Produtos (${produtosSelecionados.reduce((sum, item) => sum + item.quantidade, 0)})`} value={formatCurrency(totalProdutos)} />
          <View style={styles.finalTotal}><Text style={styles.finalTotalLabel}>VALOR TOTAL</Text><Text style={styles.finalTotalValue}>{precoFinal || formatCurrency(precoSugerido)}</Text></View>
          <FieldLabel text="Observações" />
          <TextInput style={[styles.input, styles.textArea]} value={observacoes} onChangeText={setObservacoes} multiline placeholder="Recortes, prazos e detalhes da instalação" placeholderTextColor={colors.onSurfaceVariant} />
          <NavigationRow back={() => setStep(3)} next={handleGerar} nextLabel={saving ? "Salvando..." : "Gerar orçamento"} disabled={saving} />
        </View>
      )}
    </ScrollView>
  );
}

function FieldLabel({ text }: { text: string }) { return <Text style={styles.label}>{text}</Text>; }
function CalculationType({ active, title, subtitle, unit, onPress }: { active: boolean; title: string; subtitle: string; unit: string; onPress: () => void }) { return <TouchableOpacity style={[styles.calculationType, active && styles.calculationTypeActive]} onPress={onPress}><View style={[styles.unitBadge, active && styles.unitBadgeActive]}><Text style={[styles.unitText, active && styles.unitTextActive]}>{unit}</Text></View><Text style={[styles.calculationTitle, active && styles.calculationTitleActive]}>{title}</Text><Text style={styles.calculationSub}>{subtitle}</Text></TouchableOpacity>; }
function PrimaryNext({ label, onPress }: { label: string; onPress: () => void }) { return <TouchableOpacity style={styles.primaryButton} onPress={onPress}><Text style={styles.primaryButtonText}>{label}</Text><Ionicons name="arrow-forward" size={17} color={colors.onPrimary} /></TouchableOpacity>; }
function NavigationRow({ back, next, nextLabel, disabled = false }: { back: () => void; next: () => void; nextLabel: string; disabled?: boolean }) { return <View style={styles.navRow}><TouchableOpacity style={styles.backButton} onPress={back}><Text style={styles.backButtonText}>Voltar</Text></TouchableOpacity><TouchableOpacity style={[styles.primaryButton, styles.flex1, disabled && styles.disabled]} onPress={next} disabled={disabled}><Text style={styles.primaryButtonText}>{nextLabel}</Text><Ionicons name="arrow-forward" size={17} color={colors.onPrimary} /></TouchableOpacity></View>; }
function Summary({ label, value }: { label: string; value: string }) { return <View style={styles.summaryRow}><Text style={styles.summaryLabel}>{label}</Text><Text style={styles.summaryValue}>{value}</Text></View>; }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { width: "100%", maxWidth: 720, alignSelf: "center", padding: 20, paddingBottom: 120 }, contentCompact: { paddingHorizontal: 12 },
  stepperContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, backgroundColor: colors.surfaceContainerLowest, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: colors.outlineVariant },
  stepItem: { alignItems: "center", flex: 1 },
  stepBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.surfaceContainerHigh, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  stepBadgeActive: { backgroundColor: colors.primary }, stepBadgeDone: { backgroundColor: colors.secondary },
  stepNum: { fontSize: 13, fontWeight: "700", color: colors.onSurfaceVariant }, stepNumActive: { color: colors.onPrimary },
  stepLabel: { fontSize: 11, color: colors.onSurfaceVariant, fontWeight: "500" }, stepLabelActive: { color: colors.primary, fontWeight: "700" },
  card: { backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 16, padding: 16 },
  cardTitle: { fontSize: 20, fontWeight: "800", color: colors.primary, marginBottom: 4 }, cardSub: { fontSize: 14, color: colors.onSurfaceVariant, marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "700", color: colors.primary, marginTop: 12, marginBottom: 6 },
  input: { minHeight: 48, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 10, paddingHorizontal: 14, fontSize: 15, color: colors.onSurface },
  numberInput: { height: 50, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 10, paddingHorizontal: 10, fontSize: 17, fontWeight: "700", color: colors.primary },
  currencyInput: { height: 54, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.secondary, borderRadius: 12, paddingHorizontal: 14, fontSize: 21, fontWeight: "800", color: colors.secondary },
  textArea: { height: 82, paddingTop: 12, textAlignVertical: "top" },
  calculationTypeRow: { flexDirection: "row", gap: 8, marginBottom: 4 }, calculationType: { flex: 1, minHeight: 112, borderWidth: 1, borderColor: colors.outlineVariant, backgroundColor: colors.surface, borderRadius: 13, padding: 11 }, calculationTypeActive: { borderWidth: 2, borderColor: colors.secondary, backgroundColor: colors.surfaceContainerLow }, unitBadge: { width: 36, height: 30, borderRadius: 9, backgroundColor: colors.surfaceContainerHigh, alignItems: "center", justifyContent: "center", marginBottom: 8 }, unitBadgeActive: { backgroundColor: colors.secondaryFixed }, unitText: { fontSize: 12, fontWeight: "800", color: colors.primary }, unitTextActive: { color: colors.onSecondaryFixed }, calculationTitle: { fontSize: 13, fontWeight: "800", color: colors.primary }, calculationTitleActive: { color: colors.secondary }, calculationSub: { fontSize: 10, color: colors.onSurfaceVariant, marginTop: 3 },
  rowInputs: { flexDirection: "row", gap: 8 }, rowInputsCompact: { flexWrap: "wrap" }, flex1: { flex: 1, minWidth: 105 }, quantityBox: { width: 58 },
  primaryButton: { minHeight: 50, backgroundColor: colors.primary, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingHorizontal: 16, marginTop: 20 },
  primaryButtonText: { color: colors.onPrimary, fontSize: 14, fontWeight: "800" }, disabled: { opacity: 0.55 },
  backButton: { minHeight: 50, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, alignItems: "center", justifyContent: "center", paddingHorizontal: 18, marginTop: 20 }, backButtonText: { color: colors.onSurfaceVariant, fontWeight: "700" },
  navRow: { flexDirection: "row", gap: 10 },
  itemCard: { backgroundColor: colors.surfaceContainerLow, borderRadius: 14, padding: 14, marginTop: 12 }, itemHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }, itemTitle: { fontSize: 15, fontWeight: "800", color: colors.primary },
  calculatedText: { color: colors.secondary, fontSize: 14, fontWeight: "800", marginTop: 10 },
  outlineButton: { minHeight: 48, borderWidth: 1, borderColor: colors.primary, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 12 }, outlineButtonText: { color: colors.primary, fontWeight: "700" },
  totalArea: { backgroundColor: colors.surfaceContainerHigh, borderRadius: 12, padding: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 }, totalAreaLabel: { color: colors.onSurfaceVariant, fontWeight: "700" }, totalAreaValue: { color: colors.primary, fontSize: 20, fontWeight: "800" },
  sectionLabel: { fontSize: 11, fontWeight: "800", color: colors.onSurfaceVariant, marginTop: 18, marginBottom: 8, letterSpacing: 0.5 },
  materialCard: { flexDirection: "row", alignItems: "center", padding: 12, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, marginBottom: 8 }, materialSelected: { borderWidth: 2, borderColor: colors.secondary, backgroundColor: colors.surfaceContainerLow }, materialName: { color: colors.primary, fontSize: 14, fontWeight: "800" }, materialType: { color: colors.onSurfaceVariant, fontSize: 12, marginTop: 2 }, materialPrice: { color: colors.secondary, fontSize: 13, fontWeight: "800" },
  emptyBox: { alignItems: "center", backgroundColor: colors.surfaceContainerLow, padding: 20, borderRadius: 12 }, emptyTitle: { color: colors.primary, fontWeight: "700", marginTop: 7 },
  breakdownRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12 }, breakdownLabel: { color: colors.onSurfaceVariant }, breakdownValue: { color: colors.primary, fontWeight: "800" },
  costRow: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.surfaceContainerLow, borderRadius: 12, padding: 10, marginBottom: 8 }, costTypeIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: colors.surfaceContainerHighest, alignItems: "center", justifyContent: "center" }, compactInput: { minHeight: 38, color: colors.primary, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant, paddingHorizontal: 4 },
  addCostRow: { flexDirection: "row", gap: 8 }, smallOutlineButton: { flex: 1, minHeight: 42, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 10, alignItems: "center", justifyContent: "center" }, smallOutlineText: { color: colors.primary, fontWeight: "700", fontSize: 12 },
  productCatalogCard: { minHeight: 58, flexDirection: "row", alignItems: "center", padding: 11, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, marginBottom: 7 },
  productCatalogSelected: { backgroundColor: colors.surfaceContainerLow, borderColor: colors.secondary },
  outOfStock: { opacity: 0.58 },
  selectedProductRow: { minHeight: 64, flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: colors.surfaceContainerLow, borderRadius: 12, padding: 10, marginBottom: 7 },
  selectedProductRowCompact: { flexWrap: "wrap" },
  selectedProductName: { fontSize: 13, fontWeight: "800", color: colors.primary },
  quantityButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surfaceContainerHighest, alignItems: "center", justifyContent: "center" },
  quantityText: { minWidth: 18, textAlign: "center", fontSize: 14, fontWeight: "800", color: colors.primary },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", gap: 16, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant }, summaryLabel: { color: colors.onSurfaceVariant, fontSize: 13 }, summaryValue: { color: colors.primary, fontSize: 13, fontWeight: "700", textAlign: "right", flex: 1 },
  finalTotal: { backgroundColor: colors.primary, borderRadius: 14, padding: 18, marginTop: 16, alignItems: "center" }, finalTotalLabel: { color: colors.onPrimaryContainer, fontSize: 11, fontWeight: "700" }, finalTotalValue: { color: colors.secondaryFixed, fontSize: 27, fontWeight: "800", marginTop: 4 },
});
