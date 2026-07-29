import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

interface FabProps {
  label?: string;
  onPress: () => void;
}

export default function Fab({ label = "+ Novo Orçamento", onPress }: FabProps) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.85}>
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
    paddingHorizontal: 24,
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
  fabText: {
    color: colors.onSecondaryFixed,
    fontSize: 16,
    fontWeight: "700",
  },
});
