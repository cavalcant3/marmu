import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import Badge from "../components/ui/Badge";

export default function AgendaMedicaoScreen({ navigation }: any) {
  const [selectedDay, setSelectedDay] = useState("Hoje");

  const [visitas, setVisitas] = useState([
    {
      id: "1",
      horario: "09:00",
      cliente: "João da Silva",
      projeto: "Bancada Cozinha Principal",
      endereco: "Rua das Flores, 123 - Jardins",
      telefone: "(11) 99887-6655",
      status: "Em Andamento",
    },
    {
      id: "2",
      horario: "11:30",
      cliente: "Maria Oliveira",
      projeto: "Lavatório Banheiro Suite",
      endereco: "Av. Brasil, 450 - Apt 82",
      telefone: "(11) 97766-5544",
      status: "Agendado",
    },
    {
      id: "3",
      horario: "14:30",
      cliente: "Carlos Eduardo",
      projeto: "Bancada Área Gourmet",
      endereco: "Alameda Santos, 890 - Casa",
      telefone: "(11) 96655-4433",
      status: "Agendado",
    },
  ]);

  const handleCall = (tel: string, nome: string) => {
    Alert.alert("Ligar para Cliente", `Ligando para ${nome} no número ${tel}...`);
  };

  const handleOpenMap = (endereco: string) => {
    Alert.alert("GPS / Mapa", `Abrindo navegação de rota para: ${endereco}`);
  };

  const handleNovaVisita = () => {
    Alert.prompt(
      "Agendar Nova Medição",
      "Digite o Nome do Cliente e Horário:",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Agendar",
          onPress: (val) => {
            if (val) {
              setVisitas((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  horario: "16:00",
                  cliente: val,
                  projeto: "Medição de Obra",
                  endereco: "Endereço a confirmar",
                  telefone: "(11) 90000-0000",
                  status: "Agendado",
                },
              ]);
              Alert.alert("Sucesso", "Visita de medição agendada com sucesso!");
            }
          },
        },
      ],
      "plain-text"
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Agenda de Medição</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleNovaVisita}>
          <Ionicons name="add" size={16} color={colors.onPrimary} style={{ marginRight: 2 }} />
          <Text style={styles.addBtnText}>Agendar</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Bar */}
      <View style={styles.datePickerRow}>
        {["Hoje", "Amanhã", "Quinta (31)", "Sexta (01)"].map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayChip, selectedDay === day && styles.dayChipActive]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.dayChipText, selectedDay === day && styles.dayChipTextActive]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryLabel}>VISITAS HOJE</Text>
          <Text style={styles.summaryNum}>{visitas.length} Medições Agendadas</Text>
          <Text style={styles.summarySub}>Lembrete de trena e papel de anotação ativos</Text>
        </View>
        <Ionicons name="calendar-outline" size={32} color={colors.secondaryFixed} />
      </View>

      {/* Visits List */}
      <View style={styles.list}>
        {visitas.map((visita) => (
          <View key={visita.id} style={styles.visitaCard}>
            <View style={styles.cardTop}>
              <View style={styles.timeBadge}>
                <Ionicons name="time-outline" size={14} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.timeText}>{visita.horario}</Text>
              </View>

              <Badge
                label={visita.status}
                variant={visita.status === "Em Andamento" ? "warning" : "info"}
              />
            </View>

            <Text style={styles.clienteName}>{visita.cliente}</Text>
            <Text style={styles.projetoText}>{visita.projeto}</Text>

            <View style={styles.addressBox}>
              <Ionicons name="location-outline" size={16} color={colors.onSurfaceVariant} style={{ marginRight: 4 }} />
              <Text style={styles.addressText}>{visita.endereco}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleCall(visita.telefone, visita.cliente)}
              >
                <Ionicons name="call-outline" size={16} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.actionBtnText}>Ligar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleOpenMap(visita.endereco)}
              >
                <Ionicons name="navigate-outline" size={16} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.actionBtnText}>Rota GPS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtnPrimary}
                onPress={() => navigation.navigate("novoorcamento")}
              >
                <Ionicons name="add" size={16} color={colors.onSecondaryFixed} style={{ marginRight: 2 }} />
                <Text style={styles.actionBtnPrimaryText}>Medir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  addBtnText: { color: colors.onPrimary, fontSize: 13, fontWeight: "700" },

  datePickerRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
  },
  dayChipActive: { backgroundColor: colors.primary },
  dayChipText: { fontSize: 12, fontWeight: "600", color: colors.onSurfaceVariant },
  dayChipTextActive: { color: colors.onPrimary },

  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryLeft: { flex: 1 },
  summaryLabel: { fontSize: 11, fontWeight: "700", color: colors.onPrimaryContainer, letterSpacing: 0.5 },
  summaryNum: { fontSize: 22, fontWeight: "800", color: colors.onPrimary, marginTop: 2 },
  summarySub: { fontSize: 12, color: colors.onPrimaryContainer, marginTop: 2 },

  list: { gap: 14 },
  visitaCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 16,
    padding: 16,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeText: { fontSize: 13, fontWeight: "700", color: colors.primary },

  clienteName: { fontSize: 18, fontWeight: "800", color: colors.primary },
  projetoText: { fontSize: 14, color: colors.onSurfaceVariant, marginTop: 2 },

  addressBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  addressText: { fontSize: 12, color: colors.onSurfaceVariant, flex: 1 },

  actionRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  actionBtnText: { fontSize: 12, fontWeight: "700", color: colors.primary },

  actionBtnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondaryFixed,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnPrimaryText: { fontSize: 12, fontWeight: "800", color: colors.onSecondaryFixed },
});
