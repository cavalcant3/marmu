import React, { useEffect, useMemo, useState } from "react";
import { Alert, AppState, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { useAgendaStore } from "../stores/agendaStore";
import type { CompromissoAgenda, TipoCompromisso } from "../services/agendaService";
import { formatAgendaDate, isValidTime, localDateKey, parseBrDate } from "../utils/agenda";
import { maskDate, maskPhone, maskTime } from "../utils/formatters";
import { consumePendingReschedule, getReminderPermissionState, openAlarmSettings, openNotificationSettings, requestReminderPermissions, syncAllNotifications, type ReminderPermissionState } from "../services/notificationService";

type Filtro = "HOJE" | "PROXIMOS" | "CONCLUIDOS";

const tipoLabel: Record<TipoCompromisso, string> = {
  MEDICAO: "Medição",
  VISITA: "Visita",
  INSTALACAO: "Instalação",
};

const tipoIcon: Record<TipoCompromisso, any> = {
  MEDICAO: "resize-outline",
  VISITA: "people-outline",
  INSTALACAO: "construct-outline",
};

function initialTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export default function AgendaMedicaoScreen({ navigation }: any) {
  const compact = useWindowDimensions().width < 390;
  const compromissos = useAgendaStore((state) => state.compromissos);
  const fetchCompromissos = useAgendaStore((state) => state.fetchCompromissos);
  const saveCompromisso = useAgendaStore((state) => state.saveCompromisso);
  const changeStatus = useAgendaStore((state) => state.changeStatus);
  const removeCompromisso = useAgendaStore((state) => state.removeCompromisso);

  const [filtro, setFiltro] = useState<Filtro>("HOJE");
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<CompromissoAgenda | null>(null);
  const [saving, setSaving] = useState(false);
  const [tipo, setTipo] = useState<TipoCompromisso>("MEDICAO");
  const [cliente, setCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [permission, setPermission] = useState<ReminderPermissionState>({ notifications: false, alarms: false });
  const [pendingRescheduleId] = useState(() => consumePendingReschedule()?.entityId || "");

  useEffect(() => { fetchCompromissos(); }, [fetchCompromissos]);
  useEffect(() => {
    const refresh = () => getReminderPermissionState().then(setPermission).catch(console.error);
    refresh();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        refresh();
        syncAllNotifications().catch(console.error);
      }
    });
    return () => subscription.remove();
  }, []);

  const today = localDateKey();
  const filtered = useMemo(() => compromissos.filter((item) => {
    if (filtro === "HOJE") return item.data === today && item.status !== "CANCELADO";
    if (filtro === "PROXIMOS") return item.data > today && item.status === "PENDENTE";
    return item.status === "CONCLUIDO";
  }), [compromissos, filtro, today]);

  const openForm = (item?: CompromissoAgenda) => {
    setEditing(item || null);
    setTipo(item?.tipo || "MEDICAO");
    setCliente(item?.cliente_nome || "");
    setTelefone(item?.telefone || "");
    setEndereco(item?.endereco || "");
    setData(item ? formatAgendaDate(item.data) : formatAgendaDate(today));
    setHora(item?.hora || initialTime());
    setObservacoes(item?.observacoes || "");
    setModalVisible(true);
  };

  useEffect(() => {
    if (!pendingRescheduleId || compromissos.length === 0 || modalVisible) return;
    const item = compromissos.find((current) => current.id === pendingRescheduleId);
    if (item) openForm(item);
  }, [pendingRescheduleId, compromissos]);

  const handleEnableReminders = async () => {
    try {
      const state = await requestReminderPermissions();
      setPermission(state);
      if (!state.notifications) {
        return Alert.alert("Notificações bloqueadas", "Autorize as notificações do Marmu nos ajustes do Android.", [
          { text: "Agora não", style: "cancel" },
          { text: "Abrir ajustes", onPress: () => openNotificationSettings() },
        ]);
      }
      if (!state.alarms) {
        return Alert.alert("Autorizar horários exatos", "Ative “Alarmes e lembretes” para receber os avisos às 06h, 12h e 17h, mesmo com o app fechado.", [
          { text: "Agora não", style: "cancel" },
          { text: "Autorizar", onPress: () => openAlarmSettings() },
        ]);
      }
      await syncAllNotifications();
      Alert.alert("Lembretes ativados", "Os compromissos e prazos já estão programados.");
    } catch (error) {
      console.error(error);
      Alert.alert("Não foi possível ativar", "Revise as permissões de notificações do Marmu nos ajustes do aparelho.");
    }
  };

  const handleSave = async () => {
    const normalizedDate = parseBrDate(data);
    if (!cliente.trim() || !endereco.trim() || !normalizedDate || !isValidTime(hora)) {
      return Alert.alert("Dados incompletos", "Informe cliente, endereço, uma data válida e um horário válido.");
    }
    try {
      setSaving(true);
      await saveCompromisso({
        tipo,
        cliente_nome: cliente,
        telefone,
        endereco,
        data: normalizedDate,
        hora,
        observacoes,
        status: editing?.status || "PENDENTE",
      }, editing?.id);
      setModalVisible(false);
      Alert.alert("Agenda atualizada", `${tipoLabel[tipo]} salva para ${data} às ${hora}.`);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar o compromisso.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = () => {
    if (!editing) return;
    Alert.alert("Excluir compromisso", "Esse compromisso será removido da agenda.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: async () => { await removeCompromisso(editing.id); setModalVisible(false); } },
    ]);
  };

  return (
    <View style={styles.main}>
      <ScrollView style={styles.container} contentContainerStyle={[styles.content, compact && styles.contentCompact]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityLabel="Voltar">
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>Agenda</Text>
            <Text style={styles.subtitle}>Organize medições, visitas e instalações</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => openForm()}>
            <Ionicons name="add" size={22} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>

        {(!permission.notifications || !permission.alarms) && (
          <TouchableOpacity style={styles.permissionCard} onPress={handleEnableReminders} activeOpacity={0.8}>
            <View style={styles.permissionIcon}><Ionicons name="notifications-outline" size={21} color={colors.primary} /></View>
            <View style={styles.permissionText}><Text style={styles.permissionTitle}>Ativar lembretes no celular</Text><Text style={styles.permissionSub}>Receba avisos às 06h, 12h, 17h e antes de cada compromisso.</Text></View>
            <Ionicons name="chevron-forward" size={19} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}

        <View style={styles.filterRow}>
          <Filter active={filtro === "HOJE"} label="Hoje" onPress={() => setFiltro("HOJE")} />
          <Filter active={filtro === "PROXIMOS"} label="Próximos" onPress={() => setFiltro("PROXIMOS")} />
          <Filter active={filtro === "CONCLUIDOS"} label="Concluídos" onPress={() => setFiltro("CONCLUIDOS")} />
        </View>

        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="calendar-outline" size={36} color={colors.onSurfaceVariant} />
            <Text style={styles.emptyTitle}>{filtro === "HOJE" ? "Seu dia está livre" : "Nenhum compromisso aqui"}</Text>
            <Text style={styles.emptyText}>Cadastre um compromisso para manter o trabalho organizado.</Text>
            <TouchableOpacity style={styles.emptyAction} onPress={() => openForm()}><Text style={styles.emptyActionText}>Novo compromisso</Text></TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {filtered.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.card, item.status === "CONCLUIDO" && styles.cardCompleted]} onPress={() => openForm(item)} activeOpacity={0.8}>
                <View style={styles.timeColumn}>
                  <Text style={styles.time}>{item.hora}</Text>
                  <View style={[styles.typeIcon, item.status === "CONCLUIDO" && styles.typeIconCompleted]}><Ionicons name={tipoIcon[item.tipo]} size={19} color={item.status === "CONCLUIDO" ? colors.onSecondaryFixed : colors.primary} /></View>
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleArea}>
                      <Text style={styles.clientName}>{item.cliente_nome}</Text>
                      <Text style={styles.typeText}>{tipoLabel[item.tipo]} · {formatAgendaDate(item.data)}</Text>
                    </View>
                    <View style={item.status === "CONCLUIDO" ? styles.doneBadge : styles.pendingBadge}><Text style={item.status === "CONCLUIDO" ? styles.doneBadgeText : styles.pendingBadgeText}>{item.status === "CONCLUIDO" ? "CONCLUÍDO" : "PENDENTE"}</Text></View>
                  </View>
                  <View style={styles.detailRow}><Ionicons name="location-outline" size={16} color={colors.onSurfaceVariant} /><Text style={styles.detailText}>{item.endereco}</Text></View>
                  {item.telefone && <View style={styles.detailRow}><Ionicons name="call-outline" size={15} color={colors.onSurfaceVariant} /><Text style={styles.detailText}>{item.telefone}</Text></View>}
                  {item.observacoes && <Text style={styles.notes} numberOfLines={2}>{item.observacoes}</Text>}
                  <TouchableOpacity style={item.status === "CONCLUIDO" ? styles.reopenButton : styles.completeButton} onPress={() => changeStatus(item.id, item.status === "CONCLUIDO" ? "PENDENTE" : "CONCLUIDO")}>
                    <Ionicons name={item.status === "CONCLUIDO" ? "refresh-outline" : "checkmark-circle-outline"} size={17} color={item.status === "CONCLUIDO" ? colors.primary : colors.onSecondaryFixed} />
                    <Text style={item.status === "CONCLUIDO" ? styles.reopenText : styles.completeText}>{item.status === "CONCLUIDO" ? "Reabrir" : "Marcar como concluído"}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={[styles.modalOverlay, compact && styles.modalOverlayCompact]}><ScrollView style={styles.modalScroll} contentContainerStyle={[styles.modalCard, compact && styles.modalCardCompact]} keyboardShouldPersistTaps="handled">
          <View style={styles.modalHeader}><Text style={styles.modalTitle}>{editing ? "Editar compromisso" : "Novo compromisso"}</Text><TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={23} color={colors.primary} /></TouchableOpacity></View>
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.typeRow}>{(["MEDICAO", "VISITA", "INSTALACAO"] as TipoCompromisso[]).map((item) => <TouchableOpacity key={item} style={[styles.typeChip, tipo === item && styles.typeChipActive]} onPress={() => setTipo(item)}><Text style={[styles.typeChipText, tipo === item && styles.typeChipTextActive]}>{tipoLabel[item]}</Text></TouchableOpacity>)}</View>
          <Label text="Cliente *" /><TextInput style={styles.input} value={cliente} onChangeText={setCliente} placeholder="Nome do cliente" placeholderTextColor={colors.onSurfaceVariant} autoCapitalize="words" />
          <Label text="Telefone" /><TextInput style={styles.input} value={telefone} onChangeText={(value) => setTelefone(maskPhone(value))} placeholder="(00) 00000-0000" placeholderTextColor={colors.onSurfaceVariant} keyboardType="phone-pad" />
          <Label text="Endereço *" /><TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Rua, número e bairro" placeholderTextColor={colors.onSurfaceVariant} autoCapitalize="words" />
          <View style={styles.dateTimeRow}><View style={styles.flex1}><Label text="Data *" /><TextInput style={styles.input} value={data} onChangeText={(value) => setData(maskDate(value))} placeholder="DD/MM/AAAA" placeholderTextColor={colors.onSurfaceVariant} keyboardType="number-pad" /></View><View style={styles.timeField}><Label text="Horário *" /><TextInput style={styles.input} value={hora} onChangeText={(value) => setHora(maskTime(value))} placeholder="HH:MM" placeholderTextColor={colors.onSurfaceVariant} keyboardType="number-pad" /></View></View>
          <Label text="Observações" /><TextInput style={[styles.input, styles.notesInput]} value={observacoes} onChangeText={setObservacoes} placeholder="Ex: falar com o porteiro, levar trena..." placeholderTextColor={colors.onSurfaceVariant} multiline textAlignVertical="top" />
          {editing && <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}><Ionicons name="trash-outline" size={18} color={colors.error} /><Text style={styles.deleteText}>Excluir compromisso</Text></TouchableOpacity>}
          <View style={styles.actions}><TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)} disabled={saving}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity><TouchableOpacity style={[styles.saveButton, saving && styles.disabled]} onPress={handleSave} disabled={saving}><Text style={styles.saveText}>{saving ? "Salvando..." : "Salvar"}</Text></TouchableOpacity></View>
        </ScrollView></View>
      </Modal>
    </View>
  );
}

function Filter({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) { return <TouchableOpacity style={[styles.filter, active && styles.filterActive]} onPress={onPress}><Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text></TouchableOpacity>; }
function Label({ text }: { text: string }) { return <Text style={styles.label}>{text}</Text>; }

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.background }, container: { flex: 1 }, content: { width: "100%", maxWidth: 720, alignSelf: "center", padding: 20, paddingBottom: 120 }, contentCompact: { paddingHorizontal: 12 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 11, marginBottom: 18 }, backButton: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceContainerLow }, headerText: { flex: 1 }, title: { fontSize: 24, fontWeight: "800", color: colors.primary }, subtitle: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 }, addButton: { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary },
  permissionCard: { minHeight: 78, flexDirection: "row", alignItems: "center", gap: 11, padding: 13, backgroundColor: colors.tertiaryFixed, borderRadius: 14, marginBottom: 15 }, permissionIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.surfaceContainerLowest, alignItems: "center", justifyContent: "center" }, permissionText: { flex: 1 }, permissionTitle: { fontSize: 14, fontWeight: "800", color: colors.primary }, permissionSub: { fontSize: 12, color: colors.onTertiaryFixedVariant, marginTop: 3 },
  filterRow: { flexDirection: "row", gap: 7, marginBottom: 17 }, filter: { flex: 1, minHeight: 42, borderRadius: 21, backgroundColor: colors.surfaceContainerHigh, alignItems: "center", justifyContent: "center" }, filterActive: { backgroundColor: colors.primary }, filterText: { fontSize: 12, fontWeight: "700", color: colors.onSurfaceVariant }, filterTextActive: { color: colors.onPrimary },
  list: { gap: 11 }, card: { flexDirection: "row", gap: 12, backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 16, padding: 14 }, cardCompleted: { backgroundColor: colors.surfaceContainerLow }, timeColumn: { width: 51, alignItems: "center" }, time: { fontSize: 16, fontWeight: "800", color: colors.primary }, typeIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceContainerHighest, marginTop: 9 }, typeIconCompleted: { backgroundColor: colors.secondaryFixed }, cardBody: { flex: 1 }, cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: 7 }, cardTitleArea: { flex: 1 }, clientName: { fontSize: 15, fontWeight: "800", color: colors.primary }, typeText: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 3 }, pendingBadge: { backgroundColor: colors.tertiaryFixed, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 3 }, pendingBadgeText: { fontSize: 9, fontWeight: "800", color: colors.onTertiaryFixedVariant }, doneBadge: { backgroundColor: colors.secondaryFixed, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 3 }, doneBadgeText: { fontSize: 9, fontWeight: "800", color: colors.onSecondaryFixed }, detailRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 8 }, detailText: { flex: 1, fontSize: 12, color: colors.onSurfaceVariant }, notes: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 8, fontStyle: "italic" }, completeButton: { minHeight: 39, backgroundColor: colors.secondaryFixed, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12 }, completeText: { fontSize: 12, fontWeight: "800", color: colors.onSecondaryFixed }, reopenButton: { minHeight: 39, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12 }, reopenText: { fontSize: 12, fontWeight: "800", color: colors.primary },
  emptyBox: { alignItems: "center", backgroundColor: colors.surfaceContainerLow, borderRadius: 16, padding: 30 }, emptyTitle: { fontSize: 17, fontWeight: "800", color: colors.primary, marginTop: 9 }, emptyText: { fontSize: 13, color: colors.onSurfaceVariant, textAlign: "center", marginTop: 4 }, emptyAction: { minHeight: 42, borderRadius: 12, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: 18, marginTop: 16 }, emptyActionText: { color: colors.onPrimary, fontSize: 13, fontWeight: "800" },
  modalOverlay: { flex: 1, justifyContent: "center", backgroundColor: "rgba(9, 20, 38, 0.6)", padding: 20 }, modalScroll: { maxHeight: "92%", borderRadius: 20 }, modalCard: { backgroundColor: colors.surfaceContainerLowest, padding: 20, borderRadius: 20 }, modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }, modalTitle: { fontSize: 20, fontWeight: "800", color: colors.primary }, label: { fontSize: 13, fontWeight: "700", color: colors.primary, marginTop: 12, marginBottom: 5 }, typeRow: { flexDirection: "row", gap: 6 }, typeChip: { flex: 1, minHeight: 42, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceContainerHigh, borderRadius: 11 }, typeChipActive: { backgroundColor: colors.primary }, typeChipText: { fontSize: 11, fontWeight: "700", color: colors.onSurfaceVariant }, typeChipTextActive: { color: colors.onPrimary }, input: { minHeight: 46, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 10, paddingHorizontal: 13, color: colors.onSurface }, dateTimeRow: { flexDirection: "row", gap: 9 }, flex1: { flex: 1 }, timeField: { width: 112 }, notesInput: { height: 84, paddingTop: 12 }, deleteButton: { minHeight: 43, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12 }, deleteText: { color: colors.error, fontWeight: "700" }, actions: { flexDirection: "row", gap: 10, marginTop: 18 }, cancelButton: { minHeight: 48, paddingHorizontal: 17, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 12, alignItems: "center", justifyContent: "center" }, cancelText: { color: colors.onSurfaceVariant, fontWeight: "700" }, saveButton: { flex: 1, minHeight: 48, backgroundColor: colors.secondaryFixed, borderRadius: 12, alignItems: "center", justifyContent: "center" }, saveText: { color: colors.onSecondaryFixed, fontWeight: "800" }, disabled: { opacity: 0.55 },
  modalOverlayCompact: { padding: 8 },
  modalCardCompact: { padding: 14 },
});
