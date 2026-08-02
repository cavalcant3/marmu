import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { usePedidoStore } from "../stores/pedidoStore";
import { formatCurrency } from "../services/pdfService";
import { formatDecimal } from "../utils/formatters";

export default function DetalhesPedidoScreen({ route, navigation }: any) {
  const { width } = useWindowDimensions();
  const compact = width < 390;
  const pedido = route?.params?.pedido;
  const markAsEntregue = usePedidoStore((state) => state.markAsEntregue);
  const [saving, setSaving] = useState(false);
  const [entregue, setEntregue] = useState(
    pedido?.status === "ENTREGUE"
  );

  if (!pedido) {
    return (
      <View style={styles.missingContainer}>
        <Ionicons name="alert-circle-outline" size={42} color={colors.error} />
        <Text style={styles.missingTitle}>Pedido não encontrado</Text>
        <Text style={styles.missingText}>Volte à lista e selecione um pedido válido.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cliente = pedido.cliente_nome || "Cliente não informado";
  const projeto = pedido.projeto || "Projeto não informado";
  const material = pedido.material_nome || "Material não informado";
  const acabamento = pedido.acabamento || pedido.etapa || "Não informado";
  const dataEntrega = pedido.data_prometida_entrega || "Não informada";
  const valor = formatCurrency(Number(pedido.valor || 0));
  const pendente = formatCurrency(Number(pedido.pendente || 0));
  const notas = pedido.observacoes?.trim() || "Nenhuma observação cadastrada.";
  const medicoes = Array.isArray(pedido.medicoes) && pedido.medicoes.length > 0
    ? pedido.medicoes
    : [];
  const custosAdicionais = Array.isArray(pedido.custos_adicionais) ? pedido.custos_adicionais : [];
  const produtos = Array.isArray(pedido.produtos) ? pedido.produtos : [];
  const tipoCalculo = pedido.tipo_calculo === "ML" ? "ML" : "M2";

  const handleMarcarEntregue = () => {
    Alert.alert(
      "Marcar como entregue",
      "Confirma que este pedido foi entregue ao cliente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            setSaving(true);
            try {
              await markAsEntregue(pedido.id);
              setEntregue(true);
              Alert.alert("Pedido entregue", "O status foi atualizado com sucesso.");
            } catch (error) {
              console.error(error);
              const message = error instanceof Error ? error.message : "";
              if (message.startsWith("ESTOQUE_INSUFICIENTE:")) {
                const [, nome, disponivel] = message.split(":");
                Alert.alert("Estoque insuficiente", `${nome} possui apenas ${disponivel} unidade(s). Ajuste o estoque antes de concluir a entrega.`);
              } else if (message.startsWith("PRODUTO_NAO_ENCONTRADO:")) {
                Alert.alert("Produto não encontrado", "Um produto deste pedido foi excluído do catálogo. Cadastre-o novamente antes de concluir.");
              } else Alert.alert("Erro", "Não foi possível atualizar o pedido.");
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, compact && styles.contentCompact]}>
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Pedido</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={[styles.titleRow, compact && styles.titleRowCompact]}>
        <View style={styles.titleText}>
          <Text style={styles.projectTitle}>{projeto}</Text>
          <Text style={styles.clientSub}>Cliente: {cliente}</Text>
          <Text style={styles.pedidoId}>#{pedido.id}</Text>
        </View>
        <View style={entregue ? styles.pillEntregue : styles.pillProducao}>
          <Text style={entregue ? styles.pillEntregueText : styles.pillProducaoText}>
            {entregue ? "ENTREGUE" : "EM PRODUÇÃO"}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <DetailRow icon="layers-outline" label="Material" value={material} />
        <DetailRow icon="construct-outline" label="Etapa / acabamento" value={acabamento} />
        <DetailRow icon="calendar-outline" label="Data de entrega" value={dataEntrega} />
        <DetailRow icon="wallet-outline" label="Valor total" value={valor} />
        <DetailRow icon="cash-outline" label="Valor pendente" value={pendente} last />
      </View>

      {medicoes.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>MEDIÇÕES</Text>
          {medicoes.map((medicao: any, index: number) => (
            <View key={medicao.id || index} style={styles.measurementRow}>
              <View style={styles.flex1}>
                <Text style={styles.measurementName}>{medicao.descricao || `Peça ${index + 1}`}</Text>
                <Text style={styles.measurementDimensions}>{tipoCalculo === "M2" ? `${formatDecimal(medicao.comprimento)} m × ${formatDecimal(medicao.largura)} m` : `${formatDecimal(medicao.comprimento)} m lineares`} · Qtd. {medicao.quantidade || 1}</Text>
              </View>
              <Text style={styles.measurementArea}>{formatDecimal(tipoCalculo === "M2" ? medicao.area : medicao.metros_lineares || medicao.comprimento * (medicao.quantidade || 1))} {tipoCalculo === "M2" ? "m²" : "m"}</Text>
            </View>
          ))}
        </View>
      )}

      {custosAdicionais.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>MÃO DE OBRA E ACABAMENTOS</Text>
          {custosAdicionais.map((item: any) => (
            <View key={item.id} style={styles.costRow}>
              <Text style={styles.costLabel}>{item.descricao}</Text>
              <Text style={styles.costValue}>{formatCurrency(item.valor)}</Text>
            </View>
          ))}
        </View>
      )}

      {produtos.length > 0 && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>PRODUTOS</Text>
          {produtos.map((item: any) => (
            <View key={item.produto_id} style={styles.costRow}>
              <View style={styles.flex1}>
                <Text style={styles.measurementName}>{item.nome}</Text>
                <Text style={styles.measurementDimensions}>{item.descricao ? `${item.descricao} · ` : ""}Qtd. {item.quantidade}</Text>
              </View>
              <Text style={styles.costValue}>{formatCurrency(item.subtotal)}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.notesCard}>
        <Text style={styles.notesTitle}>OBSERVAÇÕES</Text>
        <Text style={styles.notesBody}>{notas}</Text>
      </View>

      {!entregue ? (
        <TouchableOpacity
          style={[styles.deliverButton, saving && styles.disabledButton]}
          onPress={handleMarcarEntregue}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.onPrimary} style={styles.buttonIcon} />
          ) : (
            <Ionicons name="cube-outline" size={20} color={colors.onPrimary} style={styles.buttonIcon} />
          )}
          <Text style={styles.primaryButtonText}>{saving ? "Atualizando..." : "Marcar como Entregue"}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.deliveredBox}>
          <Ionicons name="checkmark-circle" size={22} color={colors.onSecondaryContainer} />
          <Text style={styles.deliveredText}>Pedido entregue</Text>
        </View>
      )}
    </ScrollView>
  );
}

function DetailRow({ icon, label, value, last = false }: { icon: any; label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.detailRow, last && styles.detailRowLast]}>
      <Ionicons name={icon} size={19} color={colors.onSurfaceVariant} />
      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { width: "100%", maxWidth: 720, alignSelf: "center", padding: 20, paddingBottom: 130 }, contentCompact: { paddingHorizontal: 12 },
  topHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceContainerHigh, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: colors.primary },
  headerSpacer: { width: 40 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 16 },
  titleRowCompact: { flexDirection: "column" },
  titleText: { flex: 1 },
  projectTitle: { fontSize: 22, fontWeight: "800", color: colors.primary },
  clientSub: { fontSize: 14, color: colors.onSurfaceVariant, marginTop: 3 },
  pedidoId: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 5 },
  pillProducao: { backgroundColor: colors.tertiaryFixed, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  pillProducaoText: { fontSize: 10, fontWeight: "700", color: colors.onTertiaryFixed },
  pillEntregue: { backgroundColor: colors.secondaryContainer, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  pillEntregueText: { fontSize: 10, fontWeight: "700", color: colors.onSecondaryContainer },
  card: { backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 16, paddingHorizontal: 16, marginBottom: 16 },
  sectionCard: { backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 16, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 11, color: colors.onSurfaceVariant, fontWeight: "800", marginBottom: 8 },
  measurementRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
  flex1: { flex: 1 },
  measurementName: { fontSize: 14, fontWeight: "800", color: colors.primary },
  measurementDimensions: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 3 },
  measurementArea: { flexShrink: 1, textAlign: "right", fontSize: 14, fontWeight: "800", color: colors.secondary },
  costRow: { flexDirection: "row", justifyContent: "space-between", gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
  costLabel: { flex: 1, fontSize: 14, color: colors.primary },
  costValue: { fontSize: 14, fontWeight: "800", color: colors.secondary },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
  detailRowLast: { borderBottomWidth: 0 },
  detailText: { flex: 1 },
  detailLabel: { fontSize: 11, color: colors.onSurfaceVariant, textTransform: "uppercase", fontWeight: "700" },
  detailValue: { fontSize: 15, color: colors.primary, fontWeight: "700", marginTop: 3 },
  notesCard: { backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 16, padding: 16, marginBottom: 18 },
  notesTitle: { fontSize: 11, color: colors.onSurfaceVariant, fontWeight: "700", marginBottom: 8 },
  notesBody: { fontSize: 14, color: colors.primary, lineHeight: 20 },
  deliverButton: { height: 52, backgroundColor: colors.primary, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  buttonIcon: { marginRight: 8 },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 20 },
  primaryButtonText: { color: colors.onPrimary, fontSize: 15, fontWeight: "700" },
  disabledButton: { opacity: 0.55 },
  deliveredBox: { height: 52, backgroundColor: colors.secondaryContainer, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  deliveredText: { color: colors.onSecondaryContainer, fontSize: 15, fontWeight: "800" },
  missingContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28, backgroundColor: colors.background },
  missingTitle: { fontSize: 20, fontWeight: "800", color: colors.primary, marginTop: 12 },
  missingText: { fontSize: 14, color: colors.onSurfaceVariant, textAlign: "center", marginTop: 6 },
});
