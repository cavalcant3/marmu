import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { useAuthStore } from "../stores/authStore";

export default function PerfilUsuarioScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);

  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [nomeMarmoaria, setNomeMarmoaria] = useState(user?.nome_marmoaria || "");
  const [telefone, setTelefone] = useState(user?.telefone || "");
  const [saving, setSaving] = useState(false);

  const initialLetter = (nome || email || "U")[0].toUpperCase();

  const handleSave = () => {
    if (!nome.trim()) {
      Alert.alert("Atenção", "Por favor, insira o seu nome.");
      return;
    }

    setSaving(true);
    updateUser({
      nome: nome.trim(),
      email: email.trim(),
      nome_marmoaria: nomeMarmoaria.trim(),
      telefone: telefone.trim(),
    });
    setSaving(false);

    Alert.alert("Sucesso", "Seu perfil foi atualizado com sucesso!");
  };

  const handleLogout = () => {
    Alert.alert("Sair da Conta", "Tem certeza que deseja encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header navigation bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Perfil do Usuário</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initialLetter}</Text>
          </View>
          <Text style={styles.userName}>{nome || "Usuário"}</Text>
          <Text style={styles.userSub}>{nomeMarmoaria || "Marmoaria Marmu"}</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Nome Completo</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={18} color={colors.outline} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome"
              placeholderTextColor={colors.onSurfaceVariant}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>E-mail</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color={colors.outline} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu.email@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.onSurfaceVariant}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Nome da Marmoaria / Empresa</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="business-outline" size={18} color={colors.outline} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={nomeMarmoaria}
              onChangeText={setNomeMarmoaria}
              placeholder="Ex: Marmoaria Pedra Fina"
              placeholderTextColor={colors.onSurfaceVariant}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Telefone / WhatsApp</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={18} color={colors.outline} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={setTelefone}
              placeholder="(00) 90000-0000"
              keyboardType="phone-pad"
              placeholderTextColor={colors.onSurfaceVariant}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color={colors.onPrimary} style={{ marginRight: 6 }} />
          <Text style={styles.saveBtnText}>Salvar Alterações</Text>
        </TouchableOpacity>

        {/* Logout Section */}
        <View style={styles.divider} />

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} style={{ marginRight: 6 }} />
          <Text style={styles.logoutBtnText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
  },
  avatarCard: {
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLowest,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    marginBottom: 24,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 2,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.onPrimary,
  },
  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.primary,
  },
  userSub: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.onSurface,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  saveBtnText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginVertical: 24,
  },
  logoutBtn: {
    backgroundColor: colors.errorContainer,
    height: 48,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.errorContainer,
  },
  logoutBtnText: {
    color: colors.error,
    fontSize: 15,
    fontWeight: "700",
  },
});
