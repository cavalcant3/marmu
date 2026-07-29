import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import Badge from "../components/ui/Badge";

export default function GestaoPagamentosScreen({ navigation }: any) {
  const [pagamentos, setPagamentos] = useState([
    {
      id: "PED-102",
      cliente: "Ed. Miramar - Apto 402",
      projeto: "Bancada Cozinha com Cuba",
      valorTotal: 1850,
      sinal: 925,
      sinalPago: true,
      saldo: 925,
      saldoPago: false,
    },
    {
      id: "PED-101",
      cliente: "Casa Cond. Lagos",
      projeto: "Soleiras e Peitoris",
      valorTotal: 3200,
      sinal: 1600,
      sinalPago: true,
      saldo: 1600,
      saldoPago: false,
    },
    {
      id: "PED-100",
      cliente: "Sede Administrativa X",
      projeto: "Piso Hall de Entrada",
      valorTotal: 8900,
      sinal: 4450,
      sinalPago: true,
      saldo: 4450,
      saldoPago: true,
    },
  ]);

  const totalRecebido = pagamentos.reduce((acc, p) => {
    let sum = 0;
    if (p.sinalPago) sum += p.sinal;
    if (p.saldoPago) sum += p.saldo;
    return acc + sum;
  }, 0);

  const totalAReceber = pagamentos.reduce((acc, p) => {
    let sum = 0;
    if (!p.sinalPago) sum += p.sinal;
    if (!p.saldoPago) sum += p.saldo;
    return acc + sum;
  }, 0);

  const handleDarBaixaSaldo = (id: string, cliente: string, valor: number) => {
    Alert.alert(
      "Confirmar Recebimento",
      `Registrar recebimento de R$ ${valor.toFixed(2)} do cliente ${cliente}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar PIX/Dinheiro",
          onPress: () => {
            setPagamentos((prev) =>
              prev.map((p) => (p.id === id ? { ...p, saldoPago: true } : p))
            );
            Alert.alert("Sucesso", "Pagamento registrado com sucesso!");
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Gestão de Pagamentos</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Bento Grid Metrics */}
      <View style={styles.bentoGrid}>
        <View style={styles.bentoCard}>
          <Text style={styles.bentoLabel}>TOTAL A RECEBER</Text>
          <Text style={styles.bentoValueWarning}>R$ {totalAReceber.toFixed(2)}</Text>
          <Text style={styles.bentoSub}>Sinal 50% ou Saldo na Entrega</Text>
        </View>

        <View style={styles.bentoCard}>
          <Text style={styles.bentoLabel}>TOTAL RECEBIDO</Text>
          <Text style={styles.bentoValueSuccess}>R$ {totalRecebido.toFixed(2)}</Text>
          <Text style={styles.bentoSub}>Confirmado no Mês</Text>
        </View>
      </View>

      {/* Orders Payments List */}
      <Text style={styles.sectionTitle}>Status de Pagamento por Pedido</Text>
      <View style={styles.list}>
        {pagamentos.map((pag) => {
          const quits = pag.sinalPago && pag.saldoPago;
          return (
            <View key={pag.id} style={styles.pagCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.pagId}>{pag.id}</Text>
                <Badge
                  label={quits ? "Quitado (100%)" : "Pendente (50%)"}
                  variant={quits ? "success" : "warning"}
                />
              </View>

              <Text style={styles.clienteName}>{pag.cliente}</Text>
              <Text style={styles.projetoSub}>{pag.projeto}</Text>
              <Text style={styles.valorTotalText}>Valor Total: R$ {pag.valorTotal.toFixed(2)}</Text>

              {/* Installments Breakdown */}
              <View style={styles.breakdownBox}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.bdLabel}>1ª Parcela (50% Sinal - Aprovação):</Text>
                  <Text style={styles.bdValSuccess}>R$ {pag.sinal.toFixed(2)} (PAGO)</Text>
                </View>

                <View style={[styles.breakdownRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.bdLabel}>2ª Parcela (50% Saldo - Entrega):</Text>
                  <Text style={pag.saldoPago ? styles.bdValSuccess : styles.bdValWarning}>
                    R$ {pag.saldo.toFixed(2)} {pag.saldoPago ? "(PAGO)" : "(PENDENTE)"}
                  </Text>
                </View>
              </View>

              {!pag.saldoPago && (
                <TouchableOpacity
                  style={styles.receiveBtn}
                  onPress={() => handleDarBaixaSaldo(pag.id, pag.cliente, pag.saldo)}
                >
                  <Ionicons name="wallet-outline" size={16} color={colors.onSecondaryFixed} style={{ marginRight: 6 }} />
                  <Text style={styles.receiveBtnText}>Registrar Recebimento do Saldo</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
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

  bentoGrid: { flexDirection: "row", gap: 12, marginBottom: 24 },
  bentoCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 16,
  },
  bentoLabel: { fontSize: 10, fontWeight: "700", color: colors.onSurfaceVariant, letterSpacing: 0.5 },
  bentoValueWarning: { fontSize: 20, fontWeight: "800", color: colors.onTertiaryFixedVariant, marginTop: 4 },
  bentoValueSuccess: { fontSize: 20, fontWeight: "800", color: colors.secondary, marginTop: 4 },
  bentoSub: { fontSize: 11, color: colors.onSurfaceVariant, marginTop: 2 },

  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.primary, marginBottom: 12 },
  list: { gap: 14 },
  pagCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pagId: { fontSize: 12, fontWeight: "700", color: colors.onSurfaceVariant },
  clienteName: { fontSize: 18, fontWeight: "800", color: colors.primary, marginTop: 4 },
  projetoSub: { fontSize: 13, color: colors.onSurfaceVariant },
  valorTotalText: { fontSize: 14, fontWeight: "700", color: colors.primary, marginTop: 6 },

  breakdownBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  bdLabel: { fontSize: 12, color: colors.onSurfaceVariant },
  bdValSuccess: { fontSize: 12, fontWeight: "700", color: colors.secondary },
  bdValWarning: { fontSize: 12, fontWeight: "700", color: colors.onTertiaryFixedVariant },

  receiveBtn: {
    backgroundColor: colors.secondaryFixed,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  receiveBtnText: { fontSize: 13, fontWeight: "800", color: colors.onSecondaryFixed },
});
