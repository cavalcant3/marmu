import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { colors } from "../theme/colors";
import Badge from "../components/ui/Badge";

export default function VisualizarOrcamentoScreen({ route, navigation }: any) {
  const orcamento = route?.params?.orcamento || {
    cliente: "João da Silva",
    projeto: "Bancada Cozinha Principal",
    comprimento: 2.4,
    largura: 0.6,
    area: 1.44,
    material: { nome: "Granito Preto São Gabriel", preco_por_m2: 280 },
    precoFinal: 403.2,
    observacoes: "Sem recortes especiais.",
    data: new Date().toLocaleDateString("pt-BR"),
  };

  const handleShareWhatsApp = () => {
    Alert.alert(
      "Compartilhar Orçamento",
      `Abrindo WhatsApp com a proposta em PDF de R$ ${orcamento.precoFinal} para ${orcamento.cliente}...`
    );
  };

  const handleConvertPedido = () => {
    Alert.alert(
      "Orçamento Aprovado",
      "Orçamento convertido em Pedido! Agendando lembrete de entrega.",
      [
        {
          text: "Ver Pedido",
          onPress: () =>
            navigation.navigate("detalhespedido", {
              pedido: {
                id: "PED-NEW",
                cliente: orcamento.cliente,
                projeto: orcamento.projeto,
                data: "Em 10 dias",
                status: "No Prazo",
                valor: `R$ ${orcamento.precoFinal}`,
              },
            }),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>Orçamento Formal</Text>
          <Badge label="Válido por 7 dias" variant="info" />
        </View>

        <Text style={styles.cliente}>{orcamento.cliente}</Text>
        <Text style={styles.projeto}>{orcamento.projeto || "Projeto de Marmoaria"}</Text>
        <Text style={styles.data}>Data da Proposta: {orcamento.data}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Detalhamento das Peças</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailKey}>Dimensões:</Text>
          <Text style={styles.detailVal}>
            {orcamento.comprimento}m × {orcamento.largura}m
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailKey}>Área Total:</Text>
          <Text style={styles.detailVal}>{orcamento.area?.toFixed(2) || "1.44"} m²</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailKey}>Material Escolhido:</Text>
          <Text style={styles.detailVal}>
            {orcamento.material?.nome || "Granito Preto São Gabriel"}
          </Text>
        </View>
        <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.detailKey}>Observações:</Text>
          <Text style={styles.detailVal}>{orcamento.observacoes || "Nenhuma"}</Text>
        </View>
      </View>

      <View style={styles.priceBox}>
        <Text style={styles.priceLabel}>VALOR TOTAL FINAL:</Text>
        <Text style={styles.priceVal}>
          R$ {typeof orcamento.precoFinal === "number" ? orcamento.precoFinal.toFixed(2) : orcamento.precoFinal}
        </Text>
      </View>

      <TouchableOpacity style={styles.whatsappBtn} onPress={handleShareWhatsApp}>
        <Text style={styles.whatsappBtnText}>📱 Enviar PDF via WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.convertBtn} onPress={handleConvertPedido}>
        <Text style={styles.convertBtnText}>✓ Cliente Aprovou? Converter em Pedido</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 110 },
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
  },
  detailKey: { fontSize: 14, color: colors.onSurfaceVariant },
  detailVal: { fontSize: 14, fontWeight: "600", color: colors.primary },

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
    marginBottom: 10,
  },
  whatsappBtnText: { fontSize: 16, fontWeight: "800", color: colors.onSecondary },

  convertBtn: {
    backgroundColor: colors.primaryContainer,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  convertBtnText: { fontSize: 14, fontWeight: "700", color: colors.onPrimaryContainer },
});
