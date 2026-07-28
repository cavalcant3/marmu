import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Button } from "react-native";
import LoginScreen from "./src/screens/Login.js";
import DashboardScreen from "./src/screens/Dashboard.js";
import NovoOrcamentoScreen from "./src/screens/NovoOrcamento.js";
import SelecionarMaterialScreen from "./src/screens/SelecionarMaterial.js";
import VisualizarOrcamentoScreen from "./src/screens/VisualizarOrcamento.js";
import TabelaPrecosScreen from "./src/screens/TabelaPrecos.js";
import ListaPedidosScreen from "./src/screens/ListaPedidos.js";
import DetalhesPedidoScreen from "./src/screens/DetalhesPedido.js";
import FotoAnotacaoScreen from "./src/screens/FotoAnotacao.js";
import { useAuthStore } from "./src/stores/authStore.js";

export default function App() {
  const [screen, setScreen] = useState("login");
  const [orcamentoData, setOrcamentoData] = useState<any>(null);
  const [pedidoData, setPedidoData] = useState<any>(null);
  const loadTokens = useAuthStore((state) => state.loadTokens);

  useEffect(() => {
    loadTokens();
  }, []);

  const navigation = {
    navigate: (name: string, params?: any) => {
      if (name === "VisualizarOrcamento" && params?.orcamento) {
        setOrcamentoData(params.orcamento);
      }
      if (name === "DetalhesPedido" && params?.pedido) {
        setPedidoData(params.pedido);
      }
      setScreen(name.toLowerCase());
    },
    goBack: () => setScreen("novoorcamento"),
  };

  return (
    <SafeAreaView style={styles.container}>
      {screen === "login" && <LoginScreen />}
      {screen === "dashboard" && <DashboardScreen navigation={navigation} />}
      {screen === "novoorcamento" && <NovoOrcamentoScreen navigation={navigation} />}
      {screen === "selecionarmaterial" && (
        <SelecionarMaterialScreen navigation={navigation} route={{ params: { onSelect: () => navigation.goBack() } }} />
      )}
      {screen === "visualizarorcamento" && orcamentoData && (
        <VisualizarOrcamentoScreen route={{ params: { orcamento: orcamentoData } }} />
      )}
      {screen === "tabelaprecos" && <TabelaPrecosScreen />}
      {screen === "listapedidos" && <ListaPedidosScreen navigation={navigation} />}
      {screen === "detalhespedido" && pedidoData && (
        <DetalhesPedidoScreen route={{ params: { pedido: pedidoData } }} />
      )}
      {screen === "fotoanotacao" && <FotoAnotacaoScreen />}

      {screen !== "login" && <Button title="Voltar" onPress={() => setScreen("dashboard")} />}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
