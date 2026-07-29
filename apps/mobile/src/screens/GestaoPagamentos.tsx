import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function GestaoPagamentosScreen({ navigation }: any) {
  const [pago, setPago] = useState(3000);
  const total = 5400;
  const pendente = total - pago;
  const porcentagemPago = Math.round((pago / total) * 100);

  const [historico, setHistorico] = useState([
    { id: "1", forma: "Transferência PIX", data: "12 de Out, 2023", valor: "R$ 1.500,00", icon: "cash-outline" },
    { id: "2", forma: "Entrada no Cartão", data: "10 de Out, 2023", valor: "R$ 1.500,00", icon: "card-outline" },
  ]);

  const handleRegistrarPagamento = () => {
    if (pendente <= 0) {
      Alert.alert("Aviso", "Este pedido já está 100% quitado!");
      return;
    }

    Alert.prompt(
      "Registrar Pagamento",
      `Digite o valor recebido em R$ (Pendente: R$ ${pendente.toFixed(2)}):`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar Recebimento",
          onPress: (val) => {
            const num = parseFloat(val || "0");
            if (num > 0) {
              const novoPago = Math.min(total, pago + num);
              setPago(novoPago);
              setHistorico([
                {
                  id: Date.now().toString(),
                  forma: "Recebimento PIX / Dinheiro",
                  data: new Date().toLocaleDateString("pt-BR"),
                  valor: `R$ ${num.toFixed(2)}`,
                  icon: "wallet-outline",
                },
                ...historico,
              ]);
              Alert.alert("Sucesso", "Pagamento registrado no sistema com sucesso!");
            }
          },
        },
      ],
      "plain-text"
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Back */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Status de Pagamento</Text>
        <View style={{ width: 38 }} />
      </View>

      <Text style={styles.subTitle}>Pedido #8829 - Granito Preto Via Láctea</Text>

      {/* Hero Card: Total Value */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>VALOR TOTAL DO PEDIDO</Text>
        <Text style={styles.heroValue}>R$ 5.400,00</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${porcentagemPago}%` }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressTextSuccess}>{porcentagemPago}% Pago</Text>
            <Text style={styles.progressTextPending}>{100 - porcentagemPago}% Pendente</Text>
          </View>
        </View>
      </View>

      {/* Bento Split: Paid vs Pending */}
      <View style={styles.bentoSplit}>
        <View style={styles.bentoPaidCard}>
          <Text style={styles.bentoPaidLabel}>Entrada (Pago)</Text>
          <Text style={styles.bentoPaidVal}>R$ {pago.toFixed(2)}</Text>
        </View>

        <View style={styles.bentoPendingCard}>
          <Text style={styles.bentoPendingLabel}>Saldo (Pendente)</Text>
          <Text style={styles.bentoPendingVal}>R$ {pendente.toFixed(2)}</Text>
        </View>
      </View>

      {/* Action: Register Payment Button */}
      <TouchableOpacity style={styles.registerBtn} onPress={handleRegistrarPagamento}>
        <Ionicons name="add-circle-outline" size={22} color={colors.onSecondary} style={{ marginRight: 8 }} />
        <Text style={styles.registerBtnText}>Registrar Pagamento</Text>
      </TouchableOpacity>

      {/* Payment History */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>HISTÓRICO DE PAGAMENTOS</Text>
      </View>

      <View style={styles.historyList}>
        {historico.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <View style={styles.historyLeft}>
              <View style={styles.historyIconBox}>
                <Ionicons name={item.icon as any} size={22} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.historyTitle}>{item.forma}</Text>
                <Text style={styles.historyDate}>{item.data}</Text>
              </View>
            </View>
            <Text style={styles.historyValue}>{item.valor}</Text>
          </View>
        ))}
      </View>

      {/* Footer Notice Alert */}
      <View style={styles.noticeBox}>
        <Ionicons name="alert-circle" size={22} color={colors.error} style={{ marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.noticeTitle}>Aguardando quitação para entrega</Text>
          <Text style={styles.noticeSub}>
            O agendamento da instalação só será liberado após a confirmação do saldo total.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 110 },

  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 20, fontWeight: "800", color: colors.primary },
  subTitle: { fontSize: 14, color: colors.onSurfaceVariant, marginBottom: 20 },

  heroCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  heroLabel: { fontSize: 11, fontWeight: "700", color: colors.onSurfaceVariant, letterSpacing: 0.5 },
  heroValue: { fontSize: 34, fontWeight: "800", color: colors.primary, marginVertical: 8 },

  progressContainer: { marginTop: 8 },
  progressBarBg: {
    height: 14,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 7,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.secondary,
    borderRadius: 7,
  },
  progressLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  progressTextSuccess: { fontSize: 13, fontWeight: "700", color: colors.secondary },
  progressTextPending: { fontSize: 13, color: colors.onSurfaceVariant },

  bentoSplit: { flexDirection: "row", gap: 12, marginBottom: 20 },
  bentoPaidCard: {
    flex: 1,
    backgroundColor: colors.secondaryContainer,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 116, 50, 0.2)",
  },
  bentoPaidLabel: { fontSize: 12, fontWeight: "700", color: colors.onSecondaryContainer },
  bentoPaidVal: { fontSize: 18, fontWeight: "800", color: colors.onSecondaryFixed, marginTop: 4 },

  bentoPendingCard: {
    flex: 1,
    backgroundColor: colors.tertiaryFixed,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  bentoPendingLabel: { fontSize: 12, fontWeight: "700", color: colors.onTertiaryFixedVariant },
  bentoPendingVal: { fontSize: 18, fontWeight: "800", color: colors.onTertiaryFixed, marginTop: 4 },

  registerBtn: {
    backgroundColor: colors.secondary,
    height: 54,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  registerBtnText: { fontSize: 16, fontWeight: "800", color: colors.onSecondary },

  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontWeight: "700", color: colors.onSurfaceVariant, letterSpacing: 0.5 },

  historyList: { gap: 10, marginBottom: 24 },
  historyItem: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  historyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  historyTitle: { fontSize: 14, fontWeight: "700", color: colors.primary },
  historyDate: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 },
  historyValue: { fontSize: 16, fontWeight: "800", color: colors.primary },

  noticeBox: {
    backgroundColor: colors.errorContainer,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(186, 26, 26, 0.1)",
  },
  noticeTitle: { fontSize: 13, fontWeight: "700", color: colors.onErrorContainer },
  noticeSub: { fontSize: 12, color: colors.onErrorContainer, marginTop: 2, opacity: 0.85 },
});
