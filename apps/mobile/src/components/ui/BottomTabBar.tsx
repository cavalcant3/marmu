import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export type TabType = "dashboard" | "orcamentos" | "pedidos" | "precos";

interface BottomTabBarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomTabBar({ currentTab, onTabChange }: BottomTabBarProps) {
  const tabs: { key: TabType; label: string; icon: string } = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "orcamentos", label: "Orçamentos", icon: "📝" },
    { key: "pedidos", label: "Pedidos", icon: "📦" },
    { key: "precos", label: "Preços", icon: "🏷️" },
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
            <Text style={[styles.icon, isActive && styles.activeIcon]}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
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
  icon: {
    fontSize: 18,
  },
  activeIcon: {
    fontSize: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  activeLabel: {
    color: colors.onPrimaryContainer,
    fontWeight: "700",
  },
});
