import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Header from "./src/components/ui/Header";
import BottomTabBar, { TabType } from "./src/components/ui/BottomTabBar";
import Fab from "./src/components/ui/Fab";

import LoginScreen from "./src/screens/Login";
import DashboardScreen from "./src/screens/Dashboard";
import NovoOrcamentoScreen from "./src/screens/NovoOrcamento";
import VisualizarOrcamentoScreen from "./src/screens/VisualizarOrcamento";
import ListaOrcamentosScreen from "./src/screens/ListaOrcamentos";
import ListaPedidosScreen from "./src/screens/ListaPedidos";
import DetalhesPedidoScreen from "./src/screens/DetalhesPedido";
import FotoAnotacaoScreen from "./src/screens/FotoAnotacao";
import TabelaPrecosScreen from "./src/screens/TabelaPrecos";
import EstoqueChapasScreen from "./src/screens/EstoqueChapas";
import { useAuthStore } from "./src/stores/authStore";

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>("dashboard");
  const [subScreen, setSubScreen] = useState<string | null>(null);

  const [orcamentoData, setOrcamentoData] = useState<any>(null);
  const [pedidoData, setPedidoData] = useState<any>(null);

  const loadTokens = useAuthStore((state) => state.loadTokens);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    loadTokens();
  }, []);

  const navigation = {
    navigate: (name: string, params?: any) => {
      const lower = name.toLowerCase();
      if (lower === "dashboard") {
        setCurrentTab("dashboard");
        setSubScreen(null);
      } else if (lower === "listaorcamentos") {
        setCurrentTab("orcamentos");
        setSubScreen(null);
      } else if (lower === "listapedidos") {
        setCurrentTab("pedidos");
        setSubScreen(null);
      } else if (lower === "tabelaprecos") {
        setCurrentTab("precos");
        setSubScreen(null);
      } else {
        if (params?.orcamento) setOrcamentoData(params.orcamento);
        if (params?.pedido) setPedidoData(params.pedido);
        setSubScreen(lower);
      }
    },
    goBack: () => setSubScreen(null),
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <LoginScreen />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  const renderScreen = () => {
    if (subScreen === "novoorcamento") {
      return <NovoOrcamentoScreen navigation={navigation} />;
    }
    if (subScreen === "visualizarorcamento") {
      return <VisualizarOrcamentoScreen route={{ params: { orcamento: orcamentoData } }} navigation={navigation} />;
    }
    if (subScreen === "detalhespedido") {
      return <DetalhesPedidoScreen route={{ params: { pedido: pedidoData } }} navigation={navigation} />;
    }
    if (subScreen === "fotoanotacao") {
      return <FotoAnotacaoScreen />;
    }
    if (subScreen === "estoquechapas") {
      return <EstoqueChapasScreen navigation={navigation} />;
    }

    switch (currentTab) {
      case "dashboard":
        return <DashboardScreen navigation={navigation} />;
      case "orcamentos":
        return <ListaOrcamentosScreen navigation={navigation} />;
      case "pedidos":
        return <ListaPedidosScreen navigation={navigation} />;
      case "precos":
        return <TabelaPrecosScreen navigation={navigation} />;
      default:
        return <DashboardScreen navigation={navigation} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top App Bar Header */}
      <Header userName="Roberto" />

      {/* Main Active Screen Content */}
      <View style={styles.body}>{renderScreen()}</View>

      {/* Floating Action Button for Novo Orçamento */}
      {!subScreen && (
        <Fab label="Novo Orçamento" onPress={() => navigation.navigate("novoorcamento")} />
      )}

      {/* Bottom Navigation Tab Bar */}
      <BottomTabBar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setSubScreen(null);
          setCurrentTab(tab);
        }}
      />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  body: {
    flex: 1,
  },
});
