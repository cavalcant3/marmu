import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../theme/colors";

interface HeaderProps {
  userName?: string;
  onSettingsPress?: () => void;
}

export default function Header({ userName = "Roberto", onSettingsPress }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userName[0]}</Text>
        </View>
        <Text style={styles.title}>Marmu</Text>
      </View>
      <TouchableOpacity style={styles.iconButton} onPress={onSettingsPress}>
        <Text style={styles.iconText}>⚙️</Text>
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
  iconText: {
    fontSize: 20,
  },
});
