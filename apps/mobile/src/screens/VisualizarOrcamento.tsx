import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import Badge from "../components/ui/Badge";
import { useOrcamentoStore } from "../stores/orcamentoStore";
import { usePedidoStore } from "../stores/pedidoStore";
import { useAuthStore } from "../stores/authStore";
import {
  formatCurrency,
  generateOrcamentoPdf,
  shareOrcamentoPdf,
} from "../services/pdfService";
import { getOrcamentoMedicoes } from "../services/orcamentoService";
import { formatDecimal, maskDate } from "../utils/formatters";

export default function VisualizarOrcamentoScreen({ route, navigation }: any) {
  const { width } = useWindowDimensions();
  const compact = width < 390;
  const orcamento = route?.params?.orcamento;
  const [sharing, setSharing] = useState(false);
  const [convertModalVisible, setConvertModalVisible] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [converting, setConverting] = useState(false);
  const [convertedPedido, setConvertedPedido] = useState<any>(null);

  const updateStatus = useOrcamentoStore((state) => state.updateStatus);
  const addPedido = usePedidoStore((state) => state.addPedido);
  const pedidos = usePedidoStore((state) => state.pedidos);
  const fetchPedidos = usePedidoStore((state) => state.fetchPedidos);
  const user = useAuthStore((state) => state.user);

  const cliente = orcamento?.cliente_nome || "";
  const projeto = orcamento?.projeto || "";
  const dataProposta = orcamento?.created_at
    ? new Date(orcamento.created_at).toLocaleDateString("pt-BR")
    : "";
  const materialNome = orcamento?.material_nome || "";
  const medicoes = orcamento ? getOrcamentoMedicoes(orcamento) : [];
  const comprimento = Number(medicoes[0]?.comprimento || 0);
  const largura = Number(medicoes[0]?.largura || 0);
  const area = Number(orcamento?.area || 0);
  const tipoCalculo: "M2" | "ML" = orcamento?.tipo_calculo === "ML" ? "ML" : "M2";
  const metragemCalculada = Number(orcamento?.metragem_calculada ?? area);
  const custosAdicionais = orcamento?.custos_adicionais || [];
  const subtotalMaterial = Number(orcamento?.subtotal_material ?? metragemCalculada * Number(orcamento?.material_preco || 0));
  const totalAdicionais = Number(orcamento?.total_adicionais ?? custosAdicionais.reduce((sum: number, item: any) => sum + Number(item.valor || 0), 0));
  const produtos = orcamento?.produtos || [];
  const totalProdutos = Number(orcamento?.total_produtos ?? produtos.reduce((sum: number, item: any) => sum + Number(item.subtotal || 0), 0));
  const precoFinalNum = Number(orcamento?.preco_final || 0);
  const precoFinalStr = formatCurrency(precoFinalNum);
  const isComplete = Boolean(
    orcamento?.id &&
    cliente &&
    projeto &&
    materialNome &&
    medicoes.length > 0 &&
    medicoes.every((item: any) => item.comprimento > 0 && (tipoCalculo === "ML" || item.largura > 0)) &&
    metragemCalculada > 0 &&
    precoFinalNum > 0
  );
  const existingPedido = convertedPedido || pedidos.find((pedido) => pedido.orcamento_id === orcamento?.id);
  const isApproved = orcamento?.status === "APROVADO" || Boolean(existingPedido);

  useEffect(() => { fetchPedidos(); }, [fetchPedidos]);

  const handleShareWhatsApp = async () => {
    if (!isComplete || !orcamento) {
      Alert.alert("Orçamento incompleto", "Revise os dados antes de gerar o PDF.");
      return;
    }

    const nomeMarmoaria = user?.nome_marmoaria?.trim();
    if (!nomeMarmoaria) {
      Alert.alert(
        "Configure sua marmoaria",
        "Informe o nome da empresa para ele aparecer no PDF.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Configurar", onPress: () => navigation.navigate("perfilusuario") },
        ]
      );
      return;
    }

    setSharing(true);
    try {
      const uri = await generateOrcamentoPdf(
        {
          id: orcamento.id,
          cliente,
          projeto,
          comprimento,
          largura,
          area,
          tipoCalculo,
          metragemCalculada,
          medicoes,
          material: materialNome,
          subtotalMaterial,
          custosAdicionais,
          produtos,
          precoFinal: precoFinalNum,
          observacoes: orcamento.observacoes,
          data: dataProposta,
          validadeDias: 7,
        },
        nomeMarmoaria
      );
      await shareOrcamentoPdf(uri, orcamento.id);
    } catch (error) {
      const unavailable = error instanceof Error && error.message === "SHARING_UNAVAILABLE";
      Alert.alert(
        unavailable ? "Compartilhamento indisponível" : "Não foi possível gerar o PDF",
        unavailable
          ? "Este aparelho não oferece compartilhamento de arquivos."
          : "Tente novamente. Se o problema continuar, reinicie o app."
      );
    } finally {
      setSharing(false);
    }
  };

  const handleConvertPedido = () => {
    if (isApproved) {
      Alert.alert("Pedido já criado", "Este orçamento já foi convertido e não pode gerar outro pedido.");
      return;
    }
    if (!isComplete || !orcamento) {
      Alert.alert("Orçamento incompleto", "Revise os dados antes de converter em pedido.");
      return;
    }

    const match = deliveryDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) {
      Alert.alert("Data inválida", "Informe a data no formato DD/MM/AAAA.");
      return;
    }
    const parsedDate = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]), 12);
    if (
      parsedDate.getFullYear() !== Number(match[3]) ||
      parsedDate.getMonth() !== Number(match[2]) - 1 ||
      parsedDate.getDate() !== Number(match[1])
    ) {
      Alert.alert("Data inválida", "Informe uma data de entrega válida.");
      return;
    }

    const newPedido = {
      orcamento_id: orcamento.id || `ORC-${Date.now()}`,
      cliente_nome: cliente,
      projeto: projeto,
      material_nome: materialNome,
      acabamento: custosAdicionais.filter((item: any) => item.tipo === "ACABAMENTO").map((item: any) => item.descricao).join(", ") || "Não informado",
      tipo_calculo: tipoCalculo,
      metragem_calculada: metragemCalculada,
      medicoes,
      custos_adicionais: custosAdicionais,
      subtotal_material: subtotalMaterial,
      total_adicionais: totalAdicionais,
      produtos,
      total_produtos: totalProdutos,
      data_prometida_entrega: deliveryDate,
      valor: precoFinalNum,
      pendente: precoFinalNum * 0.5,
      status: "PENDENTE" as const,
      etapa: "Produção",
      observacoes: orcamento.observacoes,
    };

    setConverting(true);
    addPedido(newPedido).then(async (savedPedido) => {
      if (orcamento.id) {
        await updateStatus(orcamento.id, "APROVADO");
      }

      setConvertedPedido(savedPedido);
      setConvertModalVisible(false);
      Alert.alert(
        "Orçamento Aprovado",
        "Orçamento convertido em Pedido! Agendando lembrete de entrega.",
        [
          {
            text: "Ver Pedido",
            onPress: () =>
              navigation.navigate("detalhespedido", {
                pedido: savedPedido,
              }),
          },
        ]
      );
    }).catch((err) => {
      console.error(err);
      Alert.alert("Erro", "Não foi possível converter o orçamento em pedido.");
    }).finally(() => {
      setConverting(false);
    });
  };

  if (!orcamento) {
    return (
      <View style={styles.missingContainer}>
        <Ionicons name="alert-circle-outline" size={42} color={colors.error} />
        <Text style={styles.missingTitle}>Orçamento não encontrado</Text>
        <Text style={styles.missingText}>Volte à lista e selecione um orçamento válido.</Text>
        <TouchableOpacity style={styles.missingButton} onPress={() => navigation.goBack()}>
          <Text style={styles.missingButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, compact && styles.contentCompact]}>
      <View style={styles.card}>
        <View style={[styles.rowBetween, compact && styles.wrapRow]}>
          <Text style={styles.title}>Orçamento Formal</Text>
          <Badge label="Válido por 7 dias" variant="info" />
        </View>

        <Text style={styles.cliente}>{cliente}</Text>
        <Text style={styles.projeto}>{projeto}</Text>
        <Text style={styles.data}>Data da Proposta: {dataProposta}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Detalhamento das Peças</Text>
        {medicoes.map((medicao: any, index: number) => (
          <View key={medicao.id || index} style={styles.measurementCard}>
            <Text style={styles.measurementTitle}>{medicao.descricao || `Peça ${index + 1}`}</Text>
            <Text style={styles.measurementText}>{tipoCalculo === "M2" ? `${formatDecimal(medicao.comprimento)} m × ${formatDecimal(medicao.largura)} m` : `${formatDecimal(medicao.comprimento)} m lineares`} · Qtd. {medicao.quantidade || 1}</Text>
            <Text style={styles.measurementArea}>{formatDecimal(tipoCalculo === "M2" ? medicao.area : medicao.metros_lineares || medicao.comprimento * (medicao.quantidade || 1))} {tipoCalculo === "M2" ? "m²" : "m"}</Text>
          </View>
        ))}
        <View style={styles.detailRow}>
          <Text style={styles.detailKey}>{tipoCalculo === "M2" ? "Área Total:" : "Total Linear:"}</Text>
          <Text style={styles.detailVal}>{formatDecimal(metragemCalculada)} {tipoCalculo === "M2" ? "m²" : "m"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailKey}>Material Escolhido:</Text>
          <Text style={styles.detailVal}>
            {materialNome}
          </Text>
        </View>
        <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.detailKey}>Observações:</Text>
          <Text style={styles.detailVal}>{orcamento.observacoes || "Nenhuma"}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Composição do Valor</Text>
        <View style={styles.detailRow}><Text style={styles.detailKey}>Material</Text><Text style={styles.detailVal}>{formatCurrency(subtotalMaterial)}</Text></View>
        {custosAdicionais.map((item: any) => <View key={item.id} style={styles.detailRow}><Text style={styles.detailKey}>{item.descricao}</Text><Text style={styles.detailVal}>{formatCurrency(item.valor)}</Text></View>)}
        {produtos.map((item: any) => <View key={item.produto_id} style={styles.detailRow}><Text style={styles.detailKey}>{item.nome} · {item.quantidade} un.</Text><Text style={styles.detailVal}>{formatCurrency(item.subtotal)}</Text></View>)}
        <View style={[styles.detailRow, { borderBottomWidth: 0 }]}><Text style={styles.detailKey}>Adicionais</Text><Text style={styles.detailVal}>{formatCurrency(totalAdicionais)}</Text></View>
      </View>

      <View style={styles.priceBox}>
        <Text style={styles.priceLabel}>VALOR TOTAL FINAL:</Text>
        <Text style={styles.priceVal}>
          {precoFinalStr}
        </Text>
      </View>

      {!isComplete && (
        <View style={styles.warningBox}>
          <Ionicons name="warning-outline" size={18} color={colors.onTertiaryFixed} />
          <Text style={styles.warningText}>Este orçamento está incompleto. Volte e revise os campos obrigatórios.</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.whatsappBtn, (!isComplete || sharing) && styles.disabledButton]}
        onPress={handleShareWhatsApp}
        disabled={!isComplete || sharing}
      >
        {sharing ? (
          <ActivityIndicator color={colors.onSecondary} style={{ marginRight: 8 }} />
        ) : (
          <Ionicons name="logo-whatsapp" size={20} color={colors.onSecondary} style={{ marginRight: 8 }} />
        )}
        <Text style={styles.whatsappBtnText}>{sharing ? "Gerando PDF..." : "Enviar PDF pelo WhatsApp"}</Text>
      </TouchableOpacity>

      {isApproved ? (
        <TouchableOpacity style={styles.approvedBox} onPress={() => existingPedido && navigation.navigate("detalhespedido", { pedido: existingPedido })} disabled={!existingPedido}>
          <Ionicons name="checkmark-circle" size={20} color={colors.onSecondaryContainer} />
          <Text style={styles.approvedText}>{existingPedido ? "Pedido criado · Ver detalhes" : "Orçamento já convertido em pedido"}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.convertBtn, !isComplete && styles.disabledButton]} onPress={() => setConvertModalVisible(true)} disabled={!isComplete}>
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.onPrimaryContainer} style={{ marginRight: 6 }} />
          <Text style={styles.convertBtnText}>Cliente aprovou? Converter em pedido</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={convertModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConvertModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Converter em pedido</Text>
            <Text style={styles.modalText}>Informe a data prometida de entrega.</Text>
            <TextInput
              style={styles.modalInput}
              value={deliveryDate}
              onChangeText={(value) => setDeliveryDate(maskDate(value))}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={colors.onSurfaceVariant}
              keyboardType="number-pad"
              maxLength={10}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setConvertModalVisible(false)} disabled={converting}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleConvertPedido} disabled={converting}>
                {converting && <ActivityIndicator color={colors.onSecondaryFixed} style={{ marginRight: 6 }} />}
                <Text style={styles.modalConfirmText}>{converting ? "Criando..." : "Criar Pedido"}</Text>
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
  content: { width: "100%", maxWidth: 720, alignSelf: "center", padding: 20, paddingBottom: 110 }, contentCompact: { paddingHorizontal: 12 }, wrapRow: { flexWrap: "wrap", gap: 8 },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 14, fontWeight: "700", color: colors.onSurfaceVariant },
  cliente: { fontSize: 22, fontWeight: "800", color: colors.primary, marginTop: 8 },
  projeto: { fontSize: 14, color: colors.onSurfaceVariant, marginTop: 2 },
  data: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 6 },

  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.primary, marginBottom: 12 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    gap: 12,
  },
  detailKey: { flex: 1, minWidth: 0, fontSize: 14, color: colors.onSurfaceVariant },
  detailVal: { flexShrink: 1, maxWidth: "55%", textAlign: "right", fontSize: 14, fontWeight: "600", color: colors.primary },
  measurementCard: { backgroundColor: colors.surfaceContainerLow, borderRadius: 12, padding: 12, marginBottom: 8 },
  measurementTitle: { fontSize: 14, fontWeight: "800", color: colors.primary },
  measurementText: { fontSize: 13, color: colors.onSurfaceVariant, marginTop: 3 },
  measurementArea: { fontSize: 14, fontWeight: "800", color: colors.secondary, marginTop: 5 },

  priceBox: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  priceLabel: { fontSize: 12, fontWeight: "700", color: colors.onPrimaryContainer, letterSpacing: 0.5 },
  priceVal: { fontSize: 32, fontWeight: "800", color: colors.secondaryFixed, marginTop: 4 },

  whatsappBtn: {
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  whatsappBtnText: { fontSize: 16, fontWeight: "800", color: colors.onSecondary },

  convertBtn: {
    backgroundColor: colors.primaryContainer,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  convertBtnText: { fontSize: 14, fontWeight: "700", color: colors.onPrimaryContainer },
  approvedBox: { minHeight: 50, backgroundColor: colors.secondaryContainer, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 14 },
  approvedText: { fontSize: 14, fontWeight: "800", color: colors.onSecondaryContainer },
  disabledButton: { opacity: 0.45 },
  warningBox: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.tertiaryFixed,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  warningText: { flex: 1, fontSize: 13, color: colors.onTertiaryFixed },
  missingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    backgroundColor: colors.background,
  },
  missingTitle: { fontSize: 20, fontWeight: "800", color: colors.primary, marginTop: 12 },
  missingText: { fontSize: 14, color: colors.onSurfaceVariant, textAlign: "center", marginTop: 6 },
  missingButton: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 20 },
  missingButtonText: { color: colors.onPrimary, fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(9, 20, 38, 0.55)", justifyContent: "center", padding: 24 },
  modalCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: 18, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: "800", color: colors.primary },
  modalText: { fontSize: 14, color: colors.onSurfaceVariant, marginTop: 6, marginBottom: 14 },
  modalInput: { height: 50, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, paddingHorizontal: 14, fontSize: 17, color: colors.primary },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 18 },
  modalCancel: { paddingHorizontal: 18, height: 48, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  modalCancelText: { color: colors.onSurfaceVariant, fontWeight: "700" },
  modalConfirm: { flex: 1, height: 48, backgroundColor: colors.secondaryFixed, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  modalConfirmText: { color: colors.onSecondaryFixed, fontWeight: "800" },
});
