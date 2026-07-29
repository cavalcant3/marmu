import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function DetalhesPedidoScreen({ route, navigation }: any) {
  const pedido = route?.params?.pedido || {
    id: "PED-1024",
    cliente: "Roberto Silva",
    projeto: "Bancada Cozinha",
    material: "Granito Via Láctea",
    acabamento: "Acabamento Escovado - 20mm",
    dataEntrega: "12 Out (Próximo Sábado)",
    valor: "R$ 4.250",
    pendente: "R$ 0",
    status: "Em Produção",
    notas: "Cuidado redobrado com o furo do cooktop. Cliente solicitou acabamento em bisotê simples nas bordas frontais.",
  };

  const [entregue, setEntregue] = useState(pedido.status === "Entregue");

  const handleMarcarEntregue = () => {
    setEntregue(true);
    Alert.alert("Sucesso", `Pedido #${pedido.id} finalizado e arquivado com sucesso!`);
  };

  const handleCall = () => {
    Alert.alert("Ligar para Cliente", `Ligando para ${pedido.cliente}...`);
  };

  const handleWhatsApp = () => {
    Alert.alert("WhatsApp", `Abrindo conversa do WhatsApp com ${pedido.cliente}...`);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header Back & Title */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Marmu</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Project & Client Title */}
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.projectTitle}>{pedido.projeto}</Text>
            <Text style={styles.clientSub}>Cliente: {pedido.cliente}</Text>
          </View>
          <View style={entregue ? styles.pillEntregue : styles.pillProducao}>
            <Text style={entregue ? styles.pillEntregueText : styles.pillProducaoText}>
              {entregue ? "ENTREGUE" : "EM PRODUÇÃO"}
            </Text>
          </View>
        </View>

        {/* Featured Measurement Image Card */}
        <View style={styles.imageCard}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera-outline" size={48} color={colors.onPrimaryContainer} style={{ opacity: 0.4 }} />
            <Text style={styles.imageText}>Foto / Projeto Técnico com Medidas</Text>
            <Text style={styles.imageSub}>Comprimento: 2,40m • Largura: 0,60m</Text>
          </View>
          <TouchableOpacity
            style={styles.techDetailsBtn}
            onPress={() => navigation.navigate("fotoanotacao")}
          >
            <Ionicons name="expand-outline" size={14} color={colors.onPrimary} style={{ marginRight: 6 }} />
            <Text style={styles.techDetailsBtnText}>VER DETALHES TÉCNICOS</Text>
          </TouchableOpacity>
        </View>

        {/* Bento Details Grid */}
        <View style={styles.bentoGrid}>
          {/* Material Card */}
          <View style={styles.bentoMaterialCard}>
            <View style={styles.bentoLabelRow}>
              <Ionicons name="layers-outline" size={18} color={colors.onSurfaceVariant} />
              <Text style={styles.bentoLabel}>MATERIAL</Text>
            </View>
            <Text style={styles.bentoTitle}>{pedido.material}</Text>
            <Text style={styles.bentoSub}>{pedido.acabamento}</Text>
          </View>

          {/* Delivery Card */}
          <View style={styles.bentoHalfCard}>
            <View style={styles.bentoLabelRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.onSurfaceVariant} />
              <Text style={styles.bentoLabel}>ENTREGA</Text>
            </View>
            <Text style={styles.bentoTitle}>{pedido.dataEntrega.split(" ")[0]} {pedido.dataEntrega.split(" ")[1]}</Text>
            <Text style={styles.bentoSub}>Próximo Sábado</Text>
          </View>

          {/* Value Card */}
          <View style={styles.bentoValueCard}>
            <View style={styles.bentoLabelRow}>
              <Ionicons name="wallet-outline" size={18} color={colors.onPrimaryContainer} />
              <Text style={styles.bentoValueLabel}>VALOR</Text>
            </View>
            <Text style={styles.bentoValueNum}>{pedido.valor}</Text>
            <Text style={styles.bentoValueSub}>Pendente: {pedido.pendente}</Text>
          </View>
        </View>

        {/* Workflow Progress Stepper */}
        <View style={styles.stepperCard}>
          <Text style={styles.stepperTitle}>STATUS DO WORKFLOW</Text>
          <View style={styles.stepperRow}>
            {/* Step 1: Medição */}
            <View style={styles.stepCol}>
              <View style={styles.stepCircleDone}>
                <Ionicons name="checkmark" size={16} color={colors.onSecondary} />
              </View>
              <Text style={styles.stepTextDone}>Medição</Text>
            </View>

            {/* Step 2: Corte */}
            <View style={styles.stepCol}>
              <View style={styles.stepCircleDone}>
                <Ionicons name="checkmark" size={16} color={colors.onSecondary} />
              </View>
              <Text style={styles.stepTextDone}>Corte</Text>
            </View>

            {/* Step 3: Produção */}
            <View style={styles.stepCol}>
              <View style={[styles.stepCircleActive, entregue && styles.stepCircleDone]}>
                {entregue && <Ionicons name="checkmark" size={16} color={colors.onSecondary} />}
              </View>
              <Text style={styles.stepTextActive}>Produção</Text>
            </View>

            {/* Step 4: Entrega */}
            <View style={styles.stepCol}>
              <View style={[styles.stepCirclePending, entregue && styles.stepCircleDone]}>
                {entregue && <Ionicons name="checkmark" size={16} color={colors.onSecondary} />}
              </View>
              <Text style={entregue ? styles.stepTextDone : styles.stepTextPending}>Entrega</Text>
            </View>
          </View>
        </View>

        {/* Contact & Notes Section */}
        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>NOTAS DO PROJETO</Text>
          <Text style={styles.notesBody}>"{pedido.notas}"</Text>

          <View style={styles.contactBtnRow}>
            <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
              <Ionicons name="logo-whatsapp" size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.whatsappBtnText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
              <Ionicons name="call-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.callBtnText}>Ligar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {!entregue ? (
          <TouchableOpacity style={styles.deliverBtn} onPress={handleMarcarEntregue} activeOpacity={0.85}>
            <Ionicons name="cube-outline" size={20} color={colors.onPrimary} style={{ marginRight: 8 }} />
            <Text style={styles.deliverBtnText}>Marcar como Entregue</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.deliveredBtn}>
            <Ionicons name="checkmark-circle" size={20} color={colors.onSecondaryContainer} style={{ marginRight: 8 }} />
            <Text style={styles.deliveredBtnText}>Entregue com Sucesso</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 120 },

  topHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: colors.primary },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },

  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  projectTitle: { fontSize: 22, fontWeight: "800", color: colors.primary },
  clientSub: { fontSize: 14, color: colors.onSurfaceVariant, marginTop: 2 },

  pillProducao: { backgroundColor: colors.tertiaryFixed, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  pillProducaoText: { fontSize: 11, fontWeight: "700", color: colors.onTertiaryFixedVariant },
  pillEntregue: { backgroundColor: colors.secondaryContainer, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  pillEntregueText: { fontSize: 11, fontWeight: "700", color: colors.onSecondaryContainer },

  imageCard: {
    backgroundColor: colors.primaryContainer,
    borderRadius: 16,
    height: 180,
    position: "relative",
    overflow: "hidden",
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholder: { alignItems: "center" },
  imageText: { color: colors.onPrimaryContainer, fontSize: 14, fontWeight: "700", marginTop: 8 },
  imageSub: { color: colors.onPrimaryContainer, fontSize: 12, opacity: 0.8, marginTop: 2 },
  techDetailsBtn: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  techDetailsBtnText: { color: colors.onPrimary, fontSize: 11, fontWeight: "700" },

  bentoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  bentoMaterialCard: {
    width: "100%",
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 14,
  },
  bentoHalfCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 14,
  },
  bentoValueCard: {
    flex: 1,
    backgroundColor: colors.primaryContainer,
    borderRadius: 14,
    padding: 14,
  },
  bentoLabelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  bentoLabel: { fontSize: 10, fontWeight: "700", color: colors.onSurfaceVariant, letterSpacing: 0.5 },
  bentoValueLabel: { fontSize: 10, fontWeight: "700", color: colors.onPrimaryContainer, letterSpacing: 0.5 },
  bentoTitle: { fontSize: 18, fontWeight: "800", color: colors.primary },
  bentoSub: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 },
  bentoValueNum: { fontSize: 18, fontWeight: "800", color: colors.primaryFixed },
  bentoValueSub: { fontSize: 12, color: colors.onPrimaryContainer, marginTop: 2 },

  stepperCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  stepperTitle: { fontSize: 11, fontWeight: "700", color: colors.onSurfaceVariant, letterSpacing: 0.5, marginBottom: 12 },
  stepperRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  stepCol: { alignItems: "center", flex: 1 },
  stepCircleDone: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  stepCircleActive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: colors.secondary,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  stepCirclePending: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  stepTextDone: { fontSize: 12, fontWeight: "600", color: colors.primary },
  stepTextActive: { fontSize: 12, fontWeight: "700", color: colors.secondary },
  stepTextPending: { fontSize: 12, color: colors.outline },

  notesCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  notesTitle: { fontSize: 11, fontWeight: "700", color: colors.onSurfaceVariant, letterSpacing: 0.5, marginBottom: 8 },
  notesBody: { fontSize: 14, color: colors.primary, fontStyle: "italic", lineHeight: 20, marginBottom: 16 },
  contactBtnRow: { flexDirection: "row", gap: 10 },
  whatsappBtn: {
    flex: 1,
    height: 48,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  whatsappBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  callBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  callBtnText: { color: colors.primary, fontSize: 14, fontWeight: "700" },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    padding: 16,
  },
  deliverBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  deliverBtnText: { color: colors.onPrimary, fontSize: 16, fontWeight: "700" },
  deliveredBtn: {
    height: 52,
    backgroundColor: colors.secondaryContainer,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  deliveredBtnText: { color: colors.onSecondaryContainer, fontSize: 16, fontWeight: "800" },
});
