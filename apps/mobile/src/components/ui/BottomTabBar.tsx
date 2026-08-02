import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";

export type TabType = "dashboard" | "orcamentos" | "pedidos" | "precos";

interface BottomTabBarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomTabBar({ currentTab, onTabChange }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const compact = useWindowDimensions().width < 370;
  const tabs: Array<{ key: TabType; label: string; iconName: keyof typeof Ionicons.glyphMap }> = [
    { key: "dashboard", label: "Dashboard", iconName: "grid-outline" },
    { key: "orcamentos", label: "Orçamentos", iconName: "document-text-outline" },
    { key: "pedidos", label: "Pedidos", iconName: "cube-outline" },
    { key: "precos", label: "Preços", iconName: "pricetags-outline" },
  ];

  return (
    <View
      style={[
        styles.container,
        { height: 64 + insets.bottom, paddingBottom: insets.bottom },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, compact && styles.tabButtonCompact, isActive && styles.activeTabButton]}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={tab.iconName}
              size={20}
              color={isActive ? colors.onPrimaryContainer : colors.onSurfaceVariant}
            />
            <Text numberOfLines={1} style={[styles.label, compact && styles.labelCompact, isActive && styles.activeLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    paddingTop: 6,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  tabButtonCompact: { paddingHorizontal: 3 },
  activeTabButton: {
    backgroundColor: colors.primaryContainer,
  },
  labelCompact: { fontSize: 10 },
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
