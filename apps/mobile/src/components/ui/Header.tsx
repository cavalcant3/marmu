import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

interface HeaderProps {
  userName?: string;
  onSettingsPress?: () => void;
  onProfilePress?: () => void;
}

export default function Header({ userName = "Usuário", onSettingsPress, onProfilePress }: HeaderProps) {
  const initial = (userName || "U")[0].toUpperCase();
  const handleProfileClick = onProfilePress || onSettingsPress;

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.left} onPress={handleProfileClick} activeOpacity={0.7}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.title}>Marmu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={handleProfileClick}>
        <Ionicons name="person-circle-outline" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
