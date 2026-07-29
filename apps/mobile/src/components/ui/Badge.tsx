import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

type BadgeVariant = "success" | "warning" | "info" | "neutral" | "danger";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export default function Badge({ label, variant = "neutral" }: BadgeProps) {
  const getStyles = () => {
    switch (variant) {
      case "success":
        return { bg: colors.secondaryContainer, text: colors.onSecondaryContainer };
      case "warning":
        return { bg: colors.tertiaryFixed, text: colors.onTertiaryFixedVariant };
      case "info":
        return { bg: colors.surfaceContainerHighest, text: colors.primary };
      case "danger":
        return { bg: colors.errorContainer, text: colors.error };
      default:
        return { bg: colors.surfaceContainerHigh, text: colors.onSurfaceVariant };
    }
  };

  const { bg, text } = getStyles();

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
