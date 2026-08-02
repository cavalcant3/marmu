import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import Badge from "../components/ui/Badge";
import { useAuthStore } from "../stores/authStore";
import { useOrcamentoStore } from "../stores/orcamentoStore";
import { usePedidoStore } from "../stores/pedidoStore";
import { useAgendaStore } from "../stores/agendaStore";
import { localDateKey } from "../utils/agenda";

const agendaTypeLabel: Record<string, string> = { MEDICAO: "Medição", VISITA: "Visita", INSTALACAO: "Instalação" };

export default function DashboardScreen({ navigation }: any) {
  const compact = useWindowDimensions().width < 370;
  const user = useAuthStore((state) => state.user);
  const userName = user?.nome || (user?.email ? user.email.split("@")[0] : "");
  const profileIncomplete = !user?.nome?.trim() || !user?.nome_marmoaria?.trim();

  const orcamentos = useOrcamentoStore((state) => state.orcamentos);
  const fetchOrcamentos = useOrcamentoStore((state) => state.fetchOrcamentos);
  const pedidos = usePedidoStore((state) => state.pedidos);
  const fetchPedidos = usePedidoStore((state) => state.fetchPedidos);
  const compromissos = useAgendaStore((state) => state.compromissos);
  const fetchCompromissos = useAgendaStore((state) => state.fetchCompromissos);

  useEffect(() => {
    fetchOrcamentos();
    fetchPedidos();
    fetchCompromissos();
  }, [fetchOrcamentos, fetchPedidos, fetchCompromissos]);

  const totalOrcamentosCount = orcamentos.length;
  const totalOrcamentosValue = orcamentos.reduce((acc, curr) => acc + curr.preco_final, 0);

  const openPedidos = pedidos.filter((p) => p.status !== "ENTREGUE");
  const openPedidosCount = openPedidos.length;

  const deliveryList = openPedidos.slice(0, 3);
  const todayAgenda = compromissos.filter((item) => item.data === localDateKey() && item.status === "PENDENTE");

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.contentContainer, compact && styles.contentCompact]}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greetingText}>{userName ? `Olá, ${userName}` : "Olá!"}</Text>
        <Text style={styles.sectionTitle}>Resumo da Oficina</Text>
      </View>

      {profileIncomplete && (
        <TouchableOpacity
          style={styles.setupCard}
          onPress={() => navigation.navigate("perfilusuario")}
        >
          <Ionicons name="business-outline" size={22} color={colors.primary} />
          <View style={styles.setupText}>
            <Text style={styles.setupTitle}>Configure sua marmoaria</Text>
            <Text style={styles.setupSub}>Esses dados serão usados no PDF do orçamento.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      )}


      {/* Bento Grid */}
      <View style={[styles.grid, compact && styles.gridCompact]}>
        {/* Card Orçamentos */}
        <TouchableOpacity
          style={styles.bentoCard}
          onPress={() => navigation.navigate("listaorcamentos")}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>ORÇAMENTOS NO MÊS</Text>
            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.displayNum}>{String(totalOrcamentosCount).padStart(2, "0")}</Text>
            <Text style={styles.highlightVal}>
              R$ {totalOrcamentosValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Card Pedidos */}
        <TouchableOpacity
          style={styles.bentoCard}
          onPress={() => navigation.navigate("listapedidos")}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>PEDIDOS EM ABERTO</Text>
            <Ionicons name="construct-outline" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.displayNum}>{String(openPedidosCount).padStart(2, "0")}</Text>
            <Text style={styles.subtext}>Aguardando produção</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.sectionHeader, compact && styles.sectionHeaderCompact]}>
        <View>
          <Text style={styles.sectionTitle}>Agenda de Hoje</Text>
          <Text style={styles.agendaCount}>{todayAgenda.length === 0 ? "Nenhum compromisso pendente" : `${todayAgenda.length} compromisso${todayAgenda.length > 1 ? "s" : ""} pendente${todayAgenda.length > 1 ? "s" : ""}`}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("agendamedicao")}>
          <Text style={styles.linkText}>Ver agenda</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.agendaCard} onPress={() => navigation.navigate("agendamedicao")} activeOpacity={0.8}>
        {todayAgenda.length === 0 ? (
          <>
            <View style={styles.agendaIcon}><Ionicons name="calendar-outline" size={22} color={colors.primary} /></View>
            <View style={styles.agendaInfo}><Text style={styles.agendaTitle}>Organize seu dia</Text><Text style={styles.agendaSub}>Agende uma medição, visita ou instalação.</Text></View>
            <Ionicons name="add-circle-outline" size={23} color={colors.secondary} />
          </>
        ) : (
          <>
            <View style={styles.agendaTimeBox}><Text style={styles.agendaTime}>{todayAgenda[0].hora}</Text></View>
            <View style={styles.agendaInfo}><Text style={styles.agendaTitle}>{todayAgenda[0].cliente_nome}</Text><Text style={styles.agendaSub}>{agendaTypeLabel[todayAgenda[0].tipo]}{todayAgenda.length > 1 ? ` · mais ${todayAgenda.length - 1}` : ""}</Text></View>
            <Ionicons name="chevron-forward" size={20} color={colors.onSurfaceVariant} />
          </>
        )}
      </TouchableOpacity>

      {/* Entregas desta Semana */}
      <View style={[styles.sectionHeader, compact && styles.sectionHeaderCompact]}>
        <Text style={styles.sectionTitle}>Entregas desta Semana</Text>
        <TouchableOpacity onPress={() => navigation.navigate("listapedidos")}>
          <Text style={styles.linkText}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.deliveryList}>
        {deliveryList.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Nenhuma entrega pendente.</Text>
          </View>
        ) : (
          deliveryList.map((pedido) => (
            <TouchableOpacity
              key={pedido.id}
              style={[styles.deliveryCard, compact && styles.deliveryCardCompact]}
              onPress={() =>
                navigation.navigate("detalhespedido", {
                  pedido,
                })
              }
            >
              <View style={styles.deliveryLeft}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name={(pedido.projeto || "").toLowerCase().includes("piso") ? "grid-outline" : "home-outline"}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View>
                  <Text style={styles.deliveryTitle}>{pedido.cliente_nome}</Text>
                  <Text style={styles.deliverySub}>{pedido.projeto} • {pedido.data_prometida_entrega}</Text>
                </View>
              </View>
              <Badge
                label="Em produção"
                variant="success"
              />
            </TouchableOpacity>
          ))
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    padding: 20,
    paddingBottom: 110,
  },
  contentCompact: { paddingHorizontal: 12 },
  welcomeSection: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: typography.labelMd.fontSize,
    color: colors.onSurfaceVariant,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: typography.headlineMd.fontSize,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 2,
  },
  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  gridCompact: { flexDirection: "column" },
  bentoCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 16,
    minHeight: 130,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.onSurfaceVariant,
    letterSpacing: 0.5,
    maxWidth: "80%",
  },
  displayNum: {
    fontSize: 34,
    fontWeight: "700",
    color: colors.primary,
  },
  highlightVal: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.secondary,
    marginTop: 2,
  },
  subtext: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },

  setupCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  setupText: { flex: 1 },
  setupTitle: { fontSize: 15, fontWeight: "700", color: colors.primary },
  setupSub: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionHeaderCompact: { alignItems: "flex-start", gap: 6 },
  linkText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
    textDecorationLine: "underline",
  },
  agendaCount: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 },
  agendaCard: { minHeight: 76, backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 22 },
  agendaIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surfaceContainerHighest, alignItems: "center", justifyContent: "center" },
  agendaTimeBox: { minWidth: 58, height: 44, borderRadius: 12, backgroundColor: colors.secondaryFixed, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  agendaTime: { fontSize: 15, fontWeight: "800", color: colors.onSecondaryFixed },
  agendaInfo: { flex: 1 }, agendaTitle: { fontSize: 15, fontWeight: "800", color: colors.primary }, agendaSub: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 3 },
  deliveryList: {
    gap: 10,
    marginBottom: 24,
  },
  deliveryCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deliveryCardCompact: { flexDirection: "column", alignItems: "flex-start", gap: 10 },
  deliveryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: "center",
    justifyContent: "center",
  },
  deliveryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  deliverySub: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  emptyBox: {
    padding: 20,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderStyle: "dashed",
  },
  emptyText: {
    color: colors.onSurfaceVariant,
    fontSize: 14,
  },
});
