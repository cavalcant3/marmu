import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { colors } from "../theme/colors";
import Badge from "../components/ui/Badge";

export default function DetalhesPedidoScreen({ route, navigation }: any) {
  const pedido = route?.params?.pedido || {
    id: "PED-102",
    cliente: "Ed. Miramar - Apto 402",
    projeto: "Bancada Cozinha com Cuba",
    data: "12/10/2026",
    status: "No Prazo",
    comprimento: 2.4,
    largura: 0.6,
    material: "Granito Preto São Gabriel",
    valor: "R$ 1.850,00",
  };

  const [entregue, setEntregue] = useState(false);

  const handleMarcarEntregue = () => {
    setEntregue(true);
    Alert.alert("Sucesso", "Pedido marcado como Entregue!");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Card */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.pedidoId}>PEDIDO #{pedido.id || "102"}</Text>
          <Badge
            label={entregue ? "Entregue" : pedido.status || "No Prazo"}
            variant={entregue ? "info" : pedido.status === "Atenção" ? "warning" : "success"}
          />
        </View>

        <Text style={styles.clienteName}>{pedido.cliente}</Text>
        <Text style={styles.projetoName}>{pedido.projeto}</Text>
      </View>

      {/* Production Status Timeline */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>Linha do Tempo da Produção</Text>
        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View style={[styles.dot, styles.dotDone]} />
            <Text style={styles.stepTitleDone}>1. Medição no Local</Text>
            <Text style={styles.stepDate}>Concluído em 02/10</Text>
          </View>
          <View style={styles.timelineItem}>
            <View style={[styles.dot, styles.dotDone]} />
            <Text style={styles.stepTitleDone}>2. Corte na Serra</Text>
            <Text style={styles.stepDate}>Concluído em 06/10</Text>
          </View>
          <View style={styles.timelineItem}>
            <View style={[styles.dot, entregue ? styles.dotDone : styles.dotActive]} />
            <Text style={entregue ? styles.stepTitleDone : styles.stepTitleActive}>
              3. Acabamento de Bordas & Polimento
            </Text>
            <Text style={styles.stepDate}>Em andamento</Text>
          </View>
          <View style={styles.timelineItem}>
            <View style={[styles.dot, entregue ? styles.dotDone : styles.dotPending]} />
            <Text style={entregue ? styles.stepTitleDone : styles.stepTitlePending}>
              4. Entrega e Instalação
            </Text>
            <Text style={styles.stepDate}>Prometida para {pedido.data}</Text>
          </View>
        </View>
      </View>

      {/* Photo Preview Card */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>Foto-Anotada da Obra</Text>
        <View style={styles.photoBox}>
          <Text style={{ fontSize: 40, marginBottom: 8 }}>📷</Text>
          <Text style={styles.photoText}>Visualização do Canto da Cozinha</Text>
          <Text style={styles.photoSub}>Medidas: 2,40m × 0,60m (Corte de Cuba à direita)</Text>
        </View>
        <TouchableOpacity
          style={styles.viewPhotoBtn}
          onPress={() => navigation.navigate("fotoanotacao")}
        >
          <Text style={styles.viewPhotoBtnText}>Abrir Foto em Tela Cheia 🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Details Card */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>Especificações Técnicas</Text>
        <View style={styles.specRow}>
          <Text style={styles.specKey}>Material:</Text>
          <Text style={styles.specVal}>{pedido.material || "Granito Preto São Gabriel"}</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specKey}>Dimensões:</Text>
          <Text style={styles.specVal}>2,40m × 0,60m (1,44 m²)</Text>
        </View>
        <View style={styles.specRow}>
          <Text style={styles.specKey}>Valor Acertado:</Text>
          <Text style={styles.specValBold}>{pedido.valor || "R$ 1.850,00"}</Text>
        </View>
        <View style={[styles.specRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.specKey}>Lembrete de Entrega:</Text>
          <Text style={styles.specVal}>Programado para 2 dias antes</Text>
        </View>
      </View>

      {/* Action Button */}
      {!entregue ? (
        <TouchableOpacity style={styles.deliverBtn} onPress={handleMarcarEntregue}>
          <Text style={styles.deliverBtnText}>✓ Marcar Pedido como Entregue</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.doneBanner}>
          <Text style={styles.doneBannerText}>✓ Pedido Concluído e Entregue</Text>
        </View>
      )}
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
    padding: 16,
    marginBottom: 16,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pedidoId: { fontSize: 12, fontWeight: "700", color: colors.onSurfaceVariant, letterSpacing: 0.5 },
  clienteName: { fontSize: 20, fontWeight: "800", color: colors.primary, marginTop: 6 },
  projetoName: { fontSize: 14, color: colors.onSurfaceVariant, marginTop: 2 },
  cardSectionTitle: { fontSize: 16, fontWeight: "700", color: colors.primary, marginBottom: 12 },

  timeline: { paddingLeft: 8 },
  timelineItem: { marginBottom: 14, paddingLeft: 20, position: "relative" },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: "absolute",
    left: 0,
    top: 4,
  },
  dotDone: { backgroundColor: colors.secondary },
  dotActive: { backgroundColor: colors.tertiaryFixed, borderWidth: 3, borderColor: colors.primary },
  dotPending: { backgroundColor: colors.outlineVariant },
  stepTitleDone: { fontSize: 14, fontWeight: "700", color: colors.primary },
  stepTitleActive: { fontSize: 14, fontWeight: "700", color: colors.primary },
  stepTitlePending: { fontSize: 14, color: colors.onSurfaceVariant },
  stepDate: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 },

  photoBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  photoText: { fontSize: 14, fontWeight: "700", color: colors.primary },
  photoSub: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 4 },
  viewPhotoBtn: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  viewPhotoBtnText: { fontSize: 13, fontWeight: "700", color: colors.primary },

  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  specKey: { fontSize: 13, color: colors.onSurfaceVariant },
  specVal: { fontSize: 13, fontWeight: "600", color: colors.primary },
  specValBold: { fontSize: 15, fontWeight: "800", color: colors.secondary },

  deliverBtn: {
    backgroundColor: colors.secondaryFixed,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  deliverBtnText: { fontSize: 16, fontWeight: "800", color: colors.onSecondaryFixed },

  doneBanner: {
    backgroundColor: colors.secondaryContainer,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  doneBannerText: { fontSize: 16, fontWeight: "800", color: colors.onSecondaryContainer },
});
