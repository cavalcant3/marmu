import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

export type TabType = "dashboard" | "orcamentos" | "pedidos" | "precos";

interface BottomTabBarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomTabBar({ currentTab, onTabChange }: BottomTabBarProps) {
  const tabs: Array<{ key: TabType; label: string; iconName: keyof typeof Ionicons.glyphMap }> = [
    { key: "dashboard", label: "Dashboard", iconName: "grid-outline" },
    { key: "orcamentos", label: "Orçamentos", iconName: "document-text-outline" },
    { key: "pedidos", label: "Pedidos", iconName: "cube-outline" },
    { key: "precos", label: "Preços", iconName: "pricetags-outline" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={tab.iconName}
              size={20}
              color={isActive ? colors.onPrimaryContainer : colors.onSurfaceVariant}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  activeTabButton: {
    backgroundColor: colors.primaryContainer,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.onSurfaceVariant,
    marginTop: 3,
  },
  activeLabel: {
    color: colors.onPrimaryContainer,
    fontWeight: "700",
  },
});
