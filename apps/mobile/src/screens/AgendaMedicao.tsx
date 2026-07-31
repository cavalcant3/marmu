import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function AgendaMedicaoScreen({ navigation }: any) {
  const [selectedDay, setSelectedDay] = useState("QUA 16");

  const days = [
    { day: "SEG", num: "14" },
    { day: "TER", num: "15" },
    { day: "QUA", num: "16" },
    { day: "QUI", num: "17" },
    { day: "SEX", num: "18" },
    { day: "SAB", num: "19" },
  ];

  const handleStartMeasurement = (item: any) => {
    navigation.navigate("novoorcamento", {
      cliente: item.cliente,
      projeto: item.projeto,
    });
  };

  const handleOpenMap = (endereco: string) => {
    Alert.alert("Navegação GPS", `Abrindo mapa para: ${endereco}`);
  };

  const handleAddAppointment = () => {
    Alert.prompt(
      "Agendar Nova Medição",
      "Nome do cliente e endereço:",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Agendar",
          onPress: (val?: any) => {
            if (val) {
              Alert.alert("Sucesso", "Nova medição agendada!");
            }
          },
        },
      ],
      "plain-text"
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Agenda de Medição</Text>

        {/* Horizontal Date Picker */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dateScrollView}
          contentContainerStyle={styles.datePickerContainer}
        >
          {days.map((item) => {
            const key = `${item.day} ${item.num}`;
            const isActive = selectedDay === key;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.dateCard, isActive && styles.dateCardActive]}
                onPress={() => setSelectedDay(key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dayLabel, isActive && styles.dayLabelActive]}>
                  {item.day}
                </Text>
                <Text style={[styles.numLabel, isActive && styles.numLabelActive]}>
                  {item.num}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Appointments Timeline List */}
        <View style={styles.list}>
          {/* ITEM 1: CONCLUÍDA */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.timelineCol}>
                <Text style={styles.timeText}>09:00</Text>
                <View style={styles.timelineLine} />
              </View>

              <View style={styles.infoCol}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clientName}>RICARDO ALMEIDA</Text>
                    <Text style={styles.projectSub}>Bancada Cozinha Gourmet</Text>
                  </View>
                  <View style={styles.pillConcluida}>
                    <Text style={styles.pillConcluidaText}>CONCLUÍDA</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.locationRow}
                  onPress={() => handleOpenMap("Av. das Américas, 4200 - Barra da Tijuca")}
                >
                  <Ionicons name="location-sharp" size={16} color={colors.primary} />
                  <Text style={styles.locationText}>
                    Av. das Américas, 4200 - Barra da Tijuca
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ITEM 2: CONFIRMADA (ACTIVE HIGHLIGHTED CARD) */}
          <View style={[styles.card, styles.cardHighlighted]}>
            <View style={styles.cardContent}>
              <View style={styles.timelineCol}>
                <Text style={styles.timeTextActive}>11:30</Text>
                <View style={styles.timelineLineActive} />
              </View>

              <View style={styles.infoCol}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clientName}>MARIANA COSTA</Text>
                    <Text style={styles.projectSub}>Revestimento Banheiro Suíte</Text>
                  </View>
                  <View style={styles.pillConfirmada}>
                    <Text style={styles.pillConfirmadaText}>CONFIRMADA</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.locationRow}
                  onPress={() => handleOpenMap("Rua Henrique Dumont, 120 - Ipanema")}
                >
                  <Ionicons name="location-sharp" size={16} color={colors.primary} />
                  <Text style={styles.locationText}>
                    Rua Henrique Dumont, 120 - Ipanema
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iniciarMedicaoBtn}
                  onPress={() =>
                    handleStartMeasurement({
                      cliente: "MARIANA COSTA",
                      projeto: "Revestimento Banheiro Suíte",
                    })
                  }
                >
                  <Ionicons name="stats-chart-outline" size={18} color={colors.onPrimary} style={{ marginRight: 8 }} />
                  <Text style={styles.iniciarMedicaoText}>Iniciar Medição</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ITEM 3: PENDENTE */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.timelineCol}>
                <Text style={styles.timeTextMuted}>14:45</Text>
                <View style={styles.timelineLine} />
              </View>

              <View style={styles.infoCol}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clientName}>JORGE SILVA</Text>
                    <Text style={styles.projectSub}>Área de Serviço - Tanque</Text>
                  </View>
                  <View style={styles.pillPendente}>
                    <Text style={styles.pillPendenteText}>PENDENTE</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.locationRow}
                  onPress={() => handleOpenMap("Estrada do Joá, 1500 - São Conrado")}
                >
                  <Ionicons name="location-sharp" size={16} color={colors.primary} />
                  <Text style={styles.locationText}>
                    Estrada do Joá, 1500 - São Conrado
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ITEM 4: PENDENTE */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.timelineCol}>
                <Text style={styles.timeTextMuted}>16:30</Text>
                <View style={styles.timelineLine} />
              </View>

              <View style={styles.infoCol}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clientName}>CONSTRUTORA ALPHA</Text>
                    <Text style={styles.projectSub}>Soleiras Bloco B (12 un)</Text>
                  </View>
                  <View style={styles.pillPendente}>
                    <Text style={styles.pillPendenteText}>PENDENTE</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.locationRow}
                  onPress={() => handleOpenMap("Rua Voluntários da Pátria, 80 - Botafogo")}
                >
                  <Ionicons name="location-sharp" size={16} color={colors.primary} />
                  <Text style={styles.locationText}>
                    Rua Voluntários da Pátria, 80 - Botafogo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button (FAB) Green */}
      <TouchableOpacity style={styles.greenFab} onPress={handleAddAppointment} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color={colors.onSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 110 },

  title: { fontSize: 24, fontWeight: "800", color: colors.primary, marginBottom: 16 },

  dateScrollView: { marginBottom: 20 },
  datePickerContainer: { flexDirection: "row", gap: 10 },
  dateCard: {
    width: 64,
    height: 80,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  dateCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayLabel: { fontSize: 13, fontWeight: "500", color: colors.onSurfaceVariant },
  dayLabelActive: { color: colors.onPrimary },
  numLabel: { fontSize: 20, fontWeight: "700", color: colors.onSurface, marginTop: 2 },
  numLabelActive: { color: colors.onPrimary },

  list: { gap: 12 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 16,
  },
  cardHighlighted: {
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: { flexDirection: "row", gap: 12 },

  timelineCol: { alignItems: "center", width: 50 },
  timeText: { fontSize: 16, fontWeight: "700", color: colors.primary },
  timeTextActive: { fontSize: 16, fontWeight: "800", color: colors.primary },
  timeTextMuted: { fontSize: 16, fontWeight: "700", color: colors.onSurfaceVariant },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 40,
    backgroundColor: colors.outlineVariant,
    marginVertical: 6,
    borderRadius: 1,
  },
  timelineLineActive: {
    width: 3,
    flex: 1,
    minHeight: 60,
    backgroundColor: colors.primary,
    marginVertical: 6,
    borderRadius: 1.5,
  },

  infoCol: { flex: 1 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  clientName: { fontSize: 14, fontWeight: "700", color: colors.primary, letterSpacing: 0.5 },
  projectSub: { fontSize: 14, color: colors.onSurfaceVariant, marginTop: 2 },

  pillConcluida: {
    backgroundColor: colors.secondaryFixed,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pillConcluidaText: { fontSize: 11, fontWeight: "700", color: colors.onSecondaryFixed },

  pillConfirmada: {
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pillConfirmadaText: { fontSize: 11, fontWeight: "700", color: colors.primary },

  pillPendente: {
    backgroundColor: colors.tertiaryFixed,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pillPendenteText: { fontSize: 11, fontWeight: "700", color: colors.onTertiaryFixedVariant },

  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 12 },
  locationText: { fontSize: 13, color: colors.primary, marginLeft: 4, flex: 1 },

  iniciarMedicaoBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  iniciarMedicaoText: { fontSize: 14, fontWeight: "700", color: colors.onPrimary },

  greenFab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
