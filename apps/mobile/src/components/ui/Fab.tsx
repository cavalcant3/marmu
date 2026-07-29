import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

interface FabProps {
  label?: string;
  onPress: () => void;
}

export default function Fab({ label = "Novo Orçamento", onPress }: FabProps) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.85}>
      <Ionicons name="add" size={22} color={colors.onSecondaryFixed} style={styles.icon} />
      <Text style={styles.fabText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: colors.secondaryFixed,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 6,
  },
  fabText: {
    color: colors.onSecondaryFixed,
    fontSize: 15,
    fontWeight: "700",
  },
});
