import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import Badge from "../components/ui/Badge";

export default function DashboardScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greetingText}>Bom dia, Roberto</Text>
        <Text style={styles.sectionTitle}>Resumo da Oficina</Text>
      </View>

      {/* Bento Grid */}
      <View style={styles.grid}>
        {/* Card Orçamentos */}
        <View style={styles.bentoCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>ORÇAMENTOS NO MÊS</Text>
            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.displayNum}>12</Text>
            <Text style={styles.highlightVal}>R$ 15.400</Text>
          </View>
        </View>

        {/* Card Pedidos */}
        <View style={styles.bentoCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>PEDIDOS EM ABERTO</Text>
            <Ionicons name="construct-outline" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.displayNum}>05</Text>
            <Text style={styles.subtext}>Processando na serra</Text>
          </View>
        </View>
      </View>

      {/* Entregas desta Semana */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Entregas desta Semana</Text>
        <TouchableOpacity onPress={() => navigation.navigate("listapedidos")}>
          <Text style={styles.linkText}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.deliveryList}>
        {/* Delivery Item 1 */}
        <TouchableOpacity
          style={styles.deliveryCard}
          onPress={() =>
            navigation.navigate("detalhespedido", {
              pedido: {
                id: "1",
                cliente: "Ed. Miramar - Apto 402",
                projeto: "Bancada Cozinha",
                data: "12/10",
                status: "No Prazo",
              },
            })
          }
        >
          <View style={styles.deliveryLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="home-outline" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.deliveryTitle}>Ed. Miramar - Apto 402</Text>
              <Text style={styles.deliverySub}>Bancada Cozinha • 12/10</Text>
            </View>
          </View>
          <Badge label="No Prazo" variant="success" />
        </TouchableOpacity>

        {/* Delivery Item 2 */}
        <TouchableOpacity
          style={styles.deliveryCard}
          onPress={() =>
            navigation.navigate("detalhespedido", {
              pedido: {
                id: "2",
                cliente: "Casa Cond. Lagos",
                projeto: "Soleiras/Peitoris",
                data: "15/10",
                status: "Atenção",
              },
            })
          }
        >
          <View style={styles.deliveryLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="hammer-outline" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.deliveryTitle}>Casa Cond. Lagos</Text>
              <Text style={styles.deliverySub}>Soleiras/Peitoris • 15/10</Text>
            </View>
          </View>
          <Badge label="Atenção" variant="warning" />
        </TouchableOpacity>

        {/* Delivery Item 3 */}
        <TouchableOpacity
          style={styles.deliveryCard}
          onPress={() =>
            navigation.navigate("detalhespedido", {
              pedido: {
                id: "3",
                cliente: "Sede Administrativa X",
                projeto: "Piso Hall",
                data: "16/10",
                status: "Confirmada",
              },
            })
          }
        >
          <View style={styles.deliveryLeft}>
            <View style={styles.iconBox}>
              <Ionicons name="business-outline" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.deliveryTitle}>Sede Administrativa X</Text>
              <Text style={styles.deliverySub}>Piso Hall • 16/10</Text>
            </View>
          </View>
          <Badge label="Confirmada" variant="info" />
        </TouchableOpacity>
      </View>

      {/* Card de Estoque de Chapas */}
      <View style={styles.bannerCard}>
        <Text style={styles.bannerTitle}>Estoque de Chapas</Text>
        <Text style={styles.bannerSub}>Você tem 42 chapas de granito e mármore prontas para corte.</Text>
        <TouchableOpacity
          style={styles.bannerButton}
          onPress={() => navigation.navigate("tabelaprecos")}
        >
          <Text style={styles.bannerBtnText}>Ver Inventário</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.onSecondaryFixed} style={{ marginLeft: 6 }} />
        </TouchableOpacity>
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
    padding: 20,
    paddingBottom: 110,
  },
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
    marginBottom: 24,
  },
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  linkText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
    textDecorationLine: "underline",
  },
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
  deliveryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  bannerCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.onPrimary,
    marginBottom: 6,
  },
  bannerSub: {
    fontSize: 14,
    color: colors.onPrimaryContainer,
    marginBottom: 16,
    lineHeight: 20,
  },
  bannerButton: {
    backgroundColor: colors.secondaryFixed,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  bannerBtnText: {
    color: colors.onSecondaryFixed,
    fontSize: 14,
    fontWeight: "700",
  },
});
